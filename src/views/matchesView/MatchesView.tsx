import React from "react";
import styled from "styled-components";
import { LogInPrimaryHeadline } from "../logIn/LogIn";
import { Process, Status, SecondaryHeadline } from "../../App";
import { ProfileBall } from "../../components/profileBall/ProfileBall";
import { HeartIcon } from "../../components/icons/HeartIcon";
import { Puff } from "../../components/puff/Puff";
import { TransparentButton, Mark } from "../accountSettings/AccountSettings";
import { rejectIncomingRequest } from "../../apiService/rejectIncomingRequest";
import { acceptIncomingRequest } from "../../apiService/acceptIncomingRequest";
import { AnimateType } from "../../components/icons/HeartIcon";
import { DetailsSection } from "./detailsSection/DetailsSection";
import { SearchSection } from "./searchSection/SearchSection";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: Process;
  getUserItemProcess: Process;
  getPairedUserProcess: Process;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

export const MatchesView = (props: Props) => {
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
      const acceptableRequest = props.getUserItemProcess.data.incomingRequests.SS.find(
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
      const requestListItems = props.getUserItemProcess.data.incomingRequests.SS.map(
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

  const isPartnered =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.partner !== undefined;

  return (
    <Wrapper>
      <LogInPrimaryHeadline>Partner</LogInPrimaryHeadline>
      {props.getUserItemProcess.status === Status.SUCCESS &&
        props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
          <div>
            <DetailsSection
              isPartnered={isPartnered}
              getUserItemProcess={props.getUserItemProcess}
              getCurrentAuthenticatedUserProcess={
                props.getCurrentAuthenticatedUserProcess
              }
              getPairedUserProcess={props.getPairedUserProcess}
              getCurrentSessionProcess={props.getCurrentSessionProcess}
              getUserItem={props.getUserItem}
              getPairedUser={props.getPairedUser}
            />
            {!props.getUserItemProcess.data.outgoingRequests &&
              !isPartnered && (
                <SearchSection
                  getCurrentAuthenticatedUserProcess={
                    props.getCurrentAuthenticatedUserProcess
                  }
                  getCurrentSessionProcess={props.getCurrentSessionProcess}
                  getUserItemProcess={props.getUserItemProcess}
                  getUserItem={props.getUserItem}
                />
              )}
            {props.getUserItemProcess.data.incomingRequests && (
              <SectionWrapper>
                <SecondaryHeadline>Requests</SecondaryHeadline>
                <RequestList>{getRequestListItems()}</RequestList>
              </SectionWrapper>
            )}
          </div>
        )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  width: 400px;
`;

export const MatchSectionWrapper = styled.div`
  margin-top: 50px;
  text-align: start;
`;

export const FoundUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  max-width: 300px;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px 20px;
`;

type ProfileTextProps = {
  isPartnered?: boolean;
};

export const ProfileText = styled.p`
  margin: 0;
  margin-left: 20px;
  color: ${(props: ProfileTextProps) => (props.isPartnered ? "red" : "black")};
  font-size: ${(props: ProfileTextProps) =>
    props.isPartnered ? "12px" : "16px"};
`;

export const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ButtonsWrapper = styled.div`
  margin-left: 20px;
  display: flex;
`;

const SectionWrapper = styled.div`
  margin-top: 20px;
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
