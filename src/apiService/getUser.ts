import { API } from "aws-amplify";

export const getUser = (username: string, jwtToken?: string) => {
  console.log({
    Authorization: jwtToken,
  });
  return API.get("couples-movie-picker-api", `/user?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
