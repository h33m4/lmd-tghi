import { CognitoUserSession } from "amazon-cognito-identity-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserData = (
  session: CognitoUserSession,
  libraryType: "aws-sdk" | "aws-cognito-js"
) => {
  return {
    id: session.getIdToken().payload.sub,
    name: session.getIdToken().payload.name,
    email: session.getIdToken().payload.email,
    image: session.getIdToken().payload.picture,
    role: session.getIdToken().payload["custom:role"],
    groups: session.getIdToken().payload["cognito:groups"],
    title: session.getIdToken().payload["custom:title"],
    department: session.getIdToken().payload["custom:department"],
    emailVerified: session.getIdToken().payload.email_verified,
    iat: session.getAccessToken().getIssuedAt(),
    exp: session.getAccessToken().getExpiration(),
    iat2: session.getAccessToken().getIssuedAt(),
    exp2: session.getAccessToken().getExpiration(),
    isValid: session.isValid().valueOf(),
    accessToken: session.getAccessToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  };
};
