import styled, { css } from "styled-components";
import { sizingScale } from "../../styles/Variables";

type WrapperProps = {
  isLoading: boolean;
};

const getWrapperBackground = (isLoading: boolean) => {
  if (isLoading) {
    return css`
      background: gray;
    `;
  } else {
    return css`
      background: linear-gradient(90deg, rgba(8, 82, 151, 1) 0%, rgba(220, 106, 1, 1) 100%);
    `;
  }
};

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: ${`${sizingScale[11]}px`};
  height: ${`${sizingScale[5]}px`};
  ${(props: WrapperProps) => getWrapperBackground(props.isLoading)}
  border-radius: ${`${sizingScale[5]}px`};
  box-shadow: 10px 5px 5px #b3b2b2;
`;

export const ColdIconButton = styled.button`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
  margin: ${`${sizingScale[2] * -1}px`} 0 0 ${`${sizingScale[3] * -1}px`};
  cursor: pointer;
  border: none;
  background-color: transparent;
`;

export const HotIconButton = styled(ColdIconButton)`
  margin: ${`${sizingScale[2] * -1}px`} ${`${sizingScale[3] * -1}px`} 0 0;
  cursor: pointer;
`;

const getMeterSwitchPxPosition = (fireMeterSwitchPosition: any) => {
  const meterSwitcCircleRadius = 25;
  const barMultiplier = 2.56;
  const positionIsLowMax = fireMeterSwitchPosition === 100;
  if (positionIsLowMax) {
    const finalPos = fireMeterSwitchPosition * barMultiplier - meterSwitcCircleRadius;
    return `${finalPos}px`;
  } else {
    const finalPos = fireMeterSwitchPosition * barMultiplier - meterSwitcCircleRadius;
    return `${finalPos}px`;
  }
};

type MeterSwitchButtonProps = {
  isDragging: boolean;
  score: number;
  disabled: boolean;
};

export const MeterSwitchButton = styled.button`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
  border-radius: ${`${sizingScale[6]}px`};
  background-color: white;
  border: ${(props: MeterSwitchButtonProps) =>
    props.isDragging ? "2px solid green;" : "1px solid lightgray;"};
  position: absolute;
  top: calc(50% - 25px);
  opacity: 0.9;
  left: ${(props: MeterSwitchButtonProps) => getMeterSwitchPxPosition(props.score)};
  cursor: pointer;
`;
