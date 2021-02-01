import { API } from "aws-amplify";
import { apiName } from '../config/Config';

export const breakUpPartnership = (username: string, jwtToken: string) =>
  API.get(apiName, `/breakUpPartnership?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
