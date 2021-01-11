import { Auth } from "aws-amplify";
import React from "react";
import { Redirect } from "react-router";
import styled from "styled-components";
import {
  removeProfilePicture,
  uploadProfilePicture,
} from "../apiService/uploadProfilePicture";
import { Process, Status } from "../App";
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

  const selectFile = (event: any) => {
    uploadPicture(event.target.files[0]);
  };

  // console.log(
  //   props.getCurrentAuthenticatedUserProcess,
  //   "getCurrentAuthenticatedUserProcess"
  // );
  // console.log(props.getCurrentSessionProcess, "getCurrentSession");

  return (
    <Wrapper>
      <LogInPrimaryHeadline>Profile</LogInPrimaryHeadline>
      {(props.getCurrentSessionProcess.status === Status.LOADING ||
        props.getCurrentAuthenticatedUserProcess.status === Status.LOADING) && (
        <Puff size={50} fill="blue" />
      )}
      {props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
        <>
          <div>
            <AvatarSection>
              <ProfileBall
                firstName={
                  props.getCurrentAuthenticatedUserProcess.data.username
                }
                image={undefined}
                isCurrentUser={false}
                size={50}
                animate={false}
              />
              <InputWrapper>
                <FileInput
                  type="file"
                  onChange={(event) => selectFile(event)}
                />
                <Button type="button" title="upload" error={false}>
                  <ButtonText>Upload</ButtonText>
                </Button>
              </InputWrapper>
              <Button
                type="button"
                onClick={removePicture}
                title="remove"
                error={false}
              >
                <ButtonText>Remove</ButtonText>
              </Button>
            </AvatarSection>
          </div>
          <div>
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
          </div>
        </>
      )}
    </Wrapper>
  );
};

const AvatarSection = styled.div`
  display: flex;
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 30px;
  cursor: pointer;
`;

const InputWrapper = styled.div`
  width: 100px;
  height: 30px;
  position: relative;
`;

const Wrapper = styled.div`
  text-align: center;
  margin-top: 50px;
`;
