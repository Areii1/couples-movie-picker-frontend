import styled, { keyframes, css } from "styled-components";
import { AnimateType } from "./HeartIcon";

const lighten = (isRed: boolean) => keyframes`
from {
  fill: ${isRed ? "#ff0800" : "lightgreen"};
}
to {
  fill: ${isRed ? "#ff7676" : "#b9e9b9"};
}
`;

const scaleSize = () => keyframes`
from {
  transform: scale(1, 1);
}
to {
  transform: scale(1.3, 1.3);
}
`;

const getAnimation = (animate: AnimateType, isRed: boolean) => {
  switch (animate) {
    case AnimateType.COLOR: {
      return css`
        path {
          animation: ${lighten(isRed)} 0.3s linear forwards;
        }
      `;
    }
    case AnimateType.SCALE: {
      return css`
        animation: ${scaleSize()} 0.3s linear forwards;
      `;
    }
    case AnimateType.NONE: {
      return "unset";
    }
    default: {
      return "unset";
    }
  }
};

type SvgProps = {
  animate: AnimateType;
  isRed: boolean;
  size: number;
};

export const Svg = styled.svg`
  enable-background: new 0 0 391.837 391.837;

  :hover {
    ${(props: SvgProps) => getAnimation(props.animate, props.isRed, props.size)};
  }
`;
