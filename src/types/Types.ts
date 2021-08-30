import { CognitoUserSession } from "amazon-cognito-identity-js";

export type NumberObj = { N: string };
export type StringSetObj = { SS: string[] };
export type StringObj = { S: string };

export type LikedMoviesList = { L: LikedMoviesListItem[] };
export type LikedMoviesListItem = { M: { id: StringObj; score: NumberObj } };

export type UserInfo = {
  created: NumberObj;
  profilePicture: StringObj;
  userId: StringObj;
  username: StringObj;
  partner?: StringObj;
  outgoingRequests?: StringObj;
  incomingRequests?: StringSetObj;
  likedMovies?: LikedMoviesList;
};

export type Movie = {
  id: number;
  original_title: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
};

export enum Status {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR,
}

export type ProcessInitial = {
  status: Status.INITIAL;
};

export type ProcessLoading = {
  status: Status.LOADING;
};

export type ProcessSuccess = { status: Status.SUCCESS; data: any };

export type ProcessError = { status: Status.ERROR; error: any };

export type Process = ProcessInitial | ProcessLoading | ProcessSuccess | ProcessError;

export type GetCurrentSessionProcessSuccess = { status: Status.SUCCESS; data: CognitoUserSession };
export type GetCurrentSessionProcess =
  | ProcessInitial
  | ProcessLoading
  | GetCurrentSessionProcessSuccess
  | ProcessError;

export type GetUserItemProcessSuccess = { status: Status.SUCCESS; data: UserInfo };
export type GetUserItemProcess =
  | ProcessInitial
  | ProcessLoading
  | GetUserItemProcessSuccess
  | ProcessError;
