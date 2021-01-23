import { API } from "aws-amplify";

export const evaluateMovie = (jwtToken: string, id: string, value: number) =>
  API.get("couples-movie-picker-api", `/likeMovie?id=${id}&value=${value}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
