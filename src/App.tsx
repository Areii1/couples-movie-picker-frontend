import React from "react";
import styled from "styled-components";
import "./App.css";
import { CSSTransition } from "react-transition-group";
import { configureAmplify } from "./config/Config";
import { Route, Switch } from "react-router-dom";
import { getTrendingMovies } from "./apiService/getTrendingMovies";
import { Auth } from "aws-amplify";
import { NavigationBar } from "./components/navigationBar/NavigationBar";
import { MainView } from "./views/MainView";
import { LogIn } from "./views/LogIn";
import { SignUp } from "./views/SignUp";
import { AccountSettings } from "./views/AccountSettings";

configureAmplify();

export enum Status {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR,
}

export type Process =
  | { status: Status.INITIAL }
  | { status: Status.LOADING }
  | { status: Status.SUCCESS; data: any }
  | { status: Status.ERROR; error: Error };

export const App = () => {
  const [fireMeterSwitch, setFireMeterSwitch] = React.useState<any>({
    position: 50,
    locked: false,
  });

  const [
    getTrendingMoviesProcess,
    setGetTrendingMoviesProcess,
  ] = React.useState<any>({ status: Status.INITIAL });

  const [
    getCurrentSessionProcess,
    setGetCurrentSessionProcess,
  ] = React.useState<any>({ status: Status.INITIAL });

  const [
    getCurrentAuthenticatedUserProcess,
    setGetCurrentAuthenticatedUserProcess,
  ] = React.useState<any>({ status: Status.INITIAL });

  const initiateSession = async () => {
    getUserInfo();
    getMovies();
  };

  const getUserInfo = async () => {
    try {
      setGetCurrentSessionProcess({ status: Status.LOADING });
      const getCurrentSessionResponse = await Auth.currentSession();
      setGetCurrentSessionProcess({
        status: Status.SUCCESS,
        data: getCurrentSessionResponse,
      });
      try {
        setGetCurrentAuthenticatedUserProcess({ status: Status.LOADING });
        const getCurrentAuthenticatedUserResponse = await Auth.currentAuthenticatedUser();
        setGetCurrentAuthenticatedUserProcess({
          status: Status.SUCCESS,
          data: getCurrentAuthenticatedUserResponse,
        });
      } catch (getCurrentAuthenticatedUserError) {
        setGetCurrentAuthenticatedUserProcess({
          status: Status.ERROR,
          error: getCurrentAuthenticatedUserError,
        });
      }
    } catch (getCurrentSessionError) {
      setGetCurrentSessionProcess({
        status: Status.ERROR,
        error: getCurrentSessionError,
      });
    }
  };

  const getMovies = async () => {
    try {
      setGetTrendingMoviesProcess({ status: Status.LOADING });
      const getTrendingMoviesResponse = await getTrendingMovies();
      const paredGetTrendingMoviesResponse = await getTrendingMoviesResponse.json();
      setGetTrendingMoviesProcess({
        status: Status.SUCCESS,
        data: paredGetTrendingMoviesResponse,
      });
    } catch (getTrendingMoviesError) {
      setGetTrendingMoviesProcess({
        status: Status.ERROR,
        error: getTrendingMoviesError,
      });
    }
  };

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
    initiateSession();
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keyDown", keyDownHandler);
    };
  }, []);

  return (
    <ContentWrapper>
      <NavigationBar
        getCurrentAuthenticatedUserProcess={getCurrentAuthenticatedUserProcess}
      />
      <MainCard>
          <MainCardContentWrapper>
            <Route exact path="/">
              {({ match }) => (
                <CSSTransition
                  in={match !== null}
                  timeout={1000}
                  classNames="page"
                  unmountOnExit
                >
                  <div className="page">
                    <MainView
                      getTrendingMoviesProcess={getTrendingMoviesProcess}
                      fireMeterSwitch={fireMeterSwitch}
                      setFireMeterSwitch={setFireMeterSwitch}
                      handleSwitchButtonClick={handleSwitchButtonClick}
                    />
                  </div>
                </CSSTransition>
              )}
            </Route>
            <Route exact path="/login">
              {({ match }) => (
                <CSSTransition
                  in={match !== null}
                  timeout={300}
                  classNames="page"
                  unmountOnExit
                >
                  <div className="page">
                    <LogIn initiateSession={initiateSession} />
                  </div>
                </CSSTransition>
              )}
            </Route>
            <Route exact path="/signup">
              {({ match }) => (
                <CSSTransition
                  in={match !== null}
                  timeout={300}
                  classNames="page"
                  unmountOnExit
                >
                  <div className="page">
                    <SignUp />
                  </div>
                </CSSTransition>
              )}
            </Route>
            <Route exact path="/user">
              {({ match }) => (
                <CSSTransition
                  in={match !== null}
                  timeout={300}
                  classNames="page"
                  unmountOnExit
                >
                  <div className="page">
                    <AccountSettings
                      getCurrentSessionProcess={getCurrentSessionProcess}
                      getCurrentAuthenticatedUserProcess={
                        getCurrentAuthenticatedUserProcess
                      }
                      initiateSession={initiateSession}
                    />
                  </div>
                </CSSTransition>
              )}
            </Route>
            <Route exact path="/love">
              <div>
                <h1>matches</h1>
              </div>
            </Route>
          </MainCardContentWrapper>
      </MainCard>
    </ContentWrapper>
  );
};

export const SecondaryHeadline = styled.h5`
  font-size: 20px;
  margin: 0;
  font-weight: 400;
  color: black;
`;

const ContentWrapper = styled.div`
  margin: auto;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainCard = styled.div`
  width: 100%;
  background-color: white;
  margin-top: 50px;
  border-radius: 10px;
  padding: 50px;
  height: 600px;
  display: flex;
  justify-content: start;
  overflow: hidden;
`;

const MainCardContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;
