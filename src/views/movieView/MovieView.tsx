import React from "react";
import styled from "styled-components";
import { Process, Status } from "../../App";
import { fontSizes, sizingScale } from "../../styles/Variables";
import { getMovieDetails } from "../../apiService/getMovieDetails";
import { useParams } from "react-router-dom";
import {
  PrimaryHeadline,
  SecondaryHeadline,
  TertiaryHeadline,
} from "../../styles/Styles";
import { LikedMoviesListItem } from '../../types/Types';
import { CardContentWrapper } from "../logIn/LogIn";
import { HeartIcon } from "../../components/icons/HeartIcon";
import { TransparentButton } from "../accountSettingsView/pictureSection/PictureSection";
import { FireIcon } from "../../components/icons/FireIcon";
import { ColdIcon } from "../../components/icons/ColdIcon";

type Props = {
  getCurrentSessionProcess: Process;
  getUserItemProcess: Process;
  getUserItem: (username: string, jwtToken: string) => void;
};

interface ParamTypes {
  id?: string;
}

export const MovieView = (props: Props) => {
  console.log(props, "props");
  const [
    getMovieDetailsProcess,
    setGetMovieDetailsProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });
  const { id } = useParams<ParamTypes>();

  const getMovie = async () => {
    if (id) {
      try {
        setGetMovieDetailsProcess({ status: Status.LOADING });
        const getMovieDetailsResponse = await getMovieDetails(id);
        console.log(getMovieDetailsResponse, "getMovieDetailsResponse");
        const parsedGetMovieDetailsResponse = await getMovieDetailsResponse.json();
        setGetMovieDetailsProcess({
          status: Status.SUCCESS,
          data: parsedGetMovieDetailsResponse,
        });
      } catch (getMovieDetailsError) {
        setGetMovieDetailsProcess({
          status: Status.ERROR,
          error: getMovieDetailsError,
        });
      }
    } else {
      return;
    }
  };

  React.useEffect(() => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      getMovie();
    }
  }, [props.getUserItemProcess.status]);

  // const getEvaluatedMovieItem = () => {
  //   if (props.getUserItemProcess.status === Status.SUCCESS) {
  //     const evaluatedMovieItem = props.getUserItemProcess.data.likedMovies.L.find((likedMovie: LikedMoviesListItem) => likedMovie.M.id.S === getMovieDetailsProcess.data.id)
  //     return evaluatedMovieItem;
  //   } else {
  //     return undefined;
  //   }
  // }

  console.log(getMovieDetailsProcess, "getMovieDetailsProcess");
  if (
    getMovieDetailsProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS
  ) {
    const evaluatedMovieItem = props.getUserItemProcess.data.likedMovies.L.find(
      (likedMovie: LikedMoviesListItem) =>
        likedMovie.M.id.S === getMovieDetailsProcess.data.id
    );
    return (
      <Wrapper>
        <ImageSection>
          <Image
            src={`https://image.tmdb.org/t/p/w500/${getMovieDetailsProcess.data.backdrop_path}`}
            alt={getMovieDetailsProcess.data.original_title}
          />
        </ImageSection>
        <MovieViewCardContentWrapper>
          <HeadlineWrapper>
            <PrimaryHeadline>
              {getMovieDetailsProcess.data.original_title}
            </PrimaryHeadline>
            {evaluatedMovieItem && (
              <>
                {evaluatedMovieItem.M.score.N > 50 && (
                  <FireIcon size={30} score={evaluatedMovieItem.M.score.N} />
                )}
                {evaluatedMovieItem.M.score.N <= 50 && (
                  <ColdIcon size={30} score={evaluatedMovieItem.M.score.N} />
                )}
              </>
            )}
          </HeadlineWrapper>
          <InfoList>
            <InfoListItem>
              <InfoListItemText>
                {`${getMovieDetailsProcess.data.runtime}min`}
              </InfoListItemText>
            </InfoListItem>
            <InfoListItem>
              <InfoListItemText>
                {getMovieDetailsProcess.data.genres
                  .map((genre: any) => genre.name)
                  .join(", ")}
              </InfoListItemText>
            </InfoListItem>
            <InfoListItem>
              <InfoListItemText>
                {getMovieDetailsProcess.data.release_date}
              </InfoListItemText>
            </InfoListItem>
          </InfoList>
          <MovieViewSection>
            <SecondaryHeadline>Overview</SecondaryHeadline>
            <Text>{getMovieDetailsProcess.data.overview}</Text>
          </MovieViewSection>
          <MovieViewSection>
            <SecondaryHeadline>Details</SecondaryHeadline>
            <DetailItemWrapper>
              <MovieTertiaryHeadline>duration</MovieTertiaryHeadline>
              <Text>{getMovieDetailsProcess.data.runtime}</Text>
            </DetailItemWrapper>
          </MovieViewSection>
        </MovieViewCardContentWrapper>
      </Wrapper>
    );
  } else {
    return <div />;
  }
};

const MovieViewSection = styled.div`
  text-align: start;
  margin-top: ${`${sizingScale[6]}px`};
`;

const MovieViewCardContentWrapper = styled(CardContentWrapper)`
  margin-top: ${`${sizingScale[4]}px`};
  text-align: center;
`;

const Wrapper = styled.div`
  width: 100%;
`;

const ImageSection = styled.div`
  margin: ${`${sizingScale[6] * -1}px`} 0 0 ${`${sizingScale[6] * -1}px`};
  text-align: center;
`;

const Image = styled.img`
  width: ${`${sizingScale[13]}px`};
`;

const DetailItemWrapper = styled.div`
  margin-top: 10px;
  display: flex;
`;

const Text = styled.p`
  margin: 0;
  font-size: ${`${fontSizes[0]}px`};
  font-weight: 300;
  margin-top: ${`${sizingScale[2]}px`};
`;

const InfoListItemText = styled.h6`
  margin: 0;
  font-size: ${`${fontSizes[0]}px`};
  font-weight: 400;
  color: gray;
`;

const MovieTertiaryHeadline = styled(TertiaryHeadline)`
  color: gray;
`;

const InfoList = styled.ul`
  list-style-type: none;
  display: flex;
`;

const InfoListItem = styled.li`
  padding: 0;
  margin: 0 ${`${sizingScale[1]}px`};
`;

const HeadlineWrapper = styled.div`
  display: flex;
  text-align: center;
`;
