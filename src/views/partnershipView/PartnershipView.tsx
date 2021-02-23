import React from "react";
import { PrimaryHeadline } from "../../styles/Styles";
import { GetUserItemProcess, Process, Status, GetCurrentSessionProcess } from "../../types/Types";
import { GetCurrentSessionProcessContext } from "../../App";
import { DetailsSection } from "./detailsSection/DetailsSection";
import { SearchSection } from "./searchSection/SearchSection";
import { RequestsListSection } from "./requestsListSection/RequestsListSection";
import { LikedMoviesSection } from "./likedMoviesSection/LikedMoviesSection";
import { PartnershipCardContentWrapper } from "./PartnershipViewStyles";
import {
  getAllAreInitial,
  getOneIsLoading,
  getOneIsErrored,
} from "../movieView/MovieViewUtilityFunctions";
import { ImagePlaceholder, TitlePlaceholder } from "../mainView/MainViewStyles";

const getViewContent = (
  getCurrentSessionProcess: GetCurrentSessionProcess,
  getCurrentAuthenticatedUserProcess: Process,
  getUserItemProcess: GetUserItemProcess,
  getPairedUserProcess: GetUserItemProcess,
  getUserItem: (username: string, jwtToken: string) => void,
  getPairedUser: (username: string, jwtToken: string) => void,
) => {
  const allAreInitial = getAllAreInitial([
    getCurrentSessionProcess,
    getCurrentAuthenticatedUserProcess,
  ]);
  const oneIsLoading = getOneIsLoading([
    getCurrentSessionProcess,
    getCurrentAuthenticatedUserProcess,
  ]);
  const oneIsErrored = getOneIsErrored([
    getCurrentSessionProcess,
    getCurrentAuthenticatedUserProcess,
  ]);

  if (allAreInitial) {
    return <div />;
  } else if (oneIsErrored) {
    return <div />;
  } else if (oneIsLoading) {
    return (
      <div>
        <ImagePlaceholder />
        <TitlePlaceholder />
      </div>
    );
  } else if (
    getCurrentSessionProcess.status === Status.SUCCESS &&
    getCurrentAuthenticatedUserProcess.status === Status.SUCCESS
  ) {
    const isPartnered =
      getUserItemProcess.status === Status.SUCCESS && getUserItemProcess.data.partner !== undefined;

    const requestPending =
      getUserItemProcess.status === Status.SUCCESS &&
      getUserItemProcess.data.outgoingRequests !== undefined;

    const requestsExist =
      getUserItemProcess.status === Status.SUCCESS && getUserItemProcess.data.incomingRequests;
    return (
      <div>
        <DetailsSection
          getUserItemProcess={getUserItemProcess}
          getCurrentAuthenticatedUserProcess={getCurrentAuthenticatedUserProcess}
          getPairedUserProcess={getPairedUserProcess}
          getCurrentSessionProcess={getCurrentSessionProcess}
          getUserItem={getUserItem}
          getPairedUser={getPairedUser}
        />
        {!requestPending && !isPartnered && (
          <SearchSection
            getCurrentAuthenticatedUserProcess={getCurrentAuthenticatedUserProcess}
            getCurrentSessionProcess={getCurrentSessionProcess}
            getUserItemProcess={getUserItemProcess}
            getUserItem={getUserItem}
          />
        )}
        {requestsExist && (
          <RequestsListSection
            getUserItemProcess={getUserItemProcess}
            getCurrentSessionProcess={getCurrentSessionProcess}
            getUserItem={getUserItem}
          />
        )}
        {getUserItemProcess.status === Status.SUCCESS && getUserItemProcess.data.likedMovies && (
          <LikedMoviesSection
            getPairedUserProcess={getPairedUserProcess}
            getUserItemProcess={getUserItemProcess}
          />
        )}
      </div>
    );
  } else {
    return <div />;
  }
};

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getUserItemProcess: GetUserItemProcess;
  getPairedUserProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

export const PartnershipView = (props: Props) => {
  const getCurrentSessionProcess = React.useContext(GetCurrentSessionProcessContext);

  return (
    <PartnershipCardContentWrapper>
      <PrimaryHeadline>Partner</PrimaryHeadline>
      {getViewContent(
        getCurrentSessionProcess,
        props.getCurrentAuthenticatedUserProcess,
        props.getUserItemProcess,
        props.getPairedUserProcess,
        props.getUserItem,
        props.getPairedUser,
      )}
    </PartnershipCardContentWrapper>
  );
};
