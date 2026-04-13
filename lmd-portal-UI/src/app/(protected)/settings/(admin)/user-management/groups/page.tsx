import { metaObject } from "@/config/site.config";
import React from "react";
import { cn } from "@/lib/utils";
import UserGroupTable from "./_components/userGroupTable";
import InfoBanner from "@/components/ui/banner/InfoBanner";
import handleGetAllUserGroups from "@/lib/actions/auth/handleGetAllUserGroups";

export const metadata = {
  ...metaObject("Settings | User Groups"),
};

export default async function UserGroupsPage() {
  const data = await handleGetAllUserGroups();

  return (
    <>
      <div className="border-b border-border mb-8 pb-2 sticky pt-4 top-0 z-20 bg-[#f7f7f7] dark:bg-[#0e1117] backdrop-blur supports-[backdrop-filter]:bg-[#f7f7f7]/70">
        <InfoBanner
          title="Quick Notice"
          description="This section displays the Cognito groups used for managing user access levels. To add a user to a group or modify their permissions (elevate or downgrade), please visit the individual user details modal"
          className="mb-4"
        />
        <h1 className="text-2xl th-font-roman mb-2">User Groups</h1>
        <p className="text-sm">
          Create and manage user groups, and their corresponding permissions.
        </p>
      </div>
      <div
        className={cn(
          "@container",
          "h-full flex flex-col justify-between overflow-auto"
        )}
      >
        {data.error || !data.groups ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-th-text-muted">
            Failed to load user groups. Please refresh the page.
          </div>
        ) : (
          <UserGroupTable groups={data.groups} />
        )}
      </div>
    </>
  );
}
