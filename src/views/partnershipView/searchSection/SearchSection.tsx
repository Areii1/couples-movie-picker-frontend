import React, { FormEvent } from "react";
import { toast } from "react-toastify";
import {
  GetCurrentSessionProcess,
  GetCurrentSessionProcessSuccess,
  GetUserItemProcess,
  Process,
  Status,
} from "../../../App";
import { SearchIcon } from "../../../components/icons/searchIcon/SearchIcon";
import { Form, InputField } from "../../logIn/LogInStyles";
import { getUser } from "../../../apiService/getUser";
import { pairWithUser } from "../../../apiService/pairWithUser";
import { Puff } from "../../../components/puff/Puff";
import { TransparentButton } from "../../accountSettingsView/pictureSection/PictureSectionStyles";
import {
  FoundUserWrapper,
  MatchSectionWrapper,
  ProfileWrapper,
  ProfileText,
  ButtonsWrapper,
} from "../PartnershipViewStyles";
import { ProfileBall } from "../../../components/profileBall/ProfileBall";
import { AnimateType, HeartIcon } from "../../../components/icons/heartIcon/HeartIcon";
import { bucketUrl } from "../../../config/Config";
import { SecondaryHeadline } from "../../../styles/Styles";
import { FormWrapper, InputFieldWrapper, SearchIconButton } from "./SearchSectionStyles";

type Props = {
  getCurrentAuthenticatedUserProcess: Process;
  getCurrentSessionProcess: GetCurrentSessionProcess;
  getUserItemProcess: GetUserItemProcess;
  getUserItem: (username: string, jwtToken: string) => void;
};

type Success = {
  status: Status.SUCCESS;
  data: any;
};

export const SearchSection = (props: Props) => {
  const [searchProcess, setSearchProcess] = React.useState<GetUserItemProcess>({
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
          props.getCurrentSessionProcess.data.getIdToken().getJwtToken(),
        );
        setSearchProcess({
          status: Status.SUCCESS,
          data: searchForUserResponse,
        });
        setSearchFieldValue("");
      } catch (searchForUserError) {
        setSearchFieldValue("");
        setSearchProcess({ status: Status.ERROR, error: searchForUserError });
        toast.error(`Did not find user "${searchFieldValue}"`);
      }
    } else {
      toast.error("Form not complete");
    }
  };

  const pairWith = async (
    getCurrentSessionProcess: GetCurrentSessionProcessSuccess,
    getUserItemProcess: Success,
    givenSearchProcess: Success,
  ) => {
    try {
      setSearchProcess({ status: Status.INITIAL });
      setPairingProcess({ status: Status.LOADING });
      const pairWithUserResponse = await pairWithUser(
        givenSearchProcess.data.username.S,
        getCurrentSessionProcess.data.getIdToken().getJwtToken(),
      );
      toast.success(`Pairing request sent to ${givenSearchProcess.data.username.S}`);
      setPairingProcess({
        status: Status.SUCCESS,
        data: pairWithUserResponse,
      });
      props.getUserItem(
        getUserItemProcess.data.username.S,
        getCurrentSessionProcess.data.getIdToken().getJwtToken(),
      );
    } catch (pairWithUserError) {
      toast.error("Could not complete request");
      setPairingProcess({ status: Status.ERROR, error: pairWithUserError });
    }
  };

  const getFoundUserWrapper = (
    givenGetCurrentSessionProcess: GetCurrentSessionProcessSuccess,
    givenGetUserItemProcess: Success,
    givenSearchProcess: Success,
  ) => {
    const searchedUserIsTaken =
      searchProcess.status === Status.SUCCESS && searchProcess.data.partner !== undefined;
    return (
      <FoundUserWrapper>
        <ProfileWrapper>
          <ProfileBall
            firstName={givenSearchProcess.data.username.S}
            image={
              givenSearchProcess.data.profilePicture
                ? `${bucketUrl}/${givenSearchProcess.data.profilePicture.S}`
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
          <ProfileText isPartnered={searchedUserIsTaken}>
            {givenSearchProcess.data.partner
              ? `${givenSearchProcess.data.username.S} is already partnered with ${givenSearchProcess.data.partner.S}`
              : givenSearchProcess.data.username.S}
          </ProfileText>
        </ProfileWrapper>
        {!searchedUserIsTaken && (
          <ButtonsWrapper>
            {pairingProcess.status === Status.INITIAL && (
              <TransparentButton
                onClick={() =>
                  pairWith(
                    givenGetCurrentSessionProcess,
                    givenGetUserItemProcess,
                    givenSearchProcess,
                  )
                }
                title={`pair with ${givenSearchProcess.data.username.S}`}
              >
                <HeartIcon size={30} animate={AnimateType.COLOR} isRed={false} />
              </TransparentButton>
            )}
            {pairingProcess.status === Status.LOADING && <Puff size={20} fill="lightblue" />}
            {pairingProcess.status === Status.SUCCESS && <div />}
          </ButtonsWrapper>
        )}
      </FoundUserWrapper>
    );
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
      {searchProcess.status === Status.LOADING && <Puff size={50} fill="lightblue" />}
      {searchProcess.status === Status.SUCCESS &&
        props.getUserItemProcess.status === Status.SUCCESS &&
        props.getCurrentSessionProcess.status === Status.SUCCESS &&
        getFoundUserWrapper(
          props.getCurrentSessionProcess,
          props.getUserItemProcess,
          searchProcess,
        )}
    </MatchSectionWrapper>
  );
};
