import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { ParamTypes } from "../movieView/MovieView";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { SecondaryHeadline } from "../../styles/Styles";
// import { PrimaryHeadline } from "../../styles/Styles";
import { borderRadius, fontSizes, sizingScale } from "../../styles/Variables";
import { GetUserItemProcess, Movie, Process, Status } from "../../types/Types";
import { SettingsCardContentWrapper } from "../accountSettingsView/AccountSettingsViewStyles";
// import { GetTrendingMoviesProcess } from "../mainView/MainViewTypes";
import { getRoomDetails } from "../../apiService/getRoomDetails";
import { GetCurrentSessionProcessContext } from "../../App";
import { Puff } from "../../components/puff/Puff";
import { ProfileBall } from "../../components/profileBall/ProfileBall";
import { bucketUrl } from "../../config/Config";

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

const ListItemPlaceholder = styled.li`
  opacity: 0;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
  border-radius: ${`${borderRadius}px`};
  margin: ${`${sizingScale[3]}px`} 0;
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

type ItemOverlayProps = {
  isHovering: boolean;
};

const ItemOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
  background-color: ${(props: ItemOverlayProps) =>
    props.isHovering ? `rgba(255, 255, 255, 0.8)` : `rgba(0, 0, 0, 0.3)`};
`;

const OverlayText = styled.h4`
  margin: 0;
  font-size: ${`${fontSizes[6]}px`};
  color: white;
`;

type ProgressBarTypes = {
  percent: number;
};

const ProgressBarWrapper = styled.div`
  height: ${`${sizingScale[3]}px`};
  background-color: gray;
  border-radius: ${`${borderRadius}px`};
`;

const ProgressBar = styled.div`
  width: ${(props: ProgressBarTypes) => `${props.percent}%`};
  height: ${`${sizingScale[3]}px`};
  border-radius: ${`${borderRadius}px`};
  background-color: green;
`;

const ProfileBallWrapper = styled.div`
  margin: ${`${sizingScale[4]}px`} auto 0 auto;
  width: ${`${sizingScale[9]}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: ${`${sizingScale[8]}px`};
`;

const LoadingIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${`${sizingScale[9]}px`};
  height: ${`${sizingScale[9]}px`};
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

type DraggingInfo = {
  movieId: number;
};

type MousePosition = {
  x: number;
  y: number;
};

type Props = {
  getPairedUserProcess: GetUserItemProcess;
};

export const DecideView = (props: Props) => {
  const [getRoomDetailsProcess, setGetRoomDetailsProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  // const [
  //   getTrendingMoviesProcess,
  //   setGetTrendingMoviesProcess,
  // ] = React.useState<GetTrendingMoviesProcess>({
  //   status: Status.INITIAL,
  // });

  const listElement = React.useRef(null);

  const [draggingInfo, setDraggingInfo] = React.useState<DraggingInfo | undefined>(undefined);

  const [mousePosition, setMousePosition] = React.useState<MousePosition | undefined>(undefined);

  const [hoveringOverPlacement, setHoverOverPlacement] = React.useState<number | undefined>(
    undefined,
  );

  const [orderedList, setOrderedList] = React.useState<Movie[] | undefined>(undefined);

  const [timeLeft, setTimeLeft] = React.useState<number>(30);

  const { id } = useParams<ParamTypes>();

  const getCurrentSessionProcess = React.useContext(GetCurrentSessionProcessContext);

  const getMovies = async () => {
    try {
      // setGetTrendingMoviesProcess({ status: Status.LOADING });
      const getTrendingMoviesResponse = await getTrendingMovies();
      const parsedGetTrendingMoviesResponse = await getTrendingMoviesResponse.json();
      // setGetTrendingMoviesProcess({
      //   status: Status.SUCCESS,
      //   data: parsedGetTrendingMoviesResponse.results,
      // });
      setOrderedList(parsedGetTrendingMoviesResponse.results);
    } catch (getTrendingMoviesError) {
      toast.error("Could not fetch movies list");
      // setGetTrendingMoviesProcess({
      //   status: Status.ERROR,
      //   error: getTrendingMoviesError,
      // });
    }
  };

  const fetchRoomDetails = async () => {
    if (getCurrentSessionProcess.status === Status.SUCCESS && id) {
      try {
        setGetRoomDetailsProcess({ status: Status.LOADING });
        const getRoomDetailsResponse = await getRoomDetails(
          id,
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        setGetRoomDetailsProcess({ status: Status.SUCCESS, data: getRoomDetailsResponse });
      } catch (getRoomDetailsError) {
        setGetRoomDetailsProcess({ status: Status.ERROR, error: getRoomDetailsError });
      }
    }
  };

  React.useEffect(() => {
    getMovies();
    fetchRoomDetails();
    setTimeLeft(30);
  }, []);

  React.useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
  }, [timeLeft]);

  const handleListItemMouseDown = (movieId: number) => {
    if (draggingInfo === undefined) {
      setDraggingInfo({ movieId });
    }
  };

  const handleItemDrop = () => {
    if (hoveringOverPlacement && draggingInfo !== undefined && orderedList !== undefined) {
      const draggedItemIndex = orderedList.findIndex(
        (movie: Movie) => movie.id === draggingInfo.movieId,
      );
      if (draggedItemIndex !== hoveringOverPlacement) {
        console.log("moving", draggedItemIndex + 1, "to", hoveringOverPlacement);
        const copiedList = [...orderedList];
        const tempItem = copiedList[draggedItemIndex];
        copiedList[draggedItemIndex] = copiedList[hoveringOverPlacement - 1];
        copiedList[hoveringOverPlacement - 1] = tempItem;
        const filteredList = copiedList.filter((item: Movie) => item !== undefined);
        setOrderedList(filteredList);
      }
    }
    setDraggingInfo(undefined);
  };

  console.log(getRoomDetailsProcess, "getRoomDetailsProcess");

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
      {getRoomDetailsProcess.status === Status.SUCCESS &&
        props.getPairedUserProcess.status === Status.SUCCESS && (
          <>
            {getRoomDetailsProcess.data.status.S === "waiting" && (
              <>
                <SecondaryHeadline>{`Waiting for ${props.getPairedUserProcess.data.username.S} to join the room`}</SecondaryHeadline>
                <ProfileBallWrapper>
                  <LoadingIconWrapper>
                    <Puff size={100} fill="white" />
                  </LoadingIconWrapper>
                  <ProfileBall
                    firstName={props.getPairedUserProcess.data.username.S}
                    image={
                      props.getPairedUserProcess.data.profilePicture
                        ? `${bucketUrl}/${props.getPairedUserProcess.data.profilePicture.S}`
                        : undefined
                    }
                    isCurrentUser={false}
                    size={128}
                    animate={false}
                    fontSize={60}
                    showText={props.getPairedUserProcess.data.profilePicture !== undefined}
                    shadow={false}
                    border={false}
                  />
                </ProfileBallWrapper>
              </>
            )}
            {getRoomDetailsProcess.data.status.S !== "waiting" && (
              <>
                {timeLeft <= 0 && <SecondaryHeadline>sorted list sent</SecondaryHeadline>}
                {timeLeft > 0 && (
                  <>
                    <ProgressBarWrapper>
                      <ProgressBar percent={timeLeft * 3.3333} />
                    </ProgressBarWrapper>
                    {orderedList !== undefined && orderedList.length > 0 && (
                      <List
                        ref={listElement}
                        onMouseMove={(event: any) =>
                          setMousePosition({
                            x: event.nativeEvent.pageX - listXPosition,
                            y: event.nativeEvent.pageY - listYPosition,
                          })
                        }
                        onMouseUp={() => handleItemDrop()}
                        onMouseLeave={() => handleItemDrop()}
                      >
                        {draggingInfo && draggingInfo.movieId === orderedList[0].id && (
                          <ListItemPlaceholder />
                        )}
                        <ListItem
                          draggingInfo={draggingInfo}
                          movieId={orderedList[0].id}
                          mousePosition={mousePosition}
                          listElement={listElement}
                          onMouseDown={() => handleListItemMouseDown(orderedList[0].id)}
                          title={orderedList[0].original_title}
                          onMouseEnter={
                            draggingInfo && draggingInfo.movieId === orderedList[0].id
                              ? () => {}
                              : () => setHoverOverPlacement(1)
                          }
                          onMouseLeave={
                            draggingInfo && draggingInfo.movieId === orderedList[0].id
                              ? () => {}
                              : () => setHoverOverPlacement(undefined)
                          }
                        >
                          <ListItemContentWrapper>
                            <Image
                              src={`https://image.tmdb.org/t/p/w342/${orderedList[0].backdrop_path}`}
                              alt="poster"
                            />
                            <ItemOverlay isHovering={hoveringOverPlacement === 1}>
                              <OverlayText>1</OverlayText>
                            </ItemOverlay>
                          </ListItemContentWrapper>
                        </ListItem>
                        {draggingInfo && draggingInfo.movieId === orderedList[1].id && (
                          <ListItemPlaceholder />
                        )}
                        <ListItem
                          draggingInfo={draggingInfo}
                          movieId={orderedList[1].id}
                          mousePosition={mousePosition}
                          listElement={listElement}
                          onMouseDown={() => handleListItemMouseDown(orderedList[1].id)}
                          title={orderedList[1].original_title}
                          onMouseEnter={
                            draggingInfo && draggingInfo.movieId === orderedList[1].id
                              ? () => {}
                              : () => setHoverOverPlacement(2)
                          }
                          onMouseLeave={
                            draggingInfo && draggingInfo.movieId === orderedList[1].id
                              ? () => {}
                              : () => setHoverOverPlacement(undefined)
                          }
                        >
                          <ListItemContentWrapper>
                            <Image
                              src={`https://image.tmdb.org/t/p/w342/${orderedList[1].backdrop_path}`}
                              alt="poster"
                            />
                            <ItemOverlay isHovering={hoveringOverPlacement === 2}>
                              <OverlayText>2</OverlayText>
                            </ItemOverlay>
                          </ListItemContentWrapper>
                        </ListItem>
                        {draggingInfo && draggingInfo.movieId === orderedList[2].id && (
                          <ListItemPlaceholder />
                        )}
                        <ListItem
                          draggingInfo={draggingInfo}
                          movieId={orderedList[2].id}
                          mousePosition={mousePosition}
                          listElement={listElement}
                          onMouseDown={() => handleListItemMouseDown(orderedList[2].id)}
                          title={orderedList[2].original_title}
                          onMouseEnter={
                            draggingInfo && draggingInfo.movieId === orderedList[2].id
                              ? () => {}
                              : () => setHoverOverPlacement(3)
                          }
                          onMouseLeave={
                            draggingInfo && draggingInfo.movieId === orderedList[2].id
                              ? () => {}
                              : () => setHoverOverPlacement(undefined)
                          }
                        >
                          <ListItemContentWrapper>
                            <Image
                              src={`https://image.tmdb.org/t/p/w342/${orderedList[2].backdrop_path}`}
                              alt="poster"
                            />
                            <ItemOverlay isHovering={hoveringOverPlacement === 3}>
                              <OverlayText>3</OverlayText>
                            </ItemOverlay>
                          </ListItemContentWrapper>
                        </ListItem>
                        {draggingInfo && draggingInfo.movieId === orderedList[3].id && (
                          <ListItemPlaceholder />
                        )}
                        <ListItem
                          draggingInfo={draggingInfo}
                          movieId={orderedList[3].id}
                          mousePosition={mousePosition}
                          listElement={listElement}
                          onMouseDown={() => handleListItemMouseDown(orderedList[3].id)}
                          title={orderedList[3].original_title}
                          onMouseEnter={
                            draggingInfo && draggingInfo.movieId === orderedList[3].id
                              ? () => {}
                              : () => setHoverOverPlacement(4)
                          }
                          onMouseLeave={
                            draggingInfo && draggingInfo.movieId === orderedList[3].id
                              ? () => {}
                              : () => setHoverOverPlacement(undefined)
                          }
                        >
                          <ListItemContentWrapper>
                            <Image
                              src={`https://image.tmdb.org/t/p/w342/${orderedList[3].backdrop_path}`}
                              alt="poster"
                            />
                            <ItemOverlay isHovering={hoveringOverPlacement === 4}>
                              <OverlayText>4</OverlayText>
                            </ItemOverlay>
                          </ListItemContentWrapper>
                        </ListItem>
                        {draggingInfo && draggingInfo.movieId === orderedList[4].id && (
                          <ListItemPlaceholder />
                        )}
                        <ListItem
                          draggingInfo={draggingInfo}
                          movieId={orderedList[4].id}
                          mousePosition={mousePosition}
                          listElement={listElement}
                          onMouseDown={() => handleListItemMouseDown(orderedList[4].id)}
                          title={orderedList[4].original_title}
                          onMouseEnter={
                            draggingInfo && draggingInfo.movieId === orderedList[4].id
                              ? () => {}
                              : () => setHoverOverPlacement(5)
                          }
                          onMouseLeave={
                            draggingInfo && draggingInfo.movieId === orderedList[4].id
                              ? () => {}
                              : () => setHoverOverPlacement(undefined)
                          }
                        >
                          <ListItemContentWrapper>
                            <Image
                              src={`https://image.tmdb.org/t/p/w342/${orderedList[4].backdrop_path}`}
                              alt="poster"
                            />
                            <ItemOverlay isHovering={hoveringOverPlacement === 5}>
                              <OverlayText>5</OverlayText>
                            </ItemOverlay>
                          </ListItemContentWrapper>
                        </ListItem>
                      </List>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
    </SettingsCardContentWrapper>
  );
};
