import React from "react";
import styled from "styled-components";

type Props = {
  firstName?: string | undefined;
  lastName?: string;
  image?: string;
  isCurrentUser: boolean;
  size: number;
};

const getColor = (firstname: string | undefined) => {
  if (firstname !== undefined) {
    const secondChar = firstname[1];
    if (secondChar < "e") {
      return "lightblue";
    } else if (secondChar < "j") {
      return "lightgreen";
    } else if (secondChar < "o") {
      return "gold";
    } else if (secondChar < "y") {
      return "salmon";
    } else if (secondChar < "z") {
      return "lightgray";
    } else {
      return "gray";
    }
  } else {
    return "lightgray";
  }
};

export const ProfileBall = (props: Props) => {
  return (
    <Wrapper
      isCurrentUser={props.isCurrentUser}
      firstName={props.firstName}
      size={props.size}
      image={props.image}
    >
      {props.image === undefined && (
        <>
          {props.firstName && <Text>{props.firstName[0].toUpperCase()}</Text>}
          {!props.firstName && <Text>?</Text>}
        </>
      )}
      {props.image !== undefined && (
        <Image src={props.image} size={props.size} />
      )}
    </Wrapper>
  );
};

type WrapperProps = {
  isCurrentUser: boolean;
  firstName: string | undefined;
  size: number;
  image: string | undefined;
};

const Wrapper = styled.div`
  width: ${(props: WrapperProps) => `${props.size}px`};
  height: ${(props: WrapperProps) => `${props.size}px`};
  border-radius: ${(props: WrapperProps) => `${props.size}px`};
  border: ${(props: WrapperProps) =>
    props.isCurrentUser ? "1px solid orange" : "1px solid transparent"};
  background-color: ${(props: WrapperProps) =>
    props.image ? "transparent" : getColor(props.firstName)};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Text = styled.h5`
  margin: 0;
  font-size: 18px;
  text-decoration: none;
`;

type ImageProps = {
  size: number;
};

const Image = styled.img<ImageProps>`
  width: ${(props: ImageProps) => `${props.size}px`};
  height: ${(props: ImageProps) => `${props.size}px`};
  object-fit: cover;
`;
