"use server";

import { auth } from "@/auth";
import AppConfiguration from "@/lib/configuration";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

const handleUpdateUserAttribute = async (
  atributeName: string,
  updatedName: string
) => {
  if (!updatedName) return;
  if (!atributeName) return;
  const user = await auth();

  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);
  const input = {
    UserPoolId: AppConfiguration.UserPoolId,
    Username: user?.user.email!,
    UserAttributes: [
      // AttributeListType // required
      {
        // AttributeType
        Name: atributeName, // required
        Value: updatedName,
      },
    ],
  };

  const command = new AdminUpdateUserAttributesCommand(input);
  const response = await client.send(command);
  //   console.log("update response", response);
  //   update sesssion
  return { success: "User updated successfuly" };
};

export default handleUpdateUserAttribute;
