import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HeartIcon } from "../icons/HeartIcon";
import { FireIcon } from '../icons/FireIcon';
import { Process, Status } from "../../App";
import { ProfileBall } from "../profileBall/ProfileBall";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
};

export const NavigationBar = (props: Props) => {
  const firstName =
    props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS
      ? props.getCurrentAuthenticatedUserProcess.data.username
      : undefined;
  return (
    <List>
      <ListItem>
        <Link to="/" title="like">
          <IconWrapper>
            <FireIcon size={50} />
          </IconWrapper>
        </Link>
      </ListItem>
      <ListItem>
        <Link to="/user" title="user">
          <ProfileBall
            firstName={firstName}
            image={undefined}
            isCurrentUser={false}
            size={50}
          />
        </Link>
      </ListItem>
      <ListItem>
        <Link to="/love" title="matches">
          <IconWrapper>
            <HeartIcon size={50} />
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
  border-radius: 10px;
  margin-top: 20px;
`;

const ListItem = styled.li`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
`;
