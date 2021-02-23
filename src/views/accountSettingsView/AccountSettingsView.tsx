import React from "react";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { GetCurrentSessionProcessContext } from "../../App";
import { GetCurrentSessionProcess, GetUserItemProcess, Process, Status } from "../../types/Types";
import { SecondaryHeadline, PrimaryHeadline } from "../../styles/Styles";
import { Puff } from "../../components/puff/Puff";
import { Button, ButtonText } from "../logIn/LogInStyles";
import { PictureSection } from "./pictureSection/PictureSection";
import {
  Section,
  TextWrapper,
  Text,
  SettingsCardContentWrapper,
} from "./AccountSettingsViewStyles";

const getViewContent = (
  getCurrentSessionProcess: GetCurrentSessionProcess,
  signOutProcessStatus: Status,
  signOut: () => void,
  getCurrentAuthenticatedUserProcess: Process,
  getUserItemProcess: GetUserItemProcess,
  getUserItem: (username: string) => void,
) => {
  switch (getCurrentSessionProcess.status) {
    case Status.INITIAL: {
      return <div />;
    }
    case Status.LOADING: {
      return <Puff size={50} fill="blue" />;
    }
    case Status.SUCCESS: {
      return (
        <>
          <PictureSection
            getCurrentAuthenticatedUserProcess={getCurrentAuthenticatedUserProcess}
            getUserItemProcess={getUserItemProcess}
            jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
            getUserItem={getUserItem}
          />
          <Section>
            <SecondaryHeadline>Log out</SecondaryHeadline>
            {signOutProcessStatus !== Status.LOADING && (
              <Button
                type="button"
                onClick={signOut}
                title="log out"
                error={signOutProcessStatus === Status.ERROR}
              >
                <ButtonText>
                  {signOutProcessStatus === Status.ERROR ? "Try again" : "Log out"}
                </ButtonText>
              </Button>
            )}
            {signOutProcessStatus === Status.LOADING && <Puff size={50} fill="lightblue" />}
            {signOutProcessStatus === Status.SUCCESS && <Redirect to="/login" />}
          </Section>
        </>
      );
    }
    case Status.ERROR: {
      return (
        <TextWrapper>
          <Text>
            No current user, please
            <Link to="/signup" title="signup">
              register
            </Link>
            or
            <Link to="/login" title="login">
              login
            </Link>
          </Text>
        </TextWrapper>
      );
    }
    default:
      return <div />;
  }
};

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  initiateSession: () => void;
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string) => void;
  resetState: () => void;
};

export const AccountSettingsView = (props: Props) => {
  const [signOutProcess, setSignOutProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const getCurrentSessionProcess = React.useContext(GetCurrentSessionProcessContext);

  const signOut = async () => {
    try {
      setSignOutProcess({ status: Status.LOADING });
      const signOutResponse = await Auth.signOut();
      setSignOutProcess({
        status: Status.SUCCESS,
        data: signOutResponse,
      });
      props.initiateSession();
      props.resetState();
    } catch (signOutError) {
      setSignOutProcess({
        status: Status.ERROR,
        error: signOutError,
      });
      toast.error("Could not log out");
    }
  };

  return (
    <SettingsCardContentWrapper>
      <PrimaryHeadline>Profile</PrimaryHeadline>
      {getViewContent(
        getCurrentSessionProcess,
        signOutProcess.status,
        signOut,
        props.getCurrentAuthenticatedUserProcess,
        props.getUserItemProcess,
        props.getUserItem,
      )}
    </SettingsCardContentWrapper>
  );
};
