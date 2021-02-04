import styled from "styled-components";
import { sizingScale } from "../../../styles/Variables";
import { CloseButtonWrapper, ModalBackground } from "../confirmModal/ConfirmModalStyles";

export const DisplayProfileCloseButtonWrapper = styled(CloseButtonWrapper)`
  background-color: rgba(255, 255, 255, 0.6);
`;

export const DisplayProfileModalBackground = styled(ModalBackground)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImageWrapper = styled.div`
  position: relative;
`;

export const Image = styled.img`
  max-width: ${`${sizingScale[14]}px`};
  max-height: ${`${sizingScale[15]}px`};
`;
