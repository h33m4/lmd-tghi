"use client";
import React from "react";

import LogoutIcon from "../../../public/assets/icons/Logout.svg";
import { concatClassNames } from "@/utils/helper_functions";
import handleSignOut from "@/lib/actions/auth/handleSignOut";

const LogOutButton = ({ active }: { active?: boolean }) => {
  return (
    <button
      type="submit"
      className={concatClassNames(
        active
          ? "bg-grey-default text-lmh-dark-blue th-font-heavy"
          : "text-gray-900",
        "group hover:bg-grey-default hover:text-lmh-dark-blue hover:th-font-heavy  text-gray-900 flex gap-3 px-3 py-2   w-full items-center rounded-md  text-sm th-font-roman"
      )}
      onClick={() => handleSignOut()}
    >
      {active ? (
        <LogoutIcon width="18" height="20" viewBox="0 0 24 24" />
      ) : (
        <LogoutIcon width="18" height="20" viewBox="0 0 24 24" />
      )}
      Log out
    </button>
  );
};

export default LogOutButton;
