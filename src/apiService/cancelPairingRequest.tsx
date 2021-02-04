import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const cancelPairingRequest = (username: string, jwtToken: string): Promise<any> =>
  API.get(apiName, `/cancelPairing?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
