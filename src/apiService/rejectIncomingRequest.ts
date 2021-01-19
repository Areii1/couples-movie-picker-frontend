import { API } from "aws-amplify";

export const rejectIncomingRequest = (username: string, jwtToken: string) =>
  API.get("couples-movie-picker-api", `/rejectIncomingRequest?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
