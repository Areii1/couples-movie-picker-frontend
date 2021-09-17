import { GetUserItemProcessSuccess, Status, LikedMoviesListItem } from "../../types/Types";
import { GetTrendingMovieProcessSuccess } from "../mainView/MainViewTypes";
import { ProcessedMatchedMovies } from "./MovieListView";

export const getSortedMatchedMovies = (
  matchedMovies: Array<ProcessedMatchedMovies | undefined>,
) => {
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

const getProcessedLikedMovies = (
  likedMovies: LikedMoviesListItem[],
): Array<ProcessedMatchedMovies | undefined> => {
  return likedMovies.map((movie: LikedMoviesListItem) => {
    return {
      id: movie.M.id.S,
      commonScore: parseInt(movie.M.score.N, 10),
    };
  });
};

export const getLikedMoviesDetails = (
  givenGetUserItemProcess: GetUserItemProcessSuccess,
  givenGetTrendingMoviesProcess: GetTrendingMovieProcessSuccess,
) => {
  if (givenGetUserItemProcess.data.likedMovies !== undefined) {
    const processedMatchedMovies = getProcessedLikedMovies(
      givenGetUserItemProcess.data.likedMovies.L,
    );
    console.log(processedMatchedMovies, "processedMatchedMovies");
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
  } else {
    return [];
  }
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

export const getMatchedMoviesDetails = (
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
