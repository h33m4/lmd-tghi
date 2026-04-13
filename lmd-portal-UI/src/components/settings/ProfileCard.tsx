"use client";

import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/chat-helpers";
import InfoBanner from "../ui/banner/InfoBanner";

type UserAttributeProps = {
  name: string;
  value: string | string[];
};

const UserAttribute = ({ name, value }: UserAttributeProps) => (
  <div className="grid grid-cols-5 py-4 border-b last:border-b-0">
    <div>
      <h2 className="text-sm th-font-roman text-th-text-lmh-dark-blue">{name}</h2>
    </div>
    <div className="col-span-4">
      <p className="text-base th-font-book text-th-text-muted">
        {Array.isArray(value) ? value.join(", ") : value}
      </p>
    </div>
  </div>
);

const ProfileCard = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const userAttributes = useMemo<UserAttributeProps[]>(
    () => [
      { name: "Full name", value: user?.name ?? "Not Set" },
      { name: "Email", value: user?.email ?? "Not Set" },
      { name: "Title", value: user?.title ?? "Not Set" },
      { name: "Department", value: user?.department ?? "Not Set" },
      { name: "Access Type", value: user?.groups ?? ["Not Set"] },
    ],
    [user]
  );

  return (
    <section aria-labelledby="profile-overview-title" className="pt-4">
      <InfoBanner
        setFormInfo={() => {}}
        title="Quick Notice"
        description="Your current access type grants only minimum permissions. To request elevated access or update your account details (e.g., full name, department, or title), please open a support ticket or contact the LMD administrators"
        className="mb-4"
      />
      <div className="overflow-hidden rounded-lg bg-background border dark:border-border">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>

        <div className="px-6 py-5">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-4 flex items-center justify-center">
              <Avatar className="h-[8rem] w-[8rem] 2xl:mb-1 cursor-pointer bg-lmh-dark-blue flex flex-col items-center justify-center border active:border-2 hover:border-primary">
                <AvatarImage
                  src={session?.user.image ?? undefined}
                  alt={user?.name ?? ""}
                />
                <AvatarFallback className="2xl:text-sm text-[13px] th-font-medium tracking-wide">
                  {getInitials(user?.name ?? "", user?.email ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-end">
                <p className="text-xl th-font-heavy tracking-tight text-lmh-dark-grey dark:text-foreground">
                  {user?.name}
                </p>
                <p className="text-sm font-medium text-primary">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-4">
          {userAttributes.map((attr) => (
            <UserAttribute key={attr.name} {...attr} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
