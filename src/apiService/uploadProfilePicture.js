import { Storage } from "aws-amplify";

export const uploadProfilePicture = async (fileName, file, username) => {
  return Storage.put(`${username}/${fileName}`, file);
};
