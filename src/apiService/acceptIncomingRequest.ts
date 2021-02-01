import { API } from "aws-amplify";
import { apiName } from '../config/Config';

export const acceptIncomingRequest = (username: string, jwtToken: string) =>
  API.get(apiName, `/acceptIncomingRequest?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
