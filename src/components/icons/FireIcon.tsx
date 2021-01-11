import React from "react";
import styled, { keyframes } from "styled-components";

type Props = {
  size: number;
};

export const FireIcon = (props: Props) => {
  return (
    <Svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      height={`${props.size}px`}
      width={`${props.size}px`}
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <path
        fill="#FF6536"
        d="M54.211,249.7c0,0,20.228,29.717,62.624,54.871c0,0-30.705-259.502,169.358-304.571
      c-51.257,188.121,65.2,241.174,107.651,141.786c70.893,94.651,17.066,177.229,17.066,177.229
      c29.069,4.188,53.487-27.57,53.487-27.57c0.218,3.912,0.34,7.851,0.34,11.818C464.738,418.545,371.283,512,256,512
      S47.262,418.545,47.262,303.262C47.262,284.744,49.686,266.794,54.211,249.7z"
      />
      <path
        fill="#FF421D"
        d="M464.398,291.445c0,0-24.418,31.758-53.487,27.57c0,0,53.827-82.578-17.066-177.229
      C351.394,241.174,234.937,188.121,286.194,0C275.479,2.414,265.431,5.447,256,9.018V512c115.283,0,208.738-93.455,208.738-208.738
      C464.738,299.295,464.616,295.357,464.398,291.445z"
      />
      <path
        fill="#FBBF00"
        d="M164.456,420.456C164.456,471.014,205.442,512,256,512s91.544-40.986,91.544-91.544
      c0-27.061-11.741-51.379-30.408-68.138c-35.394,48.085-85.832-24.856-46.524-78.122
      C270.612,274.196,164.456,287.499,164.456,420.456z"
      />
      <path
        fill="#FFA900"
        d="M347.544,420.456c0-27.061-11.741-51.379-30.408-68.138c-35.394,48.085-85.832-24.856-46.524-78.122
      c0,0-5.768,0.725-14.612,3.516V512C306.558,512,347.544,471.014,347.544,420.456z"
      />
    </Svg>
  );
};

const lightenFirst = keyframes`
  from {
    fill: #FF6536;
  }
  to {
    fill: #fd7c54;
  }
`;

const lightenSecond = keyframes`
  from {
    fill: #FF421D;
  }
  to {
    fill: #FF6536;
  }
`;

const lightenThird = keyframes`
  from {
    fill: #FBBF00;
  }
  to {
    fill: #ffcd28;
  }
`;

const lightenFourth = keyframes`
  from {
    fill: #FFA900;
  }
  to {
    fill: #FBBF00;
  }
`;

const Svg = styled.svg`
  enable-background: new 0 0 512 512;

  :hover {
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
  }
`;

type SvgProps = {
  hoverColor: string;
  fillColor: string;
  hovering: boolean;
};

// const Path = styled.path`
//   background-color: ${(props: PathProps) =>
//     props.hovering ? props.hoverColor : props.fillColor};
//   transition: fill 1s;
// `;
