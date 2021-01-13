import React from "react";
import styled from "styled-components";
import "./App.css";
import { CSSTransition } from "react-transition-group";
import { configureAmplify } from "./config/Config";
import { Route } from "react-router-dom";
import { getTrendingMovies } from "./apiService/getTrendingMovies";
import { Auth } from "aws-amplify";
import { NavigationBar } from "./components/navigationBar/NavigationBar";
import { MainView } from "./views/MainView";
import { LogIn } from "./views/LogIn";
import { SignUp } from "./views/SignUp";
import { AccountSettings } from "./views/AccountSettings";
import { getUser } from "./apiService/getUser";
import { MatchesView } from "./views/MatchesView";

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
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [
    getCurrentSessionProcess,
    setGetCurrentSessionProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [
    getCurrentAuthenticatedUserProcess,
    setGetCurrentAuthenticatedUserProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [getUserItemProcess, setGetUserItemProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const initiateSession = async () => {
    getUserInfo();
    getMovies();
  };

  const getUserItem = async (username: string) => {
    try {
      setGetUserItemProcess({ status: Status.LOADING });
      const getUserResponse = await getUser(username);
      setGetUserItemProcess({ status: Status.SUCCESS, data: getUserResponse });
    } catch (getUserError) {
      setGetUserItemProcess({ status: Status.ERROR, error: getUserError });
    }
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
        getUserItem(getCurrentAuthenticatedUserResponse.username);
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

  React.useEffect(() => {
    if (
      getCurrentSessionProcess.status === Status.ERROR &&
      (getCurrentAuthenticatedUserProcess.status === Status.SUCCESS ||
        getUserItemProcess.status === Status.SUCCESS)
    ) {
      setGetCurrentAuthenticatedUserProcess({
        status: Status.ERROR,
        error: { name: "error", message: "current session does not exist" },
      });
      setGetUserItemProcess({
        status: Status.ERROR,
        error: { name: "error", message: "current session does not exist" },
      });
    }
  }, [getCurrentSessionProcess.status]);

  console.log(getUserItemProcess, "getUserItemProcess");
  console.log(getCurrentSessionProcess, "getCurrentSessionProcess");
  console.log(
    getCurrentAuthenticatedUserProcess,
    "getCurrentAuthenticatedUserProcess"
  );
  return (
    <ContentWrapper>
      <NavigationBar
        getCurrentAuthenticatedUserProcess={getCurrentAuthenticatedUserProcess}
        getUserItemProcess={getUserItemProcess}
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
                    getUserItemProcess={getUserItemProcess}
                    getUserItem={getUserItem}
                  />
                </div>
              </CSSTransition>
            )}
          </Route>
          <Route exact path="/love">
            <MatchesView
              getCurrentAuthenticatedUserProcess={
                getCurrentAuthenticatedUserProcess
              }
              getUserItemProcess={getUserItemProcess}
            />
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
