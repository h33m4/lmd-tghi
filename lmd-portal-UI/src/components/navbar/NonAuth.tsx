"use client";
import React from "react";
import LmhLmdBrand from "../../../public/assets/brand/lmh-lmd2.svg";
import PrimaryButton from "../buttons/PrimaryButton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import LmdLogo from "./LmdLogo";

type Props = {
  showSignInButton?: boolean;
};

const NonAuthNavbar = ({ showSignInButton = true }: Props) => {
  return (
    <div className="flex-none border-b-[3px] border-primary h-[52px] md:h-[55px] sticky top-0  z-20 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="web-page-constraints flex flex-row justify-between items-center py-0.5">
        <div className="flex items-center gap-8  -mt-3  -ml-3">
          <LmdLogo href="/" />
        </div>

        {showSignInButton && (
          <div className="items-center gap-2 hidden md:flex -mt-1">
            <Link href={"/auth/sign-in"}>
              <Button variant={"dark-blue"} size={"lg"}>
                Log in
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NonAuthNavbar;
