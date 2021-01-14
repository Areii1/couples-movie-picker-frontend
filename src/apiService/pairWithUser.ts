import { API } from "aws-amplify";

export const pairWithUser = (username: string, jwtToken: string) =>
  API.get("couples-movie-picker-api", `/requestPairing?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
