import React from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { configureAmplify } from "./config/Config";
import { NavigationBar } from "./components/navigationBar/NavigationBar";
import { getUser } from "./apiService/getUser";
import { getCurrentSession, getCurrentAuthenticatedUser } from "./apiService/getUserInformation";
import { Status, Process, GetCurrentSessionProcess, GetUserItemProcess } from "./types/Types";
import "react-toastify/dist/ReactToastify.css";
import { ContentWrapper } from "./AppStyles";
import { CardAnimatedRoutes } from "./cardAnimatedRoutes/CardAnimatedRoutes";

configureAmplify();

export const GetCurrentSessionProcessContext = React.createContext<GetCurrentSessionProcess>({
  status: Status.INITIAL,
});

export const App: React.FunctionComponent = () => {
  const [
    getCurrentSessionProcess,
    setGetCurrentSessionProcess,
  ] = React.useState<GetCurrentSessionProcess>({
    status: Status.INITIAL,
  });

  const [
    getCurrentAuthenticatedUserProcess,
    setGetCurrentAuthenticatedUserProcess,
  ] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [getPairedUserProcess, setGetPairedUserProcess] = React.useState<GetUserItemProcess>({
    status: Status.INITIAL,
  });

  const [getUserItemProcess, setGetUserItemProcess] = React.useState<GetUserItemProcess>({
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
      toast.error("Could not get partnered user information");
      setGetPairedUserProcess({ status: Status.ERROR, error: getUserError });
    }
  };

  const getUserItem = async (username: string, jwtToken?: string) => {
    try {
      setGetUserItemProcess({ status: Status.LOADING });
      const getUserResponse = await getUser(username, jwtToken);
      console.log(getUserResponse, "getUserResponse");
      setGetUserItemProcess({
        status: Status.SUCCESS,
        data: getUserResponse,
      });
    } catch (getUserError) {
      toast.error("Could not get user information");
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
          getCurrentSessionResponse.getIdToken().getJwtToken(),
        );
      } catch (getCurrentAuthenticatedUserError) {
        toast.error("Could not get user information");
        setGetCurrentAuthenticatedUserProcess({
          status: Status.ERROR,
          error: getCurrentAuthenticatedUserError,
        });
      }
    } catch (getCurrentSessionError) {
      if (getCurrentSessionError !== "No current user") {
        toast.error("Could not initiate session");
      }
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
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
      } else if (getUserItemProcess.data.outgoingRequests) {
        getPairedUser(
          getUserItemProcess.data.outgoingRequests.S,
          getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
      }
    }
  }, [getUserItemProcess.status]);

  const resetState = () => {
    setGetCurrentSessionProcess({ status: Status.INITIAL });
    setGetCurrentAuthenticatedUserProcess({ status: Status.INITIAL });
    setGetPairedUserProcess({ status: Status.INITIAL });
    setGetUserItemProcess({ status: Status.INITIAL });
  };

  // console.log(getUserItemProcess, "getUserItemProcess");
  // console.log(getCurrentSessionProcess, "getCurrentSessionProcess");
  // console.log(getCurrentAuthenticatedUserProcess, "getCurrentAuthenticatedUserProcess");
  // console.log(getPairedUserProcess, "getPairedUserProcess");

  return (
    <ContentWrapper>
      <GetCurrentSessionProcessContext.Provider value={getCurrentSessionProcess}>
        <NavigationBar getUserItemProcess={getUserItemProcess} />
        <div className="container">
          <CardAnimatedRoutes
            getUserItemProcess={getUserItemProcess}
            getUserItem={getUserItem}
            getPairedUserProcess={getPairedUserProcess}
            getUserInfo={getUserInfo}
            resetState={resetState}
            getPairedUser={getPairedUser}
          />
        </div>
      </GetCurrentSessionProcessContext.Provider>
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
