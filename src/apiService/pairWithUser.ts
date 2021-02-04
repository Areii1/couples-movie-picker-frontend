import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const pairWithUser = (username: string, jwtToken: string): Promise<any> =>
  API.get(apiName, `/requestPairing?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
