import { Storage } from "aws-amplify";

export const uploadProfilePicture = async (fileName, file, username) => {
  return Storage.put(`${username}/${fileName}`, file);
};

export const removeProfilePicture = async () => {
  const newPromise = new Promise((reject, resolve) => {
    setTimeout(() => {
      resolve("done");
    }, 1000);
  });
  return newPromise;
};
