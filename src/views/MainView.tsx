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
    <Wrapper>
      {props.getTrendingMoviesProcess.status === Status.SUCCESS && (
        <>
          <ImageSection>
            <img
              src={`https://image.tmdb.org/t/p/w500/${props.getTrendingMoviesProcess.data.results[0].backdrop_path}`}
              alt={
                props.getTrendingMoviesProcess.data.results[0].original_title
              }
            />
          </ImageSection>
          <DetailsSection>
            <Title>
              {props.getTrendingMoviesProcess.data.results[0].original_title}
            </Title>
            <FireMeter
              fireMeterSwitch={props.fireMeterSwitch}
              setFireMeterSwitch={props.setFireMeterSwitch}
              handleSwitchButtonClick={props.handleSwitchButtonClick}
            />
          </DetailsSection>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const ImageSection = styled.div`
  margin: -50px 0 0 -50px;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 35px;
  color: #808080;
  word-wrap: break-word;
  width: 400px;
  margin: 0;
`;

const DetailsSection = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;
