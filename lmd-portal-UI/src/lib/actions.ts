"use server";
import { IResetPassordFormData } from "@/types";
import { getErrorMessage } from "@/utils/helper_functions";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { revalidatePath } from "next/cache";

interface ISendResetTokenReturn {
  AttributeName: string;
  DeliveryMedium: string;
  Destination: string;
}

const UserPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USERPOOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
});

// get cognito user
async function getCognitoUser(email: string): Promise<CognitoUser> {
  return new Promise((resolve, reject) => {
    try {
      const userEmail = email;
      const cognitoUser = new CognitoUser({
        Username: userEmail,
        Pool: UserPool,
      });
      resolve(cognitoUser);
    } catch (error) {
      reject(error);
    }
  });
}

// send reset token to an aunthenticated user
export async function handleSendResetToken(email: string): Promise<string> {
  try {
    const cognitoUser = await getCognitoUser(email);

    const result = await new Promise<string>((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          console.log("Code sent:", JSON.stringify(data));
          resolve(data.CodeDeliveryDetails.Destination);
        },
        onFailure: (err) => {
          console.error("Forgot password failed:", err.message);
          reject(err.message);
        },
      });
    });
    return result;
  } catch (error) {
    console.log("Error in sendResetToken:", error);
    return getErrorMessage(error);
  }
}

// reset password for an unauthenticated user
export async function handleUnathenticatedResetPassword(
  data: IResetPassordFormData
): Promise<string> {
  const result = await new Promise<string>(async (resolve, reject) => {
    const cognitoUser = await getCognitoUser(data.email);
    cognitoUser.confirmPassword(data.recoveryCode, data.newPassword, {
      onSuccess(success) {
        console.info("success", success);
        resolve(success);
      },
      onFailure(err) {
        console.log("server err->", getErrorMessage(err));
        reject(getErrorMessage(err));
      },
    });
  });
  revalidatePath("/auth/reset-password");
  return result;
}
