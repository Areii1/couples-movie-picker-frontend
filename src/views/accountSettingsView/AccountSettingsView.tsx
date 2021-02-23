import React from "react";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { GetCurrentSessionProcessContext, GetUserItemProcess, Process, Status } from "../../App";
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
      {getCurrentSessionProcess.status === Status.LOADING && <Puff size={50} fill="blue" />}
      {getCurrentSessionProcess.status === Status.SUCCESS && (
        <>
          <PictureSection
            getCurrentAuthenticatedUserProcess={props.getCurrentAuthenticatedUserProcess}
            getUserItemProcess={props.getUserItemProcess}
            jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
            getUserItem={props.getUserItem}
          />
          <Section>
            <SecondaryHeadline>Log out</SecondaryHeadline>
            {signOutProcess.status !== Status.LOADING && (
              <Button
                type="button"
                onClick={signOut}
                title="log out"
                error={signOutProcess.status === Status.ERROR}
              >
                <ButtonText>
                  {signOutProcess.status === Status.ERROR ? "Try again" : "Log out"}
                </ButtonText>
              </Button>
            )}
            {signOutProcess.status === Status.LOADING && <Puff size={50} fill="lightblue" />}
            {signOutProcess.status === Status.SUCCESS && <Redirect to="/login" />}
          </Section>
        </>
      )}
      {getCurrentSessionProcess.status === Status.ERROR && (
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
      )}
    </SettingsCardContentWrapper>
  );
};
