import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import { getUserData } from "./lib/utils";
import { CognitoJwtVerifier } from "aws-jwt-verify/cognito-verifier";
import AppConfiguration from "./lib/configuration";
import crypto from "crypto";
export interface CognitoTokens {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface CognitoProfile {
  sub: string;
  email_verified: boolean;
  email: string;
  name: string;
  picture?: string;
  groups: string[];
  title: string | null;
  department: string | null;
  accessToken?: string;
}

export const calculateCognitoSecretHash = (username: string): string => {
  const clientSecret = AppConfiguration.CognitoClientSecret;
  const clientId = AppConfiguration.ClientId;

  const message = username + clientId;
  const messageBuffer = Buffer.from(message);
  const secretBuffer = Buffer.from(clientSecret);

  const hmac = crypto.createHmac("sha256", secretBuffer);
  return hmac.update(messageBuffer).digest("base64");
};

interface CognitoProviderOptions extends OAuthUserConfig<CognitoProfile> {
  domain: string;
}

const IdTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: AppConfiguration.UserPoolId,
  tokenUse: "id",
  clientId: AppConfiguration.ClientId,
});

const AccessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: AppConfiguration.UserPoolId,
  tokenUse: "access",
  clientId: AppConfiguration.ClientId,
});

export const CustomCognitoProvider = (
  options: CognitoProviderOptions
): OAuthConfig<CognitoProfile> => {
  const { domain, clientId, clientSecret } = options;

  if (!domain) {
    throw new Error("Cognito Provider: `domain` is required.");
  }

  const userPoolId = process.env.COGNITO_USERPOOL_ID;
  const region = process.env.LMD_AWS_REGION;
  const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

  return {
    id: "cognito",
    name: "Cognito",
    type: "oidc",
    issuer,
    wellKnown: `${issuer}/.well-known/openid-configuration`,
    checks: ["pkce", "state", "nonce"],
    authorization: {
      url: `${domain}/oauth2/authorize`,
      params: {
        access_type: "offline",
        response_type: "code",
        client_id: clientId!,
        scope: "openid profile email",
        identity_provider: "Google",
        prompt: "consent",
        // nonce: crypto.randomBytes(32).toString("hex"),
      },
    },
    token: {
      url: `${domain}/oauth2/token`,
      async request({
        client,
        params,
        checks,
      }: {
        client: {
          post: (
            url: string,
            params: Record<string, any>,
            config: Record<string, any>
          ) => Promise<{ data: any }>;
        };
        params: Record<string, any>;
        // checks: { code_verifier: string; state?: string };
        checks: Record<string, string>;
      }) {
        const res = await client.post(
          `${domain}/oauth2/token`,
          {
            ...params,
            code_verifier: checks.code_verifier,
            nonce: checks.nonce,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        // console.log("\n=== Token Response Data ===");
        // // console.log(JSON.stringify(res.data, null, 2));
        // console.log("response====", res);
        // console.log("=== End Token Response ===\n");

        return { tokens: res.data };
      },
    },

    async profile(profile: CognitoProfile, tokens) {
      // console.log("-----Profile data received:", profile, tokens);

      const verifier = CognitoJwtVerifier.create({
        userPoolId: AppConfiguration.UserPoolId,
        tokenUse: "id",
        clientId: AppConfiguration.ClientId,
      });

      const payload = await verifier.verify(tokens.id_token!);

      // console.log("-------------------------------");
      // console.log("payload==>", payload);
      return {
        id: payload.sub,
        email: payload.email as string,
        name: payload.name as string,
        image: payload.picture as string,
        title: (payload["custom:title"] as string) || "",
        department: (payload["custom:department"] as string) || "",
        groups: (payload["cognito:groups"] as string[]) || [],
        accessToken: tokens.access_token,
      };
    },
    clientId,
    clientSecret,
  };
};

// scope: email profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile
