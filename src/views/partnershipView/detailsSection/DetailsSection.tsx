import React from "react";
import styled from "styled-components";
import { MatchSectionWrapper } from "../PartnershipView";
import {
  Process,
  Status,
  SecondaryHeadline,
  GetCurrentSessionProcess,
  GetUserItemProcess,
} from "../../../App";
import { PendingIcon } from "../../../components/icons/PendingIcon";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { AnimateType, HeartIcon } from "../../../components/icons/HeartIcon";
import { cancelPairingRequest } from "../../../apiService/cancelPairingRequest";
import { breakUpPartnership } from "../../../apiService/breakUpPartnership";
import { TransparentButton } from "../../accountSettings/AccountSettings";
import { Puff } from "../../../components/puff/Puff";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItemProcess: GetUserItemProcess;
  getPairedUserProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

export const DetailsSection = (props: Props) => {
  const [
    breakUpPartnershipProcess,
    setBreakUpPartnershipProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });
  const [
    cancelPairingRequestProcess,
    setCancelPairingRequestProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const cancelPairing = async () => {
    if (
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.outgoingRequests !== undefined
    ) {
      try {
        setCancelPairingRequestProcess({ status: Status.LOADING });
        const cancelPairingResponse = await cancelPairingRequest(
          props.getUserItemProcess.data.outgoingRequests.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        setCancelPairingRequestProcess({
          status: Status.SUCCESS,
          data: cancelPairingResponse,
        });
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        props.getPairedUser(
          props.getUserItemProcess.data.outgoingRequests.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
      } catch (cancelPairingError) {
        setCancelPairingRequestProcess({
          status: Status.ERROR,
          error: cancelPairingError,
        });
      }
    } else {
      alert("can't cancel");
    }
  };

  const breakUp = async () => {
    if (
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
      props.getPairedUserProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.partner !== undefined
    ) {
      try {
        setBreakUpPartnershipProcess({ status: Status.LOADING });
        const acceptIncomingRequestResponse = await breakUpPartnership(
          props.getUserItemProcess.data.partner.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        setBreakUpPartnershipProcess({
          status: Status.SUCCESS,
          data: acceptIncomingRequestResponse,
        });
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        props.getPairedUser(
          props.getPairedUserProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
      } catch (accpetIncomingRequestError) {
        setBreakUpPartnershipProcess({
          status: Status.ERROR,
          error: accpetIncomingRequestError,
        });
      }
    } else {
      alert("can't break up");
    }
  };

  const getTextSection = () => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      if (
        props.getUserItemProcess.data.partner !== undefined &&
        breakUpPartnershipProcess.status === Status.INITIAL
      ) {
        return (
          <TextWrapper>
            <p>{`${props.getUserItemProcess.data.username.S} loves ${props.getUserItemProcess.data.partner.S}`}</p>
            <TransparentButton onClick={breakUp} title="break up">
              <Text>break up</Text>
            </TransparentButton>
          </TextWrapper>
        );
      } else if (
        props.getUserItemProcess.data.outgoingRequests !== undefined &&
        cancelPairingRequestProcess.status === Status.INITIAL
      ) {
        return (
          <TextWrapper>
            <p>
              {`${props.getUserItemProcess.data.username.S}`}
              <DeemphasizedSpan>waiting for</DeemphasizedSpan>
              {`${props.getUserItemProcess.data.outgoingRequests.S}'s`}
              <DeemphasizedSpan>approval</DeemphasizedSpan>
            </p>
            <TransparentButton onClick={cancelPairing} title="cancel">
              <Text>cancel</Text>
            </TransparentButton>
          </TextWrapper>
        );
      } else if (
        props.getUserItemProcess.data.partner === undefined &&
        props.getUserItemProcess.data.outgoingRequests === undefined
      ) {
        return (
          <p>{`${props.getUserItemProcess.data.username.S} loves nobody`}</p>
        );
      } else if (
        (props.getUserItemProcess.data.outgoingRequests !== undefined ||
          props.getUserItemProcess.data.partner !== undefined) &&
        (breakUpPartnershipProcess.status === Status.LOADING ||
          cancelPairingRequestProcess.status === Status.LOADING)
      ) {
        return <Puff size={50} fill="lightblue" />;
      }
    }
  };

  return (
    <MatchSectionWrapper>
      {props.getCurrentSessionProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS &&
        props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
          <>
            <SecondaryHeadline>Details</SecondaryHeadline>
            <MatchSection>
              <BallsWrapper>
                <PartnerBallWrapper toLeft={false}>
                  <ProfileBall
                    firstName={
                      props.getCurrentAuthenticatedUserProcess.data.username
                    }
                    image={
                      props.getUserItemProcess.status === Status.SUCCESS &&
                      props.getUserItemProcess.data.profilePicture
                        ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-2miadmkpd2b7.s3.eu-central-1.amazonaws.com/${props.getUserItemProcess.data.profilePicture.S}`
                        : undefined
                    }
                    isCurrentUser={false}
                    size={150}
                    animate={false}
                    fontSize={100}
                    showText
                    shadow
                    border={false}
                  />
                  <BallOverlay
                    requestPending={
                      props.getUserItemProcess.status === Status.SUCCESS &&
                      props.getUserItemProcess.data.outgoingRequests !==
                        undefined
                    }
                  />
                </PartnerBallWrapper>
                <PartnerBallWrapper toLeft>
                  <ProfileBall
                    firstName={
                      props.getPairedUserProcess.status === Status.SUCCESS
                        ? props.getPairedUserProcess.data.username.S
                        : undefined
                    }
                    image={
                      ((props.getUserItemProcess.status === Status.SUCCESS &&
                        props.getUserItemProcess.data.outgoingRequests !==
                          undefined) ||
                        (props.getUserItemProcess.status === Status.SUCCESS &&
                          props.getUserItemProcess.data.partner !==
                            undefined)) &&
                      props.getPairedUserProcess.status === Status.SUCCESS &&
                      props.getPairedUserProcess.data.profilePicture
                        ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-2miadmkpd2b7.s3.eu-central-1.amazonaws.com/${props.getPairedUserProcess.data.profilePicture.S}`
                        : undefined
                    }
                    isCurrentUser={false}
                    size={150}
                    animate={false}
                    fontSize={100}
                    showText={
                      !(
                        props.getUserItemProcess.status === Status.SUCCESS &&
                        props.getUserItemProcess.data.outgoingRequests !==
                          undefined
                      )
                    }
                    shadow
                    border={false}
                  />
                  <BallOverlay
                    requestPending={
                      props.getUserItemProcess.status === Status.SUCCESS &&
                      props.getUserItemProcess.data.outgoingRequests !==
                        undefined
                    }
                  />
                  {props.getUserItemProcess.status === Status.SUCCESS &&
                    props.getUserItemProcess.data.outgoingRequests !==
                      undefined && (
                      <IconWrapper>
                        <PendingIcon animate={false} size={80} />
                      </IconWrapper>
                    )}
                </PartnerBallWrapper>
                <IconWrapper>
                  {!(
                    props.getUserItemProcess.status === Status.SUCCESS &&
                    props.getUserItemProcess.data.outgoingRequests !== undefined
                  ) && (
                    <HeartIcon size={80} animate={AnimateType.SCALE} isRed />
                  )}
                </IconWrapper>
              </BallsWrapper>
            </MatchSection>
            {getTextSection()}
          </>
        )}
    </MatchSectionWrapper>
  );
};

type BallOverlayProps = {
  requestPending: boolean;
};

const BallOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
  border-radius: 150px;
  background-color: white;
  opacity: ${(props: BallOverlayProps) => (props.requestPending ? 0.5 : 0.3)};
`;

type BallWrapperProps = {
  toLeft: boolean;
};

const BallWrapper = styled.div`
  margin-left: ${(props: BallWrapperProps) => (props.toLeft ? "-20px" : 0)};
  margin-right: ${(props: BallWrapperProps) => (props.toLeft ? 0 : "-20px")};
`;

const PartnerBallWrapper = styled(BallWrapper)`
  position: relative;
`;

const TextWrapper = styled.div`
  display: flex;
`;

const Text = styled.p`
  margin-left: 10px;
  color: blue;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: calc(50% - 40px);
  left: calc(50% - 40px);
`;

const MatchSection = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const BallsWrapper = styled.div`
  width: 260px;
  display: flex;
  align-items: center;
  position: relative;
`;

const DeemphasizedSpan = styled.span`
  color: gray;
  font-weight: 300;
  margin: 0 5px;
`;
