import { API } from "aws-amplify";

export const getUser = (username: string) =>
  API.get("couples-movie-picker-api", `/user?username=${username}`, {});
