import { GetUserItemProcess, Status } from "../../../App";
import { getEvaluatedMovieItem } from "../../movieView/MovieViewUtilityFunctions";
import { LikeMovieProcess } from "../MainView";
import { HoveringOver } from "./ImageSection";

export const getIsPartnered = (
  getUserItemProcess: GetUserItemProcess,
  getPairedUserProcess: GetUserItemProcess,
): boolean => {
  if (
    getUserItemProcess.status === Status.SUCCESS &&
    getUserItemProcess.data.partner !== undefined &&
    getPairedUserProcess.status === Status.SUCCESS &&
    getPairedUserProcess.data.partner !== undefined &&
    getPairedUserProcess.data.partner.S === getUserItemProcess.data.username.S &&
    getPairedUserProcess.data.username.S === getUserItemProcess.data.partner.S
  ) {
    return true;
  } else {
    return false;
  }
};

export const getPartnerEvaluatedMovie = (
  filteredList: any[],
  swipingIndex: number,
  getPairedUserProcess: GetUserItemProcess,
) => {
  if (filteredList.length > 0) {
    return getEvaluatedMovieItem(getPairedUserProcess, filteredList[swipingIndex].id);
  } else {
    return undefined;
  }
};

export const getImageSrc = (
  evaluateMovieProcess: LikeMovieProcess,
  filteredList: any[],
  swipingIndex: number,
): string => {
  if (evaluateMovieProcess.status === Status.LOADING) {
    if (filteredList[swipingIndex + 1] !== undefined) {
      return `https://image.tmdb.org/t/p/w500/${filteredList[swipingIndex + 1].backdrop_path}`;
    } else {
      return "";
    }
  } else {
    return `https://image.tmdb.org/t/p/w500/${filteredList[swipingIndex].backdrop_path}`;
  }
};

export const getImageAlt = (
  evaluateMovieProcess: LikeMovieProcess,
  filteredList: any[],
  swipingIndex: number,
): string => {
  if (evaluateMovieProcess.status === Status.LOADING) {
    if (filteredList[swipingIndex + 1] !== undefined) {
      return filteredList[swipingIndex + 1].original_title;
    } else {
      return "";
    }
  } else {
    return filteredList[swipingIndex].original_title;
  }
};

export const userEvaluationItemIsNotBlockedByHoverEffect = (
  partnerEvaluatedMovie: any,
  hoveringOver: HoveringOver,
): boolean => {
  if (partnerEvaluatedMovie.M.score.N >= 50 && hoveringOver !== HoveringOver.RIGHT) {
    return true;
  } else if (partnerEvaluatedMovie.M.score.N < 50 && hoveringOver !== HoveringOver.LEFT) {
    return true;
  } else {
    return false;
  }
};
