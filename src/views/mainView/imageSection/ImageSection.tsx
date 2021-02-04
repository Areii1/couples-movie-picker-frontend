import React from "react";
import { GetUserItemProcess, Process, Status } from "../../../App";
import { AnimateType, HeartIcon } from "../../../components/icons/heartIcon/HeartIcon";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { sizingScale } from "../../../styles/Variables";
import { TransparentButton } from "../../accountSettingsView/pictureSection/PictureSectionStyles";
import { LikeMovieProcess } from "../MainView";
import {
  userEvaluationItemIsNotBlockedByHoverEffect,
  getImageAlt,
  getImageSrc,
  getPartnerEvaluatedMovie,
  getIsPartnered,
} from "./ImageSectionUtilityFunctions";
import { bucketUrl } from "../../../config/Config";
import {
  Wrapper,
  EvaluateButtonLeft,
  EvaluateButtonRight,
  IconWrapper,
  SwipingImageWrapper,
  SwipingImageIconWrapper,
  SwipingImageContentWrapper,
  SwipingMark,
  HoveringMark,
  PartnerScoreWrapper,
  PartnerScoreContentWrapper,
  NotEvaluatedText,
  PartnerScoreCloseButtonWrapper,
  CloseButtonText,
  Image,
  ScoreText,
} from "./ImageSectionStyles";

export enum HoveringOver {
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
  const [partnerScoreHovering, setPartnerScoreHovering] = React.useState<boolean>(false);

  const [hoveringOver, setHoveringOver] = React.useState<HoveringOver>(HoveringOver.NONE);

  const partnerEvaluatedMovie = getPartnerEvaluatedMovie(
    props.filteredList,
    props.swipingIndex,
    props.getPairedUserProcess,
  );

  return (
    <Wrapper>
      <EvaluateButtonLeft
        onMouseEnter={() => setHoveringOver(HoveringOver.LEFT)}
        onMouseLeave={() => setHoveringOver(HoveringOver.NONE)}
        onClick={() => props.evaluateItem(props.filteredList[props.swipingIndex].id, 0)}
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
        onClick={() => props.evaluateItem(props.filteredList[props.swipingIndex].id, 100)}
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
            <HeartIcon size={sizingScale[7]} isRed={false} animate={AnimateType.NONE} />
          </IconWrapper>
        )}
      </EvaluateButtonRight>
      <Image
        src={getImageSrc(props.evaluateMovieProcess, props.filteredList, props.swipingIndex)}
        alt={getImageAlt(props.evaluateMovieProcess, props.filteredList, props.swipingIndex)}
      />
      {props.evaluateMovieProcess.status === Status.LOADING && (
        <SwipingImageWrapper score={props.evaluateMovieProcess.score}>
          <SwipingImageContentWrapper>
            <SwipingImageIconWrapper>
              {props.evaluateMovieProcess.score >= 50 && (
                <HeartIcon size={sizingScale[10]} isRed={false} animate={AnimateType.NONE} />
              )}
              {props.evaluateMovieProcess.score < 50 && <SwipingMark>✕</SwipingMark>}
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
      {getIsPartnered(props.getUserItemProcess, props.getPairedUserProcess) &&
        props.evaluateMovieProcess.status !== Status.LOADING &&
        props.getPairedUserProcess.status === Status.SUCCESS &&
        partnerEvaluatedMovie &&
        userEvaluationItemIsNotBlockedByHoverEffect(partnerEvaluatedMovie, hoveringOver) && (
          <PartnerScoreWrapper
            title={`${props.getPairedUserProcess.data.username.S} ${
              partnerEvaluatedMovie.M.score.N >= 50 ? "liked this movie" : "didn't like this movie"
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
              {partnerEvaluatedMovie === undefined && <NotEvaluatedText>?</NotEvaluatedText>}
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
