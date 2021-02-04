import styled, { keyframes } from "styled-components";
import { PrimaryHeadline } from "../../styles/Styles";
import { borderRadius, fontSizes, sizingScale } from "../../styles/Variables";

export const CardContentWrapper = styled.div`
  width: ${`${sizingScale[13] - sizingScale[6] * 2}px`};
`;

export const LoginCardContentWrapper = styled(CardContentWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentWrapper = styled.div`
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
  background-color: ${(props: ButtonProps) => (props.error ? "salmon" : "gray")};
  border-radius: ${`${borderRadius}px`};
  cursor: pointer;
  :hover {
    animation: ${(props: ButtonProps) => (props.error ? darkenTryAgain : darken)} 0.3s linear
      forwards;
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

export const LogInPrimaryHeadline = styled(PrimaryHeadline)`
  vertical-align: text-bottom;
`;
