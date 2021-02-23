import React from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { GetCurrentSessionProcess, GetUserItemProcess, Process, Status } from "../../types/Types";
import { getMovieDetails } from "../../apiService/getMovieDetails";
import { PrimaryHeadline, SecondaryHeadline } from "../../styles/Styles";
import { MovieEvaluationSection } from "./movieEvaluationSection/MovieEvaluationSection";
import { evaluateMovie } from "../../apiService/evaluateMovie";
import { EvaluateMovieProcess } from "../mainView/MainView";
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
import {
  getGenresStr,
  getRuntimeStr,
  getAllAreInitial,
  getOneIsLoading,
  getOneIsErrored,
} from "./MovieViewUtilityFunctions";
import { GetCurrentSessionProcessContext } from "../../App";

const getMovieViewContent = (
  getMovieDetailsProcess: Process,
  getPairedUserProcess: GetUserItemProcess,
  getUserItemProcess: GetUserItemProcess,
  evaluateItem: (movieId: number, score: number, jwtToken: string) => void,
  likeMovieProcess: EvaluateMovieProcess,
  getCurrentSessionProcess: GetCurrentSessionProcess,
) => {
  const allAreInitial = getAllAreInitial([getMovieDetailsProcess, getCurrentSessionProcess]);
  const oneIsLoading = getOneIsLoading([getMovieDetailsProcess, getCurrentSessionProcess]);
  const oneIsErrored = getOneIsErrored([getMovieDetailsProcess, getCurrentSessionProcess]);

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
    getMovieDetailsProcess.status === Status.SUCCESS &&
    getCurrentSessionProcess.status === Status.SUCCESS
  ) {
    return (
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
              <InfoListItemText title={getRuntimeStr(getMovieDetailsProcess)}>
                {getRuntimeStr(getMovieDetailsProcess)}
              </InfoListItemText>
            </InfoListItem>
            <InfoListItem>
              <InfoListItemText>{getGenresStr(getMovieDetailsProcess)}</InfoListItemText>
            </InfoListItem>
            <InfoListItem>
              <InfoListItemText title={getMovieDetailsProcess.data.release_date}>
                {getMovieDetailsProcess.data.release_date.split("-")[0]}
              </InfoListItemText>
            </InfoListItem>
          </InfoList>
          <MovieEvaluationSection
            movieId={getMovieDetailsProcess.data.id}
            getPairedUserProcess={getPairedUserProcess}
            getUserItemProcess={getUserItemProcess}
            evaluateItem={evaluateItem}
            likeMovieProcess={likeMovieProcess}
            jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
          />
          <MovieViewSection>
            <SecondaryHeadline>Overview</SecondaryHeadline>
            <Text>{getMovieDetailsProcess.data.overview}</Text>
          </MovieViewSection>
        </MovieViewCardContentWrapper>
      </>
    );
  } else {
    return <div />;
  }
};

type Props = {
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

  const [likeMovieProcess, setLikeMovieProcess] = React.useState<EvaluateMovieProcess>({
    status: Status.INITIAL,
  });

  const { id } = useParams<ParamTypes>();

  const getCurrentSessionProcess = React.useContext(GetCurrentSessionProcessContext);

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

  const evaluateItem = async (movieId: number, score: number, jwtToken: string) => {
    if (
      getMovieDetailsProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.status === Status.SUCCESS &&
      likeMovieProcess.status !== Status.LOADING
    ) {
      try {
        setLikeMovieProcess({ status: Status.LOADING, score });
        const likeMovieResponse = await evaluateMovie(jwtToken, movieId, score);
        setLikeMovieProcess({
          status: Status.SUCCESS,
          data: likeMovieResponse,
        });
        props.getUserItem(props.getUserItemProcess.data.username.S, jwtToken);
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

  return (
    <Wrapper>
      {getMovieViewContent(
        getMovieDetailsProcess,
        props.getPairedUserProcess,
        props.getUserItemProcess,
        evaluateItem,
        likeMovieProcess,
        getCurrentSessionProcess,
      )}
    </Wrapper>
  );
};
