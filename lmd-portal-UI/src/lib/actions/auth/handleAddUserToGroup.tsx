"use server";

import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";
import AppConfiguration from "@/lib/configuration";

interface AddUserToGroupInput {
  username: string;
  groupName: string;
}

const handleAddUserToGroup = async ({
  username,
  groupName,
}: AddUserToGroupInput) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  try {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: AppConfiguration.UserPoolId,
      Username: username,
      GroupName: groupName,
    });

    await client.send(command);
    return {
      success: true,
      message: `User ${username} successfully added to group ${groupName}`,
    };
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
          return { error: error.message || "An error has occurred" };
      }
    }
    return { error: "An error has occurred" };
  }
};

export default handleAddUserToGroup;
