import React from "react";
import styled from "styled-components";
import { GetUserItemProcess, Process, Status } from "../../../../App";
import { FireIcon } from "../../../../components/icons/FireIcon";
import { ColdIcon } from "../../../../components/icons/ColdIcon";
import { ProfileBall } from "../../../../components/profileBall/ProfileBall";
import { bucketUrl } from "../../../../config/Config";
import { borderRadius, sizingScale } from "../../../../styles/Variables";
import { TransparentButton } from "../../../accountSettingsView/pictureSection/PictureSectionStyles";
import { EvaluationItemUseCase } from "../MovieEvaluationSection";
import { getScoreTextColor } from "./UserEvaluationItemUtilityFunctions";

type Props = {
  getUserItemProcess: GetUserItemProcess;
  getMovieDetailsProcess: Process;
  evaluatedMovieItem: any;
  updateEvaluating?: (value: boolean) => void;
  useCase: EvaluationItemUseCase;
};

export const UserEvaluationItem = (props: Props) => {
  return (
    <UserEvaluatedItemWrapper>
      <UserEvaluatedItemWrapperContentWrapper>
        <ProfileBall
          image={
            props.getUserItemProcess.status === Status.SUCCESS &&
            props.getUserItemProcess.data.profilePicture
              ? `${bucketUrl}/${props.getUserItemProcess.data.profilePicture.S}`
              : undefined
          }
          isCurrentUser={false}
          size={30}
          animate={false}
          showText
          shadow={false}
          border={false}
        />
        {props.useCase === EvaluationItemUseCase.USER && (
          <IconWrapper>
            <TransparentButton
              onClick={() => (props.updateEvaluating ? props.updateEvaluating(true) : {})}
              title="reevaluate movie"
            >
              {parseInt(props.evaluatedMovieItem.M.score.N, 10) >= 50 && (
                <FireIcon
                  size={30}
                  score={parseInt(props.evaluatedMovieItem.M.score.N, 10) - 50}
                  animate={false}
                  isGray={false}
                />
              )}
              {parseInt(props.evaluatedMovieItem.M.score.N) < 50 && (
                <ColdIcon
                  size={30}
                  score={parseInt(props.evaluatedMovieItem.M.score.N, 10)}
                  animate={false}
                  isGray={false}
                />
              )}
            </TransparentButton>
          </IconWrapper>
        )}
        {props.useCase === EvaluationItemUseCase.PARTNER && (
          <IconWrapper>
            {parseInt(props.evaluatedMovieItem.M.score.N, 10) >= 50 && (
              <FireIcon
                size={30}
                score={parseInt(props.evaluatedMovieItem.M.score.N, 10) - 50}
                animate={false}
                isGray={false}
              />
            )}
            {parseInt(props.evaluatedMovieItem.M.score.N) < 50 && (
              <ColdIcon
                size={30}
                score={parseInt(props.evaluatedMovieItem.M.score.N, 10)}
                animate={false}
                isGray={false}
              />
            )}
          </IconWrapper>
        )}
        <IconText score={parseInt(props.evaluatedMovieItem.M.score.N, 10)}>
          {props.evaluatedMovieItem.M.score.N}
        </IconText>
      </UserEvaluatedItemWrapperContentWrapper>
    </UserEvaluatedItemWrapper>
  );
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

type IconTextProps = {
  score: number;
};

const IconText = styled.h5`
  margin: 0;
  color: ${(props: IconTextProps) => getScoreTextColor(props.score)};
`;

const UserEvaluatedItemWrapper = styled.div`
  display: inline-block;
  padding: ${`${sizingScale[2]}px`} ${`${sizingScale[3]}px`};
  border-radius: ${`${borderRadius}px`};
  border: 1px solid lightgray;
`;

const UserEvaluatedItemWrapperContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;
