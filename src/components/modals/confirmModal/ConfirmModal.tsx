import React from "react";
import { SecondaryHeadline } from "../../../styles/Styles";
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
} from "./ConfirmModalStyles";

type Props = {
  closeModal: () => void;
  performAction: () => void;
  title: string;
};

export const ConfirmModal = (props: Props) => {
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
          <ButtonWrapper>
            <Button
              type="button"
              title="remove picture"
              onClick={() => props.performAction()}
              error={false}
            >
              <ButtonText>Remove</ButtonText>
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
};
