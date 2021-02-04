import styled from "styled-components";
import { TertiaryHeadline } from "../../styles/Styles";
import { fontSizes, sizingScale } from "../../styles/Variables";
import { CardContentWrapper } from "../logIn/LogInStyles";

export const MovieViewSection = styled.div`
  text-align: start;
  margin-top: ${`${sizingScale[6]}px`};
`;

export const MovieViewCardContentWrapper = styled(CardContentWrapper)`
  margin-top: ${`${sizingScale[4]}px`};
  text-align: center;
`;

export const Wrapper = styled.div`
  width: 100%;
`;

export const ImageSection = styled.div`
  margin: ${`${sizingScale[6] * -1}px`} 0 0 ${`${sizingScale[6] * -1}px`};
  text-align: center;
`;

export const Image = styled.img`
  width: ${`${sizingScale[13]}px`};
`;

export const Text = styled.p`
  margin: 0;
  font-size: ${`${fontSizes[0]}px`};
  font-weight: 300;
  margin-top: ${`${sizingScale[2]}px`};
`;

export const InfoListItemText = styled.h6`
  margin: 0;
  font-size: ${`${fontSizes[0]}px`};
  font-weight: 400;
  color: gray;
`;

type HeadlineProps = {
  color: string;
};

export const MovieTertiaryHeadline = styled(TertiaryHeadline)`
  color: ${(props: HeadlineProps) => props.color};
`;

export const InfoList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

export const InfoListItem = styled.li`
  padding: 0;
  margin: 0 ${`${sizingScale[1]}px`};
`;
