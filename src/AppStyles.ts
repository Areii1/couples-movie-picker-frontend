import styled from "styled-components";
import { sizingScale } from "./styles/Variables";

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

  /* * > * {
    display: ${(props: ContentWrapperProps) => (props.isInitialized ? "block" : "none")};
  } */
`;
