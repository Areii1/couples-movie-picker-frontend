import { Auth } from "aws-amplify";
import React from "react";
import styled from "styled-components";
import {
  removeProfilePicture,
  uploadProfilePicture,
} from "../apiService/uploadProfilePicture";
import { Process, Status } from "../App";
import { ProfileBall } from "../components/profileBall/ProfileBall";
import { Puff } from "../components/puff/Puff";
import { Button, ButtonText } from "./LogIn";

type Props = {
  getCurrentSessionProcess: Process;
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
      props.initiateSession();
    } catch (signOutError) {
      setSignOutProcess({
        status: Status.ERROR,
        error: signOutError,
      });
    }
  };

  const selectFile = (event: any) => {
    uploadPicture(event.target.files[0]);
  };
  return (
    <>
      {props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
        <>
          <div>
            <h3>Profile picture</h3>
            <AvatarSection>
              <ProfileBall
                firstName={
                  props.getCurrentAuthenticatedUserProcess.data.username
                }
                image={undefined}
                isCurrentUser={false}
                size={50}
              />
              <InputWrapper>
                <FileInput
                  type="file"
                  onChange={(event) => selectFile(event)}
                />
                <Button type="button" title="upload">
                  <ButtonText>Upload</ButtonText>
                </Button>
              </InputWrapper>
              <Button type="button" onClick={removePicture} title="remove">
                <ButtonText>Remove</ButtonText>
              </Button>
            </AvatarSection>
          </div>
          <div>
            {signOutProcess.status === Status.INITIAL && (
              <Button type="button" onClick={signOut} title="log out">
                <ButtonText>Log out</ButtonText>
              </Button>
            )}
            {signOutProcess.status === Status.LOADING && (
              <Puff size={50} fill="lightblue" />
            )}
          </div>
        </>
      )}
      {(props.getCurrentSessionProcess.status === Status.ERROR ||
        props.getCurrentAuthenticatedUserProcess.status === Status.ERROR) && (
        <></>
      )}
    </>
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
