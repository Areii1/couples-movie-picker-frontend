import Amplify from 'aws-amplify';

export const configureAmplify = () => {
    Amplify.configure({
        Auth: {
            // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
            identityPoolId: 'eu-central-1:c58fe574-d598-4809-b2f3-9bfaa4d84dad',
    
            // REQUIRED - Amazon Cognito Region
            region: 'eu-central-1',
    
            // OPTIONAL - Amazon Cognito User Pool ID
            userPoolId: 'eu-central-1_zHutwNPqt',
    
            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolWebClientId: 'ogmfljtdos839cnrlktoalas',
    
            // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
            // mandatorySignIn: false,
    
            // OPTIONAL - Configuration for cookie storage
            // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
            // cookieStorage: {
            // // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            //     domain: '.yourdomain.com',
            // // OPTIONAL - Cookie path
            //     path: '/',
            // // OPTIONAL - Cookie expiration in days
            //     expires: 365,
            // // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
            //     sameSite: "strict" | "lax",
            // // OPTIONAL - Cookie secure flag
            // // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
            //     secure: true
            // },
        }
    });
}