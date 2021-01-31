import React from "react";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Process, Status, GetUserItemProcess } from "../../App";
import { FireMeter } from "../../components/fireMeter/FireMeter";
import { PrimaryHeadline, SecondaryHeadline } from "../../styles/Styles";
import { borderRadius, sizingScale, fontSizes } from "../../styles/Variables";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { evaluateMovie } from "../../apiService/evaluateMovie";
import { AnimateType, HeartIcon } from "../../components/icons/HeartIcon";
import { ImageIcon } from "../../components/icons/ImageIcon";
import { bucketUrl } from "../../config/Config";
import { ProfileBall } from "../../components/profileBall/ProfileBall";
import { getEvaluatedMovieItem } from "../movieView/MovieViewUtilityFunctions";
import { getScoreTextColor } from "../movieView/movieEvaluationSection/userEvaluationItem/UserEvaluationItemUtilityFunctions";
import { TransparentButton } from "../accountSettingsView/pictureSection/PictureSection";
import { DisplayProfile } from "../../components/modals/DisplayProfileModal";

type Props = {
  getCurrentSessionProcess: Process;
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getCurrentAuthenticatedUserProcess: Process;
  getPairedUserProcess: GetUserItemProcess;
};

export type LikeMovieProcess =
  | {
      status: Status.INITIAL;
    }
  | { status: Status.LOADING; score: number }
  | { status: Status.SUCCESS; data: any }
  | { status: Status.ERROR; error: any };

export const MainView = (props: Props) => {
  const [
    getTrendingMoviesProcess,
    setGetTrendingMoviesProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [swipingIndex, setSwipingIndex] = React.useState<number>(0);

  const [
    likeMovieProcess,
    setLikeMovieProcess,
  ] = React.useState<LikeMovieProcess>({
    status: Status.INITIAL,
  });

  const [
    partnerScoreHovering,
    setPartnerScoreHovering,
  ] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const getMovies = async () => {
    try {
      setGetTrendingMoviesProcess({ status: Status.LOADING });
      const getTrendingMoviesResponse = await getTrendingMovies();
      const parsedGetTrendingMoviesResponse = await getTrendingMoviesResponse.json();
      setGetTrendingMoviesProcess({
        status: Status.SUCCESS,
        data: parsedGetTrendingMoviesResponse,
      });
    } catch (getTrendingMoviesError) {
      toast.error("Could not fetch movies list");
      setGetTrendingMoviesProcess({
        status: Status.ERROR,
        error: getTrendingMoviesError,
      });
    }
  };

  const evaluateItem = async (movieId: string, score: number) => {
    if (
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      getTrendingMoviesProcess.status === Status.SUCCESS &&
      likeMovieProcess.status !== Status.LOADING
    ) {
      try {
        setLikeMovieProcess({ status: Status.LOADING, score });
        const likeMovieResponse = await evaluateMovie(
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          movieId,
          score
        );
        setSwipingIndex(swipingIndex + 1);
        setLikeMovieProcess({
          status: Status.SUCCESS,
          data: likeMovieResponse,
        });
      } catch (likeMovieError) {
        toast.error("Failed to evaluate movie");
        setSwipingIndex(swipingIndex + 1);
        setLikeMovieProcess({
          status: Status.ERROR,
          error: likeMovieError,
        });
      }
    }
  };

  React.useEffect(() => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      props.getUserItem(
        props.getUserItemProcess.data.username.S,
        props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
      );
    }
  }, []);

  React.useEffect(() => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      getMovies();
    }
  }, [props.getUserItemProcess.status]);

  const getFilteredList = () => {
    if (getTrendingMoviesProcess.status === Status.SUCCESS) {
      return getTrendingMoviesProcess.data.results.filter((movie: any) => {
        if (
          props.getUserItemProcess.status === Status.SUCCESS &&
          props.getUserItemProcess.data.likedMovies
        ) {
          return (
            props.getUserItemProcess.data.likedMovies.L.find(
              (likedMovie: any) => movie.id === parseInt(likedMovie.M.id.S, 10)
            ) === undefined
          );
        } else {
          return true;
        }
      });
    } else {
      return [];
    }
  };

  const getImageSrc = () => {
    if (likeMovieProcess.status === Status.LOADING) {
      if (filteredList[swipingIndex + 1] !== undefined) {
        return `https://image.tmdb.org/t/p/w500/${
          filteredList[swipingIndex + 1].backdrop_path
        }`;
      } else {
        return "";
      }
    } else {
      return `https://image.tmdb.org/t/p/w500/${filteredList[swipingIndex].backdrop_path}`;
    }
  };

  const getImageAlt = () => {
    if (likeMovieProcess.status === Status.LOADING) {
      if (filteredList[swipingIndex + 1] !== undefined) {
        return filteredList[swipingIndex + 1].original_title;
      } else {
        return "";
      }
    } else {
      return filteredList[swipingIndex].original_title;
    }
  };

  const viewInitialized =
    props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
    props.getCurrentSessionProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS &&
    getTrendingMoviesProcess.status === Status.SUCCESS;

  const getIsPartnered = () => {
    console.log(props.getUserItemProcess, "getUserItemProcess");
    console.log(props.getPairedUserProcess, "getPairedUserProcess");
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
    const filteredList = getFilteredList();
    if (filteredList.length > 0) {
      return getEvaluatedMovieItem(
        props.getPairedUserProcess,
        filteredList[swipingIndex].id
      );
    } else {
      return undefined;
    }
  };
  const partnerEvaluatedMovie = getPartnerEvaluatedMovie();
  const filteredList = getFilteredList();
  return (
    <Wrapper>
      {!viewInitialized && (
        <div>
          <ImagePlaceholder />
          <TitlePlaceholder />
        </div>
      )}
      {viewInitialized && (
        <>
          {filteredList.length > 0 && (
            <div>
              <ImageSection>
                <Image src={getImageSrc()} alt={getImageAlt()} />
                {likeMovieProcess.status === Status.LOADING && (
                  <SwipingImageWrapper score={likeMovieProcess.score}>
                    <SwipingImageContentWrapper>
                      <SwipingImageIconWrapper>
                        {likeMovieProcess.score >= 50 && (
                          <HeartIcon
                            size={sizingScale[10]}
                            isRed={false}
                            animate={AnimateType.NONE}
                          />
                        )}
                        {likeMovieProcess.score < 50 && (
                          <SwipingMark>✕</SwipingMark>
                        )}
                      </SwipingImageIconWrapper>
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${filteredList[swipingIndex].backdrop_path}`}
                        alt={filteredList[swipingIndex].original_title}
                      />
                    </SwipingImageContentWrapper>
                  </SwipingImageWrapper>
                )}
                {getIsPartnered() &&
                  likeMovieProcess.status !== Status.LOADING &&
                  props.getPairedUserProcess.status === Status.SUCCESS &&
                  partnerEvaluatedMovie && (
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
                          onClick={() => setModalOpen(true)}
                        >
                          <ProfileBall
                            image={
                              props.getPairedUserProcess.status ===
                                Status.SUCCESS &&
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
              </ImageSection>
              <DetailsSection>
                <Link
                  to={`movie/${filteredList[swipingIndex].id}`}
                  title={filteredList[swipingIndex].original_title}
                >
                  <Title>{filteredList[swipingIndex].original_title}</Title>
                </Link>
                <FireMeterWrapper>
                  <FireMeter
                    evaluateItem={evaluateItem}
                    movieId={filteredList[swipingIndex].id}
                    likeMovieProcess={likeMovieProcess}
                  />
                </FireMeterWrapper>
              </DetailsSection>
            </div>
          )}
          {filteredList.length === 0 && (
            <>
              <ImageWrapper>
                <ImageIcon
                  size={sizingScale[10]}
                  animate={false}
                  color="gray"
                />
              </ImageWrapper>
              <TitleWrapper>
                <SecondaryHeadline>Everything swiped</SecondaryHeadline>
              </TitleWrapper>
            </>
          )}
        </>
      )}
      {modalOpen && props.getPairedUserProcess.status === Status.SUCCESS && (
        <DisplayProfile
          closeModal={() => setModalOpen(false)}
          source={`${bucketUrl}/${props.getPairedUserProcess.data.profilePicture.S}`}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const ImageSection = styled.div`
  width: ${`${sizingScale[13]}px`};
  margin: ${`${sizingScale[6] * -1}px`} 0 0 ${`${sizingScale[6] * -1}px`};
  height: ${`${sizingScale[11]}px`};
  position: relative;
`;

const Title = styled(PrimaryHeadline)`
  color: #808080;
  word-wrap: break-word;
`;

export const TitlePlaceholder = styled.div`
  margin: ${`${sizingScale[6]}px auto 0 auto`};
  height: ${`${sizingScale[5]}px`};
  width: ${`${sizingScale[10]}px`};
  background-color: #e9e9e9;
`;

const DetailsSection = styled.div`
  margin: ${`${sizingScale[3]}px`} 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${`${sizingScale[13] - sizingScale[6] * 2}px`};
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

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Image = styled.img`
  border-top-left-radius: ${`${borderRadius}px`};
  border-top-right-radius: ${`${borderRadius}px`};
  max-height: ${`${sizingScale[11]}px`};
  width: ${`${sizingScale[13]}px`};
`;

export const ImagePlaceholder = styled.div`
  height: ${`${sizingScale[11]}px`};
  width: ${`${sizingScale[12]}px`};
  margin: auto;
  background-color: #e9e9e9;
  border-radius: ${`${borderRadius}px`};
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

const FireMeterWrapper = styled.div`
  margin: ${`${sizingScale[6]}px`} auto 0 auto;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleWrapper = styled.div`
  margin-top: ${`${sizingScale[5]}px`};
  display: flex;
  justify-content: center;
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
type ScoreTextProps = {
  score: number;
};

export const ScoreText = styled.h5`
  font-size: ${`${fontSizes[5]}px`};
  color: ${(props: ScoreTextProps) => getScoreTextColor(props.score)};
  margin: 0;
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
