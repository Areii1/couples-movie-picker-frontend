import { Auth } from "aws-amplify";

export const getCurrentSession = () => Auth.currentSession();
export const getCurrentAuthenticatedUser = () => Auth.currentAuthenticatedUser();
