import { CognitoJwtVerifier } from "aws-jwt-verify/cognito-verifier";
import type { NextAuthConfig } from "next-auth";
import type { User } from "next-auth";
import AppConfiguration from "./lib/configuration";
import Credentials from "next-auth/providers/credentials";
import { CustomCognitoProvider } from "./custom-cognito-provider";
import GoogleProvider from "next-auth/providers/google";
import { calculateCognitoSecretHash } from "./lib/cognito-utils";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AuthFlowType,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient(
  AppConfiguration.AWSConfig
);

export default {
  providers: [
    CustomCognitoProvider({
      domain: AppConfiguration.CognitoDomain!,
      clientId: AppConfiguration.ClientId,
      clientSecret: AppConfiguration.CognitoClientSecret,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
        newPassword: { label: "newpassword", type: "password" },
        signInType: { label: "signInType", type: "string" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const username = credentials.email as string;
          const password = credentials.password as string;
          const newpassword = credentials.newPassword as string;
          const signInType = credentials.signInType as string;

          console.log(
            "--------- Details ------",
            username,
            password,
            newpassword,
            signInType
          );

          const secretHash = calculateCognitoSecretHash(username);

          // Initial authentication attempt
          const initiateAuthInput: InitiateAuthCommandInput = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: AppConfiguration.ClientId,
            AuthParameters: {
              USERNAME: username,
              PASSWORD: password,
              SECRET_HASH: secretHash,
            },
          };

          const authResponse = await cognitoClient.send(
            new InitiateAuthCommand(initiateAuthInput)
          );

          // console.log("-----authss", authResponse);

          // Handle NEW_PASSWORD_REQUIRED challenge
          if (authResponse.ChallengeName === "NEW_PASSWORD_REQUIRED") {
            // console.log("--------- here ", newpassword);
            if (newpassword === "null") {
              throw new Error("NEW_PASSWORD_REQUIRED");
              // throw new Error(
              //   JSON.stringify({
              //     error: "NEW_PASSWORD_REQUIRED",
              //     session: authResponse.Session,
              //     email: credentials.email,
              //   })
              // );
            }

            const challengeInput: RespondToAuthChallengeCommandInput = {
              ClientId: AppConfiguration.ClientId,
              ChallengeName: "NEW_PASSWORD_REQUIRED",
              Session: authResponse.Session,
              ChallengeResponses: {
                USERNAME: username,
                NEW_PASSWORD: newpassword,
                SECRET_HASH: secretHash,
                ...(authResponse.ChallengeParameters || {}),
              },
            };

            const challengeResponse = await cognitoClient.send(
              new RespondToAuthChallengeCommand(challengeInput)
            );

            // console.log("-----challengeResponse", challengeResponse);

            if (!challengeResponse.AuthenticationResult) {
              throw new Error("Failed to complete password challenge");
            }

            const verifier = CognitoJwtVerifier.create({
              userPoolId: AppConfiguration.UserPoolId,
              tokenUse: "id",
              clientId: AppConfiguration.ClientId,
            });

            const payload = await verifier.verify(
              challengeResponse.AuthenticationResult.IdToken!
            );

            return {
              id: payload.sub,
              email: payload.email as string,
              name: payload.name as string,
              image: payload.picture as string,
              title: (payload["custom:title"] as string) || "",
              department: (payload["custom:department"] as string) || "",
              groups: (payload["cognito:groups"] as string[]) || [],
              accessToken: challengeResponse.AuthenticationResult.AccessToken,
              refreshToken: challengeResponse.AuthenticationResult.RefreshToken,
              tokenExpires:
                Math.floor(Date.now() / 1000) +
                (challengeResponse.AuthenticationResult.ExpiresIn ?? 3600),
            };
          }

          // Normal login success
          if (!authResponse.AuthenticationResult?.IdToken) {
            throw new Error("No authentication result");
          }

          const verifier = CognitoJwtVerifier.create({
            userPoolId: AppConfiguration.UserPoolId,
            tokenUse: "id",
            clientId: AppConfiguration.ClientId,
          });

          const payload = await verifier.verify(
            authResponse.AuthenticationResult.IdToken
          );
          // console.log("------ID Token details ------", payload);

          return {
            id: payload.sub,
            email: payload.email as string,
            name: payload.name as string,
            image: payload.picture as string,
            title: (payload["custom:title"] as string) || "",
            department: (payload["custom:department"] as string) || "",
            groups: (payload["cognito:groups"] as string[]) || [],
            accessToken: authResponse.AuthenticationResult.AccessToken,
            refreshToken: authResponse.AuthenticationResult.RefreshToken,
            tokenExpires:
              Math.floor(Date.now() / 1000) +
              (authResponse.AuthenticationResult.ExpiresIn ?? 3600),
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
