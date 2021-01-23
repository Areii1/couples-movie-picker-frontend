export type NumberObj = { N: string };
export type StringSetObj = { SS: string[]};
export type StringObj = { S: string };

export type LikedMoviesList = { L : LikedMoviesListItem[]}
export type LikedMoviesListItem = { M : { id: StringObj, score: NumberObj} }

export type UserInfo = {
  created: NumberObj;
  profilePicture: StringObj;
  userId: StringObj;
  username: StringObj;
  partner?: StringObj;
  outgoingRequests?: StringObj;
  incomingRequests?: StringSetObj;
  likedMovies?: LikedMoviesList;
}