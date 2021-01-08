import React, { FormEvent } from "react";
import styled from "styled-components";
import { configureAmplify } from "./config/Config";
import { ReactComponent as FireIcon } from "./assets/fire.svg";
import { ReactComponent as Heart2Icon } from "./assets/heart-2.svg";
import { ReactComponent as ColdIcon } from "./assets/snowflake.svg";
import { ProfileBall } from "./components/profileBall/ProfileBall";
import { Route, Switch, Link } from "react-router-dom";
import { getTrendingMovies } from "./apiService/getTrendingMovies";
import { Auth } from "aws-amplify";
import { Puff } from "./components/puff/Puff";
import {
  removeProfilePicture,
  uploadProfilePicture,
} from "./apiService/uploadProfilePicture";

configureAmplify();

enum Status {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR,
}

export const App = () => {
  const [fireMeterSwitch, setFireMeterSwitch] = React.useState<any>({
    position: 50,
    locked: false,
  });
  const [
    loginUsernameFieldValue,
    setLoginUsernameFieldValue,
  ] = React.useState<string>("");
  const [
    loginPasswordFieldValue,
    setLoginPasswordFieldValue,
  ] = React.useState<string>("");
  const [
    signupUsernameFieldValue,
    setSignupUsernameFieldValue,
  ] = React.useState<string>("");
  const [
    signupPasswordFieldValue,
    setSignupPasswordFieldValue,
  ] = React.useState<string>("");
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

  const [signInProcess, setSignInProcess] = React.useState<any>({
    status: Status.INITIAL,
  });
  const [signUpProcess, setSignUpProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const [signOutProcess, setSignOutProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const [uploadPictureProcess, setUploadPictureProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const [removePictureProcess, setRemovePictureProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const [selectedFile, setSelectedFile] = React.useState<any>();

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

  const signOut = async () => {
    try {
      setSignOutProcess({ status: Status.LOADING });
      const signOutResponse = await Auth.signOut();
      setSignOutProcess({
        status: Status.SUCCESS,
        data: signOutResponse,
      });
      initiateSession();
    } catch (signOutError) {
      setSignOutProcess({
        status: Status.ERROR,
        error: signOutError,
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

  const loginUser = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSignInProcess({ status: Status.LOADING });
      const loginResponse = await Auth.signIn({
        username: loginUsernameFieldValue,
        password: loginPasswordFieldValue,
      });
      setSignInProcess({ status: Status.SUCCESS, data: loginResponse });
      initiateSession();
    } catch (loginError) {
      setSignInProcess({ status: Status.ERROR, error: loginError });
    }
  };

  const signUserUp = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSignUpProcess({ status: Status.LOADING });
      const signUpResponse = await Auth.signUp({
        username: signupUsernameFieldValue,
        password: signupPasswordFieldValue,
      });
      setSignUpProcess({ status: Status.SUCCESS, data: signUpResponse });
    } catch (signupError) {
      setSignUpProcess({ status: Status.ERROR, error: signupError });
    }
  };

  const uploadPicture = async (file: any) => {
    try {
      setUploadPictureProcess({ status: Status.LOADING });
      const uploadPictureResponse = await uploadProfilePicture(
        file.name,
        file,
        getCurrentAuthenticatedUserProcess.data.username
      );
      console.log(uploadPictureResponse, "uploadPictureResponse");
      setUploadPictureProcess({
        status: Status.SUCCESS,
        data: uploadPictureResponse,
      });
    } catch (uploadPictureError) {
      console.log(uploadPictureError, "error");
      setUploadPictureProcess({
        status: Status.ERROR,
        error: uploadPictureError,
      });
    }
  };

  const removePicture = async () => {
    try {
      setRemovePictureProcess({ status: Status.LOADING });
      const uploadPictureResponse = await removeProfilePicture();
      setRemovePictureProcess({
        status: Status.SUCCESS,
        data: uploadPictureResponse,
      });
    } catch (uploadPictureError) {
      setRemovePictureProcess({
        status: Status.ERROR,
        error: uploadPictureError,
      });
    }
  };

  const selectFile = (event: any) => {
    console.log(event.target.files[0], "files");
    // setSelectedFile(event.target.files[0]);
    uploadPicture(event.target.files[0]);
  };

  React.useEffect(() => {
    initiateSession();
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keyDown", keyDownHandler);
    };
  }, []);

  console.log(getCurrentSessionProcess, "getCurrentSessionProcess");
  console.log(
    getCurrentAuthenticatedUserProcess,
    "getCurrentAuthenticatedUserProcess"
  );
  // console.log(signInProcess, "signInProcess");
  // console.log(signUpProcess, "signUpProcess");
  return (
    <ContentWrapper className="App">
      <NavigationBar>
        <NavigationBarItem>
          <Link to="/user/aaa">
            <ProfileBall
              firstName={
                getCurrentAuthenticatedUserProcess.status === Status.SUCCESS
                  ? getCurrentAuthenticatedUserProcess.data.username
                  : undefined
              }
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
            {getTrendingMoviesProcess.status === Status.SUCCESS && (
              <ImageSection>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${getTrendingMoviesProcess.data.results[0].backdrop_path}`}
                  alt={getTrendingMoviesProcess.data.results[0].original_title}
                />
                <Title>
                  {getTrendingMoviesProcess.data.results[0].original_title}
                </Title>
              </ImageSection>
            )}
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
            {getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
              <>
                <div>
                  <h3>Profile picture</h3>
                  <AvatarSection>
                    <ProfileBall
                      firstName={
                        getCurrentAuthenticatedUserProcess.data.username
                      }
                      image={undefined}
                      isCurrentUser={false}
                      size={50}
                    />
                    <InputWrapper>
                      <FileInput
                        type="file"
                        onChange={(event) => selectFile(event)}
                      />
                      <Button type="button" title="upload">
                        <ButtonText>Upload</ButtonText>
                      </Button>
                    </InputWrapper>
                    <Button
                      type="button"
                      onClick={removePicture}
                      title="remove"
                    >
                      <ButtonText>Remove</ButtonText>
                    </Button>
                  </AvatarSection>
                </div>
                <div>
                  {signOutProcess.status === Status.INITIAL && (
                    <Button type="button" onClick={signOut} title="log out">
                      <ButtonText>Log out</ButtonText>
                    </Button>
                  )}
                  {signOutProcess.status === Status.LOADING && (
                    <Puff size={50} fill="lightblue" />
                  )}
                </div>
              </>
            )}
            {(getCurrentSessionProcess.status === Status.ERROR ||
              getCurrentAuthenticatedUserProcess.status === Status.ERROR) && (
              <>
                <FormWrapper>
                  {signInProcess.status === Status.INITIAL && (
                    <>
                      <h1>Log in</h1>
                      <Form onSubmit={loginUser}>
                        <InputField
                          type="text"
                          value={loginUsernameFieldValue}
                          onChange={(event) =>
                            setLoginUsernameFieldValue(event.target.value)
                          }
                          placeholder="username"
                        />
                        <InputField
                          type="password"
                          value={loginPasswordFieldValue}
                          onChange={(event) =>
                            setLoginPasswordFieldValue(event.target.value)
                          }
                          placeholder="password"
                        />
                        <Button type="submit" title="login">
                          <ButtonText>Log in</ButtonText>
                        </Button>
                      </Form>
                    </>
                  )}
                  {signInProcess.status === Status.LOADING && (
                    <Puff size={50} fill="lightblue" />
                  )}
                  {signInProcess.status === Status.SUCCESS && (
                    <h3>user signed in</h3>
                  )}
                  {signInProcess.status === Status.ERROR && (
                    <h3>could not sign in</h3>
                  )}
                </FormWrapper>
                <FormWrapper>
                  {signUpProcess.status === Status.INITIAL && (
                    <>
                      <h1>Sign up</h1>
                      <Form onSubmit={(event) => signUserUp(event)}>
                        <InputField
                          type="text"
                          value={signupUsernameFieldValue}
                          onChange={(event) =>
                            setSignupUsernameFieldValue(event.target.value)
                          }
                          placeholder="username"
                        />
                        <InputField
                          type="password"
                          value={signupPasswordFieldValue}
                          onChange={(event) =>
                            setSignupPasswordFieldValue(event.target.value)
                          }
                          placeholder="password"
                        />
                        <Button type="submit" title="sign up">
                          <ButtonText>sign up</ButtonText>
                        </Button>
                      </Form>
                    </>
                  )}
                  {signUpProcess.status === Status.LOADING && (
                    <Puff size={50} fill="lightblue" />
                  )}
                  {signUpProcess.status === Status.SUCCESS && (
                    <h3>User registered</h3>
                  )}
                  {signUpProcess.status === Status.ERROR && (
                    <h3>User could not be registered</h3>
                  )}
                </FormWrapper>
              </>
            )}
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

const AvatarSection = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  margin: auto;
  width: 500px;
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
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ImageSection = styled.div`
  width: 500px;
`;

const Title = styled.h3`
  font-size: 40px;
  color: #808080;
  word-wrap: break-word;
  width: 500px;
  margin: 20px 0 0 0;
`;

const FormWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputField = styled.input`
  width: 200px;
  border: none;
  border-bottom: 1px solid black;
  margin: 10px 0;
`;

const Button = styled.button`
  width: 100px;
  height: 30px;
`;

const InputWrapper = styled.div`
  width: 100px;
  height: 30px;
  position: relative;
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 30px;
  cursor: pointer;
`;

const ButtonText = styled.h5`
  margin: 0;
`;
