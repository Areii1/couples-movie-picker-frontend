import React from "react";
import styled from "styled-components";
import { UserEvaluationItem } from "./userEvaluationItem/UserEvaluationItem";
import { AnimateType, HeartIcon } from "../../../components/icons/HeartIcon";
import { Process, GetUserItemProcess, Status } from "../../../App";
import { MovieTertiaryHeadline } from "../MovieView";
import { getEvaluatedMovieItem } from "../MovieViewUtilityFunctions";
import { sizingScale } from "../../../styles/Variables";
import { FireMeter } from "../../../components/fireMeter/FireMeter";

type Props = {
  getMovieDetailsProcess: Process;
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
};

export const MovieEvaluationSection = (props: Props) => {
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
    console.log(partnerEvaluatedItem, "partnerEvaluatedItem");
    if (userEvaluatedItem !== undefined && partnerEvaluatedItem !== undefined) {
      return (
        parseInt(userEvaluatedItem.M.score.N, 10) >= 50 &&
        parseInt(partnerEvaluatedItem.M.score.N, 10) >= 50
      );
    } else {
      return false;
    }
  };

  const movieIsMatched = getIsMatched();
  const userEvaluatedMovieItem = getEvaluatedMovieItem(
    props.getUserItemProcess,
    props.getMovieDetailsProcess
  );
  const partnerEvaluatedMovieItem = getEvaluatedMovieItem(
    props.getUserItemProcess,
    props.getMovieDetailsProcess
  );
  return (
    <UserEvaluationWrapper>
      {props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS &&
        userEvaluatedMovieItem && (
          <>
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
            <UserEvaluationItemWrapper>
              <UserEvaluationItem
                getMovieDetailsProcess={props.getMovieDetailsProcess}
                getUserItemProcess={props.getUserItemProcess}
                evaluatedMovieItem={userEvaluatedMovieItem}
              />
            </UserEvaluationItemWrapper>
            <UserEvaluationItemWrapper>
              <UserEvaluationItem
                getMovieDetailsProcess={props.getMovieDetailsProcess}
                getUserItemProcess={props.getPairedUserProcess}
                evaluatedMovieItem={partnerEvaluatedMovieItem}
              />
            </UserEvaluationItemWrapper>
          </>
        )}
        {props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS &&
        !userEvaluatedMovieItem && (
          <h5>sad</h5>
          // <FireMeter />
        )}
    </UserEvaluationWrapper>
  );
};

const UserEvaluationWrapper = styled.div`
  margin-top: ${`${sizingScale[6]}px`};
  display: flex;
  align-items: center;
`;

const UserEvaluationItemWrapper = styled.div`
  margin-right: ${`${sizingScale[3]}px`};
`;
