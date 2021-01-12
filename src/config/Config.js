import Amplify from "aws-amplify";

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      identityPoolId: "eu-central-1:8a83dd65-6703-4199-bfc2-201e35bac870",
      region: "eu-central-1",
      userPoolId: "eu-central-1_X8rbOOdge",
      userPoolWebClientId: "3aq629ljvpp08mbjhr5bh245u5",
    },
    Storage: {
      bucket: "couplesmoviepickerbacken-profilepicturesbucketa8b-wzbj5zhprz9k",
      region: "eu-central-1",
    },
    API: {
      endpoints: [
        {
          endpoint:
            "https://xf31qodq01.execute-api.eu-central-1.amazonaws.com/prod",
          name: "couples-movie-picker-api",
          region: "eu-central-1",
        },
      ],
    },
  });
};
