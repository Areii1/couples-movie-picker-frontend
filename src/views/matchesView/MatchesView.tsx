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
import { borderRadius, sizingScale } from "../../styles/Variables";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ScoreText } from "../mainView/imageSection/ImageSection";
import { TertiaryHeadline } from "../../styles/Styles";
import { DownwardArrow } from "../../components/icons/DownwardArrow";
import { MovieListTriggerButton } from "../../views/partnershipView/likedMoviesSection/LikedMoviesSection";
import { TransparentButton } from "../accountSettingsView/pictureSection/PictureSection";

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

  const [
    dislikedMoviesListExpanded,
    setDislikedMoviesListExpanded,
  ] = React.useState<boolean>(false);

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
            const partnerHasLikedMovie = props.getPairedUserProcess.data.likedMovies.L.find(
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

  const getProcessedMatchedMovies = (matchedMovies: any[]) => {
    return matchedMovies.map((movie: any) => {
      if (
        props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getPairedUserProcess.data.likedMovies
      ) {
        const partnerScoreA = props.getPairedUserProcess.data.likedMovies.L.find(
          (likedMovie: LikedMoviesListItem) =>
            likedMovie.M.id.S === movie.M.id.S
        );
        if (partnerScoreA) {
          return {
            id: movie.M.id.S,
            commonScore:
              parseInt(movie.M.score.N, 10) + parseInt(partnerScoreA.M.score.N),
          };
        } else {
          return undefined;
        }
      }
    });
  };

  const getSortedMatchedMovies = (matchedMovies: any[]) => {
    return matchedMovies.sort((a: any, b: any) => {
      if (a.commonScore < b.commonScore) {
        return 1;
      } else if (a.commonScore > b.commonScore) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  const getMatchedMoviesDetails = () => {
    const matchedMovies = getMatchedMovies();
    const processedMatchedMovies = getProcessedMatchedMovies(matchedMovies);
    const sortedMovies = getSortedMatchedMovies(processedMatchedMovies);
    if (sortedMovies) {
      const matchedMoviesDetails = sortedMovies.map((matchedMovie: any) => {
        if (getTrendingMoviesProcess.status === Status.SUCCESS) {
          const matchedMovieDetails = getTrendingMoviesProcess.data.results.find(
            (movie: any) => {
              return movie.id === parseInt(matchedMovie.id, 10);
            }
          );
          return {
            ...matchedMovieDetails,
            commonScore: matchedMovie.commonScore,
          };
        } else {
          return matchedMovie;
        }
      });
      const filteredList = matchedMoviesDetails.filter(
        (movieDetailsItems) => movieDetailsItems !== undefined
      );
      return filteredList;
    } else {
      return [];
    }
  };

  const getMatchesLikedListItems = () => {
    const matchedMoviesDetails = getMatchedMoviesDetails();
    const likedMatchedMoviesDetails = matchedMoviesDetails.filter(
      (matchedMovie) => matchedMovie.commonScore > 100
    );
    if (likedMatchedMoviesDetails) {
      return likedMatchedMoviesDetails.map((movie: any) => {
        return (
          <MatchesListItem>
            <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
              <TextWrapper>
                <ScoreText score={movie.commonScore / 2}>
                  {movie.commonScore / 2}
                </ScoreText>
              </TextWrapper>
              <ImageOverlay id="matches-view-image-overlay" />
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

  const getMatchesDislikedListItems = () => {
    const matchedMoviesDetails = getMatchedMoviesDetails();
    const disLikedMatchedMoviesDetails = matchedMoviesDetails.filter(
      (matchedMovie) => matchedMovie.commonScore < 100
    );
    if (disLikedMatchedMoviesDetails) {
      return disLikedMatchedMoviesDetails.map((movie: any) => {
        return (
          <MatchesListItem>
            <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
              <TextWrapper>
                <ScoreText score={movie.commonScore / 2}>
                  {movie.commonScore / 2}
                </ScoreText>
              </TextWrapper>
              <ImageOverlay id="matches-view-image-overlay" />
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
      {props.getPairedUserProcess.status === Status.SUCCESS && (
        <>
          {getMatchesLikedListItems() !== [] && (
            <MatchesList>{getMatchesLikedListItems()}</MatchesList>
          )}
          {getMatchesDislikedListItems() !== [] && (
            <>
              {!dislikedMoviesListExpanded && (
                <DislikedMoviesListWrapper>
                  <TransparentButton
                    onClick={() =>
                      setDislikedMoviesListExpanded(!dislikedMoviesListExpanded)
                    }
                    title="show disliked movies"
                  >
                    <DownwardArrow size={30} />
                  </TransparentButton>
                </DislikedMoviesListWrapper>
              )}
              {dislikedMoviesListExpanded && (
                <>
                  <ListPadding />
                  <MatchesList>{getMatchesDislikedListItems()}</MatchesList>
                </>
              )}
            </>
          )}
        </>
      )}
    </CardContentWrapper>
  );
};

const MatchesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: ${`${sizingScale[13]}px`};
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
    #matches-view-image-overlay {
      animation: ${hoverLighten} 0.3s linear forwards;
    }
  }
`;

const Image = styled.img`
  object-fit: cover;
  max-width: ${`${sizingScale[13] / 2}px`};
  max-height: ${`${sizingScale[11]}px`};
`;

const TextWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  width: ${`${sizingScale[7]}px`};
  border-bottom-right-radius: ${`${borderRadius}px`};
`;

const DislikedMoviesListWrapper = styled.div`
  margin-top: ${`${sizingScale[7]}px`};
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ListPadding = styled.div`
  margin-top: ${`${sizingScale[7]}px`};
`;
