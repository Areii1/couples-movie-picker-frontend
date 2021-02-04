import { Auth } from "aws-amplify";

export const getCurrentSession = (): Promise<any> => Auth.currentSession();
export const getCurrentAuthenticatedUser = (): Promise<any> => Auth.currentAuthenticatedUser();
