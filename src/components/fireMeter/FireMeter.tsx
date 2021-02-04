import React from "react";
import { FireIcon } from "../icons/fireIcon/FireIcon";
import { ColdIcon } from "../icons/coldIcon/ColdIcon";
import { sizingScale } from "../../styles/Variables";
import { Status } from "../../App";
import { LikeMovieProcess } from "../../views/mainView/MainView";
import { Wrapper, ColdIconButton, HotIconButton, MeterSwitchButton } from "./FireMeterStyles";

type Props = {
  evaluateItem: (movieId: string, score: number) => void;
  likeMovieProcess: LikeMovieProcess;
  movieId: string;
};

export const FireMeter = (props: Props) => {
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [mouseXPosition, setMouseXPosition] = React.useState<number>(0);
  const [mouseXStartPosition, setMouseXStartPosition] = React.useState<number>(0);
  const [score, setScore] = React.useState<number>(50);
  const [startingScore, setStartingScore] = React.useState<number>(50);

  const handleHotIconButtonClick = () => {
    setScore(100);
    props.evaluateItem(props.movieId, 100);
  };
  const handleColdIconButtonClick = () => {
    setScore(0);
    props.evaluateItem(props.movieId, 0);
  };
  const switchButtonClick = () => {
    props.evaluateItem(props.movieId, score);
  };

  const handleOnMouseDown = () => {
    setMouseXStartPosition(mouseXPosition);
    setStartingScore(score);
    setIsDragging(true);
  };

  const handleOnMouseUp = () => {
    setIsDragging(false);
    props.evaluateItem(props.movieId, score);
  };

  const keyDownHandler = (event: any) => {
    if (event.key === "ArrowLeft") {
      setScore((freshState: any) => {
        if (freshState - 5 <= 0) {
          return 0;
        } else {
          return freshState.position - 5;
        }
      });
    } else if (event.key === "ArrowRight") {
      setScore((freshState: any) => {
        if (freshState + 5 >= 100) {
          return 100;
        } else {
          return freshState.position + 5;
        }
      });
    }
  };

  const handleMouseMove = (event: any) => {
    setMouseXPosition(event.pageX);
  };

  React.useEffect(() => {
    if (isDragging) {
      if (mouseXStartPosition < mouseXPosition) {
        const newPos = (mouseXPosition - mouseXStartPosition) / 2.56 + startingScore;
        setScore(Math.floor(newPos <= 100 ? newPos : 100));
      } else {
        const newPos = startingScore - (mouseXStartPosition - mouseXPosition) / 2.56;
        setScore(Math.floor(newPos >= 0 ? newPos : 0));
      }
    }
  }, [mouseXPosition]);

  React.useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    document.onmousemove = handleMouseMove;
    return () => {
      window.removeEventListener("keyDown", keyDownHandler);
    };
  }, []);

  React.useEffect(() => {
    if (props.likeMovieProcess.status === Status.SUCCESS) {
      setScore(50);
    }
  }, [props.likeMovieProcess.status]);

  return (
    <Wrapper
      onMouseUp={handleOnMouseUp}
      isLoading={props.likeMovieProcess.status === Status.LOADING}
    >
      <ColdIconButton
        onClick={handleColdIconButtonClick}
        title="horrible"
        disabled={props.likeMovieProcess.status === Status.LOADING}
      >
        <ColdIcon
          size={sizingScale[6]}
          score={score}
          isGray={props.likeMovieProcess.status === Status.LOADING}
          animate={false}
        />
      </ColdIconButton>
      <HotIconButton
        onClick={handleHotIconButtonClick}
        title="awesome"
        disabled={props.likeMovieProcess.status === Status.LOADING}
      >
        <FireIcon
          size={sizingScale[6]}
          score={score}
          isGray={props.likeMovieProcess.status === Status.LOADING}
          animate={false}
        />
      </HotIconButton>
      <MeterSwitchButton
        onClick={switchButtonClick}
        onMouseDown={handleOnMouseDown}
        isDragging={isDragging}
        score={score}
        disabled={props.likeMovieProcess.status === Status.LOADING}
      >
        <h5>{score}</h5>
      </MeterSwitchButton>
    </Wrapper>
  );
};
