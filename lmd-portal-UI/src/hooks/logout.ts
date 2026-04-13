import { CognitoUser } from 'amazon-cognito-identity-js';

const logoutHandler = (user: CognitoUser) => {
    if (user) {
        user.signOut();
        console.log('User logged out successfully');
    } else {
        console.log('No user is currently logged in');
    }
    // Additional logout logic can be added here
};

export default logoutHandler;
