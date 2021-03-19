import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const terminateRoom = (jwtToken: string, id: string): Promise<any> =>
  API.get(apiName, `/room/terminate?id=${id}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
