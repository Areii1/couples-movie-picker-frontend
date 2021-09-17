import {
  Status,
  GetUserItemProcess,
  ProcessSuccess,
  LikedMoviesListItem,
  Movie,
} from "../../types/Types";
import { GetTrendingMoviesProcess } from "./MainViewTypes";

export const getFilteredList = (
  getTrendingMoviesProcess: GetTrendingMoviesProcess,
  getUserItemProcess: GetUserItemProcess,
) => {
  if (getTrendingMoviesProcess.status === Status.SUCCESS) {
    return getTrendingMoviesProcess.data.filter((movie: Movie) => {
      if (getUserItemProcess.status === Status.SUCCESS && getUserItemProcess.data.likedMovies) {
        return (
          getUserItemProcess.data.likedMovies.L.find(
            (likedMovie: LikedMoviesListItem) => movie.id === parseInt(likedMovie.M.id.S, 10),
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

export const checkForMatch = (
  getPairedUserProcess: GetUserItemProcess,
  getUserItemProcess: GetUserItemProcess,
  evaluateMovieProcessSuccess: ProcessSuccess,
  getTrendingMoviesProcess: GetTrendingMoviesProcess,
  swipingIndex: number,
) => {
  if (
    getPairedUserProcess.status === Status.SUCCESS &&
    getPairedUserProcess.data.likedMovies &&
    getUserItemProcess.status === Status.SUCCESS &&
    getUserItemProcess.data.likedMovies
  ) {
    const filteredList = getFilteredList(getTrendingMoviesProcess, getUserItemProcess);
    const userEvaluatedLastMovieItem =
      evaluateMovieProcessSuccess.data.Attributes.likedMovies.L.find(
        (likedMovie: LikedMoviesListItem) =>
          filteredList[swipingIndex - 1].id === parseInt(likedMovie.M.id.S, 10),
      );
    if (userEvaluatedLastMovieItem && parseInt(userEvaluatedLastMovieItem.M.score.N, 10) >= 50) {
      const pairedUserEvaluatedLastItem = getPairedUserProcess.data.likedMovies.L.find(
        (likedMovie: LikedMoviesListItem) =>
          filteredList[swipingIndex - 1].id === parseInt(likedMovie.M.id.S, 10),
      );
      if (
        pairedUserEvaluatedLastItem &&
        parseInt(pairedUserEvaluatedLastItem.M.score.N, 10) >= 50
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};
