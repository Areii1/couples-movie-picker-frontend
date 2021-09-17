import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, ButtonText, CardContentWrapper } from "../logIn/LogInStyles";
import { GetUserItemProcess, GetUserItemProcessSuccess, Status } from "../../types/Types";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { ScoreText } from "../mainView/imageSection/ImageSectionStyles";
// import { DownwardArrow } from "../../components/icons/downwardArrow/DownwardArrow";
// import { TransparentButton } from "../accountSettingsView/pictureSection/PictureSectionStyles";
import {
  MatchesList,
  ImageOverlay,
  MatchesListItem,
  Image,
  TextWrapper,
  // DislikedMoviesListWrapper,
  // ListPadding,
} from "./MovieListViewStyles";
import {
  GetTrendingMovieProcessSuccess,
  GetTrendingMoviesProcess,
} from "../mainView/MainViewTypes";
import { CreateRoomModal } from "../../components/modals/createRoomModal/CreateRoomModal";
import { GetCurrentSessionProcessContext } from "../../App";
import { Section } from "../accountSettingsView/AccountSettingsViewStyles";
import { SecondaryHeadline } from "../../styles/Styles";
import { getMatchedMoviesDetails, getLikedMoviesDetails } from "./MovieListViewUtilityFunctions";

export type ProcessedMatchedMovies = {
  id: string;
  commonScore: number;
};

export enum MovieListUseCase {
  LIKES,
  DISLIKES,
  MATCHES,
}

const getMatchesLikedListItems = (
  givenGetPairedUserProcess: GetUserItemProcessSuccess,
  givenGetUserItemProcess: GetUserItemProcessSuccess,
  givenGetTrendingMovieProcess: GetTrendingMovieProcessSuccess,
) => {
  const matchedMoviesDetails = getMatchedMoviesDetails(
    givenGetPairedUserProcess,
    givenGetUserItemProcess,
    givenGetTrendingMovieProcess,
  );
  console.log(matchedMoviesDetails, "matchedMoviesDetails");
  const likedMatchedMoviesDetails = matchedMoviesDetails.filter(
    (matchedMovie) => matchedMovie.commonScore > 100,
  );
  if (likedMatchedMoviesDetails) {
    return likedMatchedMoviesDetails.map((movie: any) => {
      return (
        <MatchesListItem>
          <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
            <TextWrapper>
              <ScoreText score={movie.commonScore / 2}>{movie.commonScore / 2}</ScoreText>
            </TextWrapper>
            <ImageOverlay id="matches-view-image-overlay" />
            <Image
              src={`https://image.tmdb.org/t/p/w342/${movie.backdrop_path}`}
              alt={`${movie.title}`}
            />
          </Link>
        </MatchesListItem>
      );
    });
  } else {
    return [];
  }
};

const getLikedListItems = (
  givenGetUserItemProcess: GetUserItemProcessSuccess,
  givenGetTrendingMovieProcess: GetTrendingMovieProcessSuccess,
) => {
  const likedMoviesDetails = getLikedMoviesDetails(
    givenGetUserItemProcess,
    givenGetTrendingMovieProcess,
  );
  console.log(likedMoviesDetails, "likedMoviesDetails");
  // const likedMatchedMoviesDetails = likedMoviesDetails.filter(
  //   (matchedMovie) => matchedMovie.commonScore > 50,
  // );
  if (likedMoviesDetails) {
    return likedMoviesDetails.map((movie: any) => {
      return (
        <MatchesListItem>
          <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
            <TextWrapper>
              <ScoreText score={movie.commonScore / 2}>{movie.commonScore / 2}</ScoreText>
            </TextWrapper>
            <ImageOverlay id="matches-view-image-overlay" />
            <Image
              src={`https://image.tmdb.org/t/p/w342/${movie.backdrop_path}`}
              alt={`${movie.title}`}
            />
          </Link>
        </MatchesListItem>
      );
    });
  } else {
    return [];
  }
};

// const getMatchesDislikedListItems = (
//   givenGetPairedUserProcess: GetUserItemProcessSuccess,
//   givenGetUserItemProcess: GetUserItemProcessSuccess,
//   getTrendingMoviesProcess: GetTrendingMovieProcessSuccess,
// ) => {
//   const matchedMoviesDetails = getMatchedMoviesDetails(
//     givenGetPairedUserProcess,
//     givenGetUserItemProcess,
//     getTrendingMoviesProcess,
//   );
//   const disLikedMatchedMoviesDetails = matchedMoviesDetails.filter(
//     (matchedMovie) => matchedMovie.commonScore < 100,
//   );
//   if (disLikedMatchedMoviesDetails) {
//     return disLikedMatchedMoviesDetails.map((movie: any) => {
//       return (
//         <MatchesListItem>
//           <Link to={`movie/${movie.id}`} title={`${movie.title}`}>
//             <TextWrapper>
//               <ScoreText score={movie.commonScore / 2}>{movie.commonScore / 2}</ScoreText>
//             </TextWrapper>
//             <ImageOverlay id="matches-view-image-overlay" />
//             <Image
//               src={`https://image.tmdb.org/t/p/w342/${movie.backdrop_path}`}
//               alt={`${movie.title}`}
//             />
//           </Link>
//         </MatchesListItem>
//       );
//     });
//   } else {
//     return [];
//   }
// };

const getMoviesListContent = (
  givenGetPairedUserProcess: GetUserItemProcessSuccess,
  givenGetUserItemProcess: GetUserItemProcessSuccess,
  getTrendingMoviesProcess: GetTrendingMovieProcessSuccess,
  useCase: MovieListUseCase,
) => {
  switch (useCase) {
    case MovieListUseCase.MATCHES: {
      const matchesLikedListItems = getMatchesLikedListItems(
        givenGetPairedUserProcess,
        givenGetUserItemProcess,
        getTrendingMoviesProcess,
      );
      if (matchesLikedListItems !== []) {
        return (
          <MatchesList>
            {getMatchesLikedListItems(
              givenGetPairedUserProcess,
              givenGetUserItemProcess,
              getTrendingMoviesProcess,
            )}
          </MatchesList>
        );
      } else {
        return undefined;
      }
    }
    case MovieListUseCase.LIKES: {
      const matchesLikedListItems = getLikedListItems(
        givenGetUserItemProcess,
        getTrendingMoviesProcess,
      );
      if (matchesLikedListItems !== []) {
        return <h1>Likes</h1>;
      } else {
        return undefined;
      }
    }
    default:
      return undefined;
  }

  // return (
  //   <>
  //     {props.useCase && MovieListUseCase.MATCHES && (
  //       <>
  //         {getMatchesLikedListItems(
  //           props.getPairedUserProcess,
  //           props.getUserItemProcess,
  //           getTrendingMoviesProcess,
  //         ) !== [] && (

  //         )}
  //         {getMatchesDislikedListItems(
  //           props.getPairedUserProcess,
  //           props.getUserItemProcess,
  //           getTrendingMoviesProcess,
  //         ) !== [] && (
  //           <>
  //             {!dislikedMoviesListExpanded && (
  //               <DislikedMoviesListWrapper>
  //                 <TransparentButton
  //                   onClick={() => setDislikedMoviesListExpanded(!dislikedMoviesListExpanded)}
  //                   title="show disliked movies"
  //                 >
  //                   <DownwardArrow size={30} />
  //                 </TransparentButton>
  //               </DislikedMoviesListWrapper>
  //             )}
  //             {dislikedMoviesListExpanded && (
  //               <>
  //                 <ListPadding />
  //                 <MatchesList>
  //                   {getMatchesDislikedListItems(
  //                     props.getPairedUserProcess,
  //                     props.getUserItemProcess,
  //                     getTrendingMoviesProcess,
  //                   )}
  //                 </MatchesList>
  //               </>
  //             )}
  //           </>
  //         )}
  //       </>
  //     )}
  //     {props.useCase && MovieListUseCase.LIKES && }
  //     {props.useCase && MovieListUseCase.DISLIKES && <h1>Dislikes</h1>}
  //   </>
  // );
};

type Props = {
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
  useCase: MovieListUseCase;
};

export const MovieListView = (props: Props) => {
  const [getTrendingMoviesProcess, setGetTrendingMoviesProcess] =
    React.useState<GetTrendingMoviesProcess>({
      status: Status.INITIAL,
    });
  // const [dislikedMoviesListExpanded, setDislikedMoviesListExpanded] =
  React.useState<boolean>(false);

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

  React.useEffect(() => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      getMovies();
    }
  }, [props.getUserItemProcess.status]);

  return (
    <CardContentWrapper>
      {props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS &&
        getTrendingMoviesProcess.status === Status.SUCCESS &&
        getCurrentSessionProcess.status === Status.SUCCESS && (
          <>
            {getMoviesListContent(
              props.getPairedUserProcess,
              props.getUserItemProcess,
              getTrendingMoviesProcess,
              props.useCase,
            )}
            <Section>
              <SecondaryHeadline>Decide movie</SecondaryHeadline>
              <Button
                type="button"
                onClick={() => setModalOpen(true)}
                title="decide a movie now"
                error={false}
              >
                <ButtonText>Decide</ButtonText>
              </Button>
            </Section>

            {modalOpen && (
              <CreateRoomModal
                username={props.getUserItemProcess.data.username.S}
                jwtToken={getCurrentSessionProcess.data.getIdToken().getJwtToken()}
                closeModal={() => setModalOpen(false)}
              />
            )}
          </>
        )}
    </CardContentWrapper>
  );
};
