import React from "react";
import styled from "styled-components";
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

export const MainView = (props: Props) => {
  const [fireMeterSwitch, setFireMeterSwitch] = React.useState<any>({
    position: 50,
    locked: false,
  });

  const [
    getTrendingMoviesProcess,
    setGetTrendingMoviesProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [swipingIndex, setSwipingIndex] = React.useState<number>(0);

  const [likeMovieProcess, setLikeMovieProcess] = React.useState<Process>({
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

  const evualuateItem = async (movieId: string) => {
    if (
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      getTrendingMoviesProcess.status === Status.SUCCESS
    ) {
      try {
        setLikeMovieProcess({ status: Status.LOADING });
        const likeMovieResponse = await evaluateMovie(
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          movieId,
          fireMeterSwitch.position
        );
        setSwipingIndex(swipingIndex + 1);
        setFireMeterSwitch({ position: 50, locked: false });
        setLikeMovieProcess({
          status: Status.SUCCESS,
          data: likeMovieResponse,
        });
      } catch (likeMovieError) {
        alert("failed to evaluate movie");
        setSwipingIndex(swipingIndex + 1);
        setFireMeterSwitch({ position: 50, locked: false });
        setLikeMovieProcess({
          status: Status.ERROR,
          error: likeMovieError,
        });
      }
    }
  };

  const keyDownHandler = (event: any) => {
    if (!fireMeterSwitch.locked) {
      if (event.key === "ArrowLeft") {
        setFireMeterSwitch((freshState: any) => {
          if (freshState.position - 5 <= 0) {
            return {
              position: 0,
              locked: false,
            };
          }
          return {
            position: freshState.position - 5,
            locked: false,
          };
        });
      } else if (event.key === "ArrowRight") {
        setFireMeterSwitch((freshState: any) => {
          if (freshState.position + 5 >= 100) {
            return {
              position: 100,
              locked: false,
            };
          }
          return {
            position: freshState.position + 5,
            locked: false,
          };
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
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keyDown", keyDownHandler);
    };
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
        <ImageSection>
          <Image
            src={`https://image.tmdb.org/t/p/w500/${filteredList[swipingIndex].backdrop_path}`}
            alt={filteredList[swipingIndex].original_title}
          />
        </ImageSection>
        <DetailsSection>
          <Title>{filteredList[swipingIndex].original_title}</Title>
          <FireMeter
            fireMeterSwitch={fireMeterSwitch}
            setFireMeterSwitch={setFireMeterSwitch}
            evualuateItem={() => evualuateItem(filteredList[swipingIndex].id)}
          />
        </DetailsSection>
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

const Image = styled.img`
  width: ${`${sizingScale[13]}px`};
`;
