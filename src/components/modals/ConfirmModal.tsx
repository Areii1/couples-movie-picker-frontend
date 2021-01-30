import React from "react";
import styled from "styled-components";
import { SecondaryHeadline } from "../../styles/Styles";
import { borderRadius, sizingScale } from "../../styles/Variables";
import {
  Mark,
  TransparentButton,
} from "../../views/accountSettingsView/pictureSection/PictureSection";
import { Button, ButtonText } from "../../views/logIn/LogIn";

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
            <Button
              type="button"
              title="cancel"
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

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
`;

export const Modal = styled.div`
  position: relative;
  background-color: white;
  margin: ${`${sizingScale[10]}px`} auto 0 auto;
  width: ${`${sizingScale[12]}px`};
  padding: ${`${sizingScale[6]}px`} ${`${sizingScale[6]}px`};
  border-radius: ${`${borderRadius}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CloseButtonWrapper = styled.div`
  position: absolute;
  top: ${`${sizingScale[1]}px`};
  right: ${`${sizingScale[2]}px`};
`;

const ButtonWrapper = styled.div`
  margin-right: ${`${sizingScale[2]}px`};
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;
