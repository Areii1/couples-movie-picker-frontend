import React, { FormEvent } from "react";
import styled, { keyframes } from "styled-components";
import { Puff } from "../components/puff/Puff";
import { Status } from "../App";
import { Auth } from "aws-amplify";
import { Link, Redirect } from "react-router-dom";

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
        alert('user logged in');
        setSignInProcess({ status: Status.SUCCESS, data: loginResponse });
        props.initiateSession();
      } catch (loginError) {
        alert('could not login');
        setSignInProcess({ status: Status.ERROR, error: loginError });
      }
    } else {
      alert('username or password missing');
    }
  };

  return (
    <Wrapper>
      <HeadlineWrapper>
        <LogInPrimaryHeadline>Log in</LogInPrimaryHeadline>
        <Text>
          or{" "}
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
                title={signInProcess.status === Status.ERROR ? 'try again' : 'login'}
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
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  margin-top: 50px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const FormWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputField = styled.input`
  width: 250px;
  border: none;
  border-bottom: 1px solid black;
  margin: 10px 0;
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
  width: 100px;
  height: 30px;
  margin-top: 20px;
  border: none;
  background-color: ${(props: ButtonProps) =>
    props.error ? "salmon" : "gray"};
  border-radius: 5px;
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
`;

export const Text = styled.h5`
  font-size: 12px;
  font-weight: 400;
  color: black;
  margin: 0;
`;

export const LogInPrimaryHeadline = styled.h3`
  font-size: 28px;
  margin: 0;
  font-weight: 400;
  vertical-align: text-bottom;
`;
