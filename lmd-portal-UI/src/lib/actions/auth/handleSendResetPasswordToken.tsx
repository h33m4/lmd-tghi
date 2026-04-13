"use server";
import { calculateCognitoSecretHash } from "@/custom-cognito-provider";
import AppConfiguration from "@/lib/configuration";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  ForgotPasswordCommand,
  ForgotPasswordCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { use } from "react";

const handleSendResetPasswordToken = async (username: string) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);
  const input: ForgotPasswordCommandInput = {
    ClientId: AppConfiguration.ClientId, // required
    SecretHash: calculateCognitoSecretHash(username),
    UserContextData: {
      // UserContextDataType
      IpAddress: "STRING_VALUE",
      EncodedData: "STRING_VALUE",
    },
    Username: username,
  };
  try {
    const command = new ForgotPasswordCommand(input);
    const response = await client.send(command);
    console.log("response", response);
    if (response.CodeDeliveryDetails) {
      return {
        success: `Recovery code sent via ${response.CodeDeliveryDetails?.DeliveryMedium?.toLowerCase()} to ${username}`,
      };
    }
  } catch (error) {
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

export default handleSendResetPasswordToken;
