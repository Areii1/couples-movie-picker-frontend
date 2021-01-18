import Amplify from "aws-amplify";

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      identityPoolId: "eu-central-1:37c128a0-8907-4643-a5a9-a62c72c61c4b",
      region: "eu-central-1",
      userPoolId: "eu-central-1_6C0tL3PuD",
      userPoolWebClientId: "230ot6gdeedsftpfmegr2pisu7",
    },
    Storage: {
      bucket: "couplesmoviepickerbacken-profilepicturesbucketa8b-2miadmkpd2b7",
      region: "eu-central-1",
    },
    API: {
      endpoints: [
        {
          endpoint:
            "https://7ocld0otxg.execute-api.eu-central-1.amazonaws.com/prod",
          name: "couples-movie-picker-api",
          region: "eu-central-1",
        },
      ],
    },
  });
};
