import React from "react";
import styled from "styled-components";
import { CardContentWrapper } from "../logIn/LogIn";
import {
  GetUserItemProcess,
  Status,
  Process,
  GetCurrentSessionProcess,
} from "../../App";
import { LikedMoviesListItem } from "../../types/Types";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { sizingScale } from "../../styles/Variables";

type Props = {
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
};

export const MatchesView = (props: Props) => {
  const [
    getTrendingMoviesProcess,
    setGetTrendingMoviesProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

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

  React.useEffect(() => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      getMovies();
    }
  }, [props.getUserItemProcess.status]);

  if (
    props.getCurrentSessionProcess.status === Status.SUCCESS &&
    props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getPairedUserProcess.status === Status.SUCCESS &&
    getTrendingMoviesProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.likedMovies &&
    props.getPairedUserProcess.data.likedMovies
  ) {
    const matchedMovies = props.getUserItemProcess.data.likedMovies.L.filter(
      (userLikedMovie: LikedMoviesListItem) => {
        if (
          props.getPairedUserProcess.status === Status.SUCCESS &&
          props.getPairedUserProcess.data.likedMovies
        ) {
          const partnerHasLikedMovie = props.getPairedUserProcess.data.likedMovies.L.some(
            (partnerLikedMovie: LikedMoviesListItem) =>
              partnerLikedMovie.M.id.S === userLikedMovie.M.id.S
          );
          return partnerHasLikedMovie;
        } else {
          return true;
        }
      }
    );

    const matchedMoviesDetails = matchedMovies.map(
      (matchedMovie: LikedMoviesListItem) => {
        if (getTrendingMoviesProcess.status === Status.SUCCESS) {
          const matchedMovieDetails = getTrendingMoviesProcess.data.results.find(
            (movie: any) => {
              return movie.id === parseInt(matchedMovie.M.id.S, 10);
            }
          );
          return matchedMovieDetails;
        } else {
          return matchedMovie;
        }
      }
    );

    const matchesListItems = matchedMoviesDetails.map((movie: any) => {
      return (
        <MatchesListItem>
          <Image
            src={`https://image.tmdb.org/t/p/w342/${movie.backdrop_path}`}
            alt={`${movie.title}`}
          />
        </MatchesListItem>
      );
    });
    return (
      <CardContentWrapper>
        <MatchesList>{matchesListItems}</MatchesList>
      </CardContentWrapper>
    );
  } else {
    return <div />;
  }
};

const MatchesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: ${`${sizingScale[6] * -1}px`} 0 0 ${`${sizingScale[6] * -1}px`};
`;

const MatchesListItem = styled.li`
  padding: 0;
  margin: 0;
  width: 256px;
  height: 190px;
  border: 1px solid white;
`;

const Image = styled.img`
  object-fit: cover;
`;
