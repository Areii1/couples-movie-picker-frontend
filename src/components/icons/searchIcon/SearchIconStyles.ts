import styled, { keyframes, css } from "styled-components";

const lighten = keyframes`
  from {
    fill: gray;
  }
  to {
    fill: lightgray;
    
  }
`;

type SvgProps = {
  animate: boolean;
};

export const Svg = styled.svg`
  enable-background: new 0 0 391.837 391.837;

  :hover {
    path {
      animation: ${(props: SvgProps) =>
        props.animate
          ? css`
              ${lighten} 0.3s linear forwards
            `
          : "unset"};
    }
  }
`;
