import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const randomizeProfilePicture = (jwtToken: string): Promise<any> =>
  API.get(apiName, `/randomizeProfilePicture`, {
    headers: {
      Authorization: jwtToken,
    },
  });
