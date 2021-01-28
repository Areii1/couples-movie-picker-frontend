import React from "react";
import styled from "styled-components";
import "./App.css";
import { CSSTransition } from "react-transition-group";
import { configureAmplify } from "./config/Config";
import { Route } from "react-router-dom";
import { NavigationBar } from "./components/navigationBar/NavigationBar";
import { MainView } from "./views/mainView/MainView";
import { LogIn } from "./views/logIn/LogIn";
import { SignUp } from "./views/signUp/SignUp";
import { AccountSettingsView } from "./views/accountSettingsView/AccountSettingsView";
import { getUser } from "./apiService/getUser";
import { PartnershipView } from "./views/partnershipView/PartnershipView";
import {
  getCurrentSession,
  getCurrentAuthenticatedUser,
} from "./apiService/getUserInformation";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { UserInfo } from "./types/Types";
import { sizingScale } from "./styles/Variables";
import { MatchesView } from "./views/matchesView/MatchesView";
import { MovieView } from "./views/movieView/MovieView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export type GetCurrentSessionProcess =
  | { status: Status.INITIAL }
  | { status: Status.LOADING }
  | { status: Status.SUCCESS; data: CognitoUserSession }
  | { status: Status.ERROR; error: Error };

export type GetUserItemProcess =
  | { status: Status.INITIAL }
  | { status: Status.LOADING }
  | { status: Status.SUCCESS; data: UserInfo }
  | { status: Status.ERROR; error: Error };

export const App = () => {
  const [
    getCurrentSessionProcess,
    setGetCurrentSessionProcess,
  ] = React.useState<GetCurrentSessionProcess>({ status: Status.INITIAL });

  const [
    getCurrentAuthenticatedUserProcess,
    setGetCurrentAuthenticatedUserProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [
    getPairedUserProcess,
    setGetPairedUserProcess,
  ] = React.useState<GetUserItemProcess>({ status: Status.INITIAL });

  const [
    getUserItemProcess,
    setGetUserItemProcess,
  ] = React.useState<GetUserItemProcess>({
    status: Status.INITIAL,
  });

  const getPairedUser = async (username: string, jwtToken?: string) => {
    try {
      setGetPairedUserProcess({ status: Status.LOADING });
      const getPairedUserResponse = await getUser(username, jwtToken);
      setGetPairedUserProcess({
        status: Status.SUCCESS,
        data: getPairedUserResponse,
      });
    } catch (getUserError) {
      toast.error('Could not get partnered user information')
      setGetPairedUserProcess({ status: Status.ERROR, error: getUserError });
    }
  };

  const getUserItem = async (username: string, jwtToken?: string) => {
    try {
      setGetUserItemProcess({ status: Status.LOADING });
      const getUserResponse = await getUser(username, jwtToken);
      setGetUserItemProcess({
        status: Status.SUCCESS,
        data: getUserResponse,
      });
    } catch (getUserError) {
      toast.error('Could not get user information')
      setGetUserItemProcess({ status: Status.ERROR, error: getUserError });
    }
  };

  const getUserInfo = async () => {
    try {
      setGetCurrentSessionProcess({ status: Status.LOADING });
      const getCurrentSessionResponse = await getCurrentSession();
      setGetCurrentSessionProcess({
        status: Status.SUCCESS,
        data: getCurrentSessionResponse,
      });
      try {
        setGetCurrentAuthenticatedUserProcess({ status: Status.LOADING });
        const getCurrentAuthenticatedUserResponse = await getCurrentAuthenticatedUser();
        setGetCurrentAuthenticatedUserProcess({
          status: Status.SUCCESS,
          data: getCurrentAuthenticatedUserResponse,
        });
        getUserItem(
          getCurrentAuthenticatedUserResponse.username,
          getCurrentSessionResponse.getIdToken().getJwtToken()
        );
      } catch (getCurrentAuthenticatedUserError) {
        toast.error('Could not get user information');
        setGetCurrentAuthenticatedUserProcess({
          status: Status.ERROR,
          error: getCurrentAuthenticatedUserError,
        });
      }
    } catch (getCurrentSessionError) {
      toast.error('Could not initiate session');
      setGetCurrentSessionProcess({
        status: Status.ERROR,
        error: getCurrentSessionError,
      });
    }
  };

  React.useEffect(() => {
    getUserInfo();
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

  React.useEffect(() => {
    if (
      getUserItemProcess.status === Status.SUCCESS &&
      getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      if (getUserItemProcess.data.partner) {
        getPairedUser(
          getUserItemProcess.data.partner.S,
          getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
      } else if (getUserItemProcess.data.outgoingRequests) {
        getPairedUser(
          getUserItemProcess.data.outgoingRequests.S,
          getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
      }
    }
  }, [getUserItemProcess.status]);

  // console.log(getUserItemProcess, "getUserItemProcess");
  // console.log(getCurrentSessionProcess, "getCurrentSessionProcess");
  // console.log(
  //   getCurrentAuthenticatedUserProcess,
  //   "getCurrentAuthenticatedUserProcess"
  // );
  // console.log(getPairedUserProcess, "getPairedUserProcess");

  return (
    <ContentWrapper>
      <NavigationBar
        getCurrentAuthenticatedUserProcess={getCurrentAuthenticatedUserProcess}
        getUserItemProcess={getUserItemProcess}
      />
      <div className="container">
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
                  getCurrentSessionProcess={getCurrentSessionProcess}
                  getUserItemProcess={getUserItemProcess}
                  getUserItem={getUserItem}
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
                <LogIn initiateSession={getUserInfo} />
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
                <AccountSettingsView
                  getCurrentSessionProcess={getCurrentSessionProcess}
                  getCurrentAuthenticatedUserProcess={
                    getCurrentAuthenticatedUserProcess
                  }
                  initiateSession={getUserInfo}
                  getUserItemProcess={getUserItemProcess}
                  getUserItem={getUserItem}
                />
              </div>
            </CSSTransition>
          )}
        </Route>
        <Route exact path="/love">
          {({ match }) => (
            <CSSTransition
              in={match !== null}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              <div className="page">
                <PartnershipView
                  getCurrentAuthenticatedUserProcess={
                    getCurrentAuthenticatedUserProcess
                  }
                  getUserItemProcess={getUserItemProcess}
                  getCurrentSessionProcess={getCurrentSessionProcess}
                  getPairedUserProcess={getPairedUserProcess}
                  getPairedUser={getPairedUser}
                  getUserItem={getUserItem}
                />
              </div>
            </CSSTransition>
          )}
        </Route>
        <Route exact path="/matches">
          {({ match }) => (
            <CSSTransition
              in={match !== null}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              <div className="page">
                <MatchesView
                  getCurrentAuthenticatedUserProcess={
                    getCurrentAuthenticatedUserProcess
                  }
                  getUserItemProcess={getUserItemProcess}
                  getCurrentSessionProcess={getCurrentSessionProcess}
                  getPairedUserProcess={getPairedUserProcess}
                />
              </div>
            </CSSTransition>
          )}
        </Route>
        <Route exact path="/movie/:id">
          {({ match }) => (
            <CSSTransition
              in={match !== null}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              <div className="page">
                <MovieView
                  getUserItemProcess={getUserItemProcess}
                  getCurrentSessionProcess={getCurrentSessionProcess}
                  getUserItem={getUserItem}
                  getPairedUserProcess={getPairedUserProcess}
                />
              </div>
            </CSSTransition>
          )}
        </Route>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={10000}
        hideProgressBar
        newestOnTop
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  margin: 0 auto ${`${sizingScale[9]}px`} auto;
  width: ${`${sizingScale[13]}px`};
  display: flex;
  flex-direction: column;
`;
