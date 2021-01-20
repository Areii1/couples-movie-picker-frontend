import { Auth } from "aws-amplify";
import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  GetCurrentSessionProcess,
  GetUserItemProcess,
  Process,
  SecondaryHeadline,
  Status,
} from "../../App";
import { Puff } from "../../components/puff/Puff";
import { Button, ButtonText, LogInPrimaryHeadline } from "../logIn/LogIn";
import { PictureSection } from "./pictureSection/PictureSection";

type Props = {
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getCurrentAuthenticatedUserProcess: Process;
  initiateSession: () => void;
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string) => void;
};

export const AccountSettingsView = (props: Props) => {
  const [signOutProcess, setSignOutProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const signOut = async () => {
    try {
      setSignOutProcess({ status: Status.LOADING });
      const signOutResponse = await Auth.signOut();
      setSignOutProcess({
        status: Status.SUCCESS,
        data: signOutResponse,
      });
      alert("logged out");
      props.initiateSession();
    } catch (signOutError) {
      setSignOutProcess({
        status: Status.ERROR,
        error: signOutError,
      });
      alert("could not log out");
    }
  };

  return (
    <Wrapper>
      <LogInPrimaryHeadline>Profile</LogInPrimaryHeadline>
      {props.getCurrentSessionProcess.status === Status.LOADING && (
        <Puff size={50} fill="blue" />
      )}
      {props.getCurrentSessionProcess.status === Status.SUCCESS && (
        <>
          <PictureSection
            getCurrentAuthenticatedUserProcess={
              props.getCurrentAuthenticatedUserProcess
            }
            getUserItemProcess={props.getUserItemProcess}
            getCurrentSessionProcess={props.getCurrentSessionProcess}
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
                  {signOutProcess.status === Status.ERROR
                    ? "Try again"
                    : "Log out"}
                </ButtonText>
              </Button>
            )}
            {signOutProcess.status === Status.LOADING && (
              <Puff size={50} fill="lightblue" />
            )}
            {signOutProcess.status === Status.SUCCESS && (
              <Redirect to="/login" />
            )}
          </Section>
        </>
      )}
      {props.getCurrentSessionProcess.status === Status.ERROR && (
        <TextWrapper>
          <Text>
            No current user, please{" "}
            <Link to="/signup" title="signup">
              register
            </Link>{" "}
            or{" "}
            <Link to="/login" title="login">
              login
            </Link>
          </Text>
        </TextWrapper>
      )}
    </Wrapper>
  );
};

export const Section = styled.div`
  text-align: start;
  margin-top: 20px;
`;

const TextWrapper = styled.div`
  margin-top: 20px;
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
`;

const Wrapper = styled.div`
  text-align: center;
  width: 400px;
`;
