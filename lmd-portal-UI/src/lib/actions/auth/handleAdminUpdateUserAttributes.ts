"use server";

import { auth } from "@/auth";
import AppConfiguration from "@/lib/configuration";
import {
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";
import { IAdminCreateUserDataType } from "./handleAdminCreateUser";

const handleAdminUpdateUserAttribute = async (
  data: IAdminCreateUserDataType
) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);
  const input: AdminUpdateUserAttributesCommandInput = {
    UserPoolId: AppConfiguration.UserPoolId,
    Username: data.username, //always remember username is email. and this cannot be changed
    UserAttributes: [
      // AttributeListType // required
      {
        // AttributeType = name
        Name: "name", // required
        Value: data.name,
      },
      {
        // AttributeType = title
        Name: "custom:title", // required
        Value: data.title,
      },
      {
        // AttributeType = department
        Name: "custom:department", // required
        Value: data.department,
      },
    ],
  };

  try {
    const command = new AdminUpdateUserAttributesCommand(input);
    const response = await client.send(command);
    console.log(response);
    return { success: "User updated successfuly" };
  } catch (error) {
    console.log("error", error);
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "NotAuthorizedException":
          return { error: error.message };

        default:
          return { error: error.message || "An error has occured" };
      }
    }
    console.log("handleAuthResetPassword======>", error);
    return { error: "An error has occured" };
  }
};

export default handleAdminUpdateUserAttribute;
