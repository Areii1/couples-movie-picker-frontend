import React from "react";
import styled from "styled-components";
import { LogInPrimaryHeadline } from "./LogIn";
import { Process, Status, SecondaryHeadline } from "../App";
import { ProfileBall } from "../components/profileBall/ProfileBall";
import { HeartIcon } from "../components/icons/HeartIcon";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getUserItemProcess: Process;
};

export const MatchesView = (props: Props) => {
  return (
    <Wrapper>
      <LogInPrimaryHeadline>Matches</LogInPrimaryHeadline>
      {props.getUserItemProcess.status === Status.SUCCESS &&
        props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
          <div>
            <BallsWrapper>
              <BallWrapper toLeft={false}>
                <ProfileBall
                  firstName={
                    props.getCurrentAuthenticatedUserProcess.data.username
                  }
                  image={
                    props.getUserItemProcess.status === Status.SUCCESS &&
                    props.getUserItemProcess.data.profilePicture
                      ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-wzbj5zhprz9k.s3.eu-central-1.amazonaws.com/${props.getUserItemProcess.data.profilePicture.S}`
                      : undefined
                  }
                  isCurrentUser={false}
                  size={150}
                  animate={false}
                  fontSize={100}
                />
              </BallWrapper>
              <IconWrapper>
                <HeartIcon size={60} animate={false} />
              </IconWrapper>
              <BallWrapper toLeft>
                <ProfileBall
                  firstName={undefined}
                  image={undefined}
                  isCurrentUser={false}
                  size={150}
                  animate={false}
                  fontSize={100}
                />
              </BallWrapper>
            </BallsWrapper>
            <TextWrapper>
              <SecondaryHeadline>{`${props.getCurrentAuthenticatedUserProcess.data.username} loves nobody`}</SecondaryHeadline>
            </TextWrapper>
          </div>
        )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  width: 400px;
`;

const Section = styled.div`
  text-align: start;
`;

const BallsWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

type BallWrapperProps = {
  toLeft: boolean;
};

const BallWrapper = styled.div`
  margin-left: ${(props: BallWrapperProps) => (props.toLeft ? "-20px" : 0)};
  margin-right: ${(props: BallWrapperProps) => (props.toLeft ? 0 : "-20px")};
`;

const TextWrapper = styled.div`
  margin-top: 20px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
`;
