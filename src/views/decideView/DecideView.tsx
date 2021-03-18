import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { PrimaryHeadline } from "../../styles/Styles";
import { borderRadius, fontSizes, sizingScale } from "../../styles/Variables";
import { GetUserItemProcess, LikedMoviesListItem, Movie, Status } from "../../types/Types";
import { SettingsCardContentWrapper } from "../accountSettingsView/AccountSettingsViewStyles";
import { GetTrendingMoviesProcess } from "../mainView/MainViewTypes";

type Props = {
  getPairedUserProcess: GetUserItemProcess;
  getUserItemProcess: GetUserItemProcess;
};

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
  border-radius: ${`${borderRadius}px`};
  margin: ${`${sizingScale[3]}px`} 0;
  position: relative;
`;

const Image = styled.img`
  max-width: ${`${sizingScale[10]}px`};
  max-height: ${`${sizingScale[8]}px`};
  border-radius: ${`${borderRadius}px`};
`;

const ItemOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
  background-color: rgba(255, 255, 255, 0.5);
`;

const OverlayText = styled.h4`
  margin: 0;
  font-size: ${`${fontSizes[4]}px`};
`;

export const DecideView = (props: Props) => {
  const [
    getTrendingMoviesProcess,
    setGetTrendingMoviesProcess,
  ] = React.useState<GetTrendingMoviesProcess>({
    status: Status.INITIAL,
  });

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
    getMovies();
  }, []);
  const filteredList = getFilteredList();

  console.log(props.getPairedUserProcess, "getPairedUserProcess");
  console.log(props.getUserItemProcess, "getUserItemProcess");

  console.log(getTrendingMoviesProcess, "getTrendingMoviesProcess");
  console.log(filteredList, "filteredList");

  return (
    <SettingsCardContentWrapper>
      <PrimaryHeadline>Decide view</PrimaryHeadline>
      {filteredList.length > 0 && (
        <List>
          <ListItem>
            <Image
              src={`https://image.tmdb.org/t/p/w342/${filteredList[0].backdrop_path}`}
              alt="poster"
            />
            <ItemOverlay>
              <OverlayText>1</OverlayText>
            </ItemOverlay>
          </ListItem>
          <ListItem>
            <Image
              src={`https://image.tmdb.org/t/p/w342/${filteredList[1].backdrop_path}`}
              alt="poster"
            />
            <ItemOverlay>
              <OverlayText>2</OverlayText>
            </ItemOverlay>
          </ListItem>
          <ListItem>
            <Image
              src={`https://image.tmdb.org/t/p/w342/${filteredList[2].backdrop_path}`}
              alt="poster"
            />
            <ItemOverlay>
              <OverlayText>3</OverlayText>
            </ItemOverlay>
          </ListItem>
          <ListItem>
            <Image
              src={`https://image.tmdb.org/t/p/w342/${filteredList[3].backdrop_path}`}
              alt="poster"
            />
            <ItemOverlay>
              <OverlayText>4</OverlayText>
            </ItemOverlay>
          </ListItem>
          <ListItem>
            <Image
              src={`https://image.tmdb.org/t/p/w342/${filteredList[4].backdrop_path}`}
              alt="poster"
            />
            <ItemOverlay>
              <OverlayText>5</OverlayText>
            </ItemOverlay>
          </ListItem>
        </List>
      )}
    </SettingsCardContentWrapper>
  );
};
