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

  const [selectedFile, setSelectedFile] = React.useState<any>();

  const uploadPicture = async (file: any) => {
    if (props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS) {
      try {
        setUploadPictureProcess({ status: Status.LOADING });
        const uploadPictureResponse = await uploadProfilePicture(
          file.name,
          file,
          props.getCurrentAuthenticatedUserProcess.data.username
        );
        console.log(uploadPictureResponse, "uploadPictureResponse");
        setUploadPictureProcess({
          status: Status.SUCCESS,
          data: uploadPictureResponse,
        });
      } catch (uploadPictureError) {
        console.log(uploadPictureError, "error");
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

  React.useEffect(() => {
    return () => {};
  }, []);

  const selectFile = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

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
              <ProfileBallWrapper>
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
`;
