import styled from "styled-components";
import { sizingScale } from "./styles/Variables";

export const ContentWrapper = styled.div`
  margin: 0 auto ${`${sizingScale[9]}px`} auto;
  width: ${`${sizingScale[13]}px`};
  display: flex;
  flex-direction: column;
`;
