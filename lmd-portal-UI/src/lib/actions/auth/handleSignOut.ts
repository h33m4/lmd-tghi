"use server";
import { auth, signOut } from "@/auth";
import AppConfiguration from "@/lib/configuration";
import {
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

const handleSignOut = async () => {
  // clear client side session
  await signOut();

  //   prepare to signout on cognito
  const user = await auth();
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);
  const input = {
    UserPoolId: AppConfiguration.UserPoolId,
    Username: user?.user.email!,
  };

  //   logout user from cognito
  const command = new AdminUserGlobalSignOutCommand(input);
  const response = await client.send(command);
  console.log("Res", response);
};

export default handleSignOut;
