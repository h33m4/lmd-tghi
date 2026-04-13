"use server";

import {
  CognitoIdentityProviderClient,
  AdminRemoveUserFromGroupCommand,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";
import AppConfiguration from "@/lib/configuration";

interface RemoveUserFromGroupInput {
  username: string;
  groupName: string;
}

const handleRemoveUserFromGroup = async ({
  username,
  groupName,
}: RemoveUserFromGroupInput) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  try {
    const command = new AdminRemoveUserFromGroupCommand({
      UserPoolId: AppConfiguration.UserPoolId,
      Username: username,
      GroupName: groupName,
    });

    await client.send(command);
    return { success: true };
  } catch (error) {
    console.error("error", error);
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "UserNotFoundException":
          return { error: "User not found" };
        case "ResourceNotFoundException":
          return { error: "Group not found" };
        case "NotAuthorizedException":
          return { error: "Not authorized to perform this action" };
        default:
          return { error: error.message || "An error occurred" };
      }
    }
    return { error: "An error occurred" };
  }
};

export default handleRemoveUserFromGroup;
