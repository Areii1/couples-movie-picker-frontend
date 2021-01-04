import { Auth } from "aws-amplify";

export const currentSession = () => Auth.currentSession();

// export const signup = (username, password) =>
