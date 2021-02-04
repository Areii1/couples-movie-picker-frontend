import styled, { keyframes, css } from "styled-components";

const lightenFirst = keyframes`
  from {
    fill: rgb(255, 101, 54);
  }
  to {
    fill: rgb(253, 124, 84);
  }
`;

const lightenSecond = keyframes`
  from {
    fill: rgb(255, 66, 29);
  }
  to {
    fill: rgb(255, 101, 54);
  }
`;

const lightenThird = keyframes`
  from {
    fill: rgb(251, 191, 0);
  }
  to {
    fill: rgb(255, 205, 40);
  }
`;

const lightenFourth = keyframes`
  from {
    fill: rgb(255, 169, 0);
  }
  to {
    fill: rgb(251, 191, 0);
  }
`;

const getHoverEffect = (animate: boolean) => {
  if (animate) {
    return css`
      path:first-child {
        animation: ${lightenFirst} 0.3s linear forwards;
      }
      path:nth-child(2) {
        animation: ${lightenSecond} 0.3s linear forwards;
      }
      path:nth-child(3) {
        animation: ${lightenThird} 0.3s linear forwards;
      }
      path:nth-child(4) {
        animation: ${lightenFourth} 0.3s linear forwards;
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
