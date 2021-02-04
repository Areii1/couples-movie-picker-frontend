import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { GetCurrentSessionProcess, GetUserItemProcess, Process, Status } from "../../App";
import { SecondaryHeadline, PrimaryHeadline } from "../../styles/Styles";
import { Puff } from "../../components/puff/Puff";
import { Button, ButtonText, CardContentWrapper } from "../logIn/LogInStyles";
import { PictureSection } from "./pictureSection/PictureSection";
import { sizingScale, fontSizes } from "../../styles/Variables";
// import { updatePreference } from "../../apiService/updatePreference";

type Props = {
  getCurrentSessionProcess: GetCurrentSessionProcess;
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
  // const [
  //   updatePreferenceProcess,
  //   setUpdatePreferenceProcess,
  // ] = React.useState<Process>({ status: Status.INITIAL });

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

  // const updateShowFireMeterPreference = async () => {
  //   try {
  //     setUpdatePreferenceProcess({ status: Status.LOADING });
  //     const updatePreferenceResponse = await updatePreference();
  //     console.log(updatePreferenceResponse, "updatePreferenceResponse");
  //     toast.success("Updated preference");
  //     setUpdatePreferenceProcess({
  //       status: Status.SUCCESS,
  //       data: updatePreferenceResponse,
  //     });
  //   } catch (updatePreferenceError) {
  //     toast.error("Could not update preference");
  //     setUpdatePreferenceProcess({
  //       status: Status.ERROR,
  //       error: updatePreferenceError,
  //     });
  //   }
  // };

  // const updateShowPartnerPreference = async () => {
  //   try {
  //     setUpdatePreferenceProcess({ status: Status.LOADING });
  //     const updatePreferenceResponse = await updatePreference();
  //     toast.success("Updated preference");
  //     setUpdatePreferenceProcess({
  //       status: Status.SUCCESS,
  //       data: updatePreferenceResponse,
  //     });
  //   } catch (updatePreferenceError) {
  //     toast.error("Could not update preference");
  //     setUpdatePreferenceProcess({
  //       status: Status.ERROR,
  //       error: updatePreferenceError,
  //     });
  //   }
  // };

  // const preferences = {
  //   showPartnerScore: true,
  //   showMeter: true,
  // };

  return (
    <SettingsCardContentWrapper>
      <PrimaryHeadline>Profile</PrimaryHeadline>
      {props.getCurrentSessionProcess.status === Status.LOADING && <Puff size={50} fill="blue" />}
      {props.getCurrentSessionProcess.status === Status.SUCCESS && (
        <>
          <PictureSection
            getCurrentAuthenticatedUserProcess={props.getCurrentAuthenticatedUserProcess}
            getUserItemProcess={props.getUserItemProcess}
            getCurrentSessionProcess={props.getCurrentSessionProcess}
            getUserItem={props.getUserItem}
          />
          {/* <Section>
            <SecondaryHeadline>Preferences</SecondaryHeadline>
            <SectionContentWrapper>
              <PreferenceItem>
                <TertiaryHeadline>Partner score</TertiaryHeadline>
                <ToggleButton onClick={updateShowPartnerPreference}>
                  <ButtonContentWrapper
                    isLoading={
                      updatePreferenceProcess.status === Status.LOADING
                    }
                    isOn={preferences.showPartnerScore}
                  >
                    {preferences.showPartnerScore ? "x" : "&#10003;"}
                  </ButtonContentWrapper>
                </ToggleButton>
              </PreferenceItem>
            </SectionContentWrapper>
          </Section> */}
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
    </SettingsCardContentWrapper>
  );
};

export const Section = styled.div`
  text-align: start;
  margin-top: ${`${sizingScale[5]}px`};
`;

const TextWrapper = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
`;

const Text = styled.p`
  font-size: ${`${fontSizes[2]}px`};
  font-weight: 400;
  text-align: center;
`;

const SettingsCardContentWrapper = styled(CardContentWrapper)`
  text-align: center;
`;

// const SectionContentWrapper = styled.div`
//   margin-top: ${`${sizingScale[3]}px`};
// `;

// const ToggleButton = styled.button`
//   width: ${`${sizingScale[7]}px`};
//   height: ${`${sizingScale[4]}px`};
//   border-radius: ${`${sizingScale[3]}px`};
//   background-color: white;
//   border: 1px solid lightgray;
//   cursor: pointer;
// `;

// const getTextAlign = (isLoading: boolean, isOn: boolean) => {
//   if (!isLoading) {
//     if (isOn) {
//       return "end";
//     } else {
//       return "start";
//     }
//   } else {
//     return "center";
//   }
// };

// type ButtonContentWrapperProps = {
//   isLoading: boolean;
//   isOn: boolean;
// };

// const ButtonContentWrapper = styled.div`
//   text-align: ${(props: ButtonContentWrapperProps) =>
//     getTextAlign(props.isLoading, props.isOn)};
// `;

// const PreferenceItem = styled.div`
//   display: flex;
// `;
