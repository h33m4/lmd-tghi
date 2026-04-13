import { auth } from "@/auth";
import React from "react";
import AuthNavbar from "./AuthNavbar";
import NonAuthNavbar from "./NonAuth";

type Props = {
  showSignInButton?: boolean;
};

const AuthBasedNavbar = async ({ showSignInButton = true }: Props) => {
  const session = await auth();

  return (
    <>
      {session ? (
        <AuthNavbar />
      ) : (
        <NonAuthNavbar showSignInButton={showSignInButton} />
      )}
    </>
  );
};

export default AuthBasedNavbar;
