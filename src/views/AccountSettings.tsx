import { Auth } from "aws-amplify";
import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  removeProfilePicture,
  uploadProfilePicture,
} from "../apiService/uploadProfilePicture";
import { Process, SecondaryHeadline, Status } from "../App";
import { ImageIcon } from "../components/icons/ImageIcon";
import { ProfileBall } from "../components/profileBall/ProfileBall";
import { Puff } from "../components/puff/Puff";
import { Button, ButtonText, LogInPrimaryHeadline } from "./LogIn";

type Props = {
  getCurrentSessionProcess: any;
  getCurrentAuthenticatedUserProcess: Process;
  initiateSession: () => void;
};

export const AccountSettings = (props: Props) => {
  const [signOutProcess, setSignOutProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const [uploadPictureProcess, setUploadPictureProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const [removePictureProcess, setRemovePictureProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const [hoveringProfileBall, setHoveringProfileBall] = React.useState<boolean>(
    false
  );

  const [selectedFile, setSelectedFile] = React.useState<any>(undefined);

  const uploadPicture = async () => {
    if (props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS) {
      try {
        setUploadPictureProcess({ status: Status.LOADING });
        const uploadPictureResponse = await uploadProfilePicture(
          selectedFile.name,
          selectedFile,
          props.getCurrentAuthenticatedUserProcess.data.username
        );
        setUploadPictureProcess({
          status: Status.SUCCESS,
          data: uploadPictureResponse,
        });
      } catch (uploadPictureError) {
        setUploadPictureProcess({
          status: Status.ERROR,
          error: uploadPictureError,
        });
      }
    }
  };

  const removePicture = async () => {
    try {
      setRemovePictureProcess({ status: Status.LOADING });
      const uploadPictureResponse = await removeProfilePicture();
      setRemovePictureProcess({
        status: Status.SUCCESS,
        data: uploadPictureResponse,
      });
    } catch (uploadPictureError) {
      setRemovePictureProcess({
        status: Status.ERROR,
        error: uploadPictureError,
      });
    }
  };

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

  const selectFile = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const hasProfilePicture = false;
  return (
    <Wrapper>
      <LogInPrimaryHeadline>Profile</LogInPrimaryHeadline>
      {(props.getCurrentSessionProcess.status === Status.LOADING ||
        props.getCurrentAuthenticatedUserProcess.status === Status.LOADING) && (
        <Puff size={50} fill="blue" />
      )}
      {props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
        <>
          <Section>
            <SecondaryHeadline>Picture</SecondaryHeadline>
            <PictureUploadWrapper>
              <ProfileBallWrapper
                onMouseEnter={() => setHoveringProfileBall(true)}
                onMouseLeave={() => setHoveringProfileBall(false)}
              >
                {hoveringProfileBall &&
                  uploadPictureProcess.status === Status.INITIAL &&
                  selectedFile === undefined && hasProfilePicture && (
                    <ProfileBallOverlay>
                      <TransparentButton
                        onClick={() => removePicture()}
                        title="reject"
                      >
                        <Mark fontColor="salmon">✕</Mark>
                      </TransparentButton>
                    </ProfileBallOverlay>
                  )}
                {selectedFile !== undefined &&
                  uploadPictureProcess.status === Status.INITIAL && (
                    <ProfileBallOverlay>
                      <TransparentButton
                        onClick={() => uploadPicture()}
                        title="confirm"
                      >
                        <Mark fontColor="lightgreen">✓</Mark>
                      </TransparentButton>
                      <TransparentButton
                        onClick={() => setSelectedFile(undefined)}
                        title="reject"
                      >
                        <Mark fontColor="salmon">✕</Mark>
                      </TransparentButton>
                    </ProfileBallOverlay>
                  )}
                {uploadPictureProcess.status === Status.LOADING && (
                  <LoadingIconWrapper>
                    <Puff size={75} fill="white" />
                  </LoadingIconWrapper>
                )}
                <ProfileBall
                  firstName={
                    props.getCurrentAuthenticatedUserProcess.data.username
                  }
                  image={
                    selectedFile === undefined
                      ? undefined
                      : URL.createObjectURL(selectedFile)
                  }
                  isCurrentUser={false}
                  size={selectedFile === undefined ? 75 : 100}
                  animate={false}
                  fontSize={50}
                />
              </ProfileBallWrapper>
              <Dropzone>
                <FileInput
                  type="file"
                  onChange={(event) => selectFile(event)}
                  accept="image/*"
                />
                <ImageIcon size={40} animate={true} />
                <DropzoneText>Click or drag to upload image</DropzoneText>
              </Dropzone>
              <TransparentButton title="choose random image">
                <RandomImageText>randomize</RandomImageText>
              </TransparentButton>
            </PictureUploadWrapper>
            <Button
              type="button"
              onClick={removePicture}
              title="remove"
              error={false}
            >
              <ButtonText>Remove</ButtonText>
            </Button>
          </Section>
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

const Section = styled.div`
  text-align: start;
  margin-top: 20px;
`;

const PictureUploadWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileBallWrapper = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: 100px;
`;

const DropzoneText = styled.p`
  font-size: 10px;
`;

const RandomImageText = styled.p`
  font-size: 10px;
  color: blue;
`;

const TextWrapper = styled.div`
  margin-top: 20px;
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
`;

const Dropzone = styled.div`
  width: 200px;
  height: 100px;
  position: relative;
  border: 1px dotted black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 100px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  text-align: center;
  width: 400px;
`;

const TransparentButton = styled.button`
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileBallOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
`;

const LoadingIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

type MarkProps = {
  fontColor: string;
};

const Mark = styled.h5`
  color: ${(props: MarkProps) => props.fontColor};
  font-size: 50px;
  margin: 0;
  text-align: center;
  vertical-align: center;
`;
