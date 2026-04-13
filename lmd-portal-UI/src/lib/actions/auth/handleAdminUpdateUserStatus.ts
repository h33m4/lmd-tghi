"use server";
import AppConfiguration from "@/lib/configuration";
import {
  AdminDisableUserCommand,
  AdminDisableUserCommandInput,
  AdminEnableUserCommand,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";

type Props = {
  username: string;
  status: Boolean;
};

const handleAdminUpdateUserStatus = async ({ username, status }: Props) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  const input: AdminDisableUserCommandInput | AdminDisableUserCommandInput = {
    UserPoolId: AppConfiguration.UserPoolId,
    Username: username,
  };
  let responseMsg = "";
  try {
    let command: AdminEnableUserCommand | AdminDisableUserCommand;
    if (status) {
      command = new AdminDisableUserCommand(input);
      responseMsg = "User disabled successfully";
    } else {
      command = new AdminEnableUserCommand(input);
      responseMsg = "User enabled successfully";
    }
    const response = await client.send(command);

    console.log("res", response);
    return { success: responseMsg };
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "NotAuthorizedException":
          return { error: error.message };

        default:
          return { error: error.message || "An error has occured" };
      }
    }
    console.log(error);
    return { error: "An error has occured" };
  }
};

export default handleAdminUpdateUserStatus;
