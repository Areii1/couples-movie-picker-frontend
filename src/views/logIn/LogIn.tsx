import React, { FormEvent } from "react";
import { toast } from "react-toastify";
import { Auth } from "aws-amplify";
import { Link, Redirect } from "react-router-dom";
import { Puff } from "../../components/puff/Puff";
import { Status } from "../../types/Types";
import {
  LoginCardContentWrapper,
  ContentWrapper,
  FormWrapper,
  Form,
  InputField,
  Button,
  ButtonText,
  HeadlineWrapper,
  Text,
  LogInPrimaryHeadline,
} from "./LogInStyles";

type Props = {
  initiateSession: () => void;
};

export const LogIn = (props: Props) => {
  const [signInProcess, setSignInProcess] = React.useState<any>({
    status: Status.INITIAL,
  });
  const [loginUsernameFieldValue, setLoginUsernameFieldValue] = React.useState<string>("");
  const [loginPasswordFieldValue, setLoginPasswordFieldValue] = React.useState<string>("");

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
              onChange={(event) => setLoginUsernameFieldValue(event.target.value)}
              placeholder="username"
            />
            <InputField
              type="password"
              value={loginPasswordFieldValue}
              onChange={(event) => setLoginPasswordFieldValue(event.target.value)}
              placeholder="password"
            />
            {signInProcess.status !== Status.LOADING && (
              <Button
                type="submit"
                title={signInProcess.status === Status.ERROR ? "try again" : "login"}
                error={signInProcess.status === Status.ERROR}
              >
                <ButtonText>
                  {signInProcess.status === Status.ERROR ? "Try again" : "Log in"}
                </ButtonText>
              </Button>
            )}
            {signInProcess.status === Status.LOADING && <Puff size={50} fill="lightblue" />}
          </Form>
        </ContentWrapper>
        {signInProcess.status === Status.SUCCESS && <Redirect to="/user" />}
      </FormWrapper>
    </LoginCardContentWrapper>
  );
};
