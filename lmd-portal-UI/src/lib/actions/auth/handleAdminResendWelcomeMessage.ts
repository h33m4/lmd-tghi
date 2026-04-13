"use server";

import AppConfiguration from "@/lib/configuration";
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
} from "@aws-sdk/client-cognito-identity-provider";

export interface IResendWelcomeMessageDataType {
  email: string;
}

const handleResendWelcomeMessage = async (
  data: IResendWelcomeMessageDataType
) => {
  const client = new CognitoIdentityProviderClient(AppConfiguration.AWSConfig);

  const input: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: ["EMAIL"],
    UserPoolId: AppConfiguration.UserPoolId,
    Username: data.email,
    MessageAction: "RESEND",
    // No need to include UserAttributes for resending
  };

  try {
    const command = new AdminCreateUserCommand(input);
    const response = await client.send(command);
    console.log("Resend welcome message response:", response);

    return { success: "Welcome message resent successfully" };
  } catch (error) {
    console.log("Resend welcome message error:", error);
    if (error instanceof CognitoIdentityProviderServiceException) {
      switch (error.name) {
        case "UserNotFoundException":
          return { error: "User not found" };
        case "NotAuthorizedException":
          return { error: "Not authorized to perform this action" };
        case "LimitExceededException":
          return { error: "Too many attempts. Please try again later" };
        default:
          return { error: error.message || "An error has occurred" };
      }
    }
    return { error: "An error has occurred while resending welcome message" };
  }
};

export default handleResendWelcomeMessage;
