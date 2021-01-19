import { API } from "aws-amplify";

export const breakUpPartnership = (username: string, jwtToken: string) =>
  API.get("couples-movie-picker-api", `/breakUpPartnership?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
