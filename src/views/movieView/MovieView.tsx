import React from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { GetUserItemProcess, Process, Status } from "../../App";
import { getMovieDetails } from "../../apiService/getMovieDetails";
import { PrimaryHeadline, SecondaryHeadline } from "../../styles/Styles";
import { MovieEvaluationSection } from "./movieEvaluationSection/MovieEvaluationSection";
import { evaluateMovie } from "../../apiService/evaluateMovie";
import { LikeMovieProcess } from "../mainView/MainView";
import { ImagePlaceholder, TitlePlaceholder } from "../mainView/MainViewStyles";
import {
  MovieViewSection,
  MovieViewCardContentWrapper,
  Wrapper,
  ImageSection,
  Image,
  Text,
  InfoListItemText,
  InfoList,
  InfoListItem,
} from "./MovieViewStyles";

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
  const [getMovieDetailsProcess, setGetMovieDetailsProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [likeMovieProcess, setLikeMovieProcess] = React.useState<LikeMovieProcess>({
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
          score,
        );
        setLikeMovieProcess({
          status: Status.SUCCESS,
          data: likeMovieResponse,
        });
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
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
          (detail: any, index: number) => index < 3,
        );
        return filteredList.map((genre: any) => genre.name).join(", ");
      } else {
        return getMovieDetailsProcess.data.genres.map((genre: any) => genre.name).join(", ");
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
    } else {
      return "";
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
            <PrimaryHeadline>{getMovieDetailsProcess.data.original_title}</PrimaryHeadline>
            <InfoList>
              <InfoListItem>
                <InfoListItemText title={getRuntimeStr()}>{getRuntimeStr()}</InfoListItemText>
              </InfoListItem>
              <InfoListItem>
                <InfoListItemText>{getGenresStr()}</InfoListItemText>
              </InfoListItem>
              <InfoListItem>
                <InfoListItemText title={getMovieDetailsProcess.data.release_date}>
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
