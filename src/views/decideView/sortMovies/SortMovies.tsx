import React from "react";
import { toast } from "react-toastify";
import { DraggingInfo, MousePosition } from "../DecideViewTypes";
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
} from "../DecideViewStyles";
import { Movie, Process, Status } from "../../../types/Types";
import { getTrendingMovies } from "../../../apiService/getTrendingMovies";
import { SecondaryHeadline } from "../../../styles/Styles";

type Props = {
  getRoomDetailsProcess: Process;
};

export const SortMovies = (props: Props) => {
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

  const handleListItemMouseDown = (movieId: number) => {
    if (draggingInfo === undefined) {
      setDraggingInfo({ movieId });
    }
  };

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

  React.useEffect(() => {
    if (
      props.getRoomDetailsProcess.status === Status.SUCCESS &&
      props.getRoomDetailsProcess.data.status.S === "sorting"
    ) {
      getMovies();
      setTimeLeft(30);
    }
  }, [props.getRoomDetailsProcess.status]);

  React.useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
  }, [timeLeft]);

  return (
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
  );
};
