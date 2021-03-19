import { GetUserItemProcess } from "../../types/Types";

export type DraggingInfo = {
  movieId: number;
};

export type MousePosition = {
  x: number;
  y: number;
};

export type DecideViewProps = {
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
};
