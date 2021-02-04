import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Status, GetUserItemProcess } from "../../../App";
import { DownwardArrow } from "../../../components/icons/DownwardArrow";
import { LikedMoviesList, LikedMoviesListItem } from "../../../types/Types";
import { sizingScale, borderRadius } from "../../../styles/Variables";
import { TertiaryHeadline } from "../../../styles/Styles";
import { SecondaryHeadline } from "../../../styles/Styles";
import {
  TransparentButton,
  Mark,
} from "../../accountSettingsView/pictureSection/PictureSection";

type Props = {
  getUserItemProcess: GetUserItemProcess;
  getPairedUserProcess: GetUserItemProcess;
};

export const LikedMoviesSection = (props: Props) => {
  const [yourLikesExpanded, setYourLikesExpanded] = React.useState<boolean>(
    false
  );
  const [
    partnersLikesExpanded,
    setPartnersLikesExpanded,
  ] = React.useState<boolean>(false);

  const getLikedMovieListItems = (list: LikedMoviesList) => {
    return list.L.map((listItem: LikedMoviesListItem) => {
      if (props.getUserItemProcess.status === Status.SUCCESS) {
        return (
          <MovieListItem>
            <Link
              to={`/movie/${listItem.M.id.S}`}
              title={`view movie ${listItem.M.id.S}`}
            >
              <TertiaryHeadline>{listItem.M.id.S}</TertiaryHeadline>
            </Link>
            <Text>{`(${listItem.M.score.N})`}</Text>
            <TransparentButton title="dislike movie">
              <Mark fontColor="salmon" size={20}>
                ✕
              </Mark>
            </TransparentButton>
          </MovieListItem>
        );
      }
    });
  };

  const isPartnered =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.partner !== undefined;

  return (
    <LikedMoviesWrapper>
      <SecondaryHeadline>Likes</SecondaryHeadline>
      <>
        {props.getUserItemProcess.status === Status.SUCCESS &&
          props.getUserItemProcess.data.likedMovies && (
            <MovieListWrapper>
              <MovieListTriggerButton
                title="your likes"
                onClick={() => setYourLikesExpanded(!yourLikesExpanded)}
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
                onClick={() => setPartnersLikesExpanded(!partnersLikesExpanded)}
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
      {isPartnered &&
        props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getPairedUserProcess.data.likedMovies && (
          <Link to="matches">
            <p>view matched movies</p>
          </Link>
        )}
    </LikedMoviesWrapper>
  );
};

export const MovieListTriggerButton = styled.button`
  width: 100%;
  background-color: white;
  text-align: start;
  padding: ${`${sizingScale[2]}px`} ${`${sizingScale[3]}px`};
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
  width: 100%;
`;

const MovieListItem = styled.li`
  padding: ${`${sizingScale[1]}px`} ${`${sizingScale[2]}px`};
  background-color: lightgray;
  border-radius: ${`${borderRadius}px`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  margin: ${`${sizingScale[4]}px`} 0;
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
