import React from "react";
import styled from "styled-components";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { HeartIcon } from "../../../components/icons/HeartIcon";
import { Puff } from "../../../components/puff/Puff";
import { TransparentButton, Mark } from "../../accountSettingsView/pictureSection/PictureSection";
import { AnimateType } from "../../../components/icons/HeartIcon";
import {
  Process,
  Status,
  GetCurrentSessionProcess,
  GetUserItemProcess,
} from "../../../App";
import { rejectIncomingRequest } from "../../../apiService/rejectIncomingRequest";
import { acceptIncomingRequest } from "../../../apiService/acceptIncomingRequest";
import {
  FoundUserWrapper,
  ProfileWrapper,
  ProfileText,
  ButtonsWrapper,
} from "../PartnershipView";
import { SecondaryHeadline } from "../../../styles/Styles";
import { sizingScale } from "../../../styles/Variables";

type Props = {
  getUserItemProcess: GetUserItemProcess;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItem: (username: string, jwtToken: string) => void;
};

export const RequestsListSection = (props: Props) => {
  const [
    rejectIncomingRequestProcess,
    setRejectIncomingRequestProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [
    acceptIncomingRequestProcess,
    setAcceptIncomingRequestProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const rejectIncoming = async (rejectUsername: string) => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.incomingRequests &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      const rejectableRequest = props.getUserItemProcess.data.incomingRequests.SS.find(
        (request: string) => rejectUsername === request
      );
      if (rejectableRequest) {
        try {
          setRejectIncomingRequestProcess({ status: Status.LOADING });
          const rejectIncomingRequestResponse = await rejectIncomingRequest(
            rejectableRequest,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
          setRejectIncomingRequestProcess({
            status: Status.SUCCESS,
            data: rejectIncomingRequestResponse,
          });
          props.getUserItem(
            props.getUserItemProcess.data.username.S,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
        } catch (rejectIncomingRequestError) {
          setRejectIncomingRequestProcess({
            status: Status.ERROR,
            error: rejectIncomingRequestError,
          });
        }
      }
    }
  };

  const acceptIncoming = async (acceptUsername: string) => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      const acceptableRequest = props.getUserItemProcess.data.incomingRequests?.SS.find(
        (request: any) => acceptUsername === request
      );
      if (acceptableRequest) {
        try {
          setAcceptIncomingRequestProcess({ status: Status.LOADING });
          const acceptIncomingRequestResponse = await acceptIncomingRequest(
            acceptUsername,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
          setAcceptIncomingRequestProcess({
            status: Status.SUCCESS,
            data: acceptIncomingRequestResponse,
          });
          props.getUserItem(
            props.getUserItemProcess.data.username.S,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
        } catch (accpetIncomingRequestError) {
          setAcceptIncomingRequestProcess({
            status: Status.ERROR,
            error: accpetIncomingRequestError,
          });
        }
      }
    }
  };
  const getRequestListItems = () => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      const requestListItems = props.getUserItemProcess.data.incomingRequests?.SS.map(
        (request: any) => {
          return (
            <RequestListItem>
              <FoundUserWrapper>
                <ProfileWrapper>
                  <ProfileBall
                    firstName={request.S}
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
                    <TransparentButton
                      onClick={() => rejectIncoming(request)}
                      title="reject"
                    >
                      <Mark fontColor="salmon" size={30}>
                        ✕
                      </Mark>
                    </TransparentButton>
                  )}
                  {rejectIncomingRequestProcess.status === Status.LOADING && (
                    <Puff size={20} fill="lightblue" />
                  )}
                  {rejectIncomingRequestProcess.status === Status.SUCCESS && (
                    <div />
                  )}
                  {acceptIncomingRequestProcess.status === Status.INITIAL && (
                    <TransparentButton
                      onClick={() => acceptIncoming(request)}
                      title="confirm"
                    >
                      <HeartIcon
                        size={30}
                        animate={AnimateType.NONE}
                        isRed={false}
                      />
                    </TransparentButton>
                  )}
                  {acceptIncomingRequestProcess.status === Status.LOADING && (
                    <Puff size={20} fill="lightblue" />
                  )}
                  {acceptIncomingRequestProcess.status === Status.SUCCESS && (
                    <div />
                  )}
                </ButtonsWrapper>
              </FoundUserWrapper>
            </RequestListItem>
          );
        }
      );
      return requestListItems;
    }
  };
  return (
    <SectionWrapper>
      <SecondaryHeadline>Requests</SecondaryHeadline>
      <RequestList>{getRequestListItems()}</RequestList>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
  text-align: start;
`;

const RequestList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const RequestListItem = styled.li`
  padding: 0;
`;
