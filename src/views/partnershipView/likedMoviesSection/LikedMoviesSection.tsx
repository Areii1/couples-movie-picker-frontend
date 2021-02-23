import React from "react";
import { Link } from "react-router-dom";
import {
  Status,
  GetUserItemProcess,
  LikedMoviesList,
  LikedMoviesListItem,
} from "../../../types/Types";
import { DownwardArrow } from "../../../components/icons/downwardArrow/DownwardArrow";
import { TertiaryHeadline, SecondaryHeadline } from "../../../styles/Styles";
import {
  TransparentButton,
  Mark,
} from "../../accountSettingsView/pictureSection/PictureSectionStyles";
import {
  MovieListTriggerButton,
  MovieList,
  MovieListItem,
  Text,
  LikedMoviesWrapper,
  MovieListWrapper,
} from "./LikedMovieSectionStyles";

type Props = {
  getUserItemProcess: GetUserItemProcess;
  getPairedUserProcess: GetUserItemProcess;
};

export const LikedMoviesSection = (props: Props) => {
  const [yourLikesExpanded, setYourLikesExpanded] = React.useState<boolean>(false);
  const [partnersLikesExpanded, setPartnersLikesExpanded] = React.useState<boolean>(false);

  const getLikedMovieListItems = (list: LikedMoviesList) => {
    return list.L.map((listItem: LikedMoviesListItem) => {
      if (props.getUserItemProcess.status === Status.SUCCESS) {
        return (
          <MovieListItem>
            <Link to={`/movie/${listItem.M.id.S}`} title={`view movie ${listItem.M.id.S}`}>
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
      } else {
        return undefined;
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
                  {getLikedMovieListItems(props.getUserItemProcess.data.likedMovies)}
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
                  {getLikedMovieListItems(props.getPairedUserProcess.data.likedMovies)}
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
