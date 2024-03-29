import React from "react";
import { Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { MainView } from "../views/mainView/MainView";
import { LogIn } from "../views/logIn/LogIn";
import { SignUp } from "../views/signUp/SignUp";
import { AccountSettingsView } from "../views/accountSettingsView/AccountSettingsView";
import { PartnershipView } from "../views/partnershipView/PartnershipView";
import { MovieListUseCase, MovieListView } from "../views/movieListView/MovieListView";
import { MovieView } from "../views/movieView/MovieView";
import { GetUserItemProcess } from "../types/Types";
import { DecideView } from "../views/decideView/DecideView";

type Props = {
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken?: string) => void;
  getPairedUserProcess: GetUserItemProcess;
  getPairedUser: (username: string, jwtToken?: string) => void;
  getUserInfo: () => void;
  resetState: () => void;
  updateInitialized: (initialized: boolean) => void;
  initialized: boolean;
};

export const CardAnimatedRoutes = (props: Props) => {
  return (
    <>
      <Route exact path="/">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={1000} classNames="page" unmountOnExit>
            <div className="page">
              <MainView
                getUserItemProcess={props.getUserItemProcess}
                getUserItem={props.getUserItem}
                getPairedUserProcess={props.getPairedUserProcess}
                updateInitialized={props.updateInitialized}
                initialized={props.initialized}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/login">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <LogIn initiateSession={props.getUserInfo} />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/signup">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <SignUp />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/user">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <AccountSettingsView
                initiateSession={props.getUserInfo}
                getUserItemProcess={props.getUserItemProcess}
                getUserItem={props.getUserItem}
                resetState={props.resetState}
                updateInitialized={props.updateInitialized}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/love">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <PartnershipView
                getUserItemProcess={props.getUserItemProcess}
                getPairedUserProcess={props.getPairedUserProcess}
                getPairedUser={props.getPairedUser}
                getUserItem={props.getUserItem}
                updateInitialized={props.updateInitialized}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/matches">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <MovieListView
                getUserItemProcess={props.getUserItemProcess}
                getPairedUserProcess={props.getPairedUserProcess}
                useCase={MovieListUseCase.MATCHES}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/likes">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <MovieListView
                getUserItemProcess={props.getUserItemProcess}
                getPairedUserProcess={props.getPairedUserProcess}
                useCase={MovieListUseCase.LIKES}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/dislikes">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <MovieListView
                getUserItemProcess={props.getUserItemProcess}
                getPairedUserProcess={props.getPairedUserProcess}
                useCase={MovieListUseCase.DISLIKES}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/decide/:id">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <DecideView
                getPairedUserProcess={props.getPairedUserProcess}
                getUserItemProcess={props.getUserItemProcess}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route exact path="/movie/:id">
        {({ match }) => (
          <CSSTransition in={match !== null} timeout={300} classNames="page" unmountOnExit>
            <div className="page">
              <MovieView
                getUserItemProcess={props.getUserItemProcess}
                getUserItem={props.getUserItem}
                getPairedUserProcess={props.getPairedUserProcess}
              />
            </div>
          </CSSTransition>
        )}
      </Route>
    </>
  );
};
