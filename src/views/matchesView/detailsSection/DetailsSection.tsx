import React from "react";
import styled from "styled-components";
import { MatchSectionWrapper } from "../MatchesView";
import { Process, Status, SecondaryHeadline } from "../../../App";
import { PendingIcon } from "../../../components/icons/PendingIcon";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { AnimateType, HeartIcon } from "../../../components/icons/HeartIcon";
import { cancelPairingRequest } from "../../../apiService/cancelPairingRequest";
import { breakUpPartnership } from "../../../apiService/breakUpPartnership";
import { TransparentButton } from "../../accountSettings/AccountSettings";
import { Puff } from "../../../components/puff/Puff";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getUserItemProcess: Process;
  getPairedUserProcess: Process;
  getCurrentSessionProcess: Process;
  isPartnered: boolean;
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
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.outgoingRequests &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
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
    }
  };

  const breakUp = async () => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      props.getPairedUserProcess.status === Status.SUCCESS
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
    }
  };

  const requestPending =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.outgoingRequests !== undefined;
  return (
    <MatchSectionWrapper>
      {props.getUserItemProcess.status === Status.SUCCESS &&
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
                  <BallOverlay requestPending={requestPending} />
                </PartnerBallWrapper>
                <PartnerBallWrapper toLeft>
                  <ProfileBall
                    firstName={
                      props.getPairedUserProcess.status === Status.SUCCESS
                        ? props.getPairedUserProcess.data.username.S
                        : undefined
                    }
                    image={
                      (requestPending || props.isPartnered) &&
                      props.getPairedUserProcess.status === Status.SUCCESS &&
                      props.getPairedUserProcess.data.profilePicture
                        ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-2miadmkpd2b7.s3.eu-central-1.amazonaws.com/${props.getPairedUserProcess.data.profilePicture.S}`
                        : undefined
                    }
                    isCurrentUser={false}
                    size={150}
                    animate={false}
                    fontSize={100}
                    showText={!requestPending}
                    shadow
                    border={false}
                  />
                  <BallOverlay requestPending={requestPending} />
                  {requestPending && (
                    <IconWrapper>
                      <PendingIcon animate={false} size={80} />
                    </IconWrapper>
                  )}
                </PartnerBallWrapper>
                <IconWrapper>
                  {!requestPending && (
                    <HeartIcon size={80} animate={AnimateType.SCALE} isRed />
                  )}
                </IconWrapper>
              </BallsWrapper>
            </MatchSection>
            {props.isPartnered &&
              breakUpPartnershipProcess.status === Status.INITIAL && (
                <TextWrapper>
                  <p>{`${props.getUserItemProcess.data.username.S} loves ${props.getUserItemProcess.data.partner.S}`}</p>
                  <TransparentButton onClick={breakUp} title="break up">
                    <Text>break up</Text>
                  </TransparentButton>
                </TextWrapper>
              )}
            {requestPending &&
              cancelPairingRequestProcess.status === Status.INITIAL && (
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
              )}
            {!props.isPartnered && !requestPending && (
              <p>{`${props.getUserItemProcess.data.username.S} loves nobody`}</p>
            )}
            {(requestPending || props.isPartnered) &&
              (breakUpPartnershipProcess.status === Status.LOADING ||
                cancelPairingRequestProcess.status === Status.LOADING) && (
                <Puff size={50} fill="lightblue" />
              )}
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
