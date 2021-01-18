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
import { rejectIncomingRequest } from "../apiService/rejectIncomingRequest";
import { acceptIncomingRequest } from "../apiService/acceptIncomingRequest";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: Process;
  getUserItemProcess: Process;
  getPairedUserProcess: Process;
  getUserItem: (username: string, jwtToken: string) => void;
  getPairedUser: (username: string, jwtToken: string) => void;
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

  const [
    rejectIncomingRequestProcess,
    setRejectIncomingRequestProcess,
  ] = React.useState<Process>({ status: Status.INITIAL });

  const [
    acceptIncomingRequestProcess,
    setAcceptIncomingRequestProcess,
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
        props.getUserItem(
          props.getUserItemProcess.data.username.S,
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
        );
      } catch (cancelPairingError) {
        setCancelPairingRequestProcess({
          status: Status.ERROR,
          error: cancelPairingError,
        });
      }
    }
  };

  const rejectIncoming = async (rejectUsername: string) => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      props.getUserItemProcess.data.outgoingRequests &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      const rejectableRequest = props.getUserItemProcess.data.incomingRequests.L.find(
        (request: string) => rejectUsername === request
      );
      if (rejectableRequest) {
        try {
          setRejectIncomingRequestProcess({ status: Status.LOADING });
          const rejectIncomingRequestResponse = await rejectIncomingRequest(
            props.getUserItemProcess.data.outgoingRequests.S,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
          setRejectIncomingRequestProcess({
            status: Status.SUCCESS,
            data: rejectIncomingRequestResponse,
          });
          props.getUserItem(
            props.getUserItemProcess.data.username.S,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
        } catch (rejectIncomingRequestError) {
          setRejectIncomingRequestProcess({
            status: Status.ERROR,
            error: rejectIncomingRequestError,
          });
        }
      }
    }
  };

  const acceptIncoming = async (acceptUsername: string) => {
    if (
      props.getUserItemProcess.status === Status.SUCCESS &&
      acceptUsername &&
      props.getCurrentSessionProcess.status === Status.SUCCESS
    ) {
      const acceptableRequest = props.getUserItemProcess.data.incomingRequests.L.find(
        (request: string) => acceptUsername === request
      );
      if (acceptableRequest) {
        try {
          setAcceptIncomingRequestProcess({ status: Status.LOADING });
          const acceptIncomingRequestResponse = await acceptIncomingRequest(
            props.getUserItemProcess.data.outgoingRequests.S,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
          setAcceptIncomingRequestProcess({
            status: Status.SUCCESS,
            data: acceptIncomingRequestResponse,
          });
          props.getUserItem(
            props.getUserItemProcess.data.username.S,
            props.getCurrentSessionProcess.data.getIdToken().getJwtToken()
          );
        } catch (accpetIncomingRequestError) {
          setAcceptIncomingRequestProcess({
            status: Status.ERROR,
            error: accpetIncomingRequestError,
          });
        }
      }
    }
  };

  const getRequestListItems = () => {
    if (props.getUserItemProcess.status === Status.SUCCESS) {
      const requestListItems = props.getUserItemProcess.data.incomingRequests.L.map(
        (request: any) => {
          return (
            <RequestListItem>
              <FoundUserWrapper>
                <ProfileWrapper>
                  <ProfileBall
                    firstName={request.S}
                    image={undefined}
                    isCurrentUser={false}
                    size={50}
                    animate={false}
                    fontSize={30}
                    showText
                    shadow={false}
                    border={false}
                  />
                  <ProfileText>{request.S}</ProfileText>
                </ProfileWrapper>
                <ButtonsWrapper>
                  {rejectIncomingRequestProcess.status === Status.INITIAL && (
                    <TransparentButton
                      onClick={() => rejectIncoming(request.S)}
                      title="reject"
                    >
                      <Mark fontColor="salmon" size={30}>
                        ✕
                      </Mark>
                    </TransparentButton>
                  )}
                  {rejectIncomingRequestProcess.status === Status.LOADING && (
                    <Puff size={20} fill="lightblue" />
                  )}
                  {rejectIncomingRequestProcess.status === Status.SUCCESS && (
                    <div />
                  )}
                  {acceptIncomingRequestProcess.status === Status.INITIAL && (
                    <TransparentButton
                      onClick={() => acceptIncoming(request.S)}
                      title="confirm"
                    >
                      <HeartIcon size={30} animate isRed={false} />
                    </TransparentButton>
                  )}
                  {acceptIncomingRequestProcess.status === Status.LOADING && (
                    <Puff size={20} fill="lightblue" />
                  )}
                  {acceptIncomingRequestProcess.status === Status.SUCCESS && (
                    <div />
                  )}
                </ButtonsWrapper>
              </FoundUserWrapper>
            </RequestListItem>
          );
        }
      );
      return requestListItems;
    }
  };

  const requestPending =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.outgoingRequests !== undefined;
  const isPartnered =
    props.getUserItemProcess.status === Status.SUCCESS &&
    props.getUserItemProcess.data.partnered !== undefined;
  console.log(cancelPairingRequestProcess, "cancelPairingRequestProcess");
  console.log(requestPending, "requestPending");

  return (
    <Wrapper>
      <LogInPrimaryHeadline>Partner</LogInPrimaryHeadline>
      {props.getUserItemProcess.status === Status.SUCCESS &&
        props.getCurrentAuthenticatedUserProcess.status === Status.SUCCESS && (
          <div>
            <MatchSectionWrapper>
              <SecondaryHeadline>Details</SecondaryHeadline>
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
                      showText
                      shadow
                      border={false}
                    />
                  </BallWrapper>
                  <PartnerBallWrapper toLeft>
                    <ProfileBall
                      firstName={
                        props.getPairedUserProcess.status === Status.SUCCESS
                          ? props.getPairedUserProcess.data.username.S
                          : undefined
                      }
                      image={
                        (requestPending || isPartnered) &&
                        props.getPairedUserProcess.status === Status.SUCCESS &&
                        props.getPairedUserProcess.data.profilePicture
                          ? `https://couplesmoviepickerbacken-profilepicturesbucketa8b-n82wt82xtb6y.s3.eu-central-1.amazonaws.com/${props.getPairedUserProcess.data.profilePicture.S}`
                          : undefined
                      }
                      isCurrentUser={false}
                      size={150}
                      animate={false}
                      fontSize={100}
                      showText={false}
                      shadow
                      border={false}
                    />
                    {requestPending && (
                      <>
                        <BallOverlay />
                        <IconWrapper>
                          <PendingIcon animate={false} size={60} />
                        </IconWrapper>
                      </>
                    )}
                  </PartnerBallWrapper>
                  <IconWrapper>
                    {!requestPending && (
                      <HeartIcon size={60} animate={false} isRed />
                    )}
                  </IconWrapper>
                </BallsWrapper>
              </MatchSection>
              {isPartnered && (
                <p>{`${props.getUserItemProcess.data.username.S} loves ${props.getUserItemProcess.data.partner.S}`}</p>
              )}
              {requestPending && (
                <TextWrapper>
                  <p>{`${props.getUserItemProcess.data.username.S} waiting for ${props.getUserItemProcess.data.outgoingRequests.S}'s approval`}</p>
                  <TransparentButton onClick={cancelPairing} title="cancel">
                    <Text>cancel</Text>
                  </TransparentButton>
                </TextWrapper>
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
                        showText
                        shadow
                        border={false}
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
            {props.getUserItemProcess.data.incomingRequests && (
              <SectionWrapper>
                <SecondaryHeadline>Requests</SecondaryHeadline>
                <RequestList>{getRequestListItems()}</RequestList>
              </SectionWrapper>
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

const PartnerBallWrapper = styled(BallWrapper)`
  position: relative;
`;

const TextWrapper = styled.div`
  display: flex;
`;

const Text = styled.p`
  margin-left: 10px;
  color: blue;
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
  box-shadow: 10px 5px 5px lightgray;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px 20px;
`;

const ProfileText = styled.p`
  margin: 0;
  margin-left: 20px;
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

const BallOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
  border-radius: 150px;
  background-color: white;
  opacity: 0.5;
`;

const SectionWrapper = styled.div`
  margin-top: 20px;
  text-align: start;
`;

const RequestList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const RequestListItem = styled.li`
  padding: 0;
`;
