import React from "react";
import styled, { keyframes, css } from "styled-components";
import { Process, Status } from "../../App";
import { FireMeter } from "../../components/fireMeter/FireMeter";
import { PrimaryHeadline } from "../../styles/Styles";
import { sizingScale } from "../../styles/Variables";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { evaluateMovie } from "../../apiService/evaluateMovie";

type Props = {
  getCurrentSessionProcess: Process;
  getUserItemProcess: Process;
  getUserItem: (username: string, jwtToken: string) => void;
};

type LikeMovieProcess =
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
        alert("failed to evaluate movie");
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
    return (
      <Wrapper>
        {filteredList.length > 0 && (
          <div>
            <ImageSection>
              <Image
                src={`https://image.tmdb.org/t/p/w500/${filteredList[swipingIndex].backdrop_path}`}
                alt={filteredList[swipingIndex].original_title}
                isLoading={likeMovieProcess.status === Status.LOADING}
                score={
                  likeMovieProcess.status === Status.LOADING
                    ? likeMovieProcess.score
                    : 50
                }
              />
            </ImageSection>
            <DetailsSection>
              <Title>{filteredList[swipingIndex].original_title}</Title>
              <FireMeter
                evaluateItem={evaluateItem}
                movieId={filteredList[swipingIndex].id}
                likeMovieProcess={likeMovieProcess}
              />
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
  text-align: center;
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
    top: ${`${sizingScale[3] * -1}px`};
    left: ${`${sizingScale[12] * -1}px`};
    opacity: 0;
  }
`;

type ImageProps = {
  isLoading: boolean;
  score: number;
};

const getAnimation = (isLoading: boolean, score: number) => {
  if (isLoading) {
    if (score >= 50) {
      return css`
        animation: ${slideImageRight} 0.5s linear forwards;
      `;
    } else {
      return css`
        animation: ${slideImageLeft} 0.5s linear forwards;
      `;
    }
  }
};

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  max-height: ${`${sizingScale[11]}px`};
  width: ${`${sizingScale[13]}px`};
  ${(props: ImageProps) => getAnimation(props.isLoading, props.score)}
`;
