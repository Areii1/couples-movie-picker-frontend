import styled, { keyframes, css } from "styled-components";

const lightenFirst = keyframes`
  from {
    fill: #4793ff;
  }
  to {
    fill: #7ab1ff;
  }
`;

const lightenSecond = keyframes`
  from {
    fill: #7dd5f4;
  }
  to {
    fill: #bfeeff;
  }
`;

const lightenThird = keyframes`
  from {
    fill: #525cdd;
  }
  to {
    fill: #767cda;
  }
`;

const getHoverEffect = (animate: boolean) => {
  if (animate) {
    return css`
      path:first-child {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
      path:nth-child(2) {
        animation: ${lightenThird} 0.3s linear forwards;
      }
      path:nth-child(3) {
        animation: ${lightenSecond} 0.3s linear forwards;
      }
      path:nth-child(4) {
        animation: ${lightenSecond} 0.3s linear forwards;
      }
      path:nth-child(5) {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
      path:nth-child(6) {
        animation: ${lightenSecond} 0.3s linear forwards;
      }
      path:nth-child(7) {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
      path:nth-child(8) {
        animation: ${lightenSecond} 0.3s linear forwards;
      }
      path:nth-child(9) {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
      path:nth-child(10) {
        animation: ${lightenSecond} 0.3s linear forwards;
      }
      path:nth-child(11) {
        animation: ${lightenSecond} 0.3s linear forwards;
      }
      path:nth-child(12) {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
      path:nth-child(13) {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
      path:nth-child(14) {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
    `;
  } else {
    return css`
      animation: unset;
    `;
  }
};

type SvgProps = {
  animate: boolean;
};

export const Svg = styled.svg`
  enable-background: new 0 0 512 512;

  :hover {
    ${(props: SvgProps) => getHoverEffect(props.animate)}
  }
`;
