import React, { FormEvent } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import { Puff } from "../../components/puff/Puff";
import { Status } from "../../App";
import { Auth } from "aws-amplify";
import { Link, Redirect } from "react-router-dom";
import { PrimaryHeadline } from "../../styles/Styles";
import { borderRadius, fontSizes, sizingScale } from "../../styles/Variables";

type Props = {
  initiateSession: () => void;
};

export const LogIn = (props: Props) => {
  const [signInProcess, setSignInProcess] = React.useState<any>({
    status: Status.INITIAL,
  });
  const [
    loginUsernameFieldValue,
    setLoginUsernameFieldValue,
  ] = React.useState<string>("");
  const [
    loginPasswordFieldValue,
    setLoginPasswordFieldValue,
  ] = React.useState<string>("");

  const loginUser = async (event: FormEvent) => {
    event.preventDefault();
    if (loginUsernameFieldValue !== "" && loginPasswordFieldValue !== "") {
      try {
        setSignInProcess({ status: Status.LOADING });
        const loginResponse = await Auth.signIn({
          username: loginUsernameFieldValue,
          password: loginPasswordFieldValue,
        });
        setSignInProcess({ status: Status.SUCCESS, data: loginResponse });
        props.initiateSession();
      } catch (loginError) {
        toast.error("Could not login");
        setSignInProcess({ status: Status.ERROR, error: loginError });
      }
    } else {
      toast.info("Username or password missing");
    }
  };

  return (
    <LoginCardContentWrapper>
      <HeadlineWrapper>
        <LogInPrimaryHeadline>Log in</LogInPrimaryHeadline>
        <Text>
          or
          <Link to="signup" title="sign up">
            sign up
          </Link>
        </Text>
      </HeadlineWrapper>
      <FormWrapper>
        <ContentWrapper>
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
            {signInProcess.status !== Status.LOADING && (
              <Button
                type="submit"
                title={
                  signInProcess.status === Status.ERROR ? "try again" : "login"
                }
                error={signInProcess.status === Status.ERROR}
              >
                <ButtonText>
                  {signInProcess.status === Status.ERROR
                    ? "Try again"
                    : "Log in"}
                </ButtonText>
              </Button>
            )}
            {signInProcess.status === Status.LOADING && (
              <Puff size={50} fill="lightblue" />
            )}
          </Form>
        </ContentWrapper>
        {signInProcess.status === Status.SUCCESS && <Redirect to="/user" />}
      </FormWrapper>
    </LoginCardContentWrapper>
  );
};

export const CardContentWrapper = styled.div`
  width: ${`${sizingScale[13] - sizingScale[6] * 2}px`};
`;

const LoginCardContentWrapper = styled(CardContentWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const FormWrapper = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
  display: flex;
  flex-direction: column;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputField = styled.input`
  width: ${`${sizingScale[11]}px`};
  border: none;
  border-bottom: 1px solid black;
  margin: ${`${sizingScale[2]}px`} 0;
`;

export const darken = keyframes`
  from {
    background-color: gray;
  }
  to {
    background-color: #a1a1a1;
  }
`;

export const darkenTryAgain = keyframes`
  from {
    background-color: salmon;
  }
  to {
    background-color: #fda69c;
  }
`;

type ButtonProps = {
  error: boolean;
};

export const Button = styled.button`
  width: ${`${sizingScale[8]}px`};
  height: ${`${sizingScale[5]}px`};
  margin-top: ${`${sizingScale[3]}px`};
  border: none;
  background-color: ${(props: ButtonProps) =>
    props.error ? "salmon" : "gray"};
  border-radius: ${`${borderRadius}px`};
  cursor: pointer;
  :hover {
    animation: ${(props: ButtonProps) =>
        props.error ? darkenTryAgain : darken}
      0.3s linear forwards;
  }
`;

export const ButtonText = styled.h5`
  margin: 0;
  color: white;
`;

export const HeadlineWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${`${sizingScale[11]}px`};
`;

export const Text = styled.h5`
  font-size: ${`${fontSizes[0]}px`};
  font-weight: 400;
  color: black;
  margin: 0;
`;

const LogInPrimaryHeadline = styled(PrimaryHeadline)`
  vertical-align: text-bottom;
`;
