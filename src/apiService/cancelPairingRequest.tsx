import { API } from "aws-amplify";

export const cancelPairingRequest = (username: string, jwtToken: string) =>
  API.get("couples-movie-picker-api", `/cancelPairing?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
