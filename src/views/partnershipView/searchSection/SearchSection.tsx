import React, { FormEvent } from "react";
import styled from "styled-components";
import { GetCurrentSessionProcess, GetUserItemProcess, Process, SecondaryHeadline, Status } from "../../../App";
import { SearchIcon } from "../../../components/icons/SearchIcon";
import { Form, InputField } from "../../logIn/LogIn";
import { getUser } from "../../../apiService/getUser";
import { pairWithUser } from "../../../apiService/pairWithUser";
import { Puff } from "../../../components/puff/Puff";
import { TransparentButton } from "../../accountSettings/AccountSettings";
import {
  FoundUserWrapper,
  MatchSectionWrapper,
  ProfileWrapper,
  ProfileText,
  ButtonsWrapper
} from "../PartnershipView";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { AnimateType, HeartIcon } from "../../../components/icons/HeartIcon";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
};

export const SearchSection = (props: Props) => {
  const [searchProcess, setSearchProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const [searchFieldValue, setSearchFieldValue] = React.useState<string>("");

  const [pairingProcess, setPairingProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const searchUser = async (event: FormEvent) => {
    event.preventDefault();
    if (
      props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      searchFieldValue.length > 0
    ) {
      try {
        setSearchProcess({ status: Status.LOADING });
        const searchForUserResponse = await getUser(
          searchFieldValue,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        setSearchProcess({
          status: Status.SUCCESS,
          data: searchForUserResponse,
        });
        setSearchFieldValue("");
      } catch (searchForUserError) {
        setSearchFieldValue("");
        setSearchProcess({ status: Status.ERROR, error: searchForUserError });
        alert(`did not find user "${searchFieldValue}"`);
      }
    } else {
      alert("form not complete");
    }
  };

  const pairWith = async () => {
    if (
      searchProcess.status === Status.SUCCESS &&
      props.getCurrentSessionProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.status === Status.SUCCESS
    ) {
      try {
        setSearchProcess({ status: Status.INITIAL });
        setPairingProcess({ status: Status.LOADING });
        const pairWithUserResponse = await pairWithUser(
          searchProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        setPairingProcess({
          status: Status.SUCCESS,
          data: pairWithUserResponse,
        });
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
      } catch (pairWithUserError) {
        setPairingProcess({ status: Status.ERROR, error: pairWithUserError });
      }
    }
  };
  return (
    <MatchSectionWrapper>
      <SecondaryHeadline>Search</SecondaryHeadline>
      <FormWrapper>
        <Form onSubmit={searchUser}>
          <InputFieldWrapper>
            <InputField
              type="text"
              value={searchFieldValue}
              onChange={(event) => setSearchFieldValue(event.target.value)}
              placeholder="search for a partner"
            />
            <SearchIconButton title="search" onClick={searchUser}>
              <SearchIcon size={20} animate />
            </SearchIconButton>
          </InputFieldWrapper>
        </Form>
      </FormWrapper>
      {searchProcess.status === Status.LOADING && (
        <Puff size={50} fill="lightblue" />
      )}
      {searchProcess.status === Status.SUCCESS && (
        <FoundUserWrapper>
          <ProfileWrapper>
            <ProfileBall
              firstName={searchProcess.data.username.S}
              image={
                searchProcess.data.profilePicture
                  ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-2miadmkpd2b7.s3.eu-central-1.amazonaws.com/${searchProcess.data.profilePicture.S}`
                  : undefined
              }
              isCurrentUser={false}
              size={40}
              animate={false}
              fontSize={25}
              showText
              shadow={false}
              border={false}
            />
            <ProfileText isPartnered={searchProcess.data.partner}>
              {searchProcess.data.partner
                ? `${searchProcess.data.username.S} is already partnered with ${searchProcess.data.partner.S}`
                : searchProcess.data.username.S}
            </ProfileText>
          </ProfileWrapper>
          {!searchProcess.data.partner && (
            <ButtonsWrapper>
              {pairingProcess.status === Status.INITIAL && (
                <TransparentButton
                  onClick={() => pairWith()}
                  title={`pair with ${searchProcess.data.username.S}`}
                >
                  <HeartIcon
                    size={30}
                    animate={AnimateType.COLOR}
                    isRed={false}
                  />
                </TransparentButton>
              )}
              {pairingProcess.status === Status.LOADING && (
                <Puff size={20} fill="lightblue" />
              )}
              {pairingProcess.status === Status.SUCCESS && <div />}
            </ButtonsWrapper>
          )}
        </FoundUserWrapper>
      )}
    </MatchSectionWrapper>
  );
};

const FormWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const InputFieldWrapper = styled.div`
  position: relative;
  width: 250px;
`;

const SearchIconButton = styled(TransparentButton)`
  position: absolute;
  top: 0;
  right: 0;
`;
