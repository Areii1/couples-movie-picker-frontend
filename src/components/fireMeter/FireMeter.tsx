import React from "react";
import styled from "styled-components";
import { FireIcon } from "../icons/FireIcon";
import { ColdIcon } from "../icons/ColdIcon";
import { sizingScale } from "../../styles/Variables";

type Props = {
  evaluateItem: (movieId: string, score: number) => void;
  movieId: string;
};

export const FireMeter = (props: Props) => {
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [mouseXPosition, setMouseXPosition] = React.useState<number>(0);
  const [mouseXStartPosition, setMouseXStartPosition] = React.useState<number>(
    0
  );
  const [score, setScore] = React.useState<number>(50);
  const [startingScore, setStartingScore] = React.useState<number>(50);

  const handleHotIconButtonClick = () => {
    setScore(50);
    props.evaluateItem(props.movieId, 0);
  };
  const handleColdIconButtonClick = () => {
    setScore(50);
    props.evaluateItem(props.movieId, 100);
  };
  const switchButtonClick = () => {
    setScore(50);
    props.evaluateItem(props.movieId, score);
  };

  const handleOnMouseDown = (event: any) => {
    setMouseXStartPosition(mouseXPosition);
    setStartingScore(score);
    setIsDragging(true);
  };

  const handleOnMouseUp = (event: any) => {
    setScore(50);
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

  // console.log(
  //   mouseXPosition,
  //   "mouseXPosition",
  //   mouseXStartPosition,
  //   "mouseXStartPosition",
  //   props.fireMeterSwitch.position,
  //   isDragging,
  //   "isDragging"
  // );
  const handleMouseMove = (event: any) => {
    setMouseXPosition(event.pageX);
  };

  React.useEffect(() => {
    if (isDragging) {
      if (mouseXStartPosition < mouseXPosition) {
        const newPos =
          (mouseXPosition - mouseXStartPosition) / 2.56 + startingScore;
        setScore(Math.floor(newPos <= 100 ? newPos : 100));
      } else {
        const newPos =
          startingScore - (mouseXStartPosition - mouseXPosition) / 2.56;
        setScore(Math.floor(newPos >= 0 ? newPos : 0));
      }
    }
  }, [mouseXPosition]);

  React.useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    document.onmousemove = handleMouseMove;
    return () => {
      window.removeEventListener("keyDown", keyDownHandler);
      document.onmousemove = () => {};
    };
  }, []);
  return (
    <Wrapper
      onMouseUp={handleOnMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      <ColdIconButton onClick={handleHotIconButtonClick} title="awesome">
        <ColdIcon size={sizingScale[6]} />
      </ColdIconButton>
      <HotIconButton onClick={handleColdIconButtonClick} title="horrible">
        <FireIcon size={sizingScale[6]} score={50} />
      </HotIconButton>
      <MeterSwitchButton
        onClick={switchButtonClick}
        onMouseDown={handleOnMouseDown}
        isDragging={isDragging}
        score={score}
      >
        <h5>{score}</h5>
      </MeterSwitchButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: ${`${sizingScale[8]}px`} auto 0 auto;
  width: ${`${sizingScale[11]}px`};
  height: ${`${sizingScale[5]}px`};
  background: rgb(220, 106, 1);
  background: linear-gradient(
    90deg,
    rgba(8, 82, 151, 1) 0%,
    rgba(220, 106, 1, 1) 100%
  );
  border-radius: ${`${sizingScale[5]}px`};
`;

const ColdIconButton = styled.div`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
  margin: ${`${sizingScale[2] * -1}px`} 0 0 ${`${sizingScale[3] * -1}px`};
  cursor: pointer;
`;

const HotIconButton = styled(ColdIconButton)`
  margin: ${`${sizingScale[2] * -1}px`} ${`${sizingScale[3] * -1}px`} 0 0;
  cursor: pointer;
`;

const getMeterSwitchPxPosition = (fireMeterSwitchPosition: any) => {
  const meterSwitcCircleRadius = 25;
  const barMultiplier = 2.56;
  const positionIsLowMax = fireMeterSwitchPosition === 100;
  if (positionIsLowMax) {
    const finalPos =
      fireMeterSwitchPosition * barMultiplier - meterSwitcCircleRadius;
    return `${finalPos}px`;
  } else {
    const finalPos =
      fireMeterSwitchPosition * barMultiplier - meterSwitcCircleRadius;
    return `${finalPos}px`;
  }
};

type MeterSwitchButtonProps = {
  isDragging: boolean;
  score: number;
};

const MeterSwitchButton = styled.button`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
  border-radius: ${`${sizingScale[6]}px`};
  background-color: white;
  border: ${(props: MeterSwitchButtonProps) =>
    props.isDragging ? "2px solid green;" : "1px solid lightgray;"};
  position: absolute;
  top: calc(50% - 25px);
  opacity: 0.9;
  left: ${(props: MeterSwitchButtonProps) =>
    getMeterSwitchPxPosition(props.score)};
  cursor: pointer;
`;
