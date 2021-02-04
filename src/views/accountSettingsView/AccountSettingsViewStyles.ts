import styled from "styled-components";
import { sizingScale, fontSizes } from "../../styles/Variables";
import { CardContentWrapper } from "../logIn/LogInStyles";

export const Section = styled.div`
  text-align: start;
  margin-top: ${`${sizingScale[5]}px`};
`;

export const TextWrapper = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
`;

export const Text = styled.p`
  font-size: ${`${fontSizes[2]}px`};
  font-weight: 400;
  text-align: center;
`;

export const SettingsCardContentWrapper = styled(CardContentWrapper)`
  text-align: center;
`;
