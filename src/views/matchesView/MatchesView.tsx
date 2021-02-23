import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CardContentWrapper } from "../logIn/LogInStyles";
import {
  GetUserItemProcess,
  GetUserItemProcessSuccess,
  Status,
  LikedMoviesListItem,
} from "../../types/Types";
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
import { GetTrendingMovieProcessSuccess, GetTrendingMoviesProcess } from "../mainView/MainView";
import { getSortedMatchedMovies } from "./MatchesViewUtilityFunctions";

export type ProcessedMatchedMovies = {
  id: string;
  commonScore: number;
};

const getMatchedMovies = (
  givenGetPairedUserProcess: GetUserItemProcessSuccess,
  givenGetUserItemProcess: GetUserItemProcessSuccess,
) => {
  if (givenGetUserItemProcess.data.likedMovies) {
    return givenGetUserItemProcess.data.likedMovies.L.filter(
      (userLikedMovie: LikedMoviesListItem) => {
        if (givenGetPairedUserProcess.data.likedMovies) {
          const partnerHasLikedMovie = givenGetPairedUserProcess.data.likedMovies.L.find(
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

const getProcessedMatchedMovies = (
  matchedMovies: LikedMoviesListItem[],
  givenGetPairedUserProcess: GetUserItemProcessSuccess,
): Array<ProcessedMatchedMovies | undefined> => {
  return matchedMovies.map((movie: LikedMoviesListItem) => {
    if (givenGetPairedUserProcess.data.likedMovies) {
      const partnerScoreA = givenGetPairedUserProcess.data.likedMovies.L.find(
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

const getMatchedMoviesDetails = (
  givenGetPairedUserProcess: GetUserItemProcessSuccess,
  givenGetUserItemProcess: GetUserItemProcessSuccess,
  givenGetTrendingMoviesProcess: GetTrendingMovieProcessSuccess,
) => {
  const matchedMovies = getMatchedMovies(givenGetPairedUserProcess, givenGetUserItemProcess);
  const processedMatchedMovies = getProcessedMatchedMovies(
    matchedMovies,
    givenGetPairedUserProcess,
  );
  const sortedMovies = getSortedMatchedMovies(processedMatchedMovies);
  if (sortedMovies) {
    const matchedMoviesDetails = sortedMovies.map((matchedMovie: any) => {
      if (givenGetTrendingMoviesProcess.status === Status.SUCCESS) {
        const matchedMovieDetails = givenGetTrendingMoviesProcess.data.find((movie: any) => {
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

const getMatchesLikedListItems = (
  givenGetPairedUserProcess: GetUserItemProcessSuccess,
  givenGetUserItemProcess: GetUserItemProcessSuccess,
  givenGetTrendingMovieProcess: GetTrendingMovieProcessSuccess,
) => {
  const matchedMoviesDetails = getMatchedMoviesDetails(
    givenGetPairedUserProcess,
    givenGetUserItemProcess,
    givenGetTrendingMovieProcess,
  );
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

const getMatchesDislikedListItems = (
  givenGetPairedUserProcess: GetUserItemProcessSuccess,
  givenGetUserItemProcess: GetUserItemProcessSuccess,
  getTrendingMoviesProcess: GetTrendingMovieProcessSuccess,
) => {
  const matchedMoviesDetails = getMatchedMoviesDetails(
    givenGetPairedUserProcess,
    givenGetUserItemProcess,
    getTrendingMoviesProcess,
  );
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

type Props = {
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
};

export const MatchesView = (props: Props) => {
  const [
    getTrendingMoviesProcess,
    setGetTrendingMoviesProcess,
  ] = React.useState<GetTrendingMoviesProcess>({
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
        data: parsedGetTrendingMoviesResponse.results,
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

  return (
    <CardContentWrapper>
      {props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS &&
        getTrendingMoviesProcess.status === Status.SUCCESS && (
          <>
            {getMatchesLikedListItems(
              props.getPairedUserProcess,
              props.getUserItemProcess,
              getTrendingMoviesProcess,
            ) !== [] && (
              <MatchesList>
                {getMatchesLikedListItems(
                  props.getPairedUserProcess,
                  props.getUserItemProcess,
                  getTrendingMoviesProcess,
                )}
              </MatchesList>
            )}
            {getMatchesDislikedListItems(
              props.getPairedUserProcess,
              props.getUserItemProcess,
              getTrendingMoviesProcess,
            ) !== [] && (
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
                    <MatchesList>
                      {getMatchesDislikedListItems(
                        props.getPairedUserProcess,
                        props.getUserItemProcess,
                        getTrendingMoviesProcess,
                      )}
                    </MatchesList>
                  </>
                )}
              </>
            )}
          </>
        )}
    </CardContentWrapper>
  );
};
