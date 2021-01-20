import React from "react";
import styled from "styled-components";
import { Process, Status } from "../../App";
import { FireMeter } from "../../components/fireMeter/FireMeter";
import { PrimaryHeadline } from "../../styles/Styles";
import { sizingScale } from "../../styles/Variables";

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
  margin: ${`${sizingScale[6] * -1}px`} 0 0 ${`${sizingScale[6] * -1}px`};
  text-align: center;
`;

const Title = styled(PrimaryHeadline)`
  color: #808080;
  word-wrap: break-word;
`;

const DetailsSection = styled.div`
  margin: ${`${sizingScale[3]}px`} 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${`${sizingScale[13] - sizingScale[6] * 2}px`};
`;
