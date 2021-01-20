import React from "react";
import styled from "styled-components";
import { LogInPrimaryHeadline } from "../logIn/LogIn";
import { Process, Status } from "../../App";
import { DetailsSection } from "./detailsSection/DetailsSection";
import { SearchSection } from "./searchSection/SearchSection";
import { RequestsListSection } from "./requestsListSection/RequestsListSection";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: Process;
  getUserItemProcess: Process;
  getPairedUserProcess: Process;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

export const MatchesView = (props: Props) => {
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
              <RequestsListSection
                getUserItemProcess={props.getUserItemProcess}
                getCurrentSessionProcess={props.getCurrentSessionProcess}
                getUserItem={props.getUserItem}
              />
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
