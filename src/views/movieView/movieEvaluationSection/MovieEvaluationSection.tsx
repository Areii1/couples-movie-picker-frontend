import React from "react";
import styled from "styled-components";
import { UserEvaluationItem } from "./userEvaluationItem/UserEvaluationItem";
import { AnimateType, HeartIcon } from "../../../components/icons/HeartIcon";
import { Process, GetUserItemProcess, Status } from "../../../App";
import { MovieTertiaryHeadline } from "../MovieView";
import { getEvaluatedMovieItem } from "../MovieViewUtilityFunctions";
import { sizingScale } from "../../../styles/Variables";
import { FireMeter } from "../../../components/fireMeter/FireMeter";
import { LikeMovieProcess } from "../../mainView/MainView";

type Props = {
  getMovieDetailsProcess: Process;
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
  evaluateItem: (movieId: string, score: number) => void;
  likeMovieProcess: LikeMovieProcess;
};

export enum EvaluationItemUseCase {
  PARTNER,
  USER,
}

export const MovieEvaluationSection = (props: Props) => {
  const [evaluating, setEvaluating] = React.useState<boolean>(false);

  const getIsMatched = () => {
    const userEvaluatedItem = getEvaluatedMovieItem(
      props.getUserItemProcess,
      props.getMovieDetailsProcess
    );
    console.log(userEvaluatedItem, "userEvaluatedItem");
    const partnerEvaluatedItem = getEvaluatedMovieItem(
      props.getPairedUserProcess,
      props.getMovieDetailsProcess
    );
    if (userEvaluatedItem !== undefined && partnerEvaluatedItem !== undefined) {
      return (
        parseInt(userEvaluatedItem.M.score.N, 10) >= 50 &&
        parseInt(partnerEvaluatedItem.M.score.N, 10) >= 50
      );
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
  const userEvaluatedMovieItem = getEvaluatedMovieItem(
    props.getUserItemProcess,
    props.getMovieDetailsProcess
  );
  const partnerEvaluatedMovieItem = getEvaluatedMovieItem(
    props.getPairedUserProcess,
    props.getMovieDetailsProcess
  );
  console.log(userEvaluatedMovieItem, "userEvaluatedMovieItem");
  console.log(evaluating, "evaluating");
  return (
    <UserEvaluationWrapper>
      {props.getUserItemProcess.status === Status.SUCCESS &&
        props.getMovieDetailsProcess.status === Status.SUCCESS &&
        (userEvaluatedMovieItem === undefined || evaluating) && (
          <FireMeterWrapper>
            <FireMeter
              evaluateItem={props.evaluateItem}
              movieId={props.getMovieDetailsProcess.data.id}
              likeMovieProcess={props.likeMovieProcess}
            />
          </FireMeterWrapper>
        )}
      {props.getUserItemProcess.status === Status.SUCCESS &&
        userEvaluatedMovieItem && (
          <>
            {!evaluating && partnerEvaluatedMovieItem && (
              <UserEvaluationItemWrapper>
                {movieIsMatched && (
                  <>
                    <HeartIcon
                      size={40}
                      isRed={false}
                      animate={AnimateType.NONE}
                    />
                    <MovieTertiaryHeadline color="green">
                      Matched
                    </MovieTertiaryHeadline>
                  </>
                )}
                {!movieIsMatched && (
                  <MovieTertiaryHeadline color="salmon">
                    Not matched
                  </MovieTertiaryHeadline>
                )}
              </UserEvaluationItemWrapper>
            )}
            {!evaluating && (
              <UserEvaluationItemWrapper>
                <UserEvaluationItem
                  getMovieDetailsProcess={props.getMovieDetailsProcess}
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
                  getMovieDetailsProcess={props.getMovieDetailsProcess}
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

const UserEvaluationWrapper = styled.div`
  margin-top: ${`${sizingScale[6]}px`};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserEvaluationItemWrapper = styled.div`
  margin-right: ${`${sizingScale[3]}px`};
`;

const FireMeterWrapper = styled.div`
  margin: auto;
`;
