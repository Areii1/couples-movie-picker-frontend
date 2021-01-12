import React from "react";
import styled from "styled-components";
import { Process, Status } from "../App";
import { FireMeter } from "../components/fireMeter/FireMeter";

type Props = {
  getTrendingMoviesProcess: Process;
  fireMeterSwitch: any;
  setFireMeterSwitch: (obj: any) => void;
  handleSwitchButtonClick: () => void;
};

export const MainView = (props: Props) => {
  return (
    <>
      {props.getTrendingMoviesProcess.status === Status.SUCCESS && (
        <>
          <ImageSection>
            <img
              src={`https://image.tmdb.org/t/p/w500/${props.getTrendingMoviesProcess.data.results[0].backdrop_path}`}
              alt={
                props.getTrendingMoviesProcess.data.results[0].original_title
              }
            />
            <Title>
              {props.getTrendingMoviesProcess.data.results[0].original_title}
            </Title>
          </ImageSection>
          <FireMeter
            fireMeterSwitch={props.fireMeterSwitch}
            setFireMeterSwitch={props.setFireMeterSwitch}
            handleSwitchButtonClick={props.handleSwitchButtonClick}
          />
        </>
      )}
    </>
  );
};

const ImageSection = styled.div`
  width: 500px;
  /* margin: -50px 0 0 -50px; */
`;

const Title = styled.h3`
  font-size: 40px;
  color: #808080;
  word-wrap: break-word;
  width: 500px;
  margin: 20px 0 0 0;
`;
