import NextAuth, { Session } from "next-auth";
import authConfig from "./auth.config";
import { CognitoJwtVerifier } from "aws-jwt-verify/cognito-verifier";
import fs from "fs";
import path from "path";
import AppConfiguration from "./lib/configuration";
import { calculateCognitoSecretHash } from "./lib/cognito-utils";
import { analytics } from "./services/analytics";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";

// Singleton verifier — caches JWKS automatically
const verifier = CognitoJwtVerifier.create({
  userPoolId: AppConfiguration.UserPoolId,
  tokenUse: "id",
  clientId: AppConfiguration.ClientId,
});

const cognitoClient = new CognitoIdentityProviderClient(
  AppConfiguration.AWSConfig
);

/**
 * Calls Cognito's REFRESH_TOKEN_AUTH flow to obtain new tokens.
 * Returns the updated token fields, or null if the refresh fails
 * (forcing the user to re-authenticate).
 */
async function refreshCognitoToken(token: {
  refreshToken?: string;
  email?: string | null;
}) {
  if (!token.refreshToken || !token.email) return null;

  try {
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        ClientId: AppConfiguration.ClientId,
        AuthParameters: {
          REFRESH_TOKEN: token.refreshToken,
          SECRET_HASH: calculateCognitoSecretHash(token.email),
        },
      })
    );

    const result = response.AuthenticationResult;
    if (!result?.IdToken) return null;

    const payload = await verifier.verify(result.IdToken);

    return {
      accessToken: result.AccessToken,
      // Cognito does not rotate the refresh token by default — keep the existing one
      refreshToken: token.refreshToken,
      exp: payload.exp,
      // Re-read groups from the refreshed IdToken so permission changes in Cognito
      // take effect at the next token refresh without requiring logout/login.
      groups: (payload["cognito:groups"] as string[]) ?? [],
    };
  } catch {
    // Refresh token expired or revoked — force re-login
    return null;
  }
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        user.title = "";
        user.department = "GMERL";
        user.groups = ["user"];
        return true;
      }

      if (account?.provider === "cognito") {
        try {
          if (!user?.id) return false;
          if (!user.email) return false;

          if (account?.id_token) {
            try {
              await verifier.verify(account.id_token);
            } catch {
              return false;
            }
          }

          return true;
        } catch {
          return false;
        }
      }

      if (account?.provider === "credentials") {
        return true;
      }

      return false;
    },

    async jwt({ token, user, account }) {
      // ── Initial sign-in: populate token from provider data ──────────────
      if (account?.provider === "google") {
        return {
          ...token,
          accessToken: account.access_token ?? user.accessToken,
          userId: user?.id,
          email: user?.email,
          groups: user?.groups ?? [],
          title: user?.title ?? "",
          department: user?.department ?? "",
        };
      }

      if (account?.provider === "cognito" && account && user) {
        let customClaims = {};
        let tokenExpiration: number | undefined;

        if (account.id_token) {
          const payload = await verifier.verify(account.id_token);
          tokenExpiration = payload.exp;
          customClaims = {
            groups: payload["cognito:groups"] || [],
            title: payload["custom:title"] || "",
            department: payload["custom:department"] || "",
          };
        }

        return {
          ...token,
          ...customClaims,
          accessToken: account.access_token ?? user.accessToken,
          refreshToken: account.refresh_token,
          userId: user.id,
          email: user.email,
          groups: user.groups ?? [],
          title: user.title ?? "",
          department: user.department ?? "",
          exp: tokenExpiration,
        };
      }

      if (account?.provider === "credentials") {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          userId: user.id,
          email: user.email,
          groups: user.groups ?? [],
          title: user.title ?? "",
          department: user.department ?? "",
          exp: user.tokenExpires,
        };
      }

      // ── Force logout check ────────────────────────────────────────────────
      try {
        let forceLogoutAfter: string | null = null;

        // 1. Try DB (primary store)
        try {
          const { prismaReader } = await import("@/lib/prisma");
          const row = await prismaReader.portalConfig.findUnique({ where: { id: "global" } });
          if (row) {
            forceLogoutAfter = (row.config as { forceLogoutAfter?: string | null }).forceLogoutAfter ?? null;
          }
        } catch {
          // Table not yet created — fall back to JSON file
          const configPath = path.join(process.cwd(), "src", "config", "portal-config.json");
          const portalConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
          forceLogoutAfter = portalConfig.forceLogoutAfter ?? null;
        }

        if (forceLogoutAfter && token.iat) {
          const logoutAfterSec = Math.floor(new Date(forceLogoutAfter).getTime() / 1000);
          if (token.iat < logoutAfterSec) {
            return null; // Invalidate session — forces re-login
          }
        }
      } catch {
        // Config unreadable — don't invalidate
      }

      // ── Subsequent requests: check expiry and refresh if needed ──────────
      if (token.exp && Date.now() >= token.exp * 1000) {
        const refreshed = await refreshCognitoToken({
          refreshToken: token.refreshToken,
          email: token.email,
        });

        if (!refreshed) {
          // Refresh failed — return null to invalidate the session
          return null;
        }

        return { ...token, ...refreshed };
      }

      return token;
    },

    async session({ session, token }) {
      try {
        session.user = {
          ...session.user,
          id: token.userId ?? token.sub!,
          email: token.email!,
          name: token.name!,
          image: token.picture ?? null,
          groups: token.groups ?? [],
          title: token.title ?? "",
          department: token.department ?? "",
        };

        if (token.accessToken) {
          session.accessToken = token.accessToken;
        }

        if (token.exp) {
          session.expires = new Date(token.exp * 1000).toISOString() as string &
            Date;
        }

        return session;
      } catch {
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",

  events: {
    async signIn(message) {
      try {
        if (message.user?.id && message.user?.email) {
          analytics.init(message.user.id as string, message.user.email);
          const loginType: "password" | "google" =
            message.account?.provider === "credentials" ? "password" : "google";
          await analytics.trackLogin(loginType);
        }
      } catch {
        // Non-critical — don't let analytics failure affect auth
      }
    },

    session(message) {
      // Log meaningful session context — user, groups, and token expiry.
      // Scoped to dev to avoid noise in production logs.
      if (process.env.NODE_ENV !== "production") {
        console.log("[session]", {
          user: message.session.user.email,
          groups: (message.session.user as Session["user"]).groups,
          expires: message.session.expires,
        });
      }
    },

    signOut(message) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[signOut]", message);
      }
    },
  },
});
