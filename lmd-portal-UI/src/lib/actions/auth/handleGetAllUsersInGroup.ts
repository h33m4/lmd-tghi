"use server";

import { IUserRowData } from "@/app/(protected)/settings/(admin)/user-management/components/UsersTable";
import AppConfiguration from "@/lib/configuration";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  ListUsersInGroupCommand,
  ListUsersInGroupCommandInput,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";

const handleGetAllUsersInGroup = async ({ GroupName }: { GroupName: string }) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  try {
    const users: UserType[] = [];
    let nextToken: string | undefined;

    do {
      const input: ListUsersInGroupCommandInput = {
        GroupName,
        UserPoolId: AppConfiguration.UserPoolId,
        ...(nextToken && { NextToken: nextToken }),
      };

      const response = await client.send(new ListUsersInGroupCommand(input));
      users.push(...(response.Users ?? []));
      nextToken = response.NextToken;
    } while (nextToken);

    return {
      success: true,
      users: users as unknown as IUserRowData[],
    };
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return { error: error.message || "An error has occurred" };
    }
    return { error: "An error has occurred" };
  }
};

export default handleGetAllUsersInGroup;
