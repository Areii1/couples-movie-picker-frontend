import React from "react";
import { useParams } from "react-router-dom";
import { ParamTypes } from "../movieView/MovieView";
import { SecondaryHeadline } from "../../styles/Styles";
import { Process, Status } from "../../types/Types";
import { SettingsCardContentWrapper } from "../accountSettingsView/AccountSettingsViewStyles";
import { getRoomDetails } from "../../apiService/getRoomDetails";
import { terminateRoom } from "../../apiService/terminateRoom";
import { GetCurrentSessionProcessContext } from "../../App";
import { Puff } from "../../components/puff/Puff";
import { ProfileBall } from "../../components/profileBall/ProfileBall";
import { bucketUrl } from "../../config/Config";
import { Button, ButtonText } from "../logIn/LogInStyles";
import { ConfirmModal } from "../../components/modals/confirmModal/ConfirmModal";
import { joinRoom } from "../../apiService/joinRoom";
import { DecideViewProps } from "./DecideViewTypes";
import { ProfileBallWrapper, LoadingIconWrapper } from "./DecideViewStyles";
import { SortMovies } from "./sortMovies/SortMovies";

export const DecideView = (props: DecideViewProps) => {
  const [getRoomDetailsProcess, setGetRoomDetailsProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [terminateRoomProcess, setTerminateRoomProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [joinRoomProcess, setJoinRoomProcess] = React.useState<Process>({ status: Status.INITIAL });

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const { id } = useParams<ParamTypes>();

  const getCurrentSessionProcess = React.useContext(GetCurrentSessionProcessContext);

  const joinTheRoom = async () => {
    if (getCurrentSessionProcess.status === Status.SUCCESS && id) {
      try {
        setJoinRoomProcess({ status: Status.LOADING });
        const joinRoomResponse = await joinRoom(
          id,
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        setJoinRoomProcess({ status: Status.SUCCESS, data: joinRoomResponse });
      } catch (joinRoomError) {
        setJoinRoomProcess({ status: Status.ERROR, error: joinRoomError });
      }
    }
  };

  const fetchRoomDetails = async () => {
    if (
      getCurrentSessionProcess.status === Status.SUCCESS &&
      id &&
      props.getPairedUserProcess.status === Status.SUCCESS
    ) {
      try {
        setGetRoomDetailsProcess({ status: Status.LOADING });
        const getRoomDetailsResponse = await getRoomDetails(
          id,
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        if (getRoomDetailsResponse !== "no access") {
          if (
            getRoomDetailsResponse.status.S === "waiting" &&
            props.getPairedUserProcess.data.username.S === getRoomDetailsResponse.creator.S
          ) {
            joinTheRoom();
          }
        }
        setGetRoomDetailsProcess({ status: Status.SUCCESS, data: getRoomDetailsResponse });
      } catch (getRoomDetailsError) {
        setGetRoomDetailsProcess({ status: Status.ERROR, error: getRoomDetailsError });
      }
    }
  };

  const terminateOngoingRoom = async () => {
    if (getCurrentSessionProcess.status === Status.SUCCESS && id) {
      try {
        setTerminateRoomProcess({ status: Status.LOADING });
        const terminateRoomResponse = await terminateRoom(
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          id,
        );
        setTerminateRoomProcess({ status: Status.SUCCESS, data: terminateRoomResponse });
      } catch (getRoomDetailsError) {
        setTerminateRoomProcess({ status: Status.ERROR, error: getRoomDetailsError });
      }
    }
  };

  React.useEffect(() => {
    if (props.getPairedUserProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, []);

  React.useEffect(() => {
    if (props.getPairedUserProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, [props.getPairedUserProcess.status]);

  React.useEffect(() => {
    if (joinRoomProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, [joinRoomProcess.status]);

  React.useEffect(() => {
    if (terminateRoomProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, [terminateRoomProcess.status]);

  return (
    <SettingsCardContentWrapper>
      {getRoomDetailsProcess.status === Status.SUCCESS &&
        props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS && (
          <>
            {getRoomDetailsProcess.data !== "no access" && (
              <>
                {getRoomDetailsProcess.data.status.S === "waiting" && (
                  <>
                    {getRoomDetailsProcess.data.creator.S ===
                      props.getUserItemProcess.data.username.S && (
                      <>
                        <SecondaryHeadline>{`Waiting for ${props.getPairedUserProcess.data.username.S} to join the room`}</SecondaryHeadline>
                        <ProfileBallWrapper>
                          <LoadingIconWrapper>
                            <Puff size={100} fill="white" />
                          </LoadingIconWrapper>
                          <ProfileBall
                            firstName={props.getPairedUserProcess.data.username.S}
                            image={
                              props.getPairedUserProcess.data.profilePicture
                                ? `${bucketUrl}/${props.getPairedUserProcess.data.profilePicture.S}`
                                : undefined
                            }
                            isCurrentUser={false}
                            size={128}
                            animate={false}
                            fontSize={60}
                            showText={props.getPairedUserProcess.data.profilePicture !== undefined}
                            shadow={false}
                            border={false}
                          />
                        </ProfileBallWrapper>
                        <Button
                          type="button"
                          onClick={() => setModalOpen(true)}
                          title="terminate the room"
                          error={false}
                        >
                          <ButtonText>Terminate room</ButtonText>
                        </Button>
                        {modalOpen && (
                          <ConfirmModal
                            closeModal={() => setModalOpen(false)}
                            performAction={terminateOngoingRoom}
                            title="terminate room"
                            status={terminateRoomProcess.status}
                            buttonText="Terminate"
                          />
                        )}
                      </>
                    )}
                    {getRoomDetailsProcess.data.creator.S ===
                      props.getPairedUserProcess.data.username.S && (
                      <>
                        {joinRoomProcess.status === Status.LOADING && (
                          <Puff size={50} fill="blue" />
                        )}
                        {joinRoomProcess.status === Status.SUCCESS && (
                          <SecondaryHeadline>Joined room</SecondaryHeadline>
                        )}
                        {joinRoomProcess.status === Status.ERROR && (
                          <SecondaryHeadline>Could not join room</SecondaryHeadline>
                        )}
                      </>
                    )}
                  </>
                )}
                {getRoomDetailsProcess.data.status.S === "terminated" && (
                  <SecondaryHeadline>Room has been terminated</SecondaryHeadline>
                )}
                {getRoomDetailsProcess.data.status.S === "sorting" && (
                  <SortMovies getRoomDetailsProcess={getRoomDetailsProcess} />
                )}
              </>
            )}
            {getRoomDetailsProcess.data === "no access" && (
              <SecondaryHeadline>You are not welcome in this room</SecondaryHeadline>
            )}
          </>
        )}
    </SettingsCardContentWrapper>
  );
};
