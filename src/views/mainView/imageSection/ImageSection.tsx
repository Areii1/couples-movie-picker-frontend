import React from "react";
import styled, { keyframes, css } from "styled-components";
import { GetUserItemProcess, Process, Status } from "../../../App";
import { AnimateType, HeartIcon } from "../../../components/icons/HeartIcon";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import {
  borderRadius,
  fontSizes,
  sizingScale,
} from "../../../styles/Variables";
import { TransparentButton } from "../../accountSettingsView/pictureSection/PictureSection";
import { getEvaluatedMovieItem } from "../../movieView/MovieViewUtilityFunctions";
import { bucketUrl } from "../../../config/Config";
import { getScoreTextColor } from "../../movieView/movieEvaluationSection/userEvaluationItem/UserEvaluationItemUtilityFunctions";
import { LikeMovieProcess } from "../MainView";

enum HoveringOver {
  LEFT,
  RIGHT,
  NONE,
}

type Props = {
  getCurrentSessionProcess: Process;
  getUserItemProcess: GetUserItemProcess;
  getCurrentAuthenticatedUserProcess: Process;
  getPairedUserProcess: GetUserItemProcess;
  filteredList: any[];
  swipingIndex: number;
  evaluateMovieProcess: LikeMovieProcess;
  evaluateItem: (movieId: string, score: number) => void;
  setModalOpen: (value: boolean) => void;
};

export const ImageSection = (props: Props) => {
  const [
    partnerScoreHovering,
    setPartnerScoreHovering,
  ] = React.useState<boolean>(false);

  const [hoveringOver, setHoveringOver] = React.useState<HoveringOver>(
    HoveringOver.NONE
  );

  const getIsPartnered = () => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.partner !== undefined &&
      props.getPairedUserProcess.status === Status.SUCCESS &&
      props.getPairedUserProcess.data.partner !== undefined &&
      props.getPairedUserProcess.data.partner.S ===
        props.getUserItemProcess.data.username.S &&
      props.getPairedUserProcess.data.username.S ===
        props.getUserItemProcess.data.partner.S
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getPartnerEvaluatedMovie = () => {
    if (props.filteredList.length > 0) {
      return getEvaluatedMovieItem(
        props.getPairedUserProcess,
        props.filteredList[props.swipingIndex].id
      );
    } else {
      return undefined;
    }
  };

  const getImageSrc = () => {
    if (props.evaluateMovieProcess.status === Status.LOADING) {
      if (props.filteredList[props.swipingIndex + 1] !== undefined) {
        return `https://image.tmdb.org/t/p/w500/${
          props.filteredList[props.swipingIndex + 1].backdrop_path
        }`;
      } else {
        return "";
      }
    } else {
      return `https://image.tmdb.org/t/p/w500/${
        props.filteredList[props.swipingIndex].backdrop_path
      }`;
    }
  };

  const getImageAlt = () => {
    if (props.evaluateMovieProcess.status === Status.LOADING) {
      if (props.filteredList[props.swipingIndex + 1] !== undefined) {
        return props.filteredList[props.swipingIndex + 1].original_title;
      } else {
        return "";
      }
    } else {
      return props.filteredList[props.swipingIndex].original_title;
    }
  };

  const userEvaluationItemIsNotBlockedByHoverEffect = () => {
    if (
      partnerEvaluatedMovie.M.score.N >= 50 &&
      hoveringOver !== HoveringOver.RIGHT
    ) {
      return true;
    } else if (
      partnerEvaluatedMovie.M.score.N < 50 &&
      hoveringOver !== HoveringOver.LEFT
    ) {
      return true;
    } else {
      return false;
    }
  };

  const partnerEvaluatedMovie = getPartnerEvaluatedMovie();

  return (
    <Wrapper>
      <EvaluateButtonLeft
        onMouseEnter={() => setHoveringOver(HoveringOver.LEFT)}
        onMouseLeave={() => setHoveringOver(HoveringOver.NONE)}
        onClick={() =>
          props.evaluateItem(props.filteredList[props.swipingIndex].id, 0)
        }
        title="dislike movie"
        hovering={
          props.evaluateMovieProcess.status !== Status.LOADING
            ? hoveringOver === HoveringOver.LEFT
            : false
        }
        disabled={props.evaluateMovieProcess.status === Status.LOADING}
      >
        {hoveringOver === HoveringOver.LEFT && (
          <IconWrapper>
            <HoveringMark>✕</HoveringMark>
          </IconWrapper>
        )}
      </EvaluateButtonLeft>
      <EvaluateButtonRight
        onMouseEnter={() => setHoveringOver(HoveringOver.RIGHT)}
        onMouseLeave={() => setHoveringOver(HoveringOver.NONE)}
        onClick={() =>
          props.evaluateItem(props.filteredList[props.swipingIndex].id, 100)
        }
        title="like movie"
        hovering={
          props.evaluateMovieProcess.status !== Status.LOADING
            ? hoveringOver === HoveringOver.RIGHT
            : false
        }
        disabled={props.evaluateMovieProcess.status === Status.LOADING}
      >
        {hoveringOver === HoveringOver.RIGHT && (
          <IconWrapper>
            <HeartIcon
              size={sizingScale[7]}
              isRed={false}
              animate={AnimateType.NONE}
            />
          </IconWrapper>
        )}
      </EvaluateButtonRight>
      <Image src={getImageSrc()} alt={getImageAlt()} />
      {props.evaluateMovieProcess.status === Status.LOADING && (
        <SwipingImageWrapper score={props.evaluateMovieProcess.score}>
          <SwipingImageContentWrapper>
            <SwipingImageIconWrapper>
              {props.evaluateMovieProcess.score >= 50 && (
                <HeartIcon
                  size={sizingScale[10]}
                  isRed={false}
                  animate={AnimateType.NONE}
                />
              )}
              {props.evaluateMovieProcess.score < 50 && (
                <SwipingMark>✕</SwipingMark>
              )}
            </SwipingImageIconWrapper>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${
                props.filteredList[props.swipingIndex].backdrop_path
              }`}
              alt={props.filteredList[props.swipingIndex].original_title}
            />
          </SwipingImageContentWrapper>
        </SwipingImageWrapper>
      )}
      {getIsPartnered() &&
        props.evaluateMovieProcess.status !== Status.LOADING &&
        props.getPairedUserProcess.status === Status.SUCCESS &&
        partnerEvaluatedMovie &&
        userEvaluationItemIsNotBlockedByHoverEffect() && (
          <PartnerScoreWrapper
            title={`${props.getPairedUserProcess.data.username.S} ${
              partnerEvaluatedMovie.M.score.N >= 50
                ? "liked this movie"
                : "didn't like this movie"
            }`}
            onMouseEnter={() => setPartnerScoreHovering(true)}
            onMouseLeave={() => setPartnerScoreHovering(false)}
            score={partnerEvaluatedMovie.M.score.N}
          >
            <PartnerScoreContentWrapper>
              <TransparentButton
                title={`display ${props.getPairedUserProcess.data.username.S}`}
                onClick={() => props.setModalOpen(true)}
              >
                <ProfileBall
                  image={
                    props.getPairedUserProcess.status === Status.SUCCESS &&
                    props.getPairedUserProcess.data.profilePicture
                      ? `${bucketUrl}/${props.getPairedUserProcess.data.profilePicture.S}`
                      : undefined
                  }
                  isCurrentUser={false}
                  size={sizingScale[6]}
                  animate={false}
                  showText
                  shadow={false}
                  border={false}
                />
              </TransparentButton>
              {partnerEvaluatedMovie !== undefined && (
                <ScoreText score={partnerEvaluatedMovie.M.score.N}>
                  {partnerEvaluatedMovie.M.score.N}
                </ScoreText>
              )}
              {partnerEvaluatedMovie === undefined && (
                <NotEvaluatedText>?</NotEvaluatedText>
              )}
              {partnerScoreHovering && (
                <PartnerScoreCloseButtonWrapper>
                  <TransparentButton title="dont't show partner score">
                    <CloseButtonText>x</CloseButtonText>
                  </TransparentButton>
                </PartnerScoreCloseButtonWrapper>
              )}
            </PartnerScoreContentWrapper>
          </PartnerScoreWrapper>
        )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
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

const getHoveringAnimation = (hovering: boolean) => {
  if (hovering) {
    return css`
      animation: ${lightenButton} 0.3s linear forwards;
    `;
  } else {
    return "unset";
  }
};

const EvaluateButton = styled.button`
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

const fadeIconIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const EvaluateButtonLeft = styled(EvaluateButton)`
  left: 0;
`;

const EvaluateButtonRight = styled(EvaluateButton)`
  right: 0;
`;

const IconWrapper = styled.div`
  opacity: 0;
  animation: ${fadeIconIn} 0.3s linear forwards;
`;

type SwipingImageWrapperProps = {
  score: number;
};

const SwipingImageWrapper = styled.div`
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

const SwipingImageIconWrapper = styled.div`
  position: absolute;
  top: ${`calc(50% - ${sizingScale[10] / 2}px)`};
  left: ${`calc(50% - ${sizingScale[10] / 2}px)`};
  animation: ${fadeOut} 0.5s linear forwards;
`;

const SwipingImageContentWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const SwipingMark = styled.h5`
  color: red;
  font-size: ${`${sizingScale[10]}px`};
  margin: -40px 0 0 0;
  vertical-align: text-top;
`;

const HoveringMark = styled.h5`
  color: red;
  font-size: ${`${sizingScale[7]}px`};
`;

type PartnerScoreWrapperProps = {
  score: number;
};

const PartnerScoreWrapper = styled.div`
  position: absolute;
  top: ${`calc(50% - ${sizingScale[7] / 2}px)`};
  left: ${(props: PartnerScoreWrapperProps) =>
    props.score < 50 ? 0 : "unset"};
  right: ${(props: PartnerScoreWrapperProps) =>
    props.score >= 50 ? 0 : "unset"};
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

const PartnerScoreContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${`${sizingScale[1]}px`} ${`${sizingScale[2]}px`};
`;
const NotEvaluatedText = styled.h5`
  font-size: ${`${fontSizes[5]}px`};
  color: white;
  margin: 0;
`;

const PartnerScoreCloseButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const CloseButtonText = styled.h5`
  color: black;
  font-size: ${`${fontSizes[3]}px`};
  margin: ${`${sizingScale[0]}px`} ${`${sizingScale[1]}px`} 0 0;
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

const Image = styled.img`
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
