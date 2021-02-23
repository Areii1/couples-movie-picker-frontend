import React from "react";
import { UserEvaluationItem } from "./userEvaluationItem/UserEvaluationItem";
import { AnimateType, HeartIcon } from "../../../components/icons/heartIcon/HeartIcon";
import { Process, GetUserItemProcess, Status, GetCurrentSessionProcess } from "../../../App";
import { MovieTertiaryHeadline } from "../MovieViewStyles";
import { getEvaluatedMovieItem } from "../MovieViewUtilityFunctions";
import { FireMeter } from "../../../components/fireMeter/FireMeter";
import { EvaluateMovieProcess } from "../../mainView/MainView";
import {
  UserEvaluationWrapper,
  UserEvaluationItemWrapper,
  FireMeterWrapper,
} from "./MovieEvaluationSectionStyles";

type Props = {
  getMovieDetailsProcess: Process;
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
  evaluateItem: (movieId: number, score: number) => void;
  likeMovieProcess: EvaluateMovieProcess;
  getCurrentSessionProcess: GetCurrentSessionProcess;
};

export enum EvaluationItemUseCase {
  PARTNER,
  USER,
}

export const MovieEvaluationSection = (props: Props) => {
  const [evaluating, setEvaluating] = React.useState<boolean>(false);

  const getIsMatched = () => {
    if (props.getMovieDetailsProcess.status === Status.SUCCESS) {
      const userEvaluatedItem = getEvaluatedMovieItem(
        props.getUserItemProcess,
        props.getMovieDetailsProcess.data.id,
      );
      const partnerEvaluatedItem = getEvaluatedMovieItem(
        props.getPairedUserProcess,
        props.getMovieDetailsProcess.data.id,
      );
      if (userEvaluatedItem !== undefined && partnerEvaluatedItem !== undefined) {
        return (
          parseInt(userEvaluatedItem.M.score.N, 10) >= 50 &&
          parseInt(partnerEvaluatedItem.M.score.N, 10) >= 50
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  React.useEffect(() => {
    if (
      props.likeMovieProcess.status === Status.SUCCESS ||
      props.likeMovieProcess.status === Status.ERROR
    ) {
      setEvaluating(false);
    }
  }, [props.likeMovieProcess.status]);

  const movieIsMatched = getIsMatched();

  const getUserEvaluaedMovieItem = (userProcess: GetUserItemProcess) => {
    if (props.getMovieDetailsProcess.status === Status.SUCCESS) {
      return getEvaluatedMovieItem(userProcess, props.getMovieDetailsProcess.data.id);
    } else {
      return undefined;
    }
  };

  const userEvaluatedMovieItem = getUserEvaluaedMovieItem(props.getUserItemProcess);
  const partnerEvaluatedMovieItem = getUserEvaluaedMovieItem(props.getPairedUserProcess);
  return (
    <UserEvaluationWrapper>
      {props.getCurrentSessionProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS &&
        props.getMovieDetailsProcess.status === Status.SUCCESS &&
        (userEvaluatedMovieItem === undefined || evaluating) && (
          <FireMeterWrapper>
            <FireMeter
              jwtToken={props.getCurrentSessionProcess.data.getIdToken().getJwtToken()}
              evaluateItem={props.evaluateItem}
              movieId={props.getMovieDetailsProcess.data.id}
              evaluateMovieProcess={props.likeMovieProcess}
            />
          </FireMeterWrapper>
        )}
      {props.getUserItemProcess.status === Status.SUCCESS && userEvaluatedMovieItem && (
        <>
          {!evaluating && partnerEvaluatedMovieItem && (
            <UserEvaluationItemWrapper>
              {movieIsMatched && (
                <>
                  <HeartIcon size={40} isRed={false} animate={AnimateType.NONE} />
                  <MovieTertiaryHeadline color="green">Matched</MovieTertiaryHeadline>
                </>
              )}
              {!movieIsMatched && (
                <MovieTertiaryHeadline color="salmon">Not matched</MovieTertiaryHeadline>
              )}
            </UserEvaluationItemWrapper>
          )}
          {!evaluating && (
            <UserEvaluationItemWrapper>
              <UserEvaluationItem
                getUserItemProcess={props.getUserItemProcess}
                evaluatedMovieItem={userEvaluatedMovieItem}
                updateEvaluating={setEvaluating}
                useCase={EvaluationItemUseCase.USER}
              />
            </UserEvaluationItemWrapper>
          )}
          {partnerEvaluatedMovieItem && (
            <UserEvaluationItemWrapper>
              <UserEvaluationItem
                getUserItemProcess={props.getPairedUserProcess}
                evaluatedMovieItem={partnerEvaluatedMovieItem}
                useCase={EvaluationItemUseCase.PARTNER}
              />
            </UserEvaluationItemWrapper>
          )}
        </>
      )}
    </UserEvaluationWrapper>
  );
};
