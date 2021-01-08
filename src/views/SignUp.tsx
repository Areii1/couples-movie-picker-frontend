import { Auth } from "aws-amplify";
import React, { FormEvent } from "react";
import { Status } from "../App";
import { Puff } from "../components/puff/Puff";
import { FormWrapper, Form, InputField, Button, ButtonText } from "./LogIn";

export const SignUp = () => {
  const [
    signupUsernameFieldValue,
    setSignupUsernameFieldValue,
  ] = React.useState<string>("");
  const [
    signupPasswordFieldValue,
    setSignupPasswordFieldValue,
  ] = React.useState<string>("");
  const [signUpProcess, setSignUpProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

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

  return (
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
      {signUpProcess.status === Status.SUCCESS && <h3>User registered</h3>}
      {signUpProcess.status === Status.ERROR && (
        <h3>User could not be registered</h3>
      )}
    </FormWrapper>
  );
};
