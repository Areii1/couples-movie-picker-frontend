import React from "react";
import styled from "styled-components";
import { Process, Status } from "../../App";
import { FireMeter } from "../../components/fireMeter/FireMeter";
import { PrimaryHeadline } from "../../styles/Styles";
import { sizingScale } from "../../styles/Variables";

type Props = {
  getTrendingMoviesProcess: Process;
};

export const MainView = (props: Props) => {
  const [fireMeterSwitch, setFireMeterSwitch] = React.useState<any>({
    position: 50,
    locked: false,
  });

  const keyDownHandler = (event: any) => {
    if (!fireMeterSwitch.locked) {
      if (event.key === "ArrowLeft") {
        setFireMeterSwitch((freshState: any) => {
          if (freshState.position - 5 <= 0) {
            return {
              position: 0,
              locked: false,
            };
          }
          return {
            position: freshState.position - 5,
            locked: false,
          };
        });
      } else if (event.key === "ArrowRight") {
        setFireMeterSwitch((freshState: any) => {
          if (freshState.position + 5 >= 100) {
            return {
              position: 100,
              locked: false,
            };
          }
          return {
            position: freshState.position + 5,
            locked: false,
          };
        });
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keyDown", keyDownHandler);
    };
  }, []);

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
              fireMeterSwitch={fireMeterSwitch}
              setFireMeterSwitch={setFireMeterSwitch}
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
