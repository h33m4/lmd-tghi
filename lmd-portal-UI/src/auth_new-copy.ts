import NextAuth, { Session } from "next-auth";
import authConfig from "./auth.config";
import { CognitoJwtVerifier } from "aws-jwt-verify/cognito-verifier";
import AppConfiguration from "./lib/configuration";

// Initialize Cognito JWT verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: AppConfiguration.UserPoolId,
  tokenUse: "id",
  clientId: AppConfiguration.ClientId,
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        if (account && user) {
          // Initial sign in - validate and store user data
          return {
            ...token,
            accessToken: account.access_token
              ? account.access_token
              : user.accessToken,
            userId: user.id,
            email: user.email,
            groups: user.groups ?? [],
            title: user.title ?? "",
            department: user.department ?? "",
          };
        }

        // Check token expiration
        if (token.exp && Date.now() < token.exp * 1000) {
          return token;
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        // Update session with user details from token
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

        // Add access token to session if needed
        if (token.accessToken) {
          session.accessToken = token.accessToken;
        }

        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },

    async signIn({ user, account }) {
      try {
        if (!user?.id) {
          console.error("No user ID provided");
          return false;
        }

        // Verify token if it exists
        if (account?.id_token) {
          try {
            await verifier.verify(account.id_token);
          } catch (error) {
            console.error("Token verification failed:", error);
            return false;
          }
        }

        // Additional sign-in validation if needed
        if (!user.email) {
          console.error("No email provided");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  debug: true,
});

// Updated type guard
export function isValidSession(session: unknown): session is Session {
  return Boolean(
    session &&
      typeof session === "object" &&
      "user" in session &&
      session.user &&
      typeof session.user === "object" &&
      "email" in session.user
  );
}
