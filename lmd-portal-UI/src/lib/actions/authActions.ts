"use server";

import { signIn, signOut, unstable_update } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const UserPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USERPOOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
});

export const handleUpdateUserName = async ({
  name,
  username,
}: {
  name: string;
  username: string;
}) => {
  try {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: UserPool,
    });

    var attibuteList = [];
    var updatedAttribute = {
      Name: "name",
      Value: name,
    };

    var attribute = new CognitoUserAttribute(updatedAttribute);
    attibuteList.push(attribute);

    cognitoUser.getUserData(function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        console.log(result);
      }
    });

    // cognitoUser.updateAttributes(attibuteList, function (err, result) {
    //   if (err) {
    //     console.log(
    //       "server error in updating user attributes=>>",
    //       getErrorMessage(err)
    //     );
    //     return { error: getErrorMessage(err) };
    //   }
    //   if (result) {
    //     console.log("result", result);
    //     return { success: result };
    //   }
    // });
  } catch (error) {
    console.log("ser err", error);
    throw error;
  }
};

export const handleUpdateProfilePic = async () => {
  try {
    // await unstable_update;
    ("https://res.cloudinary.com/jondexter/image/upload/v1661396326/smartDerm/image-4_wyazsd.jpg");
  } catch (error) {
    console.log("server error", error);
    throw new Error(`Error updating profile pic`);
  }
};
