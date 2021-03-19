import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const joinRoom = (roomId: string, jwtToken?: string): Promise<any> => {
  return API.get(apiName, `/room/join?id=${roomId}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
