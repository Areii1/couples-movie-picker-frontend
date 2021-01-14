import Amplify from "aws-amplify";

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      identityPoolId: "eu-central-1:f2229712-f4b6-4e01-97cd-49f87669e656",
      region: "eu-central-1",
      userPoolId: "eu-central-1_g1k7tnnPw",
      userPoolWebClientId: "1g5sc46kkel87k19fuco8dbd07",
    },
    Storage: {
      bucket: "couplesmoviepickerbacken-profilepicturesbucketa8b-n82wt82xtb6y",
      region: "eu-central-1",
    },
    API: {
      endpoints: [
        {
          endpoint:
            "https://5vi3yek4g3.execute-api.eu-central-1.amazonaws.com/prod",
          name: "couples-movie-picker-api",
          region: "eu-central-1",
        },
      ],
    },
  });
};
