import Amplify from "aws-amplify";

const isProd = false;

const bucketNameDev = "couplesmoviepickerbacken-profilepicturesbucketdev-ugb2hg23ts3z";
const bucketNameProd = "couplesmoviepickerbacken-profilepicturesbucketpro-s3dw2ajqi2y8";
const apiNameProd = "couples-movie-picker-api-prod";
const apiNameDev = "couples-movie-picker-api-dev";

export const apiName = isProd ? apiNameProd : apiNameDev;
export const bucketUrl = `https://${
  isProd ? bucketNameProd : bucketNameDev
}.s3.eu-central-1.amazonaws.com`;

export const configureAmplify = () => {
  if (!isProd) {
    Amplify.configure({
      Auth: {
        identityPoolId: "eu-central-1:16c7a6c4-e18d-44e5-ae7f-a1340eebdcde",
        region: "eu-central-1",
        userPoolId: "eu-central-1_UumnQIIqi",
        userPoolWebClientId: "1plodvadp073s1sarvmpi07q55",
      },
      Storage: {
        bucket: bucketNameDev,
        region: "eu-central-1",
      },
      API: {
        endpoints: [
          {
            endpoint: "https://sb44kllufe.execute-api.eu-central-1.amazonaws.com/prod",
            name: apiNameDev,
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
