import NextAuth from "next-auth";
import { auth } from "./auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

export default auth((req: any): any => {
  // req.auth
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (isAuthRoute) {
    // If user is logged in and trying to access auth routes
    if (isLoggedIn) {
      // Get the callbackUrl from the current URL if it exists
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      if (callbackUrl) {
        // Redirect to the callback URL if it exists
        return Response.redirect(
          new URL(decodeURIComponent(callbackUrl), nextUrl.origin)
        );
      }
      // Otherwise redirect to default
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    // return user to original url after signing in
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
