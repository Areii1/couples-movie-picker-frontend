import { API } from "aws-amplify";
import { apiName } from '../config/Config';

export const removeProfilePicture = (username: string, jwtToken: string) =>
  API.get(apiName, `/user/picture?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
