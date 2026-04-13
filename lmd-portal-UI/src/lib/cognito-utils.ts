import crypto from "crypto";
import AppConfiguration from "./configuration";

/**
 * Computes the Cognito SECRET_HASH required when a user pool app client
 * has a client secret configured.
 * Hash = Base64( HMAC-SHA256( username + clientId, clientSecret ) )
 */
export const calculateCognitoSecretHash = (username: string): string => {
  const clientSecret = AppConfiguration.CognitoClientSecret!;
  const clientId = AppConfiguration.ClientId!;
  const hmac = crypto.createHmac("sha256", Buffer.from(clientSecret));
  return hmac.update(Buffer.from(username + clientId)).digest("base64");
};
