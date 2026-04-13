"use server";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";

const UserPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USERPOOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
});

export default async function getCognitoUserLocal(email: string) {
  return new Promise<CognitoUserLocal>((resolve, reject) => {
    try {
      const user = new CognitoUserLocal(email);
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

class CognitoUserLocal {
  private email: string;
  private cognitoUser: CognitoUser | null = null; // Initialize to null

  constructor(email: string) {
    this.email = email;
    this.initCognitoUser();
  }

  private initCognitoUser(): void {
    this.cognitoUser = new CognitoUser({
      Username: this.email,
      Pool: UserPool,
    });
  }

  getEmail(): string {
    return this.email;
  }

  getCognitoUser(): CognitoUser {
    return this.cognitoUser!;
  }

  // Method for password reset
  async resetPassword(
    oldPassword: string,
    newPassword: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.cognitoUser) {
        reject(new Error("CognitoUser is not initialized."));
        return;
      }
      this.cognitoUser.changePassword(
        oldPassword,
        newPassword,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(result!);
        }
      );
    });
  }
}
