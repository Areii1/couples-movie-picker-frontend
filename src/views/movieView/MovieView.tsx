import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { GetUserItemProcess, Process, Status } from "../../App";
import { fontSizes, sizingScale } from "../../styles/Variables";
import { getMovieDetails } from "../../apiService/getMovieDetails";
import { useParams } from "react-router-dom";
import {
  PrimaryHeadline,
  SecondaryHeadline,
  TertiaryHeadline,
} from "../../styles/Styles";
import { CardContentWrapper } from "../logIn/LogInStyles";
import { MovieEvaluationSection } from "./movieEvaluationSection/MovieEvaluationSection";
import { evaluateMovie } from "../../apiService/evaluateMovie";
import { LikeMovieProcess } from "../mainView/MainView";
import { ImagePlaceholder, TitlePlaceholder } from "../mainView/MainViewStyles";

type Props = {
  getCurrentSessionProcess: Process;
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUserProcess: GetUserItemProcess;
};
interface ParamTypes {
  id?: string;
}

export const MovieView = (props: Props) => {
  const [
    getMovieDetailsProcess,
    setGetMovieDetailsProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [
    likeMovieProcess,
    setLikeMovieProcess,
  ] = React.useState<LikeMovieProcess>({
    status: Status.INITIAL,
  });

  const { id } = useParams<ParamTypes>();

  const getMovie = async () => {
    if (id) {
      try {
        setGetMovieDetailsProcess({ status: Status.LOADING });
        const getMovieDetailsResponse = await getMovieDetails(id);
        const parsedGetMovieDetailsResponse = await getMovieDetailsResponse.json();
        setGetMovieDetailsProcess({
          status: Status.SUCCESS,
          data: parsedGetMovieDetailsResponse,
        });
      } catch (getMovieDetailsError) {
        toast.error("Could not get movie details");
        setGetMovieDetailsProcess({
          status: Status.ERROR,
          error: getMovieDetailsError,
        });
      }
    } else {
      return;
    }
  };

  const evaluateItem = async (movieId: string, score: number) => {
    if (
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      getMovieDetailsProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.status === Status.SUCCESS &&
      likeMovieProcess.status !== Status.LOADING
    ) {
      try {
        setLikeMovieProcess({ status: Status.LOADING, score });
        const likeMovieResponse = await evaluateMovie(
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          movieId,
          score
        );
        setLikeMovieProcess({
          status: Status.SUCCESS,
          data: likeMovieResponse,
        });
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
      } catch (likeMovieError) {
        toast.error("Failed to evaluate movie");
        setLikeMovieProcess({
          status: Status.ERROR,
          error: likeMovieError,
        });
      }
    }
  };

  React.useEffect(() => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      getMovie();
    }
  }, [props.getUserItemProcess.status]);

  const getGenresStr = () => {
    if (getMovieDetailsProcess.status === Status.SUCCESS) {
      if (getMovieDetailsProcess.data.genres.length > 3) {
        const filteredList = getMovieDetailsProcess.data.genres.filter(
          (detail: any, index: number) => index < 3
        );
        return filteredList.map((genre: any) => genre.name).join(", ");
      } else {
        return getMovieDetailsProcess.data.genres
          .map((genre: any) => genre.name)
          .join(", ");
      }
    } else {
      return "";
    }
  };

  const getRuntimeStr = () => {
    if (getMovieDetailsProcess.status === Status.SUCCESS) {
      if (getMovieDetailsProcess.data.runtime > 60) {
        const hours = Math.floor(getMovieDetailsProcess.data.runtime / 60);
        const minutes = getMovieDetailsProcess.data.runtime - hours * 60;
        return `${hours}h${minutes}min`;
      } else {
        return `${getMovieDetailsProcess.data.runtime}min`;
      }
    }
  };

  return (
    <Wrapper>
      {getMovieDetailsProcess.status === Status.LOADING && (
        <div>
          <ImagePlaceholder />
          <TitlePlaceholder />
        </div>
      )}
      {getMovieDetailsProcess.status === Status.SUCCESS && (
        <>
          <ImageSection>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${getMovieDetailsProcess.data.backdrop_path}`}
              alt={getMovieDetailsProcess.data.original_title}
            />
          </ImageSection>
          <MovieViewCardContentWrapper>
            <PrimaryHeadline>
              {getMovieDetailsProcess.data.original_title}
            </PrimaryHeadline>
            <InfoList>
              <InfoListItem>
                <InfoListItemText title={getRuntimeStr()}>
                  {getRuntimeStr()}
                </InfoListItemText>
              </InfoListItem>
              <InfoListItem>
                <InfoListItemText>{getGenresStr()}</InfoListItemText>
              </InfoListItem>
              <InfoListItem>
                <InfoListItemText
                  title={getMovieDetailsProcess.data.release_date}
                >
                  {getMovieDetailsProcess.data.release_date.split("-")[0]}
                </InfoListItemText>
              </InfoListItem>
            </InfoList>
            <MovieEvaluationSection
              getMovieDetailsProcess={getMovieDetailsProcess}
              getPairedUserProcess={props.getPairedUserProcess}
              getUserItemProcess={props.getUserItemProcess}
              evaluateItem={evaluateItem}
              likeMovieProcess={likeMovieProcess}
            />
            <MovieViewSection>
              <SecondaryHeadline>Overview</SecondaryHeadline>
              <Text>{getMovieDetailsProcess.data.overview}</Text>
            </MovieViewSection>
            {/* <MovieViewSection>
            <SecondaryHeadline>Details</SecondaryHeadline>
            <DetailItemWrapper>
              <MovieTertiaryHeadline color="gray">
                duration
              </MovieTertiaryHeadline>
              <Text>{getMovieDetailsProcess.data.runtime}</Text>
            </DetailItemWrapper>
          </MovieViewSection> */}
          </MovieViewCardContentWrapper>
        </>
      )}
    </Wrapper>
  );
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

// const DetailItemWrapper = styled.div`
//   margin-top: 10px;
//   display: flex;
// `;

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

type HeadlineProps = {
  color: string;
};

export const MovieTertiaryHeadline = styled(TertiaryHeadline)`
  color: ${(props: HeadlineProps) => props.color};
`;

const InfoList = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const InfoListItem = styled.li`
  padding: 0;
  margin: 0 ${`${sizingScale[1]}px`};
`;
