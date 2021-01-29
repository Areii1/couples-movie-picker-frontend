import React from "react";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import { uploadProfilePicture } from "../../../apiService/uploadProfilePicture";
import { removeProfilePicture } from "../../../apiService/removeProfilePicture";
import { ImageIcon } from "../../../components/icons/ImageIcon";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { randomizeProfilePicture } from "../../../apiService/randomizeProfilePicture";
import { bucketUrl } from "../../../config/Config";
import { GetCurrentSessionProcess, Process, Status } from "../../../App";
import { Section } from "../AccountSettingsView";
import { Puff } from "../../../components/puff/Puff";
import { SecondaryHeadline } from "../../../styles/Styles";
import {
  sizingScale,
  borderRadius,
  fontSizes,
} from "../../../styles/Variables";
import { ConfirmModal } from "../../../components/modals/ConfirmModal";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getUserItemProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItem: (username: string, jwtToken: string) => void;
};

export const PictureSection = (props: Props) => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const [
    uploadPictureProcess,
    setUploadPictureProcess,
  ] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [
    removePictureProcess,
    setRemovePictureProcess,
  ] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [
    randomizeProfilePictureProcess,
    setRandomizeProfilePictureProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [hoveringProfileBall, setHoveringProfileBall] = React.useState<boolean>(
    false
  );

  const [selectedFile, setSelectedFile] = React.useState<any>(undefined);
  const [queryingUpdatedItem, setQueryingUpdatedItem] = React.useState<boolean>(
    false
  );

  React.useEffect(() => {
    if (
      queryingUpdatedItem &&
      props.getUserItemProcess.status === Status.SUCCESS
    ) {
      setSelectedFile(undefined);
      setQueryingUpdatedItem(false);
    }
  }, [props.getUserItemProcess.status]);

  const uploadPicture = async () => {
    if (
      props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
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
        setQueryingUpdatedItem(true);
        setTimeout(() => {
          if (
            props.getCurrentAuthenticatedUserProcess.status ===
              Status.SUCCESS &&
            props.getCurrentSessionProcess.status === Status.SUCCESS
          )
            props.getUserItem(
              props.getCurrentAuthenticatedUserProcess.data.username,
              props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
            );
          toast.success("Uploaded profile picture");
        }, 2000);
      } catch (uploadPictureError) {
        toast.error("Could not upload profile picture");
        setUploadPictureProcess({
          status: Status.ERROR,
          error: uploadPictureError,
        });
      }
    }
  };

  const removePicture = async () => {
    if (
      props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      try {
        setRemovePictureProcess({ status: Status.LOADING });
        const uploadPictureResponse = await removeProfilePicture(
          props.getCurrentAuthenticatedUserProcess.data.username,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        setRemovePictureProcess({
          status: Status.SUCCESS,
          data: uploadPictureResponse,
        });
        setQueryingUpdatedItem(true);
        setTimeout(() => {
          if (
            props.getCurrentAuthenticatedUserProcess.status ===
              Status.SUCCESS &&
            props.getCurrentSessionProcess.status === Status.SUCCESS
          )
            props.getUserItem(
              props.getCurrentAuthenticatedUserProcess.data.username,
              props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
            );
          toast.success("Removed profile picture");
        }, 2000);
      } catch (uploadPictureError) {
        toast.error("Could not remove profile picture");
        setRemovePictureProcess({
          status: Status.ERROR,
          error: uploadPictureError,
        });
      }
    }
  };

  const randomizePicture = async () => {
    if (
      props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      try {
        setRandomizeProfilePictureProcess({ status: Status.LOADING });
        const randomizeProfilePictureResponse = await randomizeProfilePicture(
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        setRandomizeProfilePictureProcess({
          status: Status.SUCCESS,
          data: randomizeProfilePictureResponse,
        });
        setQueryingUpdatedItem(true);
        setTimeout(() => {
          if (
            props.getCurrentAuthenticatedUserProcess.status ===
              Status.SUCCESS &&
            props.getCurrentSessionProcess.status === Status.SUCCESS
          )
            props.getUserItem(
              props.getCurrentAuthenticatedUserProcess.data.username,
              props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
            );
          toast.success("Changed profile picture");
        }, 2000);
      } catch (randomizeProfilePictureError) {
        toast.error("Could not change profile picture");
        setRandomizeProfilePictureProcess({
          status: Status.ERROR,
          error: randomizeProfilePictureError,
        });
      }
    }
  };

  const selectFile = (event: any) => {
    if (uploadPictureProcess.status !== Status.LOADING) {
      if (uploadPictureProcess.status !== Status.INITIAL) {
        setUploadPictureProcess({ status: Status.INITIAL });
      }
      setSelectedFile(event.target.files[0]);
    }
  };

  const getImage = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    } else if (props.getUserItemProcess.status === Status.SUCCESS) {
      if (props.getUserItemProcess.data.profilePicture) {
        return `${bucketUrl}/${props.getUserItemProcess.data.profilePicture.S}`;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  const hasProfilePicture = () => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      if (props.getUserItemProcess.data.profilePicture) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const getFirstName = () => {
    if (
      props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.status === Status.SUCCESS
    ) {
      return props.getCurrentAuthenticatedUserProcess.data.username;
    } else {
      return undefined;
    }
  };

  const handleModalButtonClick = () => {
    setModalOpen(false);
    removePicture();
  };

  return (
    <Section>
      <SecondaryHeadline>Picture</SecondaryHeadline>
      <PictureUploadWrapper>
        <ProfileBallWrapper
          onMouseEnter={() => setHoveringProfileBall(true)}
          onMouseLeave={() => setHoveringProfileBall(false)}
        >
          {hoveringProfileBall &&
            (uploadPictureProcess.status === Status.INITIAL ||
              uploadPictureProcess.status === Status.SUCCESS) &&
            selectedFile === undefined &&
            removePictureProcess.status === Status.INITIAL &&
            hasProfilePicture() && (
              <ProfileBallOverlay>
                <TransparentButton
                  onClick={() => setModalOpen(true)}
                  title="remove picture"
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
          {(uploadPictureProcess.status === Status.LOADING ||
            queryingUpdatedItem ||
            removePictureProcess.status === Status.LOADING) && (
            <LoadingIconWrapper>
              <Puff size={75} fill="white" />
            </LoadingIconWrapper>
          )}
          <ProfileBall
            firstName={getFirstName()}
            image={getImage()}
            isCurrentUser={false}
            size={100}
            animate={false}
            fontSize={50}
            showText
            shadow
            border
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
        <ExtraButtonsWrapper>
          <TransparentButton
            onClick={randomizePicture}
            title="choose random image"
          >
            <RandomImageText>randomize</RandomImageText>
          </TransparentButton>
          <TransparentButton onClick={() => setModalOpen(true)} title="remove picture">
            <RandomImageText>remove</RandomImageText>
          </TransparentButton>
        </ExtraButtonsWrapper>
      </PictureUploadWrapper>
      {modalOpen && (
        <ConfirmModal
          title="Remove profile picture?"
          performAction={handleModalButtonClick}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </Section>
  );
};

const fadeIn = keyframes`
  from {
    background-color: rgb(0, 0, 0, 0.05);
  }
  to {
    background-color: rgb(0, 0, 0, 0.5);
  }
`;

const ProfileBallOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.3s linear forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${`${sizingScale[8]}px`};
  height: ${`${sizingScale[8]}px`};
`;

const LoadingIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${`${sizingScale[8]}px`};
  height: ${`${sizingScale[8]}px`};
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dropzone = styled.div`
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[10] / 2}px`};
  position: relative;
  border: 1px dotted black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${`${borderRadius}px`};
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[10] / 2}px`};
  cursor: pointer;
`;

const PictureUploadWrapper = styled.div`
  margin-top: ${`${sizingScale[2]}px`};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileBallWrapper = styled.div`
  width: ${`${sizingScale[8]}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: ${`${sizingScale[8]}px`};
`;

const DropzoneText = styled.p`
  font-size: ${`${fontSizes[0]}px`};
`;

const RandomImageText = styled.p`
  font-size: ${`${fontSizes[0]}px`};
  color: blue;
`;

type MarkProps = {
  fontColor: string;
  size?: number;
};

const markFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const getColorHover = (fontColor: string) => keyframes`
  from {
    color: ${fontColor};
  }
  to {
    color: ${fontColor === "lightgreen" ? "green" : "red"};
  }
`;

export const Mark = styled.h5`
  color: ${(props: MarkProps) => props.fontColor};
  animation: ${markFadeIn} 0.3s linear forwards;
  font-size: ${(props: MarkProps) =>
    props.size ? `${props.size}px` : `${sizingScale[6]}px`};
  margin: 0;
  text-align: center;
  vertical-align: center;
  :hover {
    animation: ${(props: MarkProps) => getColorHover(props.fontColor)} 0.3s
      linear forwards;
  }
`;

export const TransparentButton = styled.button`
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ExtraButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;