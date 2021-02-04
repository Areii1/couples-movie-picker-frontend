import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const rejectIncomingRequest = (username: string, jwtToken: string): Promise<any> =>
  API.get(apiName, `/rejectIncomingRequest?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
