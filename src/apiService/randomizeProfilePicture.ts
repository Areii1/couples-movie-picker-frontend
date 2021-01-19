import { API } from "aws-amplify";

export const randomizeProfilePicture = (jwtToken: string) =>
  API.get("couples-movie-picker-api", `/randomizeProfilePicture`, {
    headers: {
      Authorization: jwtToken,
    },
  });
