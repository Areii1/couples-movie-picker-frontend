import { Process, Status, LikedMoviesListItem } from "../../types/Types";

export const getEvaluatedMovieItem = (
  getUserItemProcess: Process,
  movieId: number,
): LikedMoviesListItem | undefined => {
  if (getUserItemProcess.status === Status.SUCCESS && getUserItemProcess.data.likedMovies) {
    return getUserItemProcess.data.likedMovies.L.find(
      (likedMovie: LikedMoviesListItem) => parseInt(likedMovie.M.id.S, 10) === movieId,
    );
  } else {
    return undefined;
  }
};

export const getGenresStr = (getMovieDetailsProcess: Process): string => {
  if (getMovieDetailsProcess.status === Status.SUCCESS) {
    if (getMovieDetailsProcess.data.genres.length > 3) {
      const filteredList = getMovieDetailsProcess.data.genres.filter(
        (detail: string, index: number) => index < 3,
      );
      return filteredList.map((genre: any) => genre.name).join(", ");
    } else {
      return getMovieDetailsProcess.data.genres.map((genre: any) => genre.name).join(", ");
    }
  } else {
    return "";
  }
};

export const getRuntimeStr = (getMovieDetailsProcess: Process): string => {
  if (getMovieDetailsProcess.status === Status.SUCCESS) {
    if (getMovieDetailsProcess.data.runtime > 60) {
      const hours = Math.floor(getMovieDetailsProcess.data.runtime / 60);
      const minutes = getMovieDetailsProcess.data.runtime - hours * 60;
      return `${hours}h${minutes}min`;
    } else {
      return `${getMovieDetailsProcess.data.runtime}min`;
    }
  } else {
    return "";
  }
};

export const getAllAreInitial = (processList: Process[]): boolean =>
  !processList.some((process) => process.status !== Status.INITIAL);
export const getOneIsLoading = (processList: Process[]): boolean =>
  processList.some((process) => process.status === Status.LOADING);
export const getOneIsErrored = (processList: Process[]): boolean =>
  processList.some((process) => process.status === Status.ERROR);
export const getAllAreSuccessfull = (processList: Process[]): boolean =>
  !processList.some((process) => process.status !== Status.SUCCESS);
export const getAllAreErrored = (processList: Process[]): boolean =>
  !processList.some((process) => process.status !== Status.ERROR);

export const getIsMatched = (
  userEvaluatedMovieItem: LikedMoviesListItem | undefined,
  partnerEvaluatedMovieItem: LikedMoviesListItem | undefined,
): boolean => {
  if (userEvaluatedMovieItem !== undefined && partnerEvaluatedMovieItem !== undefined) {
    return (
      parseInt(userEvaluatedMovieItem.M.score.N, 10) >= 50 &&
      parseInt(partnerEvaluatedMovieItem.M.score.N, 10) >= 50
    );
  } else {
    return false;
  }
};
