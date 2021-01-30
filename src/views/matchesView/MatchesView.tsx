import React from "react";
import styled, { keyframes } from "styled-components";
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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
      toast.error("Could not fetch movies list");
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

  const getMatchedMovies = () => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.likedMovies
    ) {
      return props.getUserItemProcess.data.likedMovies.L.filter(
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
    } else {
      return [];
    }
  };

  const getMatchedMoviesDetails = () => {
    const matchedMovies = getMatchedMovies();
    if (matchedMovies) {
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
      const filteredList = matchedMoviesDetails.filter(
        (movieDetailsItems) => movieDetailsItems !== undefined
      );
      return filteredList;
    } else {
      return [];
    }
  };

  const getMatchesListItems = () => {
    const matchedMoviesDetails = getMatchedMoviesDetails();
    if (matchedMoviesDetails) {
      return matchedMoviesDetails.map((movie: any) => {
        return (
          <MatchesListItem>
            <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
              <ImageOverlay />
              <Image
                src={`https://image.tmdb.org/t/p/w342/${movie.backdrop_path}`}
                alt={`${movie.title}`}
              />
            </Link>
          </MatchesListItem>
        );
      });
    } else {
      return [];
    }
  };
  return (
    <CardContentWrapper>
      <MatchesList>{getMatchesListItems()}</MatchesList>
    </CardContentWrapper>
  );
};

const MatchesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 0 ${`${sizingScale[6] * -1}px`};
`;

const ImageOverlay = styled.div`
  width: ${`${sizingScale[13] / 2}px`};
  height: ${`${sizingScale[9]}px`};
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  opacity: 0;
`;

const hoverLighten = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0.3;
  }
`;

const MatchesListItem = styled.li`
  padding: 0;
  margin: 0;
  width: ${`${sizingScale[13] / 2}px`};
  height: ${`${sizingScale[9]}px`};
  position: relative;
  border: 1px solid white;
  overflow: hidden;
  :hover {
    div {
      animation: ${hoverLighten} 0.3s linear forwards;
    }
  }
`;

const Image = styled.img`
  object-fit: cover;
  max-width: ${`${sizingScale[13] / 2}px`};
  max-height: ${`${sizingScale[11]}px`};
`;
