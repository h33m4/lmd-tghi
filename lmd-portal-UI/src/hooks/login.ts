import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

import { USER_POOL_ID, USER_POOL_CLIENT_ID } from '../constants'


const loginHandler = (username: string, password: string) => {
    const authenticationData = {
        Username: username,
        Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    // John, you can encapsulate these values into an .env file
    const poolData = {
        UserPoolId: USER_POOL_ID,
        ClientId: USER_POOL_CLIENT_ID,
    };

    const userPool = new CognitoUserPool(poolData);

    const userData = {
        Username: username,
        Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    // for now, I am just logging the outcome to the console
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            // Handle successful authentication
            console.log('Authentication successful');
            console.log('Access token:', result.getAccessToken().getJwtToken());
            console.log('ID token:', result.getIdToken().getJwtToken());
            console.log('Refresh token:', result.getRefreshToken().getToken());
        },
        onFailure: (error) => {
            // Handle authentication failure
            console.error('Authentication failed:', error);
        },
    });
};

export default loginHandler;


