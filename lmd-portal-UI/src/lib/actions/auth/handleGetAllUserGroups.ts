"use server";

import { IUserGroup } from "@/app/(protected)/settings/(admin)/user-management/groups/_components/userGroupTable";
import AppConfiguration from "@/lib/configuration";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  GroupType,
  ListGroupsCommand,
  ListGroupsCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

const handleGetAllUserGroups = async () => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  try {
    const groups: GroupType[] = [];
    let nextToken: string | undefined;

    do {
      const input: ListGroupsCommandInput = {
        UserPoolId: AppConfiguration.UserPoolId,
        ...(nextToken && { NextToken: nextToken }),
      };

      const response = await client.send(new ListGroupsCommand(input));
      groups.push(...(response.Groups ?? []));
      nextToken = response.NextToken;
    } while (nextToken);

    return {
      success: true,
      groups: groups as unknown as IUserGroup[],
    };
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return { error: error.message || "An error has occurred" };
    }
    return { error: "An error has occurred" };
  }
};

export default handleGetAllUserGroups;
