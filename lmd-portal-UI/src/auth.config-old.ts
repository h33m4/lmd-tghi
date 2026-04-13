// import {
//   AdminInitiateAuthCommand,
//   AuthFlowType,
//   CognitoIdentityProviderClient,
//   InitiateAuthCommandInput,
//   InitiateAuthCommand,
//   RespondToAuthChallengeCommand,
//   RespondToAuthChallengeCommandInput,
// } from "@aws-sdk/client-cognito-identity-provider";
// import { CognitoJwtVerifier } from "aws-jwt-verify/cognito-verifier";
// import type { NextAuthConfig } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Cognito from "next-auth/providers/cognito";
// import AppConfiguration from "./lib/configuration";

// import {
//   AuthenticationDetails,
//   CognitoUser,
//   CognitoUserPool,
//   CognitoUserSession,
// } from "amazon-cognito-identity-js";
// import { getUserData } from "./lib/utils";
// import { headers } from "next/headers";
// import { CognitoProvider } from "./custom-cognito-provider";

// const verifier = CognitoJwtVerifier.create({
//   userPoolId: AppConfiguration.UserPoolId,
//   tokenUse: "id",
//   clientId: AppConfiguration.ClientId,
// });

// const UserPool = new CognitoUserPool({
//   UserPoolId: AppConfiguration.UserPoolId,
//   ClientId: AppConfiguration.ClientId,
// });

// export default {
//   providers: [
//     CognitoProvider({
//       domain: AppConfiguration.CognitoDomain!,
//       clientId: AppConfiguration.ClientId,
//       clientSecret: AppConfiguration.CognitoClientSecret,
//     }),
//     Credentials({
//       id: "credentials",
//       name: "credentials",
//       credentials: {
//         email: { label: "email", type: "text" },
//         password: { label: "password", type: "password" },
//         newPassword: { label: "newpassword", type: "password" },
//         signInType: { label: "signInType", type: "string" },
//       },
//       async authorize(credentials) {
//         const username = String(credentials?.email!);
//         const password = String(credentials?.password!);
//         const newPassword = String(credentials.newPassword);
//         const client = new CognitoIdentityProviderClient(
//           AppConfiguration.AWSConfig
//         );

//         const cognitoUser = new CognitoUser({
//           Username: String(credentials?.email!),
//           Pool: UserPool,
//         });

//         const authenticationDetails = new AuthenticationDetails({
//           Username: username,
//           Password: password,
//         });

//         console.log(credentials);

//         return new Promise((resolve, reject) => {
//           cognitoUser.authenticateUser(authenticationDetails, {
//             onSuccess(session, userConfirmationNecessary) {
//               // console.log("success login--->", session);
//               if (session instanceof CognitoUserSession) {
//                 const userInfo = getUserData(session, "aws-cognito-js");
//                 // console.log("user info", userInfo);
//                 resolve(userInfo);
//                 return userInfo;
//               }
//             },
//             newPasswordRequired(userAttributes, requiredAttributes) {
//               console.log(userAttributes, requiredAttributes);
//               if (credentials?.newPassword === "undefined") {
//                 reject(new Error("Need to reset password"));
//               }
//               cognitoUser.completeNewPasswordChallenge(newPassword, [], {
//                 onFailure(err) {
//                   console.log(err);
//                   reject(err);
//                 },
//                 onSuccess(session) {
//                   const userInfo = getUserData(session, "aws-cognito-js");
//                   console.log("user info", userInfo);
//                   resolve(userInfo);
//                   return userInfo;
//                 },
//               });
//             },
//             onFailure(err) {
//               console.log("--->", err);
//               reject(err);
//             },
//           });
//         });

//         return null;
//       },
//     }),
//   ],
// } satisfies NextAuthConfig;

// // https://lmd-app.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5ro35n1tiltds880u8nan9m9v6&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fcognito&code_challenge=kbU00gCf36aTHqmgtuYsWOZcsTr3lzZf1ay0tdYT4yA&code_challenge_method=S256&scope=openid+profile+email

// // TODO:
// // implement forced reset password challenge

// // IdTokenPayload
// /*
// payload {
//   sub: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   email_verified: true,
//   iss: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   picture: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   origin_jti: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   aud: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   event_id: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   token_use: 'id',
//   auth_time: xxxxxxxxxxxx-xxxxx-xxxx,
//   name: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   exp: 1709228197,
//   iat: 1709224597,
//   jti: 'xxxxxxxxxxxx-xxxxx-xxxx',
//   email: 'XXXXXXXXX@mail.com'

// payload["custom:department"],
// payload["custom:role"],
// }
// */
