import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Process,
  Status,
  GetUserItemProcess,
  ProcessInitial,
  ProcessSuccess,
  ProcessError,
} from "../../App";
import { FireMeter } from "../../components/fireMeter/FireMeter";
import { SecondaryHeadline } from "../../styles/Styles";
import { sizingScale } from "../../styles/Variables";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { evaluateMovie } from "../../apiService/evaluateMovie";
import { ImageIcon } from "../../components/icons/imageIcon/ImageIcon";
import { bucketUrl } from "../../config/Config";
import { DisplayProfile } from "../../components/modals/displayProfileModal/DisplayProfileModal";
import { ImageSection } from "./imageSection/ImageSection";
import {
  Wrapper,
  Title,
  TitlePlaceholder,
  DetailsSection,
  ImagePlaceholder,
  FireMeterWrapper,
  ImageWrapper,
  TitleWrapper,
} from "./MainViewStyles";
import { LikedMoviesListItem } from "../../types/Types";

type Props = {
  getCurrentSessionProcess: Process;
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
  getCurrentAuthenticatedUserProcess: Process;
  getPairedUserProcess: GetUserItemProcess;
};

export type EvaluateMovieProcessLoading = { status: Status.LOADING; score: number };

export type EvaluateMovieProcess =
  | ProcessInitial
  | EvaluateMovieProcessLoading
  | ProcessSuccess
  | ProcessError;

export const MainView = (props: Props) => {
  const [getTrendingMoviesProcess, setGetTrendingMoviesProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [swipingIndex, setSwipingIndex] = React.useState<number>(0);

  const [evaluateMovieProcess, setEvaluateMovieProcess] = React.useState<EvaluateMovieProcess>({
    status: Status.INITIAL,
  });

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const getMovies = async () => {
    try {
      setGetTrendingMoviesProcess({ status: Status.LOADING });
      const getTrendingMoviesResponse = await getTrendingMovies();
      const parsedGetTrendingMoviesResponse = await getTrendingMoviesResponse.json();
      setGetTrendingMoviesProcess({
        status: Status.SUCCESS,
        data: parsedGetTrendingMoviesResponse,
      });
    } catch (getTrendingMoviesError) {
      toast.error("Could not fetch movies list");
      setGetTrendingMoviesProcess({
        status: Status.ERROR,
        error: getTrendingMoviesError,
      });
    }
  };

  const evaluateItem = async (movieId: string, score: number) => {
    if (
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      getTrendingMoviesProcess.status === Status.SUCCESS &&
      evaluateMovieProcess.status !== Status.LOADING
    ) {
      try {
        setEvaluateMovieProcess({ status: Status.LOADING, score });
        const likeMovieResponse = await evaluateMovie(
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          movieId,
          score,
        );
        setSwipingIndex(swipingIndex + 1);
        setEvaluateMovieProcess({
          status: Status.SUCCESS,
          data: likeMovieResponse,
        });
      } catch (likeMovieError) {
        toast.error("Failed to evaluate movie");
        setSwipingIndex(swipingIndex + 1);
        setEvaluateMovieProcess({
          status: Status.ERROR,
          error: likeMovieError,
        });
      }
    }
  };

  React.useEffect(() => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      props.getUserItem(
        props.getUserItemProcess.data.username.S,
        props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
      );
    }
  }, []);

  React.useEffect(() => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      getMovies();
    }
  }, [props.getUserItemProcess.status]);

  const getFilteredList = () => {
    if (getTrendingMoviesProcess.status === Status.SUCCESS) {
      return getTrendingMoviesProcess.data.results.filter((movie: any) => {
        if (
          props.getUserItemProcess.status === Status.SUCCESS &&
          props.getUserItemProcess.data.likedMovies
        ) {
          return (
            props.getUserItemProcess.data.likedMovies.L.find(
              (likedMovie: LikedMoviesListItem) => movie.id === parseInt(likedMovie.M.id.S, 10),
            ) === undefined
          );
        } else {
          return true;
        }
      });
    } else {
      return [];
    }
  };

  const viewInitialized =
    props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
    props.getCurrentSessionProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS &&
    getTrendingMoviesProcess.status === Status.SUCCESS;

  const viewErrored =
    props.getCurrentAuthenticatedUserProcess.status === Status.ERROR ||
    props.getCurrentSessionProcess.status === Status.ERROR ||
    props.getUserItemProcess.status === Status.ERROR ||
    getTrendingMoviesProcess.status === Status.ERROR;

  React.useEffect(() => {
    if (
      evaluateMovieProcess.status === Status.SUCCESS &&
      props.getPairedUserProcess.status === Status.SUCCESS &&
      props.getPairedUserProcess.data.likedMovies &&
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.likedMovies
    ) {
      const filteredList = getFilteredList();
      const userEvaluatedLastMovieItem = evaluateMovieProcess.data.Attributes.likedMovies.L.find(
        (likedMovie: LikedMoviesListItem) =>
          filteredList[swipingIndex - 1].id === parseInt(likedMovie.M.id.S, 10),
      );
      if (userEvaluatedLastMovieItem && parseInt(userEvaluatedLastMovieItem.M.score.N, 10) >= 50) {
        const pairedUserEvaluatedLastItem = props.getPairedUserProcess.data.likedMovies.L.find(
          (likedMovie: LikedMoviesListItem) =>
            filteredList[swipingIndex - 1].id === parseInt(likedMovie.M.id.S, 10),
        );
        if (
          pairedUserEvaluatedLastItem &&
          parseInt(pairedUserEvaluatedLastItem.M.score.N, 10) >= 50
        ) {
          toast.success(`Movie matched with ${props.getPairedUserProcess.data.username.S}`);
        }
      }
    }
  }, [evaluateMovieProcess.status]);

  const filteredList = getFilteredList();
  return (
    <>
      {props.getCurrentSessionProcess.status !== Status.ERROR && (
        <Wrapper>
          {!viewInitialized && !viewErrored && (
            <div>
              <ImagePlaceholder />
              <TitlePlaceholder />
            </div>
          )}
          {viewInitialized && (
            <>
              {filteredList.length > 0 && filteredList[swipingIndex] !== undefined && (
                <div>
                  <ImageSection
                    getUserItemProcess={props.getUserItemProcess}
                    getPairedUserProcess={props.getPairedUserProcess}
                    filteredList={filteredList}
                    swipingIndex={swipingIndex}
                    evaluateMovieProcess={evaluateMovieProcess}
                    evaluateItem={evaluateItem}
                    setModalOpen={setModalOpen}
                  />
                  <DetailsSection>
                    <Link
                      to={`movie/${filteredList[swipingIndex].id}`}
                      title={filteredList[swipingIndex].original_title}
                    >
                      <Title>{filteredList[swipingIndex].original_title}</Title>
                    </Link>
                    <FireMeterWrapper>
                      <FireMeter
                        evaluateItem={evaluateItem}
                        movieId={filteredList[swipingIndex].id}
                        evaluateMovieProcess={evaluateMovieProcess}
                      />
                    </FireMeterWrapper>
                  </DetailsSection>
                </div>
              )}
              {(filteredList.length === 0 || filteredList[swipingIndex] === undefined) && (
                <>
                  <ImageWrapper>
                    <ImageIcon size={sizingScale[10]} animate={false} color="gray" />
                  </ImageWrapper>
                  <TitleWrapper>
                    <SecondaryHeadline>Everything swiped</SecondaryHeadline>
                  </TitleWrapper>
                </>
              )}
            </>
          )}
          {modalOpen && props.getPairedUserProcess.status === Status.SUCCESS && (
            <DisplayProfile
              closeModal={() => setModalOpen(false)}
              source={`${bucketUrl}/${props.getPairedUserProcess.data.profilePicture.S}`}
            />
          )}
        </Wrapper>
      )}
      {props.getCurrentSessionProcess.status === Status.ERROR && <Redirect to="/signup" />}
    </>
  );
};
