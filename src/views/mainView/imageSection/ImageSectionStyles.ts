import styled, { keyframes, css } from "styled-components";
import { borderRadius, fontSizes, sizingScale } from "../../../styles/Variables";
import { getScoreTextColor } from "../../movieView/movieEvaluationSection/userEvaluationItem/UserEvaluationItemUtilityFunctions";

export const Wrapper = styled.div`
  width: ${`${sizingScale[13]}px`};
  margin: ${`${sizingScale[6] * -1}px`} 0 0 ${`${sizingScale[6] * -1}px`};
  height: ${`${sizingScale[11]}px`};
  position: relative;
`;

type EvaluateButtonProps = {
  hovering: boolean;
};

const lightenButton = keyframes`
from {
  background-color: transparent;
}
to {
  background-color: rgba(255, 255, 255, 0.2);
}
`;

export const getHoveringAnimation = (hovering: boolean) => {
  if (hovering) {
    return css`
      animation: ${lightenButton} 0.3s linear forwards;
    `;
  } else {
    return "unset";
  }
};

export const EvaluateButton = styled.button`
  width: ${`${sizingScale[9]}px`};
  height: 100%;
  position: absolute;
  top: 0;
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props: EvaluateButtonProps) => getHoveringAnimation(props.hovering)}
`;

export const fadeIconIn = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 1;
}
`;

export const EvaluateButtonLeft = styled(EvaluateButton)`
  left: 0;
`;

export const EvaluateButtonRight = styled(EvaluateButton)`
  right: 0;
`;

export const IconWrapper = styled.div`
  opacity: 0;
  animation: ${fadeIconIn} 0.3s linear forwards;
`;

const slideImageRight = keyframes`
from {
  left: 0;
  top: 0;
  opacity: 1;
}
to {
  top: ${`${sizingScale[5] * -1}px`};
  left: ${`${sizingScale[12]}px`};
  opacity: 0.3
}
`;

const slideImageLeft = keyframes`
from {
  top: 0;
  left: 0;
  opacity: 1;
}
to {
  top: ${`${sizingScale[4] * -1}px`};
  left: ${`${sizingScale[12] * -1}px`};
  opacity: 0;
}
`;

const getAnimation = (score: number) => {
  if (score >= 50) {
    return css`
      animation: ${slideImageRight} 0.5s linear forwards;
    `;
  } else {
    return css`
      animation: ${slideImageLeft} 0.5s linear forwards;
    `;
  }
};

type SwipingImageWrapperProps = {
  score: number;
};

export const SwipingImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: ${`${sizingScale[11]}px`};
  width: ${`${sizingScale[13]}px`};
  ${(props: SwipingImageWrapperProps) => getAnimation(props.score)}
`;

const fadeOut = keyframes`
from {
  opacity: 1;
}
to {
  opacity: 0;
}
`;

export const SwipingImageIconWrapper = styled.div`
  position: absolute;
  top: ${`calc(50% - ${sizingScale[10] / 2}px)`};
  left: ${`calc(50% - ${sizingScale[10] / 2}px)`};
  animation: ${fadeOut} 0.5s linear forwards;
`;

export const SwipingImageContentWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const SwipingMark = styled.h5`
  color: red;
  font-size: ${`${sizingScale[10]}px`};
  margin: -40px 0 0 0;
  vertical-align: text-top;
`;

export const HoveringMark = styled.h5`
  color: red;
  font-size: ${`${sizingScale[7]}px`};
`;

type PartnerScoreWrapperProps = {
  score: number;
};

export const PartnerScoreWrapper = styled.div`
  position: absolute;
  top: ${`calc(50% - ${sizingScale[7] / 2}px)`};
  left: ${(props: PartnerScoreWrapperProps) => (props.score < 50 ? 0 : "unset")};
  right: ${(props: PartnerScoreWrapperProps) => (props.score >= 50 ? 0 : "unset")};
  width: ${`${sizingScale[8] + 10}px`};
  height: ${`${sizingScale[7]}px`};
  background-color: rgba(255, 255, 255, 0.5);
  border-top-right-radius: ${(props: PartnerScoreWrapperProps) =>
    props.score < 50 ? `${borderRadius}px` : "unset"};
  border-bottom-right-radius: ${(props: PartnerScoreWrapperProps) =>
    props.score < 50 ? `${borderRadius}px` : "unset"};
  border-top-left-radius: ${(props: PartnerScoreWrapperProps) =>
    props.score >= 50 ? `${borderRadius}px` : "unset"};
  border-bottom-left-radius: ${(props: PartnerScoreWrapperProps) =>
    props.score >= 50 ? `${borderRadius}px` : "unset"};
`;

export const PartnerScoreContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${`${sizingScale[1]}px`} ${`${sizingScale[2]}px`};
`;

export const NotEvaluatedText = styled.h5`
  font-size: ${`${fontSizes[5]}px`};
  color: white;
  margin: 0;
`;

export const PartnerScoreCloseButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export const CloseButtonText = styled.h5`
  color: black;
  font-size: ${`${fontSizes[3]}px`};
  margin: ${`${sizingScale[0]}px`} ${`${sizingScale[1]}px`} 0 0;
`;

export const Image = styled.img`
  border-top-left-radius: ${`${borderRadius}px`};
  border-top-right-radius: ${`${borderRadius}px`};
  max-height: ${`${sizingScale[11]}px`};
  width: ${`${sizingScale[13]}px`};
`;

type ScoreTextProps = {
  score: number;
};

export const ScoreText = styled.h5`
  font-size: ${`${fontSizes[5]}px`};
  color: ${(props: ScoreTextProps) => getScoreTextColor(props.score)};
  margin: 0;
`;
