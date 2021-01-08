import React, { FormEvent } from "react";
import styled, { keyframes } from "styled-components";
import { Puff } from "../components/puff/Puff";
import { Status } from "../App";
import { Auth } from "aws-amplify";
import { PrimaryHeadline } from "../App";
import { Link } from "react-router-dom";

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
    try {
      setSignInProcess({ status: Status.LOADING });
      const loginResponse = await Auth.signIn({
        username: loginUsernameFieldValue,
        password: loginPasswordFieldValue,
      });
      setSignInProcess({ status: Status.SUCCESS, data: loginResponse });
      props.initiateSession();
    } catch (loginError) {
      setSignInProcess({ status: Status.ERROR, error: loginError });
    }
  };

  return (
    <Wrapper>
      <HeadlineWrapper>
        <LogInPrimaryHeadline>Log in</LogInPrimaryHeadline>
        <Text>or <Link to="signup">sign up</Link></Text>
      </HeadlineWrapper>
      <FormWrapper>
        {signInProcess.status === Status.INITIAL && (
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
              <Button type="submit" title="login">
                <ButtonText>Log in</ButtonText>
              </Button>
            </Form>
          </ContentWrapper>
        )}
        {signInProcess.status === Status.LOADING && (
          <Puff size={50} fill="lightblue" />
        )}
        {signInProcess.status === Status.SUCCESS && <h3>user signed in</h3>}
        {signInProcess.status === Status.ERROR && <h3>could not sign in</h3>}
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
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
    background-color: lightgray;
  }
`;

export const Button = styled.button`
  width: 100px;
  height: 30px;
  margin-top: 20px;
  border: none;
  background-color: gray;
  border-radius: 5px;
  cursor: pointer;
  :hover {
    animation: ${darken} 0.3s linear forwards;
  }
`;

export const ButtonText = styled.h5`
  margin: 0;
  color: white;
`;

const HeadlineWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  `;

const Text = styled.h5`
  font-size: 12px;
  font-weight: 400;
  color: black;
  margin: 0;
  `;

const LogInPrimaryHeadline = styled.h3`
  font-size: 28px;
  margin: 0;
  font-weight: 400;
  vertical-align: text-bottom;
`;