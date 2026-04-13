"use client";

import { useCallback, useRef, useState } from "react";
import { RectangleStackIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";

import handleGetAllUsersInGroup from "@/lib/actions/auth/handleGetAllUsersInGroup";
import handleGetAlUsers from "@/lib/actions/auth/handleGetAllUsers";
import handleAddUserToGroup from "@/lib/actions/auth/handleAddUserToGroup";
import { IUserRowData } from "../../components/UsersTable";
import Spinner from "@/components/ui/spinner";
import NoDataFoundIcon from "@public/assets/icons/no-data-found.svg";
import UsersTable2 from "./usersTable2";

type Props = {
  color: string;
  GroupName: string;
  Description: string;
  LastModifiedDate?: Date | string;
  CreationDate?: Date | string;
};

const attr = (row: IUserRowData, name: string) =>
  row.Attributes.find((a) => a.Name === name)?.Value ?? "";

export default function ViewUserGroupModal({
  color,
  GroupName,
  Description,
  LastModifiedDate,
  CreationDate,
}: Props) {
  const [users, setUsers] = useState<IUserRowData[]>();
  const [fetchError, setFetchError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<BaseModalRef>(null);

  // Add-user panel state
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [allPoolUsers, setAllPoolUsers] = useState<IUserRowData[]>([]);
  const [addSearch, setAddSearch] = useState("");
  const [addingUsername, setAddingUsername] = useState<string | null>(null);

  const fetchGroupUsers = useCallback(async () => {
    setLoading(true);
    setFetchError(undefined);
    try {
      const data = await handleGetAllUsersInGroup({ GroupName });
      if (data.error) {
        setFetchError(data.error);
        setUsers([]);
      } else {
        setUsers(data.users ?? []);
      }
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [GroupName]);

  const openModalAndFetchData = useCallback(async () => {
    modalRef.current?.openModal();
    await fetchGroupUsers();
  }, [fetchGroupUsers]);

  const openAddPanel = useCallback(async () => {
    setShowAddPanel(true);
    setAddSearch("");
    if (allPoolUsers.length === 0) {
      const data = await handleGetAlUsers();
      setAllPoolUsers(data.success ?? []);
    }
  }, [allPoolUsers.length]);

  const closeAddPanel = useCallback(() => {
    setShowAddPanel(false);
    setAddSearch("");
  }, []);

  const addUserToGroup = useCallback(
    async (username: string) => {
      setAddingUsername(username);
      const result = await handleAddUserToGroup({ username, groupName: GroupName });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`User added to ${GroupName}`);
        // Refresh the group user list and close the panel
        await fetchGroupUsers();
        closeAddPanel();
      }
      setAddingUsername(null);
    },
    [GroupName, fetchGroupUsers, closeAddPanel]
  );

  // Users already in the group (by Username)
  const groupUsernames = new Set(users?.map((u) => u.Username) ?? []);

  // Pool users not already in this group, filtered by search
  const addablUsers = allPoolUsers.filter((u) => {
    if (groupUsernames.has(u.Username)) return false;
    const q = addSearch.toLowerCase();
    return (
      !q ||
      attr(u, "email").toLowerCase().includes(q) ||
      attr(u, "name").toLowerCase().includes(q) ||
      u.Username.toLowerCase().includes(q)
    );
  });

  return (
    <BaseModal
      ref={modalRef}
      size="medium"
      title="User Group Details"
      buttonComponent={
        <Button
          className="mt-4 -mb-2 w-full h-8"
          variant="outline"
          onClick={openModalAndFetchData}
        >
          View Group
        </Button>
      }
      components={
        <div className="px-6 py-4 h-[70vh] flex flex-col gap-3">

          {/* Header */}
          <div>
            <header className="flex flex-col items-start justify-between gap-2">
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-content-center rounded-lg text-white"
                    style={{ backgroundColor: color }}
                  >
                    <RectangleStackIcon className="h-6 w-6" />
                  </span>
                  <h4 className="font-medium text-lg">{GroupName}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex items-center gap-2 text-primary text-sm"
                >
                  Permissions
                  <RectangleStackIcon className="h-5 w-5" />
                </Button>
              </div>
              <span className="text-sm">{Description}</span>
            </header>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-th-text-muted flex gap-6">
              {CreationDate && (
                <p>Created: {new Date(CreationDate).toLocaleDateString()}</p>
              )}
              {LastModifiedDate && (
                <p>Modified: {new Date(LastModifiedDate).toLocaleDateString()}</p>
              )}
            </div>
            <Button
              className="h-7"
              variant="outline"
              onClick={openAddPanel}
            >
              Add User to Group
            </Button>
          </div>

          {/* Add-user panel */}
          {showAddPanel && (
            <div className="border rounded-md p-3 flex flex-col gap-2 bg-background">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Add a user to {GroupName}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={closeAddPanel}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>

              <input
                type="text"
                placeholder="Search by name or email..."
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="text-input h-[30px] w-full"
                autoFocus
              />

              <div className="max-h-[160px] overflow-y-auto flex flex-col gap-1">
                {allPoolUsers.length === 0 ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : addablUsers.length === 0 ? (
                  <p className="text-xs text-th-text-muted text-center py-3">
                    {addSearch
                      ? "No users match your search."
                      : "All users are already in this group."}
                  </p>
                ) : (
                  addablUsers.map((u) => (
                    <div
                      key={u.Username}
                      className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm truncate">
                          {attr(u, "name") || u.Username}
                        </span>
                        <span className="text-xs text-th-text-muted truncate">
                          {attr(u, "email")}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="dark-blue"
                        className="h-6 text-xs px-2.5 ml-2 shrink-0"
                        disabled={addingUsername === u.Username}
                        onClick={() => addUserToGroup(u.Username)}
                      >
                        {addingUsername === u.Username ? "Adding…" : "Add"}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Users table */}
          <div className="rounded-md overflow-y-auto flex-1 flex flex-col items-center justify-center">
            {loading ? (
              <Spinner />
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <p className="text-sm text-red-500">{fetchError}</p>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={fetchGroupUsers}>
                  Retry
                </Button>
              </div>
            ) : users && users.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center">
                <NoDataFoundIcon />
                <p className="text-th-muted-foreground text-sm">No users in this group</p>
              </div>
            ) : users ? (
              <div className="h-full w-full">
                <UsersTable2 userData={users} />
              </div>
            ) : null}
          </div>
        </div>
      }
    />
  );
}
