import { API } from "aws-amplify";

export const getUser = (username: string, jwtToken?: string) => {
  return API.get("couples-movie-picker-api", `/user?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
