import styled, { keyframes } from "styled-components";
import { sizingScale, borderRadius, fontSizes } from "../../../styles/Variables";

const fadeIn = keyframes`
from {
  background-color: rgb(0, 0, 0, 0.05);
}
to {
  background-color: rgb(0, 0, 0, 0.5);
}
`;

export const ProfileBallOverlay = styled.div`
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

export const LoadingIconWrapper = styled.div`
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

export const Dropzone = styled.div`
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

export const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[10] / 2}px`};
  cursor: pointer;
`;

export const PictureUploadWrapper = styled.div`
  margin-top: ${`${sizingScale[2]}px`};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ProfileBallWrapper = styled.div`
  width: ${`${sizingScale[8]}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: ${`${sizingScale[8]}px`};
`;

export const DropzoneText = styled.p`
  font-size: ${`${fontSizes[0]}px`};
`;

export const RandomImageText = styled.p`
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
  font-size: ${(props: MarkProps) => (props.size ? `${props.size}px` : `${sizingScale[6]}px`)};
  margin: 0;
  text-align: center;
  vertical-align: center;
  :hover {
    animation: ${(props: MarkProps) => getColorHover(props.fontColor)} 0.3s linear forwards;
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

export const ExtraButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
