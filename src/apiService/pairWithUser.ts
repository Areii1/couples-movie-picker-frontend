import { API } from "aws-amplify";
import { apiName } from '../config/Config';

export const pairWithUser = (username: string, jwtToken: string) =>
  API.get(apiName, `/requestPairing?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
