import React from "react";
import styled, { keyframes, css } from "styled-components";

type Props = {
  size: number;
  animate: boolean;
};

export const HeartIcon = (props: Props) => {
  return (
    <Svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 391.837 391.837"
      xmlSpace="preserve"
      height={`${props.size}px`}
      width={`${props.size}px`}
      animate={props.animate}
    >
      <path
        fill="#D7443E"
        d="M285.257,35.528c58.743,0.286,106.294,47.836,106.58,106.58
		c0,107.624-195.918,214.204-195.918,214.204S0,248.165,0,142.108c0-58.862,47.717-106.58,106.58-106.58l0,0
		c36.032-0.281,69.718,17.842,89.339,48.065C215.674,53.517,249.273,35.441,285.257,35.528z"
      />
    </Svg>
  );
};

const lighten = keyframes`
  from {
    fill: #D7443E;
  }
  to {
    fill: #ff4c46;
  }
`;

type SvgProps = {
  animate: boolean;
};

const Svg = styled.svg`
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
