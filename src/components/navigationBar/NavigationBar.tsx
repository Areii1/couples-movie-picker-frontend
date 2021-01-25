import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HeartIcon } from "../icons/HeartIcon";
import { FireIcon } from "../icons/FireIcon";
import { GetUserItemProcess, Process, Status } from "../../App";
import { ProfileBall } from "../profileBall/ProfileBall";
import { AnimateType } from '../icons/HeartIcon';
import { bucketUrl } from '../../config/Config';
import { borderRadius, shadowColor, sizingScale } from '../../styles/Variables';

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
            <FireIcon size={sizingScale[6]} score={0} />
          </IconWrapper>
        </Link>
      </ListItem>
      <ListItem>
        <Link to="/user" title={firstName}>
          <ProfileBall
            firstName={firstName}
            image={
              (props.getUserItemProcess.status === Status.SUCCESS && props.getUserItemProcess.data.profilePicture)
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
            <HeartIcon size={sizingScale[6]} animate={AnimateType.COLOR} isRed/>
          </IconWrapper>
        </Link>
      </ListItem>
    </List>
  );
};

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  background-color: white;
  display: flex;
  border-radius: ${`${borderRadius}px`};
  margin-top: ${`${sizingScale[3]}px`};
  box-shadow: 10px 5px 5px ${shadowColor};
`;

const ListItem = styled.li`
  width: ${`${sizingScale[8]}px`};
  height: ${`${sizingScale[8]}px`};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
`;
