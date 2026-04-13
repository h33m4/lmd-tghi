"use server";

import { IUserRowData } from "@/app/(protected)/settings/(admin)/user-management/components/UsersTable";
import AppConfiguration from "@/lib/configuration";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  ListUsersCommand,
  ListUsersCommandInput,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";

const handleGetAlUsers = async () => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  try {
    const users: UserType[] = [];
    let paginationToken: string | undefined;

    do {
      const input: ListUsersCommandInput = {
        UserPoolId: AppConfiguration.UserPoolId,
        ...(paginationToken && { PaginationToken: paginationToken }),
      };

      const response = await client.send(new ListUsersCommand(input));
      users.push(...(response.Users ?? []));
      paginationToken = response.PaginationToken;
    } while (paginationToken);

    return { success: users as unknown as IUserRowData[] };
  } catch (error) {
    if (error instanceof CognitoIdentityProviderServiceException) {
      return { error: error.message || "An error has occurred" };
    }
    return { error: "An error has occurred" };
  }
};

export default handleGetAlUsers;
