import styled from "styled-components";
import { borderRadius, sizingScale } from "../../../../styles/Variables";
import { getScoreTextColor } from "./UserEvaluationItemUtilityFunctions";

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

type IconTextProps = {
  score: number;
};

export const IconText = styled.h5`
  margin: 0;
  color: ${(props: IconTextProps) => getScoreTextColor(props.score)};
`;

export const UserEvaluatedItemWrapper = styled.div`
  display: inline-block;
  padding: ${`${sizingScale[2]}px`} ${`${sizingScale[3]}px`};
  border-radius: ${`${borderRadius}px`};
  border: 1px solid lightgray;
`;

export const UserEvaluatedItemWrapperContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;
