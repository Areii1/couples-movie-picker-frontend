import { API } from "aws-amplify";
import { apiName } from '../config/Config';

export const cancelPairingRequest = (username: string, jwtToken: string) =>
  API.get(apiName, `/cancelPairing?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
