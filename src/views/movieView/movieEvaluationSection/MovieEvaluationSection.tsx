import React from "react";
import { UserEvaluationItem } from "./userEvaluationItem/UserEvaluationItem";
import { AnimateType, HeartIcon } from "../../../components/icons/heartIcon/HeartIcon";
import { GetUserItemProcess, Status } from "../../../types/Types";
import { MovieTertiaryHeadline } from "../MovieViewStyles";
import { getEvaluatedMovieItem, getIsMatched } from "../MovieViewUtilityFunctions";
import { FireMeter } from "../../../components/fireMeter/FireMeter";
import { EvaluateMovieProcess } from "../../mainView/MainViewTypes";
import {
  UserEvaluationWrapper,
  UserEvaluationItemWrapper,
  FireMeterWrapper,
} from "./MovieEvaluationSectionStyles";

type Props = {
  movieId: number;
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
  evaluateItem: (movieId: number, score: number, jwtToken: string) => void;
  likeMovieProcess: EvaluateMovieProcess;
  jwtToken: string;
};

export enum EvaluationItemUseCase {
  PARTNER,
  USER,
}

export const MovieEvaluationSection = (props: Props) => {
  const [evaluating, setEvaluating] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      props.likeMovieProcess.status === Status.SUCCESS ||
      props.likeMovieProcess.status === Status.ERROR
    ) {
      setEvaluating(false);
    }
  }, [props.likeMovieProcess.status]);

  const userEvaluatedMovieItem = getEvaluatedMovieItem(props.getUserItemProcess, props.movieId);
  const partnerEvaluatedMovieItem = getEvaluatedMovieItem(
    props.getPairedUserProcess,
    props.movieId,
  );
  const movieIsMatched = getIsMatched(userEvaluatedMovieItem, partnerEvaluatedMovieItem);

  return (
    <UserEvaluationWrapper>
      {props.getUserItemProcess.status === Status.SUCCESS &&
        (userEvaluatedMovieItem === undefined || evaluating) && (
          <FireMeterWrapper>
            <FireMeter
              jwtToken={props.jwtToken}
              evaluateItem={props.evaluateItem}
              movieId={props.movieId}
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
