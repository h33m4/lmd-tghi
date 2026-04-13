"use client";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import handleSignOut from "@/lib/actions/auth/handleSignOut";
// import { ExitIcon } from "@radix-ui/react-icons";
import { LogOut } from "lucide-react";

import React from "react";

function UserProfileSignoutButton() {
  return (
    <DropdownMenuItem
      onClick={() => handleSignOut()}
      className="cursor-pointer"
    >
      <LogOut className="h-[17px] w-[17px] mr-2" />
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

export default UserProfileSignoutButton;
