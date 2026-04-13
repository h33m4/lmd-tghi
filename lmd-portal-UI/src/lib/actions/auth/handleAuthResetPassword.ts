"use server";
import AppConfiguration from "@/lib/configuration";
import {
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";
import { auth } from "@/auth";
import { ServerErrorResponse, ServerSuccessResponse } from "@/types";

export interface ISignedInUserResetPasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Reset password of an authenticated user logged in
 * @param {ISignedInUserResetPasswordData} data - form data [current password, new password, and confirm password]
 * @returns {Promise} Response: [success, error]
 * returns success with a message or error with a message
 */
const handleAuthResetPassword = async (
  data: ISignedInUserResetPasswordData
): Promise<any> => {
  const session = await auth();
  const accessToken = session?.accessToken;
  if (!accessToken) return { error: "No access token provided" };
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);
  const input = {
    PreviousPassword: data.currentPassword, // required
    ProposedPassword: data.newPassword, // required
    AccessToken: accessToken, // required
  };
  try {
    const command = new ChangePasswordCommand(input);
    const response = await client.send(command);
    console.log("res", response);
    return { success: "Password changed successfully" };
  } catch (error) {
    console.log(error);
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "NotAuthorizedException":
          return { error: error.message };

        default:
          return { error: error.message || "An error has occured" };
      }
    }
    console.log("handleAuthResetPassword======>", error);
    return { error: "An error has occured" };
  }
};

export default handleAuthResetPassword;
