import { API } from "aws-amplify";
import { apiName } from "../config/Config";

export const evaluateMovie = (jwtToken: string, id: string, value: number): Promise<any> =>
  API.get(apiName, `/likeMovie?id=${id}&value=${value}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
