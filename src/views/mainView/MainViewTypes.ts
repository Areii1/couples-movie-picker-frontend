import {
  GetUserItemProcess,
  Movie,
  ProcessError,
  ProcessInitial,
  ProcessLoading,
  ProcessSuccess,
  Status,
} from "../../types/Types";

export type MainViewProps = {
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUserProcess: GetUserItemProcess;
  updateInitialized: any;
  initialized: boolean;
};

type EvaluateMovieProcessLoading = { status: Status.LOADING; score: number };

export type EvaluateMovieProcess =
  | ProcessInitial
  | EvaluateMovieProcessLoading
  | ProcessSuccess
  | ProcessError;

export type GetTrendingMovieProcessSuccess = { status: Status.SUCCESS; data: Movie[] };
export type GetTrendingMoviesProcess =
  | ProcessInitial
  | ProcessLoading
  | GetTrendingMovieProcessSuccess
  | ProcessError;
