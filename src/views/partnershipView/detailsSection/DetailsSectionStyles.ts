import styled from "styled-components";
import { borderRadius, sizingScale } from "../../../styles/Variables";

type BallOverlayProps = {
  requestPending: boolean;
};

export const BallOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${`${sizingScale[10]}px`};
  height: ${`${sizingScale[10]}px`};
  border-radius: ${`${sizingScale[10]}px`};
  background-color: white;
  opacity: ${(props: BallOverlayProps) => (props.requestPending ? 0.5 : 0.3)};
`;

type BallWrapperProps = {
  toLeft: boolean;
};

export const BallWrapper = styled.div`
  margin-left: ${(props: BallWrapperProps) => (props.toLeft ? `${sizingScale[5] * -1}px` : 0)};
  margin-right: ${(props: BallWrapperProps) => (props.toLeft ? 0 : `${sizingScale[5] * -1}px`)};
`;

export const PartnerBallWrapper = styled(BallWrapper)`
  position: relative;
`;

export const TextWrapper = styled.div`
  display: flex;
`;

export const Text = styled.p`
  margin-left: ${`${sizingScale[2]}px`};
  color: blue;
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: calc(50% - 40px);
  left: calc(50% - 40px);
`;

export const PendingIconWrapper = styled(IconWrapper)`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: ${`${borderRadius}px`};
  padding: ${`${sizingScale[1]}px`} 0;
`;

export const MatchSection = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
  display: flex;
  justify-content: space-between;
`;

export const BallsWrapper = styled.div`
  width: ${`${sizingScale[10] * 2 - sizingScale[5] * 2}px`};
  display: flex;
  align-items: center;
  position: relative;
`;

export const DeemphasizedSpan = styled.span`
  color: gray;
  font-weight: 300;
  margin: 0 ${`${sizingScale[1]}px`};
`;
