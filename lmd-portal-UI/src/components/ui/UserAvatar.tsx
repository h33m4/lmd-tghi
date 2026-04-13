"use client";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const UserAvatar = ({
  size = "small",
  newImgUrl,
  userPicture,
  userEmail,
  userName,
  self = true,
}: {
  size?: "small" | "medium" | "large";
  newImgUrl?: string;
  userPicture?: string; //mostly used it settings page
  userName?: string; //mostly used it settings page
  userEmail?: string; //mostly used it settings page
  self?: boolean; //this controls if to display logged-in user's details or passed values. default is self=true
}) => {
  const session = useSession();

  const user = session.data?.user;

  let avatarInitials = "";
  let avatarSrc = "";

  if (self) {
    if (newImgUrl) {
      avatarSrc = newImgUrl;
    } else if (user?.image) {
      avatarSrc = user.image;
    } else if (user?.name) {
      const nameInitials = user.name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
      avatarInitials = nameInitials;
    } else if (user?.email) {
      // if user email exits which is the default
      avatarInitials = user.email.charAt(0).toUpperCase();
    }
  } else {
    if (userPicture) {
      avatarSrc = userPicture;
    } else if (userName) {
      const nameInitials = userName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
      avatarInitials = nameInitials;
    } else if (userEmail) {
      // if user email exits which is the default
      avatarInitials = userEmail.charAt(0).toUpperCase();
    }
  }

  return (
    <div
      className={`
      th-font-heavy
      ${size === "small" && "h-[25px] w-[25px] text-sm th-font-book "} 
      ${size === "medium" && "h-[30px] w-[30px] text-lg"} 
      ${size === "large" && "h-[5.5rem] w-[5.8rem] text-3xl"} 
      flex rounded-full bg-lmh-dark-blue  justify-center items-center relative`}
    >
      {avatarSrc ? (
        <>
          <Image
            src={avatarSrc}
            alt={avatarSrc}
            className="rounded-full "
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            fill
          />
          {avatarSrc}
        </>
      ) : (
        <span className="text-white ">{avatarInitials}</span>
      )}
    </div>
  );
};

export default UserAvatar;
