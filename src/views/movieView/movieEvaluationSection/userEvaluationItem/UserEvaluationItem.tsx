import React from "react";
import { GetUserItemProcess, Status, LikedMoviesListItem } from "../../../../types/Types";
import { FireIcon } from "../../../../components/icons/fireIcon/FireIcon";
import { ColdIcon } from "../../../../components/icons/coldIcon/ColdIcon";
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

const getIconContent = (score: number) => {
  if (score >= 50) {
    return <FireIcon size={30} score={score - 50} animate={false} isGray={false} />;
  } else {
    return <ColdIcon size={30} score={score} animate={false} isGray={false} />;
  }
};

type Props = {
  getUserItemProcess: GetUserItemProcess;
  evaluatedMovieItem: LikedMoviesListItem;
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
              {getIconContent(parseInt(props.evaluatedMovieItem.M.score.N, 10))}
            </TransparentButton>
          </IconWrapper>
        )}
        {props.useCase === EvaluationItemUseCase.PARTNER && (
          <IconWrapper>
            {getIconContent(parseInt(props.evaluatedMovieItem.M.score.N, 10))}
          </IconWrapper>
        )}
        <IconText score={parseInt(props.evaluatedMovieItem.M.score.N, 10)}>
          {props.evaluatedMovieItem.M.score.N}
        </IconText>
      </UserEvaluatedItemWrapperContentWrapper>
    </UserEvaluatedItemWrapper>
  );
};

UserEvaluationItem.defaultProps = {
  updateEvaluating: undefined,
};
