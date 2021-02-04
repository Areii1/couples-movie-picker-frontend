import React from "react";
import { Wrapper, Text, Image } from "./ProfileBallStyles";

type Props = {
  firstName?: string | undefined;
  lastName?: string;
  image?: string;
  isCurrentUser: boolean;
  size: number;
  animate: boolean;
  fontSize?: number;
  showText: boolean;
  shadow: boolean;
  border: boolean;
};

export const ProfileBall = (props: Props) => {
  return (
    <Wrapper
      isCurrentUser={props.isCurrentUser}
      firstName={props.firstName}
      size={props.size}
      image={props.image}
      animate={props.animate}
      shadow={props.shadow}
      border={props.border}
    >
      {props.image === undefined && props.showText && (
        <Text fontSize={props.fontSize}>
          {props.firstName ? props.firstName[0].toUpperCase() : "?"}
        </Text>
      )}
      {props.image !== undefined && <Image src={props.image} size={props.size} />}
    </Wrapper>
  );
};

ProfileBall.defaultProps = {
  firstName: "a",
};
