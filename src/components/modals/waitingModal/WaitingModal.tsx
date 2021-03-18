import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { bucketUrl } from "../../../config/Config";
import { SecondaryHeadline } from "../../../styles/Styles";
import { sizingScale } from "../../../styles/Variables";
import { UserInfo } from "../../../types/Types";
import { Button, ButtonText } from "../../../views/logIn/LogInStyles";
import { ProfileBall } from "../../profileBall/ProfileBall";
import { Puff } from "../../puff/Puff";
import { ModalBackground, Modal } from "../confirmModal/ConfirmModalStyles";

const ProfileBallWrapper = styled.div`
  margin-top: ${`${sizingScale[4]}px`};
  width: ${`${sizingScale[9]}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: ${`${sizingScale[8]}px`};
`;

const LoadingIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${`${sizingScale[9]}px`};
  height: ${`${sizingScale[9]}px`};
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  pairedUserItem: UserInfo;
  closeModal: () => void;
};

export const WaitingModal = (props: Props) => {
  const [shouldRedirect, setShouldRedirect] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        toast.success(`${props.pairedUserItem.username.S} accepted your challenge`);
        setShouldRedirect(true);
      } else {
        props.closeModal();
        toast.error(`${props.pairedUserItem.username.S} rejected your challenge`);
      }
    }, 5000);
  }, []);
  return (
    <ModalBackground>
      <Modal>
        <SecondaryHeadline>{`Waiting for ${props.pairedUserItem.username.S}'s confirmation`}</SecondaryHeadline>
        <ProfileBallWrapper>
          <LoadingIconWrapper>
            <Puff size={100} fill="white" />
          </LoadingIconWrapper>
          <ProfileBall
            firstName={props.pairedUserItem.username.S}
            image={
              props.pairedUserItem.profilePicture
                ? `${bucketUrl}/${props.pairedUserItem.profilePicture.S}`
                : undefined
            }
            isCurrentUser={false}
            size={128}
            animate={false}
            fontSize={60}
            showText={props.pairedUserItem.profilePicture !== undefined}
            shadow={false}
            border={false}
          />
        </ProfileBallWrapper>
        <Button type="button" onClick={() => {}} title="Cancel deciding process" error={false}>
          <ButtonText>Cancel</ButtonText>
        </Button>
      </Modal>
      {shouldRedirect && <Redirect to="/decide" />}
    </ModalBackground>
  );
};
