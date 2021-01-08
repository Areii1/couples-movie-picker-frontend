import React, { FormEvent } from "react";
import styled from "styled-components";
import { Puff } from "../components/puff/Puff";
import { Status } from "../App";
import { Auth } from "aws-amplify";

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
      {signInProcess.status === Status.SUCCESS && <h3>user signed in</h3>}
      {signInProcess.status === Status.ERROR && <h3>could not sign in</h3>}
    </FormWrapper>
  );
};

export const FormWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputField = styled.input`
  width: 200px;
  border: none;
  border-bottom: 1px solid black;
  margin: 10px 0;
`;

export const Button = styled.button`
  width: 100px;
  height: 30px;
`;

export const ButtonText = styled.h5`
  margin: 0;
`;