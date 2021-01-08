import React from "react";
import styled from "styled-components";
import { ReactComponent as FireIcon } from "../../assets/fire.svg";
import { ReactComponent as ColdIcon } from "../../assets/snowflake.svg";

type Props = {
  fireMeterSwitch: any;
  setFireMeterSwitch: (obj: any) => void;
  handleSwitchButtonClick: () => void;
};

export const FireMeter = (props: Props) => {
  return (
    <Wrapper>
      <HotIconButton
        onClick={() =>
          !props.fireMeterSwitch.locked
            ? props.setFireMeterSwitch({ position: 0, locked: true })
            : () => {}
        }
        title="awesome"
      >
        <FireIcon />
      </HotIconButton>
      <ColdIconButton
        onClick={() =>
          !props.fireMeterSwitch.locked
            ? props.setFireMeterSwitch({ position: 100, locked: true })
            : () => {}
        }
        title="horrible"
      >
        <ColdIcon />
      </ColdIconButton>
      <MeterSwitchButton
        fireMeterSwitch={props.fireMeterSwitch}
        onClick={props.handleSwitchButtonClick}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 100px auto 0 auto;
  width: 300px;
  height: 30px;
  background: rgb(220, 106, 1);
  background: linear-gradient(
    90deg,
    rgba(220, 106, 1, 1) 0%,
    rgba(8, 82, 151, 1) 100%
  );
  border-radius: 10px;
`;

const HotIconButton = styled.div`
  width: 50px;
  height: 50px;
  margin: -15px 0 0 -25px;
  cursor: pointer;
`;

const ColdIconButton = styled(HotIconButton)`
  margin: -15px -25px 0 0;
  cursor: pointer;
`;

const getMeterSwitchPxPosition = (fireMeterSwitchPosition: any) => {
  const meterSwitcCircleRadius = 25;
  const barMultiplier = 3;
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
  fireMeterSwitch: any;
};

const MeterSwitchButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: white;
  border: ${(props: MeterSwitchButtonProps) =>
    props.fireMeterSwitch.locked ? "2px solid green;" : "1px solid lightgray;"};
  position: absolute;
  top: calc(50% - 25px);
  opacity: 0.9;
  left: ${(props: MeterSwitchButtonProps) =>
    getMeterSwitchPxPosition(props.fireMeterSwitch.position)};
  cursor: pointer;
`;
