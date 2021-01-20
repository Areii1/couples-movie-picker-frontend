export type NumberObj = { N: string };
export type StringSetObj = { SS: string[]};
export type StringObj = { S: string };

export type UserInfo = {
  created: NumberObj;
  profilePicture: StringObj;
  userId: StringObj;
  username: StringObj;
  partner?: StringObj;
  outgoingRequests?: StringObj;
  incomingRequests?: StringSetObj;
}