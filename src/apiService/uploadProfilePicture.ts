import { Storage } from "aws-amplify";

export const uploadProfilePicture = async (
  fileName: string,
  file: any,
  username: string,
): Promise<any> => {
  return Storage.put(`${username}/${fileName}`, file);
};
