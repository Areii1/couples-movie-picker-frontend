import React from "react";
import styled from "styled-components";
import { PrimaryHeadline } from "../../styles/Styles";
import {
  GetCurrentSessionProcess,
  GetUserItemProcess,
  Process,
  Status,
} from "../../App";
import { DetailsSection } from "./detailsSection/DetailsSection";
import { SearchSection } from "./searchSection/SearchSection";
import { RequestsListSection } from "./requestsListSection/RequestsListSection";
import { CardContentWrapper } from "../logIn/LogIn";
import { fontSizes, sizingScale } from "../../styles/Variables";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItemProcess: GetUserItemProcess;
  getPairedUserProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

export const PartnershipView = (props: Props) => {
  const isPartnered =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.partner !== undefined;

  const requestPending =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.outgoingRequests !== undefined;

  const sessionInitialized =
    props.getCurrentSessionProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS;

  const requestsExist =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.incomingRequests;
  return (
    <PartnershipCardContentWrapper>
      <PrimaryHeadline>Partner</PrimaryHeadline>
      {sessionInitialized && (
        <div>
          <DetailsSection
            getUserItemProcess={props.getUserItemProcess}
            getCurrentAuthenticatedUserProcess={
              props.getCurrentAuthenticatedUserProcess
            }
            getPairedUserProcess={props.getPairedUserProcess}
            getCurrentSessionProcess={props.getCurrentSessionProcess}
            getUserItem={props.getUserItem}
            getPairedUser={props.getPairedUser}
          />
          {!requestPending && !isPartnered && (
            <SearchSection
              getCurrentAuthenticatedUserProcess={
                props.getCurrentAuthenticatedUserProcess
              }
              getCurrentSessionProcess={props.getCurrentSessionProcess}
              getUserItemProcess={props.getUserItemProcess}
              getUserItem={props.getUserItem}
            />
          )}
          {requestsExist && (
            <RequestsListSection
              getUserItemProcess={props.getUserItemProcess}
              getCurrentSessionProcess={props.getCurrentSessionProcess}
              getUserItem={props.getUserItem}
            />
          )}
        </div>
      )}
    </PartnershipCardContentWrapper>
  );
};

const PartnershipCardContentWrapper = styled(CardContentWrapper)`
  text-align: center;
`;

export const MatchSectionWrapper = styled.div`
  margin-top: ${`${sizingScale[6]}px`};
  text-align: start;
`;

export const FoundUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${`${sizingScale[3]}px`};
  max-width: ${`${sizingScale[11]}px`};
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: ${`${sizingScale[2]}px`} ${`${sizingScale[3]}px`};
`;

type ProfileTextProps = {
  isPartnered?: boolean;
};

export const ProfileText = styled.p`
  margin: 0;
  margin-left: ${`${sizingScale[3]}px`};
  color: ${(props: ProfileTextProps) => (props.isPartnered ? "red" : "black")};
  font-size: ${(props: ProfileTextProps) =>
    props.isPartnered ? `${fontSizes[0]}px` : `${fontSizes[2]}px`};
`;

export const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ButtonsWrapper = styled.div`
  margin-left: ${`${sizingScale[3]}px`};
  display: flex;
`;
