import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CardContentWrapper } from "../logIn/LogInStyles";
import { GetUserItemProcess, Status, Process } from "../../App";
import { LikedMoviesListItem } from "../../types/Types";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { ScoreText } from "../mainView/imageSection/ImageSectionStyles";
import { DownwardArrow } from "../../components/icons/downwardArrow/DownwardArrow";
import { TransparentButton } from "../accountSettingsView/pictureSection/PictureSectionStyles";
import {
  MatchesList,
  ImageOverlay,
  MatchesListItem,
  Image,
  TextWrapper,
  DislikedMoviesListWrapper,
  ListPadding,
} from "./MatchesViewStyles";

type Props = {
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
};

export const MatchesView = (props: Props) => {
  const [getTrendingMoviesProcess, setGetTrendingMoviesProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const [dislikedMoviesListExpanded, setDislikedMoviesListExpanded] = React.useState<boolean>(
    false,
  );

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
                partnerLikedMovie.M.id.S === userLikedMovie.M.id.S,
            );
            return partnerHasLikedMovie;
          } else {
            return true;
          }
        },
      );
    } else {
      return [];
    }
  };

  type ProcessedMatchedMovies = {
    id: string;
    commonScore: number;
  };

  const getProcessedMatchedMovies = (
    matchedMovies: LikedMoviesListItem[],
  ): Array<ProcessedMatchedMovies | undefined> => {
    return matchedMovies.map((movie: LikedMoviesListItem) => {
      if (
        props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getPairedUserProcess.data.likedMovies
      ) {
        const partnerScoreA = props.getPairedUserProcess.data.likedMovies.L.find(
          (likedMovie: LikedMoviesListItem) => likedMovie.M.id.S === movie.M.id.S,
        );
        if (partnerScoreA) {
          return {
            id: movie.M.id.S,
            commonScore: parseInt(movie.M.score.N, 10) + parseInt(partnerScoreA.M.score.N, 10),
          };
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    });
  };

  const getSortedMatchedMovies = (matchedMovies: Array<ProcessedMatchedMovies | undefined>) => {
    return matchedMovies.sort(
      (a: ProcessedMatchedMovies | undefined, b: ProcessedMatchedMovies | undefined) => {
        if (a && b) {
          if (a.commonScore < b.commonScore) {
            return 1;
          } else if (a.commonScore > b.commonScore) {
            return -1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      },
    );
  };

  const getMatchedMoviesDetails = () => {
    const matchedMovies = getMatchedMovies();
    const processedMatchedMovies = getProcessedMatchedMovies(matchedMovies);
    const sortedMovies = getSortedMatchedMovies(processedMatchedMovies);
    if (sortedMovies) {
      const matchedMoviesDetails = sortedMovies.map((matchedMovie: any) => {
        if (getTrendingMoviesProcess.status === Status.SUCCESS) {
          const matchedMovieDetails = getTrendingMoviesProcess.data.results.find((movie: any) => {
            return movie.id === parseInt(matchedMovie.id, 10);
          });
          return {
            ...matchedMovieDetails,
            commonScore: matchedMovie.commonScore,
          };
        } else {
          return matchedMovie;
        }
      });
      const filteredList = matchedMoviesDetails.filter(
        (movieDetailsItems) => movieDetailsItems !== undefined,
      );
      return filteredList;
    } else {
      return [];
    }
  };

  const getMatchesLikedListItems = () => {
    const matchedMoviesDetails = getMatchedMoviesDetails();
    const likedMatchedMoviesDetails = matchedMoviesDetails.filter(
      (matchedMovie) => matchedMovie.commonScore > 100,
    );
    if (likedMatchedMoviesDetails) {
      return likedMatchedMoviesDetails.map((movie: any) => {
        return (
          <MatchesListItem>
            <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
              <TextWrapper>
                <ScoreText score={movie.commonScore / 2}>{movie.commonScore / 2}</ScoreText>
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
      (matchedMovie) => matchedMovie.commonScore < 100,
    );
    if (disLikedMatchedMoviesDetails) {
      return disLikedMatchedMoviesDetails.map((movie: any) => {
        return (
          <MatchesListItem>
            <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
              <TextWrapper>
                <ScoreText score={movie.commonScore / 2}>{movie.commonScore / 2}</ScoreText>
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
                    onClick={() => setDislikedMoviesListExpanded(!dislikedMoviesListExpanded)}
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
