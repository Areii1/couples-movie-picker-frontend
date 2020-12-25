import React from "react";
import styled from "styled-components";
import { ReactComponent as FireIcon } from "./assets/fire.svg";
import { ReactComponent as Heart2Icon } from "./assets/heart-2.svg";
import { ReactComponent as ColdIcon } from "./assets/snowflake.svg";
import { ProfileBall } from "./components/profileBall/ProfileBall";
import { Route, Switch, Link } from "react-router-dom";

export const App = () => {
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

  const handleSwitchButtonClick = () => {
    setFireMeterSwitch({ position: fireMeterSwitch.position, locked: true });
  };

  React.useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keyDown", keyDownHandler);
    };
  }, []);

  console.log(fireMeterSwitch.position, "fireMeterSwitchPosition");
  return (
    <ContentWrapper className="App">
      <NavigationBar>
        <NavigationBarItem>
          <Link to="/user/aaa">
            <ProfileBall
              firstName="aaaaaa"
              lastName="aaaa"
              image={undefined}
              isCurrentUser={false}
              size={50}
            />
          </Link>
        </NavigationBarItem>
        <NavigationBarItem>
          <Link to="/">
            <IconWrapper>
              <FireIcon />
            </IconWrapper>
          </Link>
        </NavigationBarItem>
        <NavigationBarItem>
          <Link to="/love">
            <IconWrapper>
              <Heart2Icon />
            </IconWrapper>
          </Link>
        </NavigationBarItem>
      </NavigationBar>
      <MainCard>
        <Switch>
          <Route exact path="/">
            <FireMeter>
              <FireMeterHotIconButton
                onClick={() =>
                  !fireMeterSwitch.locked
                    ? setFireMeterSwitch({ position: 0, locked: true })
                    : () => {}
                }
                title="awesome"
              >
                <FireIcon />
              </FireMeterHotIconButton>
              <FireMeterColdIconButton
                onClick={() =>
                  !fireMeterSwitch.locked
                    ? setFireMeterSwitch({ position: 100, locked: true })
                    : () => {}
                }
                title="horrible"
              >
                <ColdIcon />
              </FireMeterColdIconButton>
              <MeterSwitchButton
                fireMeterSwitch={fireMeterSwitch}
                onClick={handleSwitchButtonClick}
              />
            </FireMeter>
          </Route>
          <Route exact path="/user/:id">
            <div>
              <h1>user</h1>
            </div>
          </Route>
          <Route exact path="/love">
            <div>
              <h1>matches</h1>
            </div>
          </Route>
        </Switch>
      </MainCard>
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  margin: auto;
  width: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavigationBar = styled.ul`
  list-style-type: none;
  padding: 0;
  background-color: white;
  display: flex;
  border-radius: 10px;
  margin-top: 20px;
`;

const NavigationBarItem = styled.li`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
`;

const MainCard = styled.div`
  width: 100%;
  height: 600px;
  background-color: white;
  margin-top: 50px;
  border-radius: 10px;
`;

const FireMeter = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 100px auto 0 auto;
  width: 300px;
  height: 30px;
  background: rgb(220, 106, 1);
  background: linear-gradient(
    90deg,
    rgba(220, 106, 1, 1) 0%,
    rgba(8, 82, 151, 1) 100%
  );
  border-radius: 10px;
`;

const FireMeterHotIconButton = styled.div`
  width: 50px;
  height: 50px;
  margin: -15px 0 0 -25px;
  cursor: pointer;
`;

const FireMeterColdIconButton = styled(FireMeterHotIconButton)`
  margin: -15px -25px 0 0;
  cursor: pointer;
`;

type MeterSwitchButtonProps = {
  fireMeterSwitch: any;
};

const getMeterSwitchPxPosition = (fireMeterSwitchPosition: any) => {
  const meterSwitcCircleRadius = 25;
  const barMultiplier = 3;
  const positionIsLowMax = fireMeterSwitchPosition === 100;
  if (positionIsLowMax) {
    const finalPos =
      fireMeterSwitchPosition * barMultiplier - meterSwitcCircleRadius;
    return `${finalPos}px`;
  } else {
    const finalPos =
      fireMeterSwitchPosition * barMultiplier - meterSwitcCircleRadius;
    return `${finalPos}px`;
  }
};

const MeterSwitchButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: white;
  border: ${(props: MeterSwitchButtonProps) =>
    props.fireMeterSwitch.locked ? "2px solid green;" : "1px solid lightgray;"};
  position: absolute;
  top: calc(50% - 25px);
  opacity: 0.9;
  left: ${(props: MeterSwitchButtonProps) =>
    getMeterSwitchPxPosition(props.fireMeterSwitch.position)};
  cursor: pointer;
`;
