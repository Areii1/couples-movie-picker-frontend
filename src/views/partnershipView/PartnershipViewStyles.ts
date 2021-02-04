import styled from "styled-components";
import { fontSizes, sizingScale } from "../../styles/Variables";
import { CardContentWrapper } from "../logIn/LogInStyles";

export const MatchSectionWrapper = styled.div`
  margin-top: ${`${sizingScale[6]}px`};
  text-align: start;
`;

export const FoundUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${`${sizingScale[3]}px`};
  max-width: ${`${sizingScale[11]}px`};
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: ${`${sizingScale[2]}px`} ${`${sizingScale[3]}px`};
`;

type ProfileTextProps = {
  isPartnered?: boolean;
};

export const ProfileText = styled.p`
  margin: 0;
  margin-left: ${`${sizingScale[3]}px`};
  color: ${(props: ProfileTextProps) => (props.isPartnered ? "red" : "black")};
  font-size: ${(props: ProfileTextProps) =>
    props.isPartnered ? `${fontSizes[0]}px` : `${fontSizes[2]}px`};
`;

export const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ButtonsWrapper = styled.div`
  margin-left: ${`${sizingScale[3]}px`};
  display: flex;
`;

export const PartnershipCardContentWrapper = styled(CardContentWrapper)`
  text-align: center;
`;
