import React, { FormEvent } from "react";
import styled from "styled-components";
import { LogInPrimaryHeadline } from "./LogIn";
import { Process, Status, SecondaryHeadline } from "../App";
import { ProfileBall } from "../components/profileBall/ProfileBall";
import { HeartIcon } from "../components/icons/HeartIcon";
import { Form, InputField } from "./LogIn";
import { Puff } from "../components/puff/Puff";
import { getUser } from "../apiService/getUser";
import { TransparentButton, Mark } from "./AccountSettings";
import { pairWithUser } from "../apiService/pairWithUser";
import { SearchIcon } from "../components/icons/SearchIcon";
import { PendingIcon } from "../components/icons/PendingIcon";
import { cancelPairingRequest } from "../apiService/cancelPairingRequest";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: Process;
  getUserItemProcess: Process;
  getPairedUserProcess: Process;
};

export const MatchesView = (props: Props) => {
  const [searchProcess, setSearchProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });
  const [searchFieldValue, setSearchFieldValue] = React.useState<string>("");

  const [pairingProcess, setPairingProcess] = React.useState<Process>({
    status: Status.INITIAL,
  });

  const [
    cancelPairingRequestProcess,
    setCancelPairingRequestProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

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
        console.log(searchForUserResponse, "searchForUserResponse");
        setSearchProcess({
          status: Status.SUCCESS,
          data: searchForUserResponse,
        });
        setSearchFieldValue("");
      } catch (searchForUserError) {
        setSearchFieldValue("");
        console.log(searchForUserError, "searchForUserError");
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
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      try {
        setPairingProcess({ status: Status.LOADING });
        const pairWithUserResponse = await pairWithUser(
          searchProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        setPairingProcess({
          status: Status.SUCCESS,
          data: pairWithUserResponse,
        });
      } catch (pairWithUserError) {
        setPairingProcess({ status: Status.ERROR, error: pairWithUserError });
      }
    }
  };

  const cancelPairing = async () => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.outgoingRequests &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      console.log(
        props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        "matches view jwttoken"
      );
      try {
        setCancelPairingRequestProcess({ status: Status.LOADING });
        const cancelPairingResponse = await cancelPairingRequest(
          props.getUserItemProcess.data.outgoingRequests.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
        console.log(cancelPairingResponse, "cancelPairingResponse");
        setCancelPairingRequestProcess({
          status: Status.SUCCESS,
          data: cancelPairingResponse,
        });
      } catch (cancelPairingError) {
        setCancelPairingRequestProcess({
          status: Status.ERROR,
          error: cancelPairingError,
        });
      }
    }
  };

  console.log(cancelPairingRequestProcess, "cancelPairingRequestProcess");

  return (
    <Wrapper>
      <LogInPrimaryHeadline>Matches</LogInPrimaryHeadline>
      {props.getUserItemProcess.status === Status.SUCCESS &&
        props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
          <div>
            <MatchSectionWrapper>
              <SecondaryHeadline>Match details</SecondaryHeadline>
              <MatchSection>
                <BallsWrapper>
                  <BallWrapper toLeft={false}>
                    <ProfileBall
                      firstName={
                        props.getCurrentAuthenticatedUserProcess.data.username
                      }
                      image={
                        props.getUserItemProcess.status === Status.SUCCESS &&
                        props.getUserItemProcess.data.profilePicture
                          ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-n82wt82xtb6y.s3.eu-central-1.amazonaws.com/${props.getUserItemProcess.data.profilePicture.S}`
                          : undefined
                      }
                      isCurrentUser={false}
                      size={150}
                      animate={false}
                      fontSize={100}
                    />
                  </BallWrapper>
                  <IconWrapper>
                    <HeartIcon size={60} animate={false} isRed />
                  </IconWrapper>
                  <BallWrapper toLeft>
                    <ProfileBall
                      firstName={undefined}
                      image={undefined}
                      isCurrentUser={false}
                      size={150}
                      animate={false}
                      fontSize={100}
                    />
                  </BallWrapper>
                </BallsWrapper>
                <TextWrapper>
                  <Headline>
                    {props.getCurrentAuthenticatedUserProcess.data.username}
                  </Headline>
                  <Text>loves</Text>
                  <Headline>nobody</Headline>
                </TextWrapper>
              </MatchSection>
              {props.getUserItemProcess.data.outgoingRequests &&
                props.getPairedUserProcess.status === Status.SUCCESS && (
                  <FoundUserWrapper>
                    <PendingIcon animate size={30} />
                    <ProfileWrapper>
                      <ProfileBall
                        firstName={props.getPairedUserProcess.data.username.S}
                        image={
                          props.getPairedUserProcess.data.profilePicture
                            ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-n82wt82xtb6y.s3.eu-central-1.amazonaws.com/${props.getPairedUserProcess.data.profilePicture.S}`
                            : undefined
                        }
                        isCurrentUser={false}
                        size={50}
                        animate={false}
                        fontSize={30}
                      />
                      <ProfileText>
                        {props.getPairedUserProcess.data.username.S}
                      </ProfileText>
                    </ProfileWrapper>
                    <ButtonsWrapper>
                      {pairingProcess.status === Status.INITIAL && (
                        <TransparentButton
                          onClick={() => cancelPairing()}
                          title="reject"
                        >
                          <Mark fontColor="salmon" size={30}>
                            ✕
                          </Mark>
                        </TransparentButton>
                      )}
                      {pairingProcess.status === Status.LOADING && (
                        <Puff size={20} fill="lightblue" />
                      )}
                      {pairingProcess.status === Status.SUCCESS && <div />}
                    </ButtonsWrapper>
                  </FoundUserWrapper>
                )}
            </MatchSectionWrapper>
            {!props.getUserItemProcess.data.outgoingRequests && (
              <MatchSectionWrapper>
                <SecondaryHeadline>Search</SecondaryHeadline>
                {(searchProcess.status === Status.INITIAL ||
                  searchProcess.status === Status.ERROR) && (
                  <FormWrapper>
                    <Form onSubmit={searchUser}>
                      <InputFieldWrapper>
                        <InputField
                          type="text"
                          value={searchFieldValue}
                          onChange={(event) =>
                            setSearchFieldValue(event.target.value)
                          }
                          placeholder="search for a partner"
                        />
                        <SearchIconButton title="search" onClick={searchUser}>
                          <SearchIcon size={20} animate />
                        </SearchIconButton>
                      </InputFieldWrapper>
                    </Form>
                  </FormWrapper>
                )}
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
                            ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-n82wt82xtb6y.s3.eu-central-1.amazonaws.com/${searchProcess.data.profilePicture.S}`
                            : undefined
                        }
                        isCurrentUser={false}
                        size={50}
                        animate={false}
                        fontSize={30}
                      />
                      <ProfileText>{searchProcess.data.username.S}</ProfileText>
                    </ProfileWrapper>
                    <ButtonsWrapper>
                      <TransparentButton
                        onClick={() =>
                          setSearchProcess({ status: Status.INITIAL })
                        }
                        title="reject"
                      >
                        <Mark fontColor="salmon" size={30}>
                          ✕
                        </Mark>
                      </TransparentButton>
                      {pairingProcess.status === Status.INITIAL && (
                        <TransparentButton
                          onClick={() => pairWith()}
                          title="confirm"
                        >
                          <HeartIcon size={30} animate isRed={false} />
                        </TransparentButton>
                      )}
                      {pairingProcess.status === Status.LOADING && (
                        <Puff size={20} fill="lightblue" />
                      )}
                      {pairingProcess.status === Status.SUCCESS && <div />}
                    </ButtonsWrapper>
                  </FoundUserWrapper>
                )}
              </MatchSectionWrapper>
            )}
          </div>
        )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  width: 400px;
`;

const MatchSectionWrapper = styled.div`
  margin-top: 50px;
  text-align: start;
`;

const MatchSection = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const BallsWrapper = styled.div`
  width: 260px;
  display: flex;
  align-items: center;
  position: relative;
`;

type BallWrapperProps = {
  toLeft: boolean;
};

const BallWrapper = styled.div`
  margin-left: ${(props: BallWrapperProps) => (props.toLeft ? "-20px" : 0)};
  margin-right: ${(props: BallWrapperProps) => (props.toLeft ? 0 : "-20px")};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
`;

const FormWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const FoundUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  width: 300px;
`;

const Headline = styled.h5`
  margin: 0;
`;

const Text = styled.p`
  margin: 0;
`;

const ProfileText = styled.p`
  margin: 0;
  margin-left: 5px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  margin-left: 20px;
  display: flex;
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
