import Amplify from "aws-amplify";

const isProd = true;

const bucketNameDev =
  "couplesmoviepickerbacken-profilepicturesbucketa8b-2miadmkpd2b7";
const bucketNameProd = "couplesmoviepickerbacken-profilepicturesbucketpro-1t9nid3ibqk2b";
const apiNameProd = "couples-movie-picker-api-prod"
const apiNameDev = "couples-movie-picker-api";

export const apiName = isProd ? apiNameProd : apiNameDev;
export const bucketUrl = `https://${isProd ? bucketNameProd : bucketNameDev}.s3.eu-central-1.amazonaws.com`;

export const configureAmplify = () => {
  if (!isProd) {
    Amplify.configure({
      Auth: {
        identityPoolId: "eu-central-1:37c128a0-8907-4643-a5a9-a62c72c61c4b",
        region: "eu-central-1",
        userPoolId: "eu-central-1_6C0tL3PuD",
        userPoolWebClientId: "230ot6gdeedsftpfmegr2pisu7",
      },
      Storage: {
        bucket: bucketNameDev,
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
  } else {
    Amplify.configure({
      Auth: {
        identityPoolId: "eu-central-1:0e7367c1-2de2-4c11-bdd4-30e8f6baf6be",
        region: "eu-central-1",
        userPoolId: "eu-central-1_a8mnX0Zx8",
        userPoolWebClientId: "3l2iqcnu6jl48krvkmkdi0k6u2",
      },
      Storage: {
        bucket: bucketNameProd,
        region: "eu-central-1",
      },
      API: {
        endpoints: [
          {
            endpoint:
              "https://z4veihhcek.execute-api.eu-central-1.amazonaws.com/prod",
            name: "couples-movie-picker-api-prod",
            region: "eu-central-1",
          },
        ],
      },
    });
  }
};
