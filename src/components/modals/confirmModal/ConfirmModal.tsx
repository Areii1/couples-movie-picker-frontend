import React from "react";
import { SecondaryHeadline } from "../../../styles/Styles";
import { Status } from "../../../types/Types";
import {
  Mark,
  TransparentButton,
} from "../../../views/accountSettingsView/pictureSection/PictureSectionStyles";
import { Button, ButtonText } from "../../../views/logIn/LogInStyles";
import { Puff } from "../../puff/Puff";
import {
  ModalBackground,
  Modal,
  CloseButtonWrapper,
  ButtonWrapper,
  ButtonsWrapper,
} from "./ConfirmModalStyles";

type Props = {
  closeModal: () => void;
  performAction: () => void;
  title: string;
  status: Status;
  buttonText: string;
};

export const ConfirmModal = (props: Props) => {
  React.useEffect(() => {
    if (props.status === Status.SUCCESS) {
      props.closeModal();
    }
  }, [props.status]);
  return (
    <ModalBackground>
      <Modal>
        <SecondaryHeadline>{props.title}</SecondaryHeadline>
        <CloseButtonWrapper>
          <TransparentButton onClick={props.closeModal} title="close modal">
            <Mark fontColor="salmon" size={30}>
              ✕
            </Mark>
          </TransparentButton>
        </CloseButtonWrapper>
        <ButtonsWrapper>
          {props.status === Status.INITIAL && (
            <ButtonWrapper>
              <Button
                type="button"
                title="remove picture"
                onClick={() => props.performAction()}
                error={false}
              >
                <ButtonText>{props.buttonText}</ButtonText>
              </Button>
            </ButtonWrapper>
          )}
          {props.status === Status.LOADING && (
            <ButtonWrapper>
              <Puff size={50} fill="blue" />
            </ButtonWrapper>
          )}
          {props.status === Status.ERROR && (
            <ButtonWrapper>
              <Button type="button" title="try again" onClick={() => props.performAction()} error>
                <ButtonText>{props.buttonText}</ButtonText>
              </Button>
            </ButtonWrapper>
          )}
          <ButtonWrapper>
            <Button
              type="button"
              title="cancel"
              disabled={props.status !== Status.INITIAL}
              onClick={props.closeModal}
              error={false}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ButtonWrapper>
        </ButtonsWrapper>
      </Modal>
    </ModalBackground>
  );
};
