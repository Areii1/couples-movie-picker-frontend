import React from "react";
import {
  Mark,
  TransparentButton,
} from "../../../views/accountSettingsView/pictureSection/PictureSectionStyles";
import {
  DisplayProfileCloseButtonWrapper,
  DisplayProfileModalBackground,
  ImageWrapper,
  Image,
} from "./DisplayProfileModalStyles";

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
