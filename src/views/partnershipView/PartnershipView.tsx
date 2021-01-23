import React from "react";
import styled from "styled-components";
import { PrimaryHeadline, SecondaryHeadline } from "../../styles/Styles";
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
import { borderRadius, fontSizes, sizingScale } from "../../styles/Variables";
import { TertiaryHeadline } from "../../styles/Styles";
import { DownwardArrow } from "../../components/icons/DownwardArrow";
import { LikedMoviesList, LikedMoviesListItem } from "../../types/Types";
import {
  TransparentButton,
  Mark,
} from "../accountSettingsView/pictureSection/PictureSection";
import { Link } from "react-router-dom";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItemProcess: GetUserItemProcess;
  getPairedUserProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
};

export const PartnershipView = (props: Props) => {
  const [yourLikesExpanded, setYourLikesExpanded] = React.useState<boolean>(
    false
  );
  const [
    partnersLikesExpanded,
    setPartnersLikesExpanded,
  ] = React.useState<boolean>(false);
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

  const getLikedMovieListItems = (list: LikedMoviesList) => {
    return list.L.map((listItem: LikedMoviesListItem) => {
      return (
        <MovieListItem>
          <Link
            to={`/movie/${listItem.M.id.S}`}
            title={`view movie ${listItem.M.id.S}`}
          >
            <TertiaryHeadline>{listItem.M.id.S}</TertiaryHeadline>
          </Link>
          <Text>{`(${listItem.M.score.N})`}</Text>
          <TransparentButton onClick={() => {}} title="dislike movie">
            <Mark fontColor="salmon" size={20}>
              ✕
            </Mark>
          </TransparentButton>
        </MovieListItem>
      );
    });
  };

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
          {props.getUserItemProcess.status === Status.SUCCESS &&
            props.getUserItemProcess.data.likedMovies &&
            props.getPairedUserProcess.status === Status.SUCCESS &&
            props.getPairedUserProcess.data.likedMovies && (
              <LikedMoviesWrapper>
                <SecondaryHeadline>Likes</SecondaryHeadline>
                <>
                  {props.getUserItemProcess.status === Status.SUCCESS &&
                    props.getUserItemProcess.data.likedMovies && (
                      <MovieListWrapper>
                        <MovieListTriggerButton
                          title="your likes"
                          onClick={() =>
                            setYourLikesExpanded(!yourLikesExpanded)
                          }
                        >
                          <TertiaryHeadline>your likes</TertiaryHeadline>
                          <DownwardArrow size={15} />
                        </MovieListTriggerButton>
                        {yourLikesExpanded && (
                          <MovieList>
                            {getLikedMovieListItems(
                              props.getUserItemProcess.data.likedMovies
                            )}
                          </MovieList>
                        )}
                      </MovieListWrapper>
                    )}
                  {props.getPairedUserProcess.status === Status.SUCCESS &&
                    props.getPairedUserProcess.data.likedMovies && (
                      <MovieListWrapper>
                        <MovieListTriggerButton
                          title="partners likes"
                          onClick={() =>
                            setPartnersLikesExpanded(!partnersLikesExpanded)
                          }
                        >
                          <TertiaryHeadline>{`${props.getPairedUserProcess.data.username.S}'s likes`}</TertiaryHeadline>
                          <DownwardArrow size={15} />
                        </MovieListTriggerButton>
                        {partnersLikesExpanded && (
                          <MovieList>
                            {getLikedMovieListItems(
                              props.getPairedUserProcess.data.likedMovies
                            )}
                          </MovieList>
                        )}
                      </MovieListWrapper>
                    )}
                </>
                {isPartnered && (
                  // <TextWrapper>
                    <Link to="matches">
                      <p>view matched movies</p>
                    </Link>
                  // </TextWrapper>
                )}
              </LikedMoviesWrapper>
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

const MovieListTriggerButton = styled.button`
  width: 100%;
  background-color: white;
  padding: ${`${sizingScale[2]}px`} ${`${sizingScale[3]}px`};
  text-align: start;
  border-radius: ${`${borderRadius}px`};
  border: 1px solid gray;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const MovieList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${`${sizingScale[4]}px`} 0 ${`${sizingScale[7]}px`} 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: ${`${sizingScale[3]}px`};
  justify-items: center;
  width: 100%;
`;

const MovieListItem = styled.li`
  padding: ${`${sizingScale[1]}px`} ${`${sizingScale[2]}px`};
  background-color: lightgray;
  width: ${`${sizingScale[9] + 60}px`};
  border-radius: ${`${borderRadius}px`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
`;

const Text = styled.p`
  margin: 0;
  color: gray;
`;

const LikedMoviesWrapper = styled.div`
  margin-top: ${`${sizingScale[5]}px`};
  text-align: start;
`;

const MovieListWrapper = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
`;

// const TextWrapper = styled.div`
//   text-align: start;
// `;
