"use server";

import AppConfiguration from "@/lib/configuration";
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";

export interface IAdminCreateUserDataType {
  username?: string;
  name: string;
  email: string;
  title?: string;
  department?: string;
}

const handleAdminCreateUser = async (data: IAdminCreateUserDataType) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  const input: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: ["EMAIL"],
    UserPoolId: AppConfiguration.UserPoolId,
    Username: data.email, //email is the username
    // MessageAction: "RESEND",
    UserAttributes: [
      {
        Name: "name",
        Value: data.name,
      },

      {
        Name: "email",
        Value: data.email,
      },
      {
        Name: "custom:title",
        Value: data.title!,
      },
      {
        Name: "custom:department",
        Value: data.department!,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
  };

  try {
    const command = new AdminCreateUserCommand(input);
    const response = await client.send(command);
    console.log(response);

    return { success: "User created successfully", user: response.User };
  } catch (error) {
    console.log("err", error);
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "NotAuthorizedException":
          return { error: error.message };

        default:
          return { error: error.message || "An error has occured" };
      }
    }
    return { error: "An error has occured" };
  }
};

export default handleAdminCreateUser;
