import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon, AnimateType } from "../icons/HeartIcon";
import { FireIcon } from "../icons/FireIcon";
import { GetUserItemProcess, Process, Status } from "../../App";
import { ProfileBall } from "../profileBall/ProfileBall";
import { bucketUrl } from "../../config/Config";
import { sizingScale } from "../../styles/Variables";
import { List, ListItem, IconWrapper } from "./NavigationBarStyles";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getUserItemProcess: GetUserItemProcess;
};

export const NavigationBar = (props: Props) => {
  const firstName =
    props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.status === Status.SUCCESS
      ? props.getCurrentAuthenticatedUserProcess.data.username
      : undefined;
  return (
    <List>
      <ListItem>
        <Link to="/" title="like">
          <IconWrapper>
            <FireIcon size={sizingScale[6]} score={100} animate isGray={false} />
          </IconWrapper>
        </Link>
      </ListItem>
      <ListItem>
        <Link to="/user" title={firstName}>
          <ProfileBall
            firstName={firstName}
            image={
              props.getUserItemProcess.status === Status.SUCCESS &&
              props.getUserItemProcess.data.profilePicture
                ? `${bucketUrl}/${props.getUserItemProcess.data.profilePicture.S}`
                : undefined
            }
            isCurrentUser={false}
            size={sizingScale[6]}
            animate
            showText
            shadow={false}
            border={false}
          />
        </Link>
      </ListItem>
      <ListItem>
        <Link to="/love" title="matches">
          <IconWrapper>
            <HeartIcon size={sizingScale[6]} animate={AnimateType.COLOR} isRed />
          </IconWrapper>
        </Link>
      </ListItem>
    </List>
  );
};
