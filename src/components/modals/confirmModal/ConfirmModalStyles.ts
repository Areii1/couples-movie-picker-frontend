import styled from "styled-components";
import { borderRadius, sizingScale } from "../../../styles/Variables";

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

export const ButtonWrapper = styled.div`
  margin-right: ${`${sizingScale[2]}px`};
`;

export const ButtonsWrapper = styled.div`
  display: flex;
`;
