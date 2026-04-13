import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import UserProfileSignoutButton from "./user-profile-signout-button";
import {
  AvatarIcon,
  ChatBubbleIcon,
  ChevronDownIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { auth } from "@/auth";
import { getInitials } from "@/utils/chat-helpers";
import { TourWrapper } from "@/context/tourContext";
import { Settings } from "lucide-react";

type Props = {
  tourRef?: string;
};

async function UserProfileDropdown({ tourRef }: Props) {
  const session = await auth();

  return (
    <DropdownMenu>
      <TourWrapper tourRef={tourRef}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar className=" h-[30px] w-[31px] 2xl:h-[30px] 2xl:w-[30px] 2xl:mb-1 cursor-pointer bg-lmh-dark-blue flex flex-col items-center justify-center border active:border-2 hover:border-primary">
            <AvatarImage
              src={session?.user.image as string}
              alt={`${session?.user.name}`}
            />
            <AvatarFallback className="2xl:text-sm text-[13px] th-font-medium tracking-wide">
              {getInitials(session?.user!.name!, session?.user.email!)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      </TourWrapper>

      <DropdownMenuContent
        className="w-56 mt-0 z-[999999] p-2"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm  leading-[0.8rem] th-font-black tracking-wide text-lmh-dark-blue-foreground -mt-[0.5px] ">
              {session?.user.name!}
            </p>
            <span className="text-sm 2xl:text-[13px] leading-[0.7rem] -mt-[0px] 2xl:-mt-[1.8px] tracking-wide  text-muted-foreground">
              {session?.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem asChild>
            <Link href="/settings" className="w-full flex cursor-pointer">
              <AvatarIcon className="h-4 w-4 mr-2" />
              Profile
            </Link>
          
          </DropdownMenuItem> */}

          <DropdownMenuItem asChild className="py-2">
            <Link href="/settings" className="w-full flex cursor-pointer">
              <Settings className="h-[17px] w-[17px] mr-2" />
              Portal Settings
            </Link>
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <UserProfileSignoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserProfileDropdown;
