import React from "react";
import { GetUserItemProcess, Process, Status } from "../../../../App";
import { FireIcon } from "../../../../components/icons/FireIcon";
import { ColdIcon } from "../../../../components/icons/ColdIcon";
import { ProfileBall } from "../../../../components/profileBall/ProfileBall";
import { bucketUrl } from "../../../../config/Config";
import { TransparentButton } from "../../../accountSettingsView/pictureSection/PictureSectionStyles";
import { EvaluationItemUseCase } from "../MovieEvaluationSection";
import {
  IconWrapper,
  IconText,
  UserEvaluatedItemWrapper,
  UserEvaluatedItemWrapperContentWrapper,
} from "./UserEvaluationItemStyles";

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
