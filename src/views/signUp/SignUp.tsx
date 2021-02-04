import { Auth } from "aws-amplify";
import styled from "styled-components";
import { toast } from "react-toastify";
import React, { FormEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import { Status } from "../../App";
import { Puff } from "../../components/puff/Puff";
import {
  FormWrapper,
  Form,
  InputField,
  Button,
  ButtonText,
  HeadlineWrapper,
  Text,
  CardContentWrapper,
} from "../logIn/LogIn";
import { PrimaryHeadline } from "../../styles/Styles";

export const SignUp: React.FC = () => {
  const [
    signupUsernameFieldValue,
    setSignupUsernameFieldValue,
  ] = React.useState<string>("");
  const [
    signupPasswordFieldValue,
    setSignupPasswordFieldValue,
  ] = React.useState<string>("");
  const [
    signupConfirmPasswordFieldValue,
    setSignupConfirmPasswordFieldValue,
  ] = React.useState<string>("");
  const [signUpProcess, setSignUpProcess] = React.useState<any>({
    status: Status.INITIAL,
  });

  const signUserUp = async (event: FormEvent) => {
    event.preventDefault();
    if (
      signupUsernameFieldValue !== "" &&
      signupPasswordFieldValue !== ""
    ) {
      if (signupPasswordFieldValue === signupConfirmPasswordFieldValue) {
        try {
          setSignUpProcess({ status: Status.LOADING });
          const signUpResponse = await Auth.signUp({
            username: signupUsernameFieldValue,
            password: signupPasswordFieldValue,
          });
          setSignUpProcess({ status: Status.SUCCESS, data: signUpResponse });
        } catch (signupError) {
          setSignUpProcess({ status: Status.ERROR, error: signupError });
          toast.error("Could not register user");
        }
      } else {
        toast.info("Passwords don't match");
      }
    } else {
      toast.info("Required fields missing");
    }
  };

  return (
    <SignupCardContentWrapper>
      <HeadlineWrapper>
        <PrimaryHeadline>Sign up</PrimaryHeadline>
        <Text>
          {"or "}
          <Link to="login" title="log in">
            log in
          </Link>
        </Text>
      </HeadlineWrapper>
      <FormWrapper>
        <>
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
            <InputField
              type="password"
              value={signupConfirmPasswordFieldValue}
              onChange={(event) =>
                setSignupConfirmPasswordFieldValue(event.target.value)
              }
              placeholder="confirm password"
            />
            {signUpProcess.status !== Status.LOADING && (
              <Button
                type="submit"
                title="sign up"
                error={signUpProcess.status === Status.ERROR}
              >
                <ButtonText>
                  {signUpProcess.status === Status.ERROR
                    ? "Try again"
                    : "Sign up"}
                </ButtonText>
              </Button>
            )}
            {signUpProcess.status === Status.LOADING && (
              <Puff size={50} fill="lightblue" />
            )}
          </Form>
        </>
        {signUpProcess.status === Status.SUCCESS && <Redirect to="/login" />}
      </FormWrapper>
    </SignupCardContentWrapper>
  );
};

const SignupCardContentWrapper = styled(CardContentWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
