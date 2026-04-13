"use server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
interface ISignInData {
  signInType?: "SignIn" | "AuthChallengeResponse";
  email: string;
  password: string;
  newPassword?: string | null;
}

const handleSignInWithEmail = async (
  data: ISignInData,
  callbackUrl?: string | null
) => {
  // TODO validate data

  try {
    await signIn("credentials", {
      signInType: data?.signInType || "SignIn",
      email: data.email,
      password: data.password,
      newPassword: data.newPassword || null,
      redirect: false,
    });
    // Return success so the client can do a full page reload (window.location.href).
    // This ensures the root layout re-runs on the server, re-hydrating SessionProvider
    // with the real session — avoiding the stale-session bug that occurs with
    // client-side navigation (router.push / NEXT_REDIRECT).
    return { success: true, redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT };
  } catch (error) {
    console.log("authActions====>:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: error.cause?.err?.message };
        case "CredentialsSignin":
          console.log("server error", error);
          return { error: `Invalid credentials! ==${error}` };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

const handleSignInWithGoogle1 = async (callbackUrl?: string | null) => {
  try {
    const response = await signIn("cognito", {
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      // // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      // // callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT, // specify a default callback URL
      // // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    console.log("Cognito Sign-In Response", response);
  } catch (error) {
    console.error("Cognito Sign-In Error -> ", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: error.cause?.err?.message };
        case "CredentialsSignin":
          console.log("server error", error);
          return { error: `Invalid credentials! ==${error}` };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

const handleSignInWithGoogle2 = async (callbackUrl?: string | null) => {
  try {
    const response = await signIn("google", {
      // // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      // // callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT, // specify a default callback URL
      // // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    console.log("Google Sign-In Response", response);
  } catch (error) {
    console.error("Google Sign-In Error -> ", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: error.cause?.err?.message };
        case "CredentialsSignin":
          console.log("server error", error);
          return { error: `Invalid credentials! ==${error}` };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

const handleSignInWithGoogle = async (callbackUrl?: string | null) => {
  try {
    // Get the host from headers
    const headersList = headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const appUrl = `${protocol}://${host}`;

    const redirectUri = `${appUrl}/api/auth/callback/cognito`;
    // const redirectUri = `${appUrl}/api/auth/google-sign-in-callback`;
    const cognitoDomain = process.env.COGNITO_DOMAIN;
    const clientId = process.env.COGNITO_CLIENT_ID;
    const state = crypto.randomBytes(16).toString("hex");

    // Construct the authorization URL
    const authorizationURL = new URL(`${cognitoDomain}/oauth2/authorize`);
    authorizationURL.searchParams.append("response_type", "code");
    authorizationURL.searchParams.append("client_id", clientId!);
    authorizationURL.searchParams.append("redirect_uri", redirectUri);
    // authorizationURL.searchParams.append("state", state);
    authorizationURL.searchParams.append("identity_provider", "Google");
    authorizationURL.searchParams.append("scope", "openid email profile");

    // authorizationURL.searchParams.append("state", callbackUrl!);

    // Store the callback URL in cookies if provided
    if (callbackUrl) {
      cookies().set("cognito-callbackUrl", callbackUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 10, // 10 minutes
      });
    }

    // Redirect to Cognito's Google authorization URL
    // redirect(authorizationURL.toString());
    return { url: authorizationURL.toString() };
  } catch (error) {
    console.error("Custom google sign in error----:", error);
    return { error: "Failed to initiate Google sign-in" };
  }
};

export {
  handleSignInWithEmail,
  handleSignInWithGoogle,
  handleSignInWithGoogle1,
  handleSignInWithGoogle2,
};

// https://lmd-app-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=code&client_id=3anncba9mvvgs6vvk16vmo0pii&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgoogle-sign-in-callback&identity_provider=Google&scope=openid+email+profile
