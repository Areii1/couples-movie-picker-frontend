import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const getUser = (username: string, jwtToken?: string): Promise<any> => {
  return API.get(apiName, `/user?username=${username}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
