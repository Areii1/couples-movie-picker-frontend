import styled from "styled-components";
import { DraggingInfo, MousePosition } from "./DecideViewTypes";
import { borderRadius, fontSizes, sizingScale } from "../../styles/Variables";

export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  height: ${`${sizingScale[12]}px`};
`;

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

type ListItemProps = {
  draggingInfo: DraggingInfo | undefined;
  movieId: number;
  mousePosition: MousePosition | undefined;
  listElement: any;
};

export const ListItem = styled.li`
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

export const ListItemPlaceholder = styled.li`
  opacity: 0;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
  border-radius: ${`${borderRadius}px`};
  margin: ${`${sizingScale[3]}px`} 0;
  user-select: none;
`;

export const ListItemContentWrapper = styled.div`
  position: relative;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[8]}px`};
`;

export const Image = styled.img`
  max-width: ${`${sizingScale[10]}px`};
  max-height: ${`${sizingScale[8]}px`};
  border-radius: ${`${borderRadius}px`};
`;

type ItemOverlayProps = {
  isHovering: boolean;
};

export const ItemOverlay = styled.div`
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

export const OverlayText = styled.h4`
  margin: 0;
  font-size: ${`${fontSizes[6]}px`};
  color: white;
`;

type ProgressBarTypes = {
  percent: number;
};

export const ProgressBarWrapper = styled.div`
  height: ${`${sizingScale[3]}px`};
  background-color: gray;
  border-radius: ${`${borderRadius}px`};
`;

export const ProgressBar = styled.div`
  width: ${(props: ProgressBarTypes) => `${props.percent}%`};
  height: ${`${sizingScale[3]}px`};
  border-radius: ${`${borderRadius}px`};
  background-color: green;
`;

export const ProfileBallWrapper = styled.div`
  margin: ${`${sizingScale[4]}px`} auto 0 auto;
  width: ${`${sizingScale[9]}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: ${`${sizingScale[8]}px`};
`;

export const LoadingIconWrapper = styled.div`
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
