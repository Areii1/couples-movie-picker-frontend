import React from "react";
import { toast } from "react-toastify";
import { Redirect } from "react-router";
import { SecondaryHeadline } from "../../../styles/Styles";
import { Process, Status } from "../../../types/Types";
import {
  Mark,
  TransparentButton,
} from "../../../views/accountSettingsView/pictureSection/PictureSectionStyles";
import { Button, ButtonText } from "../../../views/logIn/LogInStyles";
import {
  ModalBackground,
  Modal,
  CloseButtonWrapper,
  ButtonWrapper,
  ButtonsWrapper,
} from "../confirmModal/ConfirmModalStyles";
import { createRoom } from "../../../apiService/createRoom";

type Props = {
  closeModal: () => void;
  username: string;
  jwtToken: string;
};

export const CreateRoomModal = (props: Props) => {
  const [createRoomProcess, setCreateRoomProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const createDecidingRoom = async () => {
    try {
      setCreateRoomProcess({ status: Status.LOADING });
      const createRoomResponse = await createRoom(props.username, props.jwtToken);
      setCreateRoomProcess({
        status: Status.SUCCESS,
        data: createRoomResponse,
      });
      toast.success("Room created");
    } catch (roomCreationError) {
      console.log(roomCreationError, "roomCreationError");
      toast.error("Could not create room");
      setCreateRoomProcess({
        status: Status.ERROR,
        error: roomCreationError,
      });
    }
  };

  console.log(createRoomProcess, "createRoomProcess");

  if (createRoomProcess.status === Status.SUCCESS) {
    return <Redirect to={`/decide/${createRoomProcess.data.id.S}`} />;
  } else {
    return (
      <ModalBackground>
        <Modal>
          <SecondaryHeadline>Decide a movie with your partner right now</SecondaryHeadline>
          <CloseButtonWrapper>
            <TransparentButton onClick={props.closeModal} title="close modal">
              <Mark fontColor="salmon" size={30}>
                ✕
              </Mark>
            </TransparentButton>
          </CloseButtonWrapper>
          <ButtonsWrapper>
            <ButtonWrapper>
              <Button
                type="button"
                title="remove picture"
                onClick={createDecidingRoom}
                error={false}
              >
                <ButtonText>Create room</ButtonText>
              </Button>
            </ButtonWrapper>
            <ButtonWrapper>
              <Button type="button" title="cancel" onClick={props.closeModal} error={false}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </ButtonWrapper>
          </ButtonsWrapper>
        </Modal>
      </ModalBackground>
    );
  }
};
