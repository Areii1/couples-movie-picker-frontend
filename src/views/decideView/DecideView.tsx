import React from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ParamTypes } from "../movieView/MovieView";
import { getTrendingMovies } from "../../apiService/getTrendingMovies";
import { SecondaryHeadline } from "../../styles/Styles";
import { Movie, Process, Status } from "../../types/Types";
import { SettingsCardContentWrapper } from "../accountSettingsView/AccountSettingsViewStyles";
import { getRoomDetails } from "../../apiService/getRoomDetails";
import { terminateRoom } from "../../apiService/terminateRoom";
import { GetCurrentSessionProcessContext } from "../../App";
import { Puff } from "../../components/puff/Puff";
import { ProfileBall } from "../../components/profileBall/ProfileBall";
import { bucketUrl } from "../../config/Config";
import { Button, ButtonText } from "../logIn/LogInStyles";
import { ConfirmModal } from "../../components/modals/confirmModal/ConfirmModal";
import { joinRoom } from "../../apiService/joinRoom";
import { DraggingInfo, MousePosition, DecideViewProps } from "./DecideViewTypes";
import {
  List,
  ListItem,
  ListItemPlaceholder,
  ListItemContentWrapper,
  Image,
  ItemOverlay,
  OverlayText,
  ProgressBarWrapper,
  ProgressBar,
  ProfileBallWrapper,
  LoadingIconWrapper,
} from "./DecideViewStyles";

export const DecideView = (props: DecideViewProps) => {
  const [getRoomDetailsProcess, setGetRoomDetailsProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [terminateRoomProcess, setTerminateRoomProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [joinRoomProcess, setJoinRoomProcess] = React.useState<Process>({ status: Status.INITIAL });
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

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

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

  const joinTheRoom = async () => {
    if (getCurrentSessionProcess.status === Status.SUCCESS && id) {
      try {
        setJoinRoomProcess({ status: Status.LOADING });
        const joinRoomResponse = await joinRoom(
          id,
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        setJoinRoomProcess({ status: Status.SUCCESS, data: joinRoomResponse });
      } catch (joinRoomError) {
        setJoinRoomProcess({ status: Status.ERROR, error: joinRoomError });
      }
    }
  };

  const fetchRoomDetails = async () => {
    if (
      getCurrentSessionProcess.status === Status.SUCCESS &&
      id &&
      props.getPairedUserProcess.status === Status.SUCCESS
    ) {
      try {
        setGetRoomDetailsProcess({ status: Status.LOADING });
        const getRoomDetailsResponse = await getRoomDetails(
          id,
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        if (getRoomDetailsResponse !== "no access") {
          if (
            getRoomDetailsResponse.status.S === "waiting" &&
            props.getPairedUserProcess.data.username.S === getRoomDetailsResponse.creator.S
          ) {
            joinTheRoom();
          }
        }
        setGetRoomDetailsProcess({ status: Status.SUCCESS, data: getRoomDetailsResponse });
      } catch (getRoomDetailsError) {
        setGetRoomDetailsProcess({ status: Status.ERROR, error: getRoomDetailsError });
      }
    }
  };

  const terminateOngoingRoom = async () => {
    if (getCurrentSessionProcess.status === Status.SUCCESS && id) {
      try {
        setTerminateRoomProcess({ status: Status.LOADING });
        const terminateRoomResponse = await terminateRoom(
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
          id,
        );
        setTerminateRoomProcess({ status: Status.SUCCESS, data: terminateRoomResponse });
      } catch (getRoomDetailsError) {
        setTerminateRoomProcess({ status: Status.ERROR, error: getRoomDetailsError });
      }
    }
  };

  React.useEffect(() => {
    if (props.getPairedUserProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, []);

  React.useEffect(() => {
    if (props.getPairedUserProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, [props.getPairedUserProcess.status]);

  React.useEffect(() => {
    if (joinRoomProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, [joinRoomProcess.status]);

  React.useEffect(() => {
    if (
      getRoomDetailsProcess.status === Status.SUCCESS &&
      getRoomDetailsProcess.data.status.S === "sorting"
    ) {
      getMovies();
      setTimeLeft(30);
    }
  }, [getRoomDetailsProcess.status]);

  React.useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
  }, [timeLeft]);

  React.useEffect(() => {
    if (terminateRoomProcess.status === Status.SUCCESS) {
      fetchRoomDetails();
    }
  }, [terminateRoomProcess.status]);

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

  // console.log(getRoomDetailsProcess, "getRoomDetailsProcess");
  // console.log(terminateRoomProcess, "terminateRoomProcess");

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

  console.log(timeLeft, "timeLeft");

  return (
    <SettingsCardContentWrapper>
      {getRoomDetailsProcess.status === Status.SUCCESS &&
        props.getPairedUserProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS && (
          <>
            {getRoomDetailsProcess.data !== "no access" && (
              <>
                {getRoomDetailsProcess.data.status.S === "waiting" && (
                  <>
                    {getRoomDetailsProcess.data.creator.S ===
                      props.getUserItemProcess.data.username.S && (
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
                        <Button
                          type="button"
                          onClick={() => setModalOpen(true)}
                          title="terminate the room"
                          error={false}
                        >
                          <ButtonText>Terminate room</ButtonText>
                        </Button>
                        {modalOpen && (
                          <ConfirmModal
                            closeModal={() => setModalOpen(false)}
                            performAction={terminateOngoingRoom}
                            title="terminate room"
                            status={terminateRoomProcess.status}
                            buttonText="Terminate"
                          />
                        )}
                      </>
                    )}
                    {getRoomDetailsProcess.data.creator.S ===
                      props.getPairedUserProcess.data.username.S && (
                      <>
                        {joinRoomProcess.status === Status.LOADING && (
                          <Puff size={50} fill="blue" />
                        )}
                        {joinRoomProcess.status === Status.SUCCESS && (
                          <SecondaryHeadline>Joined room</SecondaryHeadline>
                        )}
                        {joinRoomProcess.status === Status.ERROR && (
                          <SecondaryHeadline>Could not join room</SecondaryHeadline>
                        )}
                      </>
                    )}
                  </>
                )}
                {getRoomDetailsProcess.data.status.S === "terminated" && (
                  <SecondaryHeadline>Room has been terminated</SecondaryHeadline>
                )}
                {getRoomDetailsProcess.data.status.S === "sorting" && (
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
            {getRoomDetailsProcess.data === "no access" && (
              <SecondaryHeadline>You are not welcome in this room</SecondaryHeadline>
            )}
          </>
        )}
    </SettingsCardContentWrapper>
  );
};
