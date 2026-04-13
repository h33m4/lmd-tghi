// this does not work - check the code at
// src/lib/actions/auth/handleSignin.ts - handleSignInWithGoogle
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import AppConfiguration from "@/lib/configuration";

export async function GET(request: NextRequest) {
  let authorizeParams = new URLSearchParams();
  const origin = request.nextUrl.origin;

  const state = crypto.randomBytes(16).toString("hex");

  authorizeParams.append("response_type", "code");
  authorizeParams.append("client_id", AppConfiguration.ClientId as string);
  authorizeParams.append(
    "redirect_uri",
    `${origin}/api/auth/google-sign-in-callback`
  );
  authorizeParams.append("state", state);
  authorizeParams.append("identity_provider", "Google");
  authorizeParams.append("scope", "profile email openid");

  console.log(
    ` -----------------------------------------------${
      AppConfiguration.CognitoDomain
    }/oauth2/authorize?${authorizeParams.toString()}`
  );

  return NextResponse.redirect(
    `${
      AppConfiguration.CognitoDomain
    }/oauth2/authorize?${authorizeParams.toString()}`
  );
}
