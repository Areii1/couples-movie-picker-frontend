import React from "react";
import { Svg } from "./FireIconStyles";

type Props = {
  size: number;
  score: number;
  isGray: boolean;
  animate: boolean;
};

export const FireIcon = (props: Props) => {
  const scorePercent = props.score / 100;
  // most intense rgb(255, 101, 54)
  // least intense rgb(253, 186, 166)"
  const firstPath = {
    // 255 - 253 = 2
    red: 255 - Math.floor(scorePercent * 2),
    // 186 - 101 = 85
    green: 186 - Math.floor(scorePercent * 85),
    // 166 - 54 = 112
    blue: 166 - Math.floor(scorePercent * 112),
  };
  // most intense  rgb(255, 66, 29)
  // least intense  rgb(252, 145, 124)
  const secondPath = {
    // 255 - 252 = 3
    red: 255 - Math.floor(scorePercent * 3),
    // 145 - 66 = 89
    green: 145 - Math.floor(scorePercent * 81),
    // 124 - 29 = 95
    blue: 124 - Math.floor(scorePercent * 95),
  };

  // most intense rgb(251, 191, 0)
  // least intense rgb(250, 220, 124)"
  const thirdPath = {
    // 251 - 250 = 1
    red: 251 - Math.floor(scorePercent * 1),
    // 220 - 191 = 29
    green: 220 - Math.floor(scorePercent * 29),
    // 124 - 0 = 124
    blue: 124 - Math.floor(scorePercent * 112),
  };

  // most intense rgb(255, 169, 0)
  // least intense rgb(253, 227, 174)"
  const fourthPath = {
    // 255 - 253 = 2
    red: 255 - Math.floor(scorePercent * 2),
    // 227 - 169 = 58
    green: 227 - Math.floor(scorePercent * 58),
    // 174 - 0 = 174
    blue: 174 - Math.floor(scorePercent * 174),
  };

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
      animate={props.animate}
    >
      <path
        fill={
          props.isGray ? "lightgray" : `rgb(${firstPath.red},${firstPath.green},${firstPath.blue})`
        }
        d="M54.211,249.7c0,0,20.228,29.717,62.624,54.871c0,0-30.705-259.502,169.358-304.571
      c-51.257,188.121,65.2,241.174,107.651,141.786c70.893,94.651,17.066,177.229,17.066,177.229
      c29.069,4.188,53.487-27.57,53.487-27.57c0.218,3.912,0.34,7.851,0.34,11.818C464.738,418.545,371.283,512,256,512
      S47.262,418.545,47.262,303.262C47.262,284.744,49.686,266.794,54.211,249.7z"
      />
      <path
        fill={
          props.isGray ? "gray" : `rgb(${secondPath.red},${secondPath.green},${secondPath.blue})`
        }
        d="M464.398,291.445c0,0-24.418,31.758-53.487,27.57c0,0,53.827-82.578-17.066-177.229
      C351.394,241.174,234.937,188.121,286.194,0C275.479,2.414,265.431,5.447,256,9.018V512c115.283,0,208.738-93.455,208.738-208.738
      C464.738,299.295,464.616,295.357,464.398,291.445z"
      />
      <path
        fill={
          props.isGray ? "#e7e7e7" : `rgb(${thirdPath.red},${thirdPath.green},${thirdPath.blue})`
        }
        d="M164.456,420.456C164.456,471.014,205.442,512,256,512s91.544-40.986,91.544-91.544
      c0-27.061-11.741-51.379-30.408-68.138c-35.394,48.085-85.832-24.856-46.524-78.122
      C270.612,274.196,164.456,287.499,164.456,420.456z"
      />
      <path
        fill={
          props.isGray ? "#d8d8d8" : `rgb(${fourthPath.red},${fourthPath.green},${fourthPath.blue})`
        }
        d="M347.544,420.456c0-27.061-11.741-51.379-30.408-68.138c-35.394,48.085-85.832-24.856-46.524-78.122
      c0,0-5.768,0.725-14.612,3.516V512C306.558,512,347.544,471.014,347.544,420.456z"
      />
    </Svg>
  );
};
