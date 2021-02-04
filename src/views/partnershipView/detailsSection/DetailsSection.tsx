import React from "react";
import { toast } from "react-toastify";
import { MatchSectionWrapper } from "../PartnershipViewStyles";
import { Process, Status, GetCurrentSessionProcess, GetUserItemProcess } from "../../../App";
import { PendingIcon } from "../../../components/icons/pendingIcon/PendingIcon";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { AnimateType, HeartIcon } from "../../../components/icons/heartIcon/HeartIcon";
import { cancelPairingRequest } from "../../../apiService/cancelPairingRequest";
import { breakUpPartnership } from "../../../apiService/breakUpPartnership";
import { TransparentButton } from "../../accountSettingsView/pictureSection/PictureSectionStyles";
import { Puff } from "../../../components/puff/Puff";
import { bucketUrl } from "../../../config/Config";
import { SecondaryHeadline } from "../../../styles/Styles";
import { ConfirmModal } from "../../../components/modals/confirmModal/ConfirmModal";
import { DisplayProfile } from "../../../components/modals/displayProfileModal/DisplayProfileModal";
import {
  BallOverlay,
  PartnerBallWrapper,
  TextWrapper,
  Text,
  IconWrapper,
  PendingIconWrapper,
  MatchSection,
  BallsWrapper,
  DeemphasizedSpan,
} from "./DetailsSectionStyles";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItemProcess: GetUserItemProcess;
  getPairedUserProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

enum ModalOpen {
  BREAK,
  CANCEL,
  PICTUREUSER,
  PICTUREPARTNER,
  NONE,
}

export const DetailsSection = (props: Props) => {
  const [breakUpPartnershipProcess, setBreakUpPartnershipProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const [cancelPairingRequestProcess, setCancelPairingRequestProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const [modalOpen, setModalOpen] = React.useState<ModalOpen>(ModalOpen.NONE);

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
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        toast.success("Cancelled pairing request");
        setCancelPairingRequestProcess({
          status: Status.SUCCESS,
          data: cancelPairingResponse,
        });
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        props.getPairedUser(
          props.getUserItemProcess.data.outgoingRequests.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
      } catch (cancelPairingError) {
        toast.error("Could not cancel pairing");
        setCancelPairingRequestProcess({
          status: Status.ERROR,
          error: cancelPairingError,
        });
      }
    } else {
      toast.info("can't cancel");
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
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        setBreakUpPartnershipProcess({
          status: Status.SUCCESS,
          data: acceptIncomingRequestResponse,
        });
        toast.success("Broke up partnership");
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        props.getPairedUser(
          props.getPairedUserProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
      } catch (accpetIncomingRequestError) {
        toast.error("Could not break up partnership");
        setBreakUpPartnershipProcess({
          status: Status.ERROR,
          error: accpetIncomingRequestError,
        });
      }
    } else {
      toast.info("can't break up");
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
            <TransparentButton onClick={() => setModalOpen(ModalOpen.BREAK)} title="break up">
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
            <TransparentButton onClick={() => setModalOpen(ModalOpen.CANCEL)} title="cancel">
              <Text>cancel</Text>
            </TransparentButton>
          </TextWrapper>
        );
      } else if (
        props.getUserItemProcess.data.partner === undefined &&
        props.getUserItemProcess.data.outgoingRequests === undefined
      ) {
        return <p>{`${props.getUserItemProcess.data.username.S} loves nobody`}</p>;
      } else if (
        (props.getUserItemProcess.data.outgoingRequests !== undefined ||
          props.getUserItemProcess.data.partner !== undefined) &&
        (breakUpPartnershipProcess.status === Status.LOADING ||
          cancelPairingRequestProcess.status === Status.LOADING)
      ) {
        return <Puff size={50} fill="lightblue" />;
      } else {
        return <div />;
      }
    } else {
      return <div />;
    }
  };

  const handleCancelModalButtonClick = () => {
    setModalOpen(ModalOpen.NONE);
    cancelPairing();
  };

  const handleBreakUpModalButtonClick = () => {
    setModalOpen(ModalOpen.NONE);
    breakUp();
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
                <TransparentButton
                  title={`display ${props.getUserItemProcess.data.username.S}`}
                  onClick={() => setModalOpen(ModalOpen.PICTUREUSER)}
                >
                  <PartnerBallWrapper toLeft={false}>
                    <ProfileBall
                      firstName={props.getCurrentAuthenticatedUserProcess.data.username}
                      image={
                        props.getUserItemProcess.status === Status.SUCCESS &&
                        props.getUserItemProcess.data.profilePicture
                          ? `${bucketUrl}/${props.getUserItemProcess.data.profilePicture.S}`
                          : undefined
                      }
                      isCurrentUser={false}
                      size={192}
                      animate={false}
                      fontSize={100}
                      showText
                      shadow={false}
                      border={false}
                    />
                    <BallOverlay
                      requestPending={
                        props.getUserItemProcess.status === Status.SUCCESS &&
                        props.getUserItemProcess.data.outgoingRequests !== undefined
                      }
                    />
                  </PartnerBallWrapper>
                </TransparentButton>
                <TransparentButton
                  title={`display ${props.getUserItemProcess.data.username.S}`}
                  onClick={() => setModalOpen(ModalOpen.PICTUREPARTNER)}
                >
                  <PartnerBallWrapper toLeft>
                    <ProfileBall
                      firstName={
                        props.getPairedUserProcess.status === Status.SUCCESS
                          ? props.getPairedUserProcess.data.username.S
                          : undefined
                      }
                      image={
                        ((props.getUserItemProcess.status === Status.SUCCESS &&
                          props.getUserItemProcess.data.outgoingRequests !== undefined) ||
                          (props.getUserItemProcess.status === Status.SUCCESS &&
                            props.getUserItemProcess.data.partner !== undefined)) &&
                        props.getPairedUserProcess.status === Status.SUCCESS &&
                        props.getPairedUserProcess.data.profilePicture
                          ? `${bucketUrl}/${props.getPairedUserProcess.data.profilePicture.S}`
                          : undefined
                      }
                      isCurrentUser={false}
                      size={192}
                      animate={false}
                      fontSize={100}
                      showText={
                        !(
                          props.getUserItemProcess.status === Status.SUCCESS &&
                          props.getUserItemProcess.data.outgoingRequests !== undefined
                        )
                      }
                      shadow={false}
                      border={false}
                    />
                    <BallOverlay
                      requestPending={
                        props.getUserItemProcess.status === Status.SUCCESS &&
                        props.getUserItemProcess.data.outgoingRequests !== undefined
                      }
                    />
                    {props.getUserItemProcess.status === Status.SUCCESS &&
                      props.getUserItemProcess.data.outgoingRequests !== undefined && (
                        <PendingIconWrapper>
                          <PendingIcon animate={false} size={80} />
                        </PendingIconWrapper>
                      )}
                  </PartnerBallWrapper>
                </TransparentButton>
                <IconWrapper>
                  {!(
                    props.getUserItemProcess.status === Status.SUCCESS &&
                    props.getUserItemProcess.data.outgoingRequests !== undefined
                  ) && <HeartIcon size={80} animate={AnimateType.NONE} isRed />}
                </IconWrapper>
              </BallsWrapper>
            </MatchSection>
            {getTextSection()}
          </>
        )}
      {modalOpen !== ModalOpen.NONE && props.getUserItemProcess.status === Status.SUCCESS && (
        <>
          {modalOpen === ModalOpen.BREAK && props.getUserItemProcess.data.partner && (
            <ConfirmModal
              title={`Break up partnership with ${props.getUserItemProcess.data.partner.S}`}
              closeModal={() => setModalOpen(ModalOpen.NONE)}
              performAction={() => handleBreakUpModalButtonClick()}
            />
          )}
          {modalOpen === ModalOpen.CANCEL && props.getUserItemProcess.data.outgoingRequests && (
            <ConfirmModal
              title={`Cancel pending request to ${props.getUserItemProcess.data.outgoingRequests.S}`}
              closeModal={() => setModalOpen(ModalOpen.NONE)}
              performAction={() => handleCancelModalButtonClick()}
            />
          )}
          {modalOpen === ModalOpen.PICTUREUSER &&
            props.getUserItemProcess.status === Status.SUCCESS && (
              <DisplayProfile
                closeModal={() => setModalOpen(ModalOpen.NONE)}
                source={`${bucketUrl}/${props.getUserItemProcess.data.profilePicture.S}`}
              />
            )}
          {modalOpen === ModalOpen.PICTUREPARTNER &&
            props.getPairedUserProcess.status === Status.SUCCESS && (
              <DisplayProfile
                closeModal={() => setModalOpen(ModalOpen.NONE)}
                source={`${bucketUrl}/${props.getPairedUserProcess.data.profilePicture.S}`}
              />
            )}
        </>
      )}
    </MatchSectionWrapper>
  );
};
