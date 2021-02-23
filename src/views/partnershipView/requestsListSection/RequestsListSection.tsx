import React from "react";
import { toast } from "react-toastify";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { HeartIcon, AnimateType } from "../../../components/icons/heartIcon/HeartIcon";
import { Puff } from "../../../components/puff/Puff";
import {
  TransparentButton,
  Mark,
} from "../../accountSettingsView/pictureSection/PictureSectionStyles";
import {
  Process,
  Status,
  GetCurrentSessionProcess,
  GetCurrentSessionProcessSuccess,
  GetUserItemProcess,
  GetUserItemProcessSuccess,
} from "../../../types/Types";
import { rejectIncomingRequest } from "../../../apiService/rejectIncomingRequest";
import { acceptIncomingRequest } from "../../../apiService/acceptIncomingRequest";
import {
  FoundUserWrapper,
  ProfileWrapper,
  ProfileText,
  ButtonsWrapper,
} from "../PartnershipViewStyles";
import { SecondaryHeadline } from "../../../styles/Styles";
import { SectionWrapper, RequestList, RequestListItem } from "./RequestsListSectionStyles";

type Props = {
  getUserItemProcess: GetUserItemProcess;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItem: (username: string, jwtToken: string) => void;
};

export const RequestsListSection = (props: Props) => {
  const [rejectIncomingRequestProcess, setRejectIncomingRequestProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [acceptIncomingRequestProcess, setAcceptIncomingRequestProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const rejectIncoming = async (rejectUsername: string) => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.incomingRequests &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      const rejectableRequest = props.getUserItemProcess.data.incomingRequests.SS.find(
        (request: string) => rejectUsername === request,
      );
      if (rejectableRequest) {
        try {
          setRejectIncomingRequestProcess({ status: Status.LOADING });
          const rejectIncomingRequestResponse = await rejectIncomingRequest(
            rejectableRequest,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          );
          setRejectIncomingRequestProcess({
            status: Status.SUCCESS,
            data: rejectIncomingRequestResponse,
          });
          toast.success("Rejected request");
          props.getUserItem(
            props.getUserItemProcess.data.username.S,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          );
        } catch (rejectIncomingRequestError) {
          toast.error("Could not reject request");
          setRejectIncomingRequestProcess({
            status: Status.ERROR,
            error: rejectIncomingRequestError,
          });
        }
      }
    }
  };

  const acceptIncoming = async (
    acceptUsername: string,
    givenGetUserItemProcess: GetUserItemProcessSuccess,
    givenGetCurrentSessionProcess: GetCurrentSessionProcessSuccess,
  ) => {
    const acceptableRequest = givenGetUserItemProcess.data.incomingRequests?.SS.find(
      (request: string) => acceptUsername === request,
    );
    if (acceptableRequest) {
      try {
        setAcceptIncomingRequestProcess({ status: Status.LOADING });
        const acceptIncomingRequestResponse = await acceptIncomingRequest(
          acceptUsername,
          givenGetCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        toast.success(`Partnered with ${acceptUsername}`);
        setAcceptIncomingRequestProcess({
          status: Status.SUCCESS,
          data: acceptIncomingRequestResponse,
        });
        props.getUserItem(
          givenGetUserItemProcess.data.username.S,
          givenGetCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
      } catch (accpetIncomingRequestError) {
        toast.error("Could not accept request");
        setAcceptIncomingRequestProcess({
          status: Status.ERROR,
          error: accpetIncomingRequestError,
        });
      }
    }
  };

  const getAcceptIncomingButton = (
    request: string,
    givenGetUserItemProcess: GetUserItemProcessSuccess,
    givenGetCurrentSessionProcess: GetCurrentSessionProcessSuccess,
  ) => (
    <TransparentButton
      onClick={() =>
        acceptIncoming(request, givenGetUserItemProcess, givenGetCurrentSessionProcess)
      }
      title="confirm"
    >
      <HeartIcon size={30} animate={AnimateType.NONE} isRed={false} />
    </TransparentButton>
  );

  const getRequestListItems = () => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      const requestListItems = props.getUserItemProcess.data.incomingRequests?.SS.map(
        (request: string) => {
          return (
            <RequestListItem>
              <FoundUserWrapper>
                <ProfileWrapper>
                  <ProfileBall
                    firstName={request}
                    image={undefined}
                    isCurrentUser={false}
                    size={30}
                    animate={false}
                    fontSize={15}
                    showText
                    shadow={false}
                    border={false}
                  />
                  <ProfileText>{request}</ProfileText>
                </ProfileWrapper>
                <ButtonsWrapper>
                  {rejectIncomingRequestProcess.status === Status.INITIAL && (
                    <TransparentButton onClick={() => rejectIncoming(request)} title="reject">
                      <Mark fontColor="salmon" size={30}>
                        ✕
                      </Mark>
                    </TransparentButton>
                  )}
                  {rejectIncomingRequestProcess.status === Status.LOADING && (
                    <Puff size={20} fill="lightblue" />
                  )}
                  {rejectIncomingRequestProcess.status === Status.SUCCESS && <div />}
                  {acceptIncomingRequestProcess.status === Status.INITIAL &&
                    props.getUserItemProcess.status === Status.SUCCESS &&
                    props.getCurrentSessionProcess.status === Status.SUCCESS &&
                    getAcceptIncomingButton(
                      request,
                      props.getUserItemProcess,
                      props.getCurrentSessionProcess,
                    )}
                  {acceptIncomingRequestProcess.status === Status.LOADING && (
                    <Puff size={20} fill="lightblue" />
                  )}
                  {acceptIncomingRequestProcess.status === Status.SUCCESS && <div />}
                </ButtonsWrapper>
              </FoundUserWrapper>
            </RequestListItem>
          );
        },
      );
      return requestListItems;
    } else {
      return undefined;
    }
  };

  return (
    <SectionWrapper>
      <SecondaryHeadline>Requests</SecondaryHeadline>
      <RequestList>{getRequestListItems()}</RequestList>
    </SectionWrapper>
  );
};
