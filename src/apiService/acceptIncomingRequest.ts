import { API } from "aws-amplify";

export const acceptIncomingRequest = (username: string, jwtToken: string) =>
  API.get("couples-movie-picker-api", `/acceptIncoming?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
