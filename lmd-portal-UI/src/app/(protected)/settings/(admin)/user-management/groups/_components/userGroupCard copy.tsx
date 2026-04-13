import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import ViewUserGroupModal from "./viewUserGroupModal";

type User = {
  id: number;
  role: any;
  avatar: string;
};

interface UserGroupCardProps {
  name: string;
  color?: string;
  className?: string;
  users: User[];
  description: string;
}

export default function UserGroupCard({
  className,
  color,
  users,
  name,
  description,
}: UserGroupCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border h-full flex flex-col justify-between group hover:bg-backgroundf hover:shadow-md p-5",
        className
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-content-center rounded-lg text-white"
            style={{
              backgroundColor: color,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 6.5H16.75C18.8567 6.5 19.91 6.5 20.6667 7.00559C20.9943 7.22447 21.2755 7.50572 21.4944 7.83329C21.935 8.49268 21.9916 8.96506 21.9989 10.5M12 6.5L11.3666 5.23313C10.8418 4.18358 10.3622 3.12712 9.19926 2.69101C8.6899 2.5 8.10802 2.5 6.94427 2.5C5.1278 2.5 4.21956 2.5 3.53806 2.88032C3.05227 3.15142 2.65142 3.55227 2.38032 4.03806C2 4.71956 2 5.6278 2 7.44427V10.5C2 15.214 2 17.5711 3.46447 19.0355C4.8215 20.3926 6.44493 20.4927 10.5 20.5H11"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M15.59 18.9736C14.9612 19.3001 13.3126 19.9668 14.3167 20.801C14.8072 21.2085 15.3536 21.4999 16.0404 21.4999H19.9596C20.6464 21.4999 21.1928 21.2085 21.6833 20.801C22.6874 19.9668 21.0388 19.3001 20.41 18.9736C18.9355 18.208 17.0645 18.208 15.59 18.9736Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M20 14.4378C20 15.508 19.1046 16.3756 18 16.3756C16.8954 16.3756 16 15.508 16 14.4378C16 13.3676 16.8954 12.5 18 12.5C19.1046 12.5 20 13.3676 20 14.4378Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </span>
          <h4 className="font-medium">{name}</h4>
        </div>
      </header>
      <div className="mt-2">
        <span className="text-sm">{description}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((user, _id) => (
            <figure
              key={_id}
              className="relative z-10 -ml-[8px] h-9 w-9 rounded-full "
            >
              {/* <Image
                src={user.avatar}
                alt="user avatar"
                fill
                className="rounded-full"
              /> */}
              <Avatar className="border h-9 w-9">
                <AvatarFallback className="bg-gray-400 text-white h-full w-full text-xs border border-background dark:border-white">
                  JM
                </AvatarFallback>
              </Avatar>
            </figure>
          ))}
        </div>

        <span className="text-sm">Total: {users.length} users</span>
      </div>
      {/* <ViewUserGroupModal
        name={name}
        color={color!}
        description={description}
      /> */}
    </div>
  );
}
