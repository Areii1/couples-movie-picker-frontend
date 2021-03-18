import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { PrimaryHeadline } from "../../styles/Styles";
import { borderRadius, fontSizes, sizingScale } from "../../styles/Variables";
import { GetUserItemProcess, LikedMoviesListItem, Movie, Status } from "../../types/Types";
import { SettingsCardContentWrapper } from "../accountSettingsView/AccountSettingsViewStyles";
import { TransparentButton } from "../accountSettingsView/pictureSection/PictureSectionStyles";
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
    mousePosition &&
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
      ? "absolute"
      : "static"};
  top: ${(props: ListItemProps) =>
    props.draggingInfo !== undefined &&
    props.draggingInfo.movieId === props.movieId &&
    props.mousePosition
      ? `${props.mousePosition.y}px`
      : "unset"};
  left: ${(props: ListItemProps) =>
    props.draggingInfo !== undefined &&
    props.draggingInfo.movieId === props.movieId &&
    props.mousePosition
      ? `${props.mousePosition.x}px`
      : "unset"};
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
  border-radius: ${`${borderRadius}px`};
  margin: ${`${sizingScale[3]}px`} 0;
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
    // document.onmousemove = (event: any) => setMousePosition({ x: event.pageX, y: event.pageY });
  }, []);
  const filteredList = getFilteredList();

  // console.log(props.getPairedUserProcess, "getPairedUserProcess");
  // console.log(props.getUserItemProcess, "getUserItemProcess");

  // console.log(getTrendingMoviesProcess, "getTrendingMoviesProcess");
  // console.log(filteredList, "filteredList");
  // console.log(mousePosition, "mousePosition");

  return (
    <SettingsCardContentWrapper>
      <PrimaryHeadline>Decide view</PrimaryHeadline>
      {filteredList.length > 0 && (
        <List
          ref={listElement}
          onMouseMove={(event: any) => {
            console.log(event.nativeEvent, "event");
            setMousePosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
          }}
        >
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[0].id}
            mousePosition={mousePosition}
            listElement={listElement}
          >
            <TransparentButton
              onMouseDown={() => setDraggingInfo({ movieId: filteredList[0].id })}
              onMouseUp={() => setDraggingInfo(undefined)}
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
            </TransparentButton>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[1].id}
            mousePosition={mousePosition}
            listElement={listElement}
          >
            <TransparentButton
              onMouseDown={() => setDraggingInfo({ movieId: filteredList[1].id })}
              onMouseUp={() => setDraggingInfo(undefined)}
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
            </TransparentButton>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[2].id}
            mousePosition={mousePosition}
            listElement={listElement}
          >
            <TransparentButton
              onMouseDown={() => setDraggingInfo({ movieId: filteredList[2].id })}
              onMouseUp={() => setDraggingInfo(undefined)}
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
            </TransparentButton>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[3].id}
            mousePosition={mousePosition}
            listElement={listElement}
          >
            <TransparentButton
              onMouseDown={() => setDraggingInfo({ movieId: filteredList[3].id })}
              onMouseUp={() => setDraggingInfo(undefined)}
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
            </TransparentButton>
          </ListItem>
          <ListItem
            draggingInfo={draggingInfo}
            movieId={filteredList[4].id}
            mousePosition={mousePosition}
            listElement={listElement}
          >
            <TransparentButton
              onMouseDown={() => setDraggingInfo({ movieId: filteredList[4].id })}
              onMouseUp={() => setDraggingInfo(undefined)}
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
            </TransparentButton>
          </ListItem>
        </List>
      )}
    </SettingsCardContentWrapper>
  );
};
