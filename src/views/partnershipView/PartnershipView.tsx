import React from "react";
import { PrimaryHeadline } from "../../styles/Styles";
import { GetUserItemProcess, Status, GetCurrentSessionProcess } from "../../types/Types";
import { GetCurrentSessionProcessContext } from "../../App";
import { DetailsSection } from "./detailsSection/DetailsSection";
import { SearchSection } from "./searchSection/SearchSection";
import { RequestsListSection } from "./requestsListSection/RequestsListSection";
import { LikedMoviesSection } from "./likedMoviesSection/LikedMoviesSection";
import { PartnershipCardContentWrapper } from "./PartnershipViewStyles";
import { ImagePlaceholder, TitlePlaceholder } from "../mainView/MainViewStyles";

const getViewContent = (
  getCurrentSessionProcess: GetCurrentSessionProcess,
  getUserItemProcess: GetUserItemProcess,
  getPairedUserProcess: GetUserItemProcess,
  getUserItem: (username: string, jwtToken: string) => void,
  getPairedUser: (username: string, jwtToken: string) => void,
) => {
  switch (getCurrentSessionProcess.status) {
    case Status.INITIAL: {
      return <div />;
    }
    case Status.LOADING: {
      return (
        <div>
          <ImagePlaceholder />
          <TitlePlaceholder />
        </div>
      );
    }
    case Status.SUCCESS: {
      const isPartnered =
        getUserItemProcess.status === Status.SUCCESS &&
        getUserItemProcess.data.partner !== undefined;

      const requestPending =
        getUserItemProcess.status === Status.SUCCESS &&
        getUserItemProcess.data.outgoingRequests !== undefined;

      const requestsExist =
        getUserItemProcess.status === Status.SUCCESS && getUserItemProcess.data.incomingRequests;
      return (
        <div>
          <DetailsSection
            getUserItemProcess={getUserItemProcess}
            getPairedUserProcess={getPairedUserProcess}
            jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
            getUserItem={getUserItem}
            getPairedUser={getPairedUser}
          />
          {!requestPending && !isPartnered && (
            <SearchSection
              jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
              getUserItemProcess={getUserItemProcess}
              getUserItem={getUserItem}
            />
          )}
          {requestsExist && (
            <RequestsListSection
              getUserItemProcess={getUserItemProcess}
              jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
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
    }
    case Status.ERROR: {
      return <div />;
    }
    default:
      return <div />;
  }
};

type Props = {
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
        props.getUserItemProcess,
        props.getPairedUserProcess,
        props.getUserItem,
        props.getPairedUser,
      )}
    </PartnershipCardContentWrapper>
  );
};
