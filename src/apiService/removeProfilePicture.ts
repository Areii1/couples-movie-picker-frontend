import { API } from "aws-amplify";

export const removeProfilePicture = (username: string, jwtToken: string) =>
  API.get("couples-movie-picker-api", `/user/picture?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
