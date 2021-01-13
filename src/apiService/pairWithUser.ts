import { API } from "aws-amplify";

export const pairWithUser = (username: string) =>
  API.get("couples-movie-picker-api", `/user?username=${username}`, {});
