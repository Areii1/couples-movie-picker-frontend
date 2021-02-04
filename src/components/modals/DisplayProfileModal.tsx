import React from "react";
import styled from "styled-components";
import { sizingScale } from "../../styles/Variables";
import {
  Mark,
  TransparentButton,
} from "../../views/accountSettingsView/pictureSection/PictureSectionStyles";
import { ModalBackground, CloseButtonWrapper } from "./ConfirmModal";

type Props = {
  closeModal: () => void;
  source: string;
};

export const DisplayProfile = (props: Props) => {
  return (
    <DisplayProfileModalBackground>
      <ImageWrapper>
        <Image src={props.source} alt="profile" />
        <DisplayProfileCloseButtonWrapper>
          <TransparentButton onClick={props.closeModal} title="close modal">
            <Mark fontColor="salmon" size={30}>
              ✕
            </Mark>
          </TransparentButton>
        </DisplayProfileCloseButtonWrapper>
      </ImageWrapper>
    </DisplayProfileModalBackground>
  );
};

const DisplayProfileCloseButtonWrapper = styled(CloseButtonWrapper)`
  background-color: rgba(255, 255, 255, 0.6);
`;

const DisplayProfileModalBackground = styled(ModalBackground)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  max-width: ${`${sizingScale[14]}px`};
  max-height: ${`${sizingScale[15]}px`};
`;
