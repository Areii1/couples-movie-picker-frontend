import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Status,
  GetUserItemProcess,
  ProcessSuccess,
  LikedMoviesListItem,
  Movie,
} from "../../types/Types";
import { MainViewProps, EvaluateMovieProcess, GetTrendingMoviesProcess } from "./MainViewTypes";
import { GetCurrentSessionProcessContext } from "../../App";
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

export const MainView = (props: MainViewProps) => {
  const [getTrendingMoviesProcess, setGetTrendingMoviesProcess] =
    React.useState<GetTrendingMoviesProcess>({
      status: Status.INITIAL,
    });

  const [swipingIndex, setSwipingIndex] = React.useState<number>(0);

  const [evaluateMovieProcess, setEvaluateMovieProcess] = React.useState<EvaluateMovieProcess>({
    status: Status.INITIAL,
  });

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const getCurrentSessionProcess = React.useContext(GetCurrentSessionProcessContext);

  const getMovies = async () => {
    try {
      setGetTrendingMoviesProcess({ status: Status.LOADING });
      const getTrendingMoviesResponse = await getTrendingMovies();
      const parsedGetTrendingMoviesResponse = await getTrendingMoviesResponse.json();
      setGetTrendingMoviesProcess({
        status: Status.SUCCESS,
        data: parsedGetTrendingMoviesResponse.results,
      });
    } catch (getTrendingMoviesError) {
      toast.error("Could not fetch movies list");
      setGetTrendingMoviesProcess({
        status: Status.ERROR,
        error: getTrendingMoviesError,
      });
    }
  };

  const evaluateItem = async (movieId: number, score: number, jwtToken: string) => {
    if (evaluateMovieProcess.status !== Status.LOADING) {
      try {
        setEvaluateMovieProcess({ status: Status.LOADING, score });
        const likeMovieResponse = await evaluateMovie(jwtToken, movieId, score);
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
    } else {
      toast.info("Can't perform action before the first one is finished");
    }
  };

  const getFilteredList = () => {
    if (getTrendingMoviesProcess.status === Status.SUCCESS) {
      return getTrendingMoviesProcess.data.filter((movie: Movie) => {
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
    getCurrentSessionProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS &&
    getTrendingMoviesProcess.status === Status.SUCCESS;

  const viewErrored =
    getCurrentSessionProcess.status === Status.ERROR ||
    props.getUserItemProcess.status === Status.ERROR ||
    getTrendingMoviesProcess.status === Status.ERROR;

  const displayMatchToast = (
    getPairedUserProcess: GetUserItemProcess,
    getUserItemProcess: GetUserItemProcess,
    evaluateMovieProcessSuccess: ProcessSuccess,
  ) => {
    if (
      getPairedUserProcess.status === Status.SUCCESS &&
      getPairedUserProcess.data.likedMovies &&
      getUserItemProcess.status === Status.SUCCESS &&
      getUserItemProcess.data.likedMovies
    ) {
      const filteredList = getFilteredList();
      const userEvaluatedLastMovieItem =
        evaluateMovieProcessSuccess.data.Attributes.likedMovies.L.find(
          (likedMovie: LikedMoviesListItem) =>
            filteredList[swipingIndex - 1].id === parseInt(likedMovie.M.id.S, 10),
        );
      if (userEvaluatedLastMovieItem && parseInt(userEvaluatedLastMovieItem.M.score.N, 10) >= 50) {
        const pairedUserEvaluatedLastItem = getPairedUserProcess.data.likedMovies.L.find(
          (likedMovie: LikedMoviesListItem) =>
            filteredList[swipingIndex - 1].id === parseInt(likedMovie.M.id.S, 10),
        );
        if (
          pairedUserEvaluatedLastItem &&
          parseInt(pairedUserEvaluatedLastItem.M.score.N, 10) >= 50
        ) {
          toast.success(`Movie matched with ${getPairedUserProcess.data.username.S}`);
        }
      }
    }
  };

  React.useEffect(() => {
    if (evaluateMovieProcess.status === Status.SUCCESS) {
      displayMatchToast(props.getPairedUserProcess, props.getUserItemProcess, evaluateMovieProcess);
    }
  }, [evaluateMovieProcess.status]);

  React.useEffect(() => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      props.getUserItem(
        props.getUserItemProcess.data.username.S,
        getCurrentSessionProcess.data.getIdToken().getJwtToken(),
      );
    }
  }, []);

  React.useEffect(() => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      getMovies();
    }
  }, [props.getUserItemProcess.status]);

  const filteredList = getFilteredList();
  return (
    <>
      {getCurrentSessionProcess.status !== Status.ERROR && (
        <Wrapper>
          {!viewInitialized && !viewErrored && (
            <div>
              <ImagePlaceholder />
              <TitlePlaceholder />
            </div>
          )}
          {getCurrentSessionProcess.status === Status.SUCCESS &&
            props.getUserItemProcess.status === Status.SUCCESS &&
            getTrendingMoviesProcess.status === Status.SUCCESS && (
              <>
                {filteredList.length > 0 && filteredList[swipingIndex] !== undefined && (
                  <div>
                    <ImageSection
                      jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
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
                          jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
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
      {getCurrentSessionProcess.status === Status.ERROR && <Redirect to="/signup" />}
    </>
  );
};
