import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon, AnimateType } from "../icons/heartIcon/HeartIcon";
import { FireIcon } from "../icons/fireIcon/FireIcon";
import { GetUserItemProcess, Status } from "../../types/Types";
import { GetCurrentSessionProcessContext } from "../../App";
import { ProfileBall } from "../profileBall/ProfileBall";
import { bucketUrl } from "../../config/Config";
import { sizingScale } from "../../styles/Variables";
import { List, ListItem, IconWrapper, Wrapper } from "./NavigationBarStyles";

type Props = {
  getUserItemProcess: GetUserItemProcess;
};

export const NavigationBar = (props: Props) => {
  const firstName =
    props.getUserItemProcess.status === Status.SUCCESS
      ? props.getUserItemProcess.data.username.S
      : undefined;
  console.log(firstName, "firstName");
  const getCurrentSessionProcess = React.useContext(GetCurrentSessionProcessContext);
  return (
    <>
      {getCurrentSessionProcess.status !== Status.ERROR && (
        <Wrapper>
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
        </Wrapper>
      )}
      {getCurrentSessionProcess.status === Status.ERROR && (
        <Wrapper>
          <List>
            <ListItem>
              <Link to="login" title="log in">
                Log in
              </Link>
            </ListItem>
            <ListItem>
              <Link to="signup" title="register">
                Register
              </Link>
            </ListItem>
          </List>
        </Wrapper>
      )}
    </>
  );
};
