import React from "react";
import styled from "styled-components";
import { FireIcon } from "../icons/FireIcon";
import { ColdIcon } from "../icons/ColdIcon";
import { sizingScale } from "../../styles/Variables";

type Props = {
  fireMeterSwitch: any;
  setFireMeterSwitch: (obj: any) => void;
  evualuateItem: () => void;
};

export const FireMeter = (props: Props) => {
  const handleHotIconButtonClick = () => {
    props.setFireMeterSwitch({ position: 0, locked: true });
    props.evualuateItem();
  };
  const handleColdIconButtonClick = () => {
    props.setFireMeterSwitch({ position: 100, locked: true });
    props.evualuateItem();
  };
  const switchButtonClick = () => {
    props.evualuateItem();
  };
  return (
    <Wrapper>
      <HotIconButton onClick={handleHotIconButtonClick} title="awesome">
        <FireIcon size={sizingScale[6]} score={25} />
      </HotIconButton>
      <ColdIconButton onClick={handleColdIconButtonClick} title="horrible">
        <ColdIcon size={sizingScale[6]} />
      </ColdIconButton>
      <MeterSwitchButton
        fireMeterSwitch={props.fireMeterSwitch}
        onClick={switchButtonClick}
      />
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
    rgba(220, 106, 1, 1) 0%,
    rgba(8, 82, 151, 1) 100%
  );
  border-radius: ${`${sizingScale[5]}px`};
`;

const HotIconButton = styled.div`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
  margin: ${`${sizingScale[2] * -1}px`} 0 0 ${`${sizingScale[3] * -1}px`};
  cursor: pointer;
`;

const ColdIconButton = styled(HotIconButton)`
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
  fireMeterSwitch: any;
};

const MeterSwitchButton = styled.button`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
  border-radius: ${`${sizingScale[6]}px`};
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
