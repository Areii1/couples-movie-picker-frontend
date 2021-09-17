import styled, { keyframes } from "styled-components";
import { sizingScale, fontSizes } from "./styles/Variables";

type ContentWrapperProps = {
  isInitialized: boolean;
};

export const ContentWrapper = styled.div`
  display: ${(props: ContentWrapperProps) => (props.isInitialized ? "initial" : "none")};
  margin: 0 auto ${`${sizingScale[9]}px`} auto;
  width: ${`${sizingScale[13]}px`};
  display: flex;
  flex-direction: column;

  .container {
    display: ${(props: ContentWrapperProps) => (props.isInitialized ? "block" : "none")};
  }
`;

type LoadingTextWrapperProps = {
  isInitialized: boolean;
};

export const LoadingTextWrapper = styled.div`
  display: ${(props: LoadingTextWrapperProps) => (props.isInitialized ? "none" : "flex")};
  position: absolute;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;

  h1 {
    display: ${(props: LoadingTextWrapperProps) => (props.isInitialized ? "none" : "initial")};
  }
`;

const hoverText = keyframes`
  0% {
    font-size: ${`${fontSizes[8]}px`};
  }
  50% {
    font-size: ${`${fontSizes[8] - 15}px`};
  }
  100% {
    font-size: ${`${fontSizes[8]}px`};
  }
`;

export const LoadingText = styled.h1`
  font-size: ${`${fontSizes[8]}px`};
  margin: 0;
  color: red;
  animation: ${hoverText} 3s linear infinite;
`;
