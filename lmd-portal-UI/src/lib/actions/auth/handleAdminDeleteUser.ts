"use server";
import AppConfiguration from "@/lib/configuration";
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandInput,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";

const handleAdminDeleteUser = async (username: string) => {
  if (!username) return { error: "No username provided" };
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);
  const input: AdminDeleteUserCommandInput = {
    UserPoolId: AppConfiguration.UserPoolId, // required
    Username: username, // required
  };
  try {
    const command = new AdminDeleteUserCommand(input);
    const response = await client.send(command);
    console.log(response);
    return { success: `${username} deleted successfully` };
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "NotAuthorizedException":
          return { error: error.message };

        default:
          return { error: error.message || "An error has occured" };
      }
    }
    console.log(" error======>", error);
    return { error: "An error has occured" };
  }
};

export default handleAdminDeleteUser;
