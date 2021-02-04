import Amplify from "aws-amplify";

const isProd = true;

const bucketNameDev = "couplesmoviepickerbacken-profilepicturesbucketdev-ugb2hg23ts3z";
const bucketNameProd = "couplesmoviepickerbacken-profilepicturesbucketpro-s3dw2ajqi2y8";
const apiNameProd = "couples-movie-picker-api-prod";
const apiNameDev = "couples-movie-picker-api";

export const apiName = isProd ? apiNameProd : apiNameDev;
export const bucketUrl = `https://${
  isProd ? bucketNameProd : bucketNameDev
}.s3.eu-central-1.amazonaws.com`;

export const configureAmplify = () => {
  if (!isProd) {
    Amplify.configure({
      Auth: {
        identityPoolId: "eu-central-1:f8b2582c-367f-4ad6-b1ca-6c7a8ad90df1",
        region: "eu-central-1",
        userPoolId: "eu-central-1_W6JLN2fl0",
        userPoolWebClientId: "7s61asv7likcj62ng17v06731o",
      },
      Storage: {
        bucket: bucketNameDev,
        region: "eu-central-1",
      },
      API: {
        endpoints: [
          {
            endpoint: "https://113idz1bmg.execute-api.eu-central-1.amazonaws.com/prod",
            name: "couples-movie-picker-api-dev",
            region: "eu-central-1",
          },
        ],
      },
    });
  } else {
    Amplify.configure({
      Auth: {
        identityPoolId: "eu-central-1:0712b2b0-4516-403a-88d2-c7f51e5c895d",
        region: "eu-central-1",
        userPoolId: "eu-central-1_FE9WM6s4w",
        userPoolWebClientId: "6rvpan2g4lot0d9jhj538sq6vf",
      },
      Storage: {
        bucket: bucketNameProd,
        region: "eu-central-1",
      },
      API: {
        endpoints: [
          {
            endpoint: "https://295slj5x96.execute-api.eu-central-1.amazonaws.com/prod",
            name: "couples-movie-picker-api-prod",
            region: "eu-central-1",
          },
        ],
      },
    });
  }
};
