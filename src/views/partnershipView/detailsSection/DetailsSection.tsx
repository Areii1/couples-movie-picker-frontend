import React from "react";
import { toast } from "react-toastify";
import { MatchSectionWrapper } from "../PartnershipViewStyles";
import { Process, Status, UserInfo } from "../../../types/Types";
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

enum ModalOpen {
  BREAK,
  CANCEL,
  PICTUREUSER,
  PICTUREPARTNER,
  NONE,
}

const getTextSection = (
  userItem: UserInfo,
  breakUpPartnershipProcess: Process,
  cancelPairingRequestProcess: Process,
  setModalOpen: (modalOpen: ModalOpen) => void,
) => {
  if (userItem.partner !== undefined && breakUpPartnershipProcess.status === Status.INITIAL) {
    return (
      <TextWrapper>
        <p>{`${userItem.username.S} loves ${userItem.partner.S}`}</p>
        <TransparentButton onClick={() => setModalOpen(ModalOpen.BREAK)} title="break up">
          <Text>break up</Text>
        </TransparentButton>
      </TextWrapper>
    );
  } else if (
    userItem.outgoingRequests !== undefined &&
    cancelPairingRequestProcess.status === Status.INITIAL
  ) {
    return (
      <TextWrapper>
        <p>
          {`${userItem.username.S}`}
          <DeemphasizedSpan>waiting for</DeemphasizedSpan>
          {`${userItem.outgoingRequests.S}'s`}
          <DeemphasizedSpan>approval</DeemphasizedSpan>
        </p>
        <TransparentButton onClick={() => setModalOpen(ModalOpen.CANCEL)} title="cancel">
          <Text>cancel</Text>
        </TransparentButton>
      </TextWrapper>
    );
  } else if (userItem.partner === undefined && userItem.outgoingRequests === undefined) {
    return <p>{`${userItem.username.S} loves nobody`}</p>;
  } else if (
    (userItem.outgoingRequests !== undefined || userItem.partner !== undefined) &&
    (breakUpPartnershipProcess.status === Status.LOADING ||
      cancelPairingRequestProcess.status === Status.LOADING)
  ) {
    return <Puff size={50} fill="lightblue" />;
  } else {
    return <div />;
  }
};

const getViewContent = (
  userItem: UserInfo,
  breakUpPartnershipProcess: Process,
  cancelPairingRequestProcess: Process,
  setModalOpen: (modalOpen: ModalOpen) => void,
  pairedUserItem?: UserInfo,
) => {
  return (
    <>
      <SecondaryHeadline>Details</SecondaryHeadline>
      <MatchSection>
        <BallsWrapper>
          <TransparentButton
            title={`display ${userItem.username.S}`}
            onClick={() => setModalOpen(ModalOpen.PICTUREUSER)}
          >
            <PartnerBallWrapper toLeft={false}>
              <ProfileBall
                firstName={userItem.username.S}
                image={
                  userItem.profilePicture ? `${bucketUrl}/${userItem.profilePicture.S}` : undefined
                }
                isCurrentUser={false}
                size={192}
                animate={false}
                fontSize={100}
                showText
                shadow={false}
                border={false}
              />
              <BallOverlay requestPending={userItem.outgoingRequests !== undefined} />
            </PartnerBallWrapper>
          </TransparentButton>
          <TransparentButton
            title={`display ${pairedUserItem !== undefined ? pairedUserItem.username.S : ""}`}
            onClick={() => setModalOpen(ModalOpen.PICTUREPARTNER)}
          >
            <PartnerBallWrapper toLeft>
              <ProfileBall
                firstName={pairedUserItem !== undefined ? pairedUserItem.username.S : ""}
                image={
                  pairedUserItem !== undefined && pairedUserItem.profilePicture
                    ? `${bucketUrl}/${pairedUserItem.profilePicture.S}`
                    : undefined
                }
                isCurrentUser={false}
                size={192}
                animate={false}
                fontSize={100}
                showText={userItem.outgoingRequests === undefined}
                shadow={false}
                border={false}
              />
              <BallOverlay requestPending={userItem.outgoingRequests !== undefined} />
              {userItem.outgoingRequests !== undefined && (
                <PendingIconWrapper>
                  <PendingIcon animate={false} size={80} />
                </PendingIconWrapper>
              )}
            </PartnerBallWrapper>
          </TransparentButton>
          <IconWrapper>
            {userItem.outgoingRequests === undefined && (
              <HeartIcon size={80} animate={AnimateType.NONE} isRed />
            )}
          </IconWrapper>
        </BallsWrapper>
      </MatchSection>
      {getTextSection(
        userItem,
        breakUpPartnershipProcess,
        cancelPairingRequestProcess,
        setModalOpen,
      )}
    </>
  );
};

type Props = {
  jwtToken: string;
  userItem: UserInfo;
  pairedUserItem?: UserInfo;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

export const DetailsSection = (props: Props) => {
  const [breakUpPartnershipProcess, setBreakUpPartnershipProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const [cancelPairingRequestProcess, setCancelPairingRequestProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const [modalOpen, setModalOpen] = React.useState<ModalOpen>(ModalOpen.NONE);

  const cancelPairing = async () => {
    if (props.userItem.outgoingRequests !== undefined) {
      try {
        setCancelPairingRequestProcess({ status: Status.LOADING });
        const cancelPairingResponse = await cancelPairingRequest(
          props.userItem.outgoingRequests.S,
          props.jwtToken,
        );
        toast.success("Cancelled pairing request");
        setCancelPairingRequestProcess({
          status: Status.SUCCESS,
          data: cancelPairingResponse,
        });
        props.getUserItem(props.userItem.username.S, props.jwtToken);
        props.getPairedUser(props.userItem.outgoingRequests.S, props.jwtToken);
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
    if (props.userItem.partner !== undefined && props.pairedUserItem !== undefined) {
      try {
        setBreakUpPartnershipProcess({ status: Status.LOADING });
        const acceptIncomingRequestResponse = await breakUpPartnership(
          props.userItem.partner.S,
          props.jwtToken,
        );
        setBreakUpPartnershipProcess({
          status: Status.SUCCESS,
          data: acceptIncomingRequestResponse,
        });
        toast.success("Broke up partnership");
        props.getUserItem(props.userItem.username.S, props.jwtToken);
        props.getPairedUser(props.pairedUserItem.username.S, props.jwtToken);
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
      {getViewContent(
        props.userItem,
        breakUpPartnershipProcess,
        cancelPairingRequestProcess,
        setModalOpen,
        props.pairedUserItem,
      )}
      {modalOpen !== ModalOpen.NONE && (
        <>
          {modalOpen === ModalOpen.BREAK && props.userItem.partner && (
            <ConfirmModal
              title={`Break up partnership with ${props.userItem.partner.S}`}
              closeModal={() => setModalOpen(ModalOpen.NONE)}
              performAction={() => handleBreakUpModalButtonClick()}
            />
          )}
          {modalOpen === ModalOpen.CANCEL && props.userItem.outgoingRequests && (
            <ConfirmModal
              title={`Cancel pending request to ${props.userItem.outgoingRequests.S}`}
              closeModal={() => setModalOpen(ModalOpen.NONE)}
              performAction={() => handleCancelModalButtonClick()}
            />
          )}
          {modalOpen === ModalOpen.PICTUREUSER && (
            <DisplayProfile
              closeModal={() => setModalOpen(ModalOpen.NONE)}
              source={`${bucketUrl}/${props.userItem.profilePicture.S}`}
            />
          )}
          {modalOpen === ModalOpen.PICTUREPARTNER && props.pairedUserItem !== undefined && (
            <DisplayProfile
              closeModal={() => setModalOpen(ModalOpen.NONE)}
              source={`${bucketUrl}/${props.pairedUserItem.profilePicture.S}`}
            />
          )}
        </>
      )}
    </MatchSectionWrapper>
  );
};

DetailsSection.defaultProps = {
  pairedUserItem: undefined,
};
