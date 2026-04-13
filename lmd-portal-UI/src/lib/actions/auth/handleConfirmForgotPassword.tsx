"use server";
import { calculateCognitoSecretHash } from "@/custom-cognito-provider";
import AppConfiguration from "@/lib/configuration";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { string } from "zod";

export interface IConfirmForgotPasswordRequestData {
  username: string;
  confirmationCode: string;
  newPassword: string;
  confirmNewPassword?: string;
}

const handleConfirmForgotPassword = async (
  data: IConfirmForgotPasswordRequestData
) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);
  const input: ConfirmForgotPasswordCommandInput = {
    ClientId: AppConfiguration.ClientId, // required
    SecretHash: calculateCognitoSecretHash(data.username),
    Username: data.username, // required
    ConfirmationCode: data.confirmationCode, // required
    Password: data.newPassword, // required
  };
  try {
    const command = new ConfirmForgotPasswordCommand(input);
    const response = await client.send(command);
    console.log("response", response);
    return { success: "Password reset successfully, please proceed to log in" };
  } catch (error) {
    console.log("error", error);
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "NotAuthorizedException":
          return { error: error.message };

        default:
          return { error: error.message || "An error has occured" };
      }
    }

    return { error: "An error has occured" };
  }
};

export default handleConfirmForgotPassword;
