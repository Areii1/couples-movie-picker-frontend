import React from "react";
import styled, { css, keyframes } from "styled-components";

type Props = {
  firstName?: string | undefined;
  lastName?: string;
  image?: string;
  isCurrentUser: boolean;
  size: number;
  animate: boolean;
};

const getColor = (firstname: string | undefined) => {
  if (firstname !== undefined) {
    const secondChar = firstname[1];
    if (secondChar < "e") {
      return "aqua";
    } else if (secondChar < "j") {
      return "lightgreen";
    } else if (secondChar < "o") {
      return "gold";
    } else if (secondChar < "y") {
      return "salmon";
    } else if (secondChar < "z") {
      return "gray";
    } else {
      return "lightgray";
    }
  } else {
    return "gray";
  }
};

const getHoverColor = (firstname: string | undefined) => {
  if (firstname !== undefined) {
    const secondChar = firstname[1];
    if (secondChar < "e") {
      return "#91ffff";
    } else if (secondChar < "j") {
      return "#b9e9b9";
    } else if (secondChar < "o") {
      return "#ffe657";
    } else if (secondChar < "y") {
      return "#fda69c;";
    } else if (secondChar < "z") {
      return "#a1a1a1";
    } else {
      return "lightgray";
    }
  } else {
    return "#a1a1a1";
  }
};

export const ProfileBall = (props: Props) => {
  return (
    <Wrapper
      isCurrentUser={props.isCurrentUser}
      firstName={props.firstName}
      size={props.size}
      image={props.image}
      animate={props.animate}
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
  animate: boolean;
};

const lighten = (firstName: string | undefined) => keyframes`
  from {
    background-color: ${getColor(firstName)};
  }
  to {
    background-color: ${getHoverColor(firstName)};
  }
`;

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
  /* color: #afffff; */
  :hover {
    animation: ${(props: WrapperProps) =>
      props.animate
        ? css`
            ${lighten(props.firstName)} 0.3s linear forwards
          `
        : `unset`};
  }
`;

const Text = styled.h5`
  margin: 0;
  font-size: 30px;
  text-decoration: none;
  color: white;
`;

type ImageProps = {
  size: number;
};

const Image = styled.img<ImageProps>`
  width: ${(props: ImageProps) => `${props.size}px`};
  height: ${(props: ImageProps) => `${props.size}px`};
  object-fit: cover;
`;
