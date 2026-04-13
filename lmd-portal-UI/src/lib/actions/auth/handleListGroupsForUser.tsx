"use server";

import {
  CognitoIdentityProviderClient,
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";
import AppConfiguration from "@/lib/configuration";
import { IUserGroup } from "@/app/(protected)/settings/(admin)/user-management/groups/_components/userGroupTable";

const handleListUserGroups = async (username: string) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  try {
    const command = new AdminListGroupsForUserCommand({
      UserPoolId: AppConfiguration.UserPoolId,
      Username: username,
    });

    const response = await client.send(command);

    return {
      success: true,
      groups: response.Groups as unknown as IUserGroup[],
    };
  } catch (error) {
    console.error("error", error);
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "UserNotFoundException":
          return { error: "User not found" };
        case "NotAuthorizedException":
          return { error: "Not authorized to perform this action" };
        default:
          return { error: error.message || "An error has occurred" };
      }
    }
    return { error: "An error has occurred" };
  }
};

export default handleListUserGroups;
