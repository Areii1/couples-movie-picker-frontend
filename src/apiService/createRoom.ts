import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const createRoom = (username: string, jwtToken: string): Promise<any> =>
  API.post(apiName, `/room`, {
    body: { username },
    headers: {
      Authorization: jwtToken,
    },
  });
