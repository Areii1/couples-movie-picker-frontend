import React from "react";
import { PrimaryHeadline } from "../../styles/Styles";
import { GetCurrentSessionProcess, GetUserItemProcess, Process, Status } from "../../App";
import { DetailsSection } from "./detailsSection/DetailsSection";
import { SearchSection } from "./searchSection/SearchSection";
import { RequestsListSection } from "./requestsListSection/RequestsListSection";
import { LikedMoviesSection } from "./likedMoviesSection/LikedMoviesSection";
import { PartnershipCardContentWrapper } from "./PartnershipViewStyles";

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

  // const userLikedMovies =
  //   props.getUserItemProcess.status === Status.SUCCESS &&
  //   props.getUserItemProcess.data.likedMovies;

  // const partnerLikedMovies =
  //   props.getUserItemProcess.status === Status.SUCCESS &&
  //   props.getUserItemProcess.data.likedMovies;

  return (
    <PartnershipCardContentWrapper>
      <PrimaryHeadline>Partner</PrimaryHeadline>
      {sessionInitialized && (
        <div>
          <DetailsSection
            getUserItemProcess={props.getUserItemProcess}
            getCurrentAuthenticatedUserProcess={props.getCurrentAuthenticatedUserProcess}
            getPairedUserProcess={props.getPairedUserProcess}
            getCurrentSessionProcess={props.getCurrentSessionProcess}
            getUserItem={props.getUserItem}
            getPairedUser={props.getPairedUser}
          />
          {!requestPending && !isPartnered && (
            <SearchSection
              getCurrentAuthenticatedUserProcess={props.getCurrentAuthenticatedUserProcess}
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
          {props.getUserItemProcess.status === Status.SUCCESS &&
            props.getUserItemProcess.data.likedMovies && (
              <LikedMoviesSection
                getPairedUserProcess={props.getPairedUserProcess}
                getUserItemProcess={props.getUserItemProcess}
              />
            )}
        </div>
      )}
    </PartnershipCardContentWrapper>
  );
};
