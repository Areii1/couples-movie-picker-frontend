import { Process, Status } from "../../App";
import { LikedMoviesListItem } from "../../types/Types";

export const getEvaluatedMovieItem = (
  getUserItemProcess: Process,
  getMovieDetailsProcess: Process
) => {
  if (
    getUserItemProcess.status === Status.SUCCESS &&
    getUserItemProcess.data.likedMovies
  ) {
    return getUserItemProcess.data.likedMovies.L.find(
      (likedMovie: LikedMoviesListItem) => {
        if (getMovieDetailsProcess.status === Status.SUCCESS) {
          return (
            parseInt(likedMovie.M.id.S, 10) === getMovieDetailsProcess.data.id
          );
        } else {
          return false;
        }
      }
    );
  } else {
    return undefined;
  }
};
