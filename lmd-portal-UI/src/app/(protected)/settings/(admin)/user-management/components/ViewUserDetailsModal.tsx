"use client";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { IButtonStatus } from "@/types";
import { CustomCellRendererProps } from "ag-grid-react";
import React, { useRef, useState } from "react";
import { IUserRowData } from "./UsersTable";
import UserAvatar from "@/components/ui/UserAvatar";
import TextInput from "@/components/input/TextInput";
import { IAdminCreateUserDataType } from "@/lib/actions/auth/handleAdminCreateUser";

import isEqual from "lodash/isEqual";
import BadgeButton from "./BadgeButton";
import handleAdminUpdateUserAttribute from "@/lib/actions/auth/handleAdminUpdateUserAttributes";
import ErrorBanner from "@/components/ui/banner/ErrorBanner";
import { updateUserObject } from "./updateUserObject";
import AdminUserDetailsActionMenuDropdown from "@/components/dropdowns/menuDropdowns/AdminUserDetailsActionMenuDropdown";
import { IUserGroup } from "../groups/_components/userGroupTable";
import handleListUserGroups from "@/lib/actions/auth/handleListGroupsForUser";
import handleGetAllUserGroups from "@/lib/actions/auth/handleGetAllUserGroups";
import { Select } from "antd";
import handleAddUserToGroup from "@/lib/actions/auth/handleAddUserToGroup";
import handleRemoveUserFromGroup from "@/lib/actions/auth/handleRemoveUserFromGroup";
import { toast } from "sonner";

// Defined at module level to avoid React treating it as a new component type on every render
const AttributeCard = ({
  label,
  value,
  useBadge = false,
  badgeVariant,
  badgeShowDot = false,
}: {
  label: string;
  value: string;
  useBadge?: boolean;
  badgeVariant?: "red" | "blue" | "green" | "yellow";
  badgeShowDot?: boolean;
}) => (
  <div className="flex gap-2">
    <label className="text-lmh-dark-blue th-font-book text-sm">{label}:</label>
    {!useBadge ? (
      <p className="text-th-text-muted th-font-roman text-sm">{value}</p>
    ) : (
      <BadgeButton value={value} showDot={badgeShowDot} variant={badgeVariant} />
    )}
  </div>
);

const ViewUserDetailsModal = ({
  props,
}: {
  props: CustomCellRendererProps<IUserRowData>;
}) => {
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const baseModalRef = useRef<BaseModalRef>(null);
  const [formError, setFormError] = useState<string>();

  const [userGroups, setUserGroups] = useState<IUserGroup[]>([]);
  const [allUserGroups, setAllUserGroups] = useState<IUserGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const originalUserData: IAdminCreateUserDataType = {
    username: props.data?.Username ?? "",
    name: props.data?.Attributes.find((attr) => attr.Name === "name")?.Value ?? "",
    email: props.data?.Attributes.find((attr) => attr.Name === "email")?.Value ?? "",
    department:
      props.data?.Attributes.find((attr) => attr.Name === "custom:department")?.Value ?? "",
    title:
      props.data?.Attributes.find((attr) => attr.Name === "custom:title")?.Value ?? "",
  };

  const [userData, setUserData] = useState<IAdminCreateUserDataType>({
    ...originalUserData,
  });

  const handleFormDataChange = (fieldName: string, value: string) => {
    setUserData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const fetchUserGroups = async () => {
    const response = await handleListUserGroups(props.data?.Username!);
    if (response.success && response.groups) {
      setUserGroups(response.groups);
      setSelectedGroups(response.groups.map((g) => g.GroupName));
    }
  };

  const fetchAllGroups = async () => {
    const response = await handleGetAllUserGroups();
    if (response.success && response.groups) {
      setAllUserGroups(response.groups);
    }
  };

  const handleClose = () => {
    setFormError(undefined);
    setButtonStatus("default");
    setUserData({ ...originalUserData });
    setSelectedGroups(userGroups.map((g) => g.GroupName));
  };

  const handleOpenModal = async () => {
    await Promise.all([fetchUserGroups(), fetchAllGroups()]);
  };

  const hasAttributeChanges = !isEqual(userData, originalUserData);
  const hasGroupChanges = !isEqual(
    [...selectedGroups].sort(),
    userGroups.map((g) => g.GroupName).sort()
  );

  const onFormSubmitHandler = async () => {
    if (!hasAttributeChanges && !hasGroupChanges) return;

    setButtonStatus("loading");
    setFormError(undefined);

    try {
      if (hasAttributeChanges) {
        const attrResponse = await handleAdminUpdateUserAttribute(userData);
        if (attrResponse.error) {
          setFormError(attrResponse.error);
          return;
        }
      }

      if (hasGroupChanges) {
        const currentGroupNames = userGroups.map((g) => g.GroupName);
        const groupsToRemove = currentGroupNames.filter(
          (g) => !selectedGroups.includes(g)
        );
        const groupsToAdd = selectedGroups.filter(
          (g) => !currentGroupNames.includes(g)
        );

        const results = await Promise.all([
          ...groupsToRemove.map((group) =>
            handleRemoveUserFromGroup({ username: props.data?.Username!, groupName: group })
          ),
          ...groupsToAdd.map((group) =>
            handleAddUserToGroup({ username: props.data?.Username!, groupName: group })
          ),
        ]);

        const error = results.find((r) => r.error);
        if (error) {
          setFormError(error.error);
          return;
        }
      }

      toast.success("User updated successfully");
      const newUserRowData = updateUserObject(props.data!, userData);
      props.node.updateData(newUserRowData);
      baseModalRef.current?.closeModal();
    } catch {
      setFormError("An error occurred while updating user");
    } finally {
      setButtonStatus("default");
    }
  };

  return (
    <BaseModal
      ref={baseModalRef}
      title="User Details"
      size="medium"
      buttonComponent={
        <button
          className="text-sm bg-lmh-pink px-2.5 py-0.5 text-white rounded-md th-font-book"
          onClick={handleOpenModal}
        >
          View More
        </button>
      }
      ctaTitle={
        hasAttributeChanges || hasGroupChanges
          ? buttonStatus === "loading"
            ? "Updating User"
            : "Update User"
          : ""
      }
      ctaOnClicked={onFormSubmitHandler}
      isCtaDisabled={false}
      isLoading={buttonStatus === "loading"}
      components={
        <div className="px-6 py-4 overflow-y-auto h-[70vh]">
          <div className="h-[6rem] border-b-[0.5px] pb-2 mt-1 mb-4 border-primary flex sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-4 h-full items-center">
              <div className="flex-shrink-0">
                <UserAvatar
                  self={false}
                  userEmail={
                    props.data?.Attributes.find((attr) => attr.Name === "email")?.Value
                  }
                  userName={
                    props.data?.Attributes.find((attr) => attr.Name === "name")?.Value
                  }
                  size="large"
                />
              </div>

              <div className="h-full flex flex-col items-start justify-end">
                <AttributeCard
                  label="Email"
                  value={
                    props.data?.Attributes.find((attr) => attr.Name === "email")?.Value ?? ""
                  }
                />
                <AttributeCard
                  label="User ID (sub)"
                  value={
                    props.data?.Attributes.find((attr) => attr.Name === "sub")?.Value ?? ""
                  }
                />
                <AttributeCard
                  label="Confirmation Status"
                  value={props.data?.UserStatus ?? ""}
                  useBadge={true}
                  badgeVariant={
                    props.data?.UserStatus === "CONFIRMED"
                      ? "green"
                      : props.data?.UserStatus === "FORCE_CHANGE_PASSWORD"
                      ? "red"
                      : "yellow"
                  }
                />
              </div>
            </div>

            <div className="h-full flex flex-col justify-between items-end -mt-2">
              <AdminUserDetailsActionMenuDropdown props={props} />
              <div className="flex flex-col items-end mt-2">
                <AttributeCard
                  label="Status"
                  value={props.data?.Enabled ? "Enabled" : "Disabled"}
                  useBadge={true}
                  badgeShowDot={true}
                  badgeVariant={props.data?.Enabled ? "yellow" : "red"}
                />
                <AttributeCard
                  label="Date Added"
                  value={props.data?.UserCreateDate.toDateString() ?? ""}
                />
                <AttributeCard
                  label="Last Updated"
                  value={props.data?.UserLastModifiedDate.toDateString() ?? ""}
                />
              </div>
            </div>
          </div>

          <ErrorBanner message={formError} setFormError={setFormError} />

          <div className="mt-4 flex flex-col gap-4">
            <TextInput
              onInputChange={(value) => handleFormDataChange("name", value)}
              labelText="Name"
              name="name"
              value={userData.name}
              isRequired
            />
            <div className="flex flex-col md:flex-row gap-3 md:gap-10">
              <TextInput
                onInputChange={(value) => handleFormDataChange("title", value)}
                labelText="Title"
                name="title"
                value={userData.title}
              />
              <TextInput
                onInputChange={(value) => handleFormDataChange("department", value)}
                labelText="Department"
                name="department"
                value={userData.department}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-gray-700">Access Level</label>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Select access levels"
                value={selectedGroups}
                onChange={setSelectedGroups}
                options={allUserGroups.map((group) => ({
                  label: group.GroupName,
                  value: group.GroupName,
                }))}
                getPopupContainer={(trigger) => trigger.parentElement!}
              />
            </div>
          </div>
        </div>
      }
      cancelOnClicked={handleClose}
      onCloseModal={handleClose}
    />
  );
};

export default ViewUserDetailsModal;
