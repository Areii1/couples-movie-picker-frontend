import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const getRoomDetails = (roomId: string, jwtToken?: string): Promise<any> => {
  return API.get(apiName, `/room?id=${roomId}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
