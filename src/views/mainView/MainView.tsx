import React from "react";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Process, Status } from "../../App";
import { FireMeter } from "../../components/fireMeter/FireMeter";
import { PrimaryHeadline } from "../../styles/Styles";
import { borderRadius, sizingScale } from "../../styles/Variables";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { evaluateMovie } from "../../apiService/evaluateMovie";
import { AnimateType, HeartIcon } from "../../components/icons/HeartIcon";

type Props = {
  getCurrentSessionProcess: Process;
  getUserItemProcess: Process;
  getUserItem: (username: string, jwtToken: string) => void;
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
        console.log(likeMovieResponse, "likeMovieResponse");
        setSwipingIndex(swipingIndex + 1);
        setLikeMovieProcess({
          status: Status.SUCCESS,
          data: likeMovieResponse,
        });
      } catch (likeMovieError) {
        console.log(likeMovieError, "likeMovieError");
        toast.error("failed to evaluate movie");
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

  if (
    getTrendingMoviesProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS
  ) {
    const filteredList = getTrendingMoviesProcess.data.results.filter(
      (movie: any) => {
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
      }
    );

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

    // const notifySuccess = (message: string) => toast.success(message);
    // const notifyError = (message: string) => toast.error(message);
    // const notifyInfo = (message: string) => toast.info(message);

    return (
      <Wrapper>
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
            </ImageSection>
            <DetailsSection>
              <Link to={`movie/${filteredList[swipingIndex].id}`}>
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
        {filteredList.length === 0 && <h5>everything swiped</h5>}
      </Wrapper>
    );
  } else {
    return <div />;
  }
};

const Wrapper = styled.div`
  width: 100%;
`;

const ImageSection = styled.div`
  margin: ${`${sizingScale[6] * -1}px`} 0 0 ${`${sizingScale[6] * -1}px`};
  height: ${`${sizingScale[11]}px`};
  position: relative;
`;

const Title = styled(PrimaryHeadline)`
  color: #808080;
  word-wrap: break-word;
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
  margin: ${`${sizingScale[8]}px`} auto 0 auto;
`;
