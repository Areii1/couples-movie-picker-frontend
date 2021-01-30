import { Process, Status } from "../../App";
import { LikedMoviesListItem } from "../../types/Types";

export const getEvaluatedMovieItem = (
  getUserItemProcess: Process,
  movieId: number
) => {
  if (
    getUserItemProcess.status === Status.SUCCESS &&
    getUserItemProcess.data.likedMovies
  ) {
    return getUserItemProcess.data.likedMovies.L.find(
      (likedMovie: LikedMoviesListItem) =>
        parseInt(likedMovie.M.id.S, 10) === movieId
    );
  } else {
    return undefined;
  }
};
