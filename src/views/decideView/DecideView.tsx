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
  getUserItemProcess: GetUserItemProcess;
};

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  height: ${`${sizingScale[12]}px`};
`;

type ListItemProps = {
  draggingInfo: DraggingInfo | undefined;
  movieId: number;
  mousePosition: MousePosition | undefined;
  listElement: any;
};

const getPosition = (
  draggingInfo: DraggingInfo | undefined,
  movieId: number,
  mousePosition: MousePosition | undefined,
  listElement: any,
): boolean => {
  if (
    draggingInfo !== undefined &&
    draggingInfo.movieId === movieId &&
    mousePosition !== undefined &&
    listElement &&
    listElement.current
  ) {
    if (
      mousePosition.x > 0 &&
      mousePosition.y > 0 &&
      mousePosition.x < listElement.current.offsetWidth &&
      mousePosition.y < listElement.current.offsetHeight
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const ListItem = styled.li`
  position: ${(props: ListItemProps) =>
    getPosition(props.draggingInfo, props.movieId, props.mousePosition, props.listElement)
      ? "fixed"
      : "static"};
  top: ${(props: ListItemProps) =>
    props.draggingInfo !== undefined &&
    props.draggingInfo.movieId === props.movieId &&
    props.mousePosition &&
    props.listElement.current
      ? `${
          props.listElement.current.getBoundingClientRect().top +
          props.mousePosition.y -
          sizingScale[8] / 2
        }px`
      : "unset"};
  left: ${(props: ListItemProps) =>
    props.draggingInfo !== undefined &&
    props.draggingInfo.movieId === props.movieId &&
    props.mousePosition
      ? `${
          props.listElement.current.getBoundingClientRect().left +
          props.mousePosition.x -
          sizingScale[10] / 2
        }px`
      : "unset"};
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
  border-radius: ${`${borderRadius}px`};
  margin: ${`${sizingScale[3]}px`} 0;
  cursor: pointer;
  user-select: none;
`;

const ListItemContentWrapper = styled.div`
  position: relative;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
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
  background-color: rgba(0, 0, 0, 0.4);
`;

const OverlayText = styled.h4`
  margin: 0;
  font-size: ${`${fontSizes[6]}px`};
  color: white;
`;

type DraggingInfo = {
  movieId: number;
};

type MousePosition = {
  x: number;
  y: number;
};

export const DecideView = (props: Props) => {
  const [
    getTrendingMoviesProcess,
    setGetTrendingMoviesProcess,
  ] = React.useState<GetTrendingMoviesProcess>({
    status: Status.INITIAL,
  });

  const listElement = React.useRef(null);

  const [draggingInfo, setDraggingInfo] = React.useState<DraggingInfo | undefined>(undefined);

  const [mousePosition, setMousePosition] = React.useState<MousePosition | undefined>(undefined);

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

  const handleListItemMouseDown = (movieId: number) => {
    if (draggingInfo === undefined) {
      setDraggingInfo({ movieId });
    }
  };

  const listXPosition =
    listElement && listElement !== null && listElement.current && listElement.current !== null
      ? // @ts-ignore: Object is possibly 'null'.
        listElement.current!.getBoundingClientRect().left
      : 0;
  const listYPosition =
    listElement && listElement !== null && listElement.current && listElement.current !== null
      ? // @ts-ignore: Object is possibly 'null'.
        listElement.current!.getBoundingClientRect().top
      : 0;

  return (
    <SettingsCardContentWrapper>
      <PrimaryHeadline>Decide view</PrimaryHeadline>
      {filteredList.length > 0 && (
        <List
          ref={listElement}
          onMouseMove={(event: any) =>
            setMousePosition({
              x: event.nativeEvent.pageX - listXPosition,
              y: event.nativeEvent.pageY - listYPosition,
            })
          }
          onMouseUp={() => setDraggingInfo(undefined)}
          onMouseLeave={() => setDraggingInfo(undefined)}
        >
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[0].id}
            mousePosition={mousePosition}
            listElement={listElement}
            onMouseDown={() => handleListItemMouseDown(filteredList[0].id)}
            title={filteredList[0].original_title}
          >
            <ListItemContentWrapper>
              <Image
                src={`https://image.tmdb.org/t/p/w342/${filteredList[0].backdrop_path}`}
                alt="poster"
              />
              <ItemOverlay>
                <OverlayText>1</OverlayText>
              </ItemOverlay>
            </ListItemContentWrapper>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[1].id}
            mousePosition={mousePosition}
            listElement={listElement}
            onMouseDown={() => handleListItemMouseDown(filteredList[1].id)}
            title={filteredList[1].original_title}
          >
            <ListItemContentWrapper>
              <Image
                src={`https://image.tmdb.org/t/p/w342/${filteredList[1].backdrop_path}`}
                alt="poster"
              />
              <ItemOverlay>
                <OverlayText>2</OverlayText>
              </ItemOverlay>
            </ListItemContentWrapper>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[2].id}
            mousePosition={mousePosition}
            listElement={listElement}
            onMouseDown={() => handleListItemMouseDown(filteredList[2].id)}
            title={filteredList[2].original_title}
          >
            <ListItemContentWrapper>
              <Image
                src={`https://image.tmdb.org/t/p/w342/${filteredList[2].backdrop_path}`}
                alt="poster"
              />
              <ItemOverlay>
                <OverlayText>3</OverlayText>
              </ItemOverlay>
            </ListItemContentWrapper>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[3].id}
            mousePosition={mousePosition}
            listElement={listElement}
            onMouseDown={() => handleListItemMouseDown(filteredList[3].id)}
            title={filteredList[3].original_title}
          >
            <ListItemContentWrapper>
              <Image
                src={`https://image.tmdb.org/t/p/w342/${filteredList[3].backdrop_path}`}
                alt="poster"
              />
              <ItemOverlay>
                <OverlayText>4</OverlayText>
              </ItemOverlay>
            </ListItemContentWrapper>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[4].id}
            mousePosition={mousePosition}
            listElement={listElement}
            onMouseDown={() => handleListItemMouseDown(filteredList[4].id)}
            title={filteredList[4].original_title}
          >
            <ListItemContentWrapper>
              <Image
                src={`https://image.tmdb.org/t/p/w342/${filteredList[4].backdrop_path}`}
                alt="poster"
              />
              <ItemOverlay>
                <OverlayText>5</OverlayText>
              </ItemOverlay>
            </ListItemContentWrapper>
          </ListItem>
        </List>
      )}
      {/* <Dot listElement={listElement} />
      <AnotherDot listElement={listElement} mousePosition={mousePosition} /> */}
    </SettingsCardContentWrapper>
  );
};
