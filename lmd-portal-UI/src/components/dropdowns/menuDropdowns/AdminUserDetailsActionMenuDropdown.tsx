import React, { useState } from "react";
import BaseMenuDropdown from "./BaseMenuDropDown";
import { Menu } from "@headlessui/react";
import { concatClassNames } from "@/utils/helper_functions";
import {
  RssIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { CustomCellRendererProps } from "ag-grid-react";
import { IUserRowData } from "@/app/(protected)/settings/(admin)/user-management/components/UsersTable";
import handleAdminUpdateUserStatus from "@/lib/actions/auth/handleAdminUpdateUserStatus";
import { IButtonStatus } from "@/types";
import { LoadingOutlined } from "@ant-design/icons";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import handleAdminDeleteUser from "@/lib/actions/auth/handleAdminDeleteUser";
import { MailPlus } from "lucide-react";
import handleResendWelcomeMessage from "@/lib/actions/auth/handleAdminResendWelcomeMessage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  props: CustomCellRendererProps<IUserRowData>;
};

type NavITemsType = {
  title: string;
  onClickHandler: () => void;
  icon: any;
  hidden?: boolean;
};

const AdminUserDetailsActionMenuDropdown = ({ props }: Props) => {
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const NavItems: NavITemsType[] = [
    {
      title: props.data?.Enabled ? "Disable User" : "Enable User",
      onClickHandler: updateUserStatus,
      icon: props.data?.Enabled ? LockClosedIcon : LockOpenIcon,
      hidden: false,
    },
    {
      title: "Delete User",
      onClickHandler: deleteUser,
      icon: TrashIcon,
      hidden: false,
    },
    {
      title: "Reset Password",
      onClickHandler: () => console.log("click me rest"),
      icon: RssIcon,
      hidden: false,
    },
    {
      title: "Resend Welcome Message",
      onClickHandler: resendWelcomeMessage,
      icon: MailPlus,
      hidden: props.data?.UserStatus === "EXTERNAL_PROVIDER",
    },
  ];

  async function updateUserStatus() {
    console.log("clicking me");
    setButtonStatus("loading");
    const { error, success } = await handleAdminUpdateUserStatus({
      username: props.data?.Username!,
      status: props.data?.Enabled!,
    });
    setButtonStatus("default");
    if (error) {
      ErrorToast({ message: error });
    }
    if (success) {
      SuccessToast({ message: success });
      if (success.includes("disabled")) {
        props.node.setDataValue("Enabled", false);
        //
        // props.node.updateData()
      } else if (success.includes("enabled")) {
        props.node.setDataValue("Enabled", true);
      }
    }
  }

  async function deleteUser() {
    console.log("deleting user");
    setButtonStatus("loading");
    const { error, success } = await handleAdminDeleteUser(
      props.data?.Username!
    );
    setButtonStatus("default");
    if (error) {
      ErrorToast({ message: error });
    }
    if (success) {
      SuccessToast({ message: success });
      props.api.applyTransaction({ remove: [props.node.data!] });
    }
  }

  async function resendWelcomeMessage() {
    console.log("resending welcome email");
    setButtonStatus("loading");
    const { error, success } = await handleResendWelcomeMessage({
      email: props.data?.Attributes.find((attr) => attr.Name === "email")
        ?.Value!,
    });
    setButtonStatus("default");
    if (error) {
      toast.success(error || "Error resending welcome email");
      ErrorToast({ message: error });
    }
    if (success) {
      toast.success(success || "Welcome email resent successfully");
      SuccessToast({ message: success });
    }
  }

  return (
    <BaseMenuDropdown
      buttonComponent={
        <p className="text-sm bg-primary text-white ml-2 flex gap-2 ">
          Action{" "}
          {buttonStatus === "loading" && (
            <LoadingOutlined style={{ fontSize: 14 }} spin rev={undefined} />
          )}
        </p>
      }
      widthClass="mt-1 rounded-mds"
      buttonClass={`bg-primary rounded-md text-white  `}
    >
      <nav className="px-1 py-1.5 space-y-0 text-sm flex flex-col">
        {NavItems.map((navItem, _x) => (
          <Menu.Item key={_x}>
            {({ active }) => (
              <button
                className={cn(
                  active
                    ? "bg-gray-100 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary",
                  "group flex items-center px-2 py-1.5 font-medium rounded-md w-full text-sm th-font-roman cursor-pointer whitespace-nowrap",
                  navItem.hidden ? "hidden" : ""
                )}
                onClick={navItem.onClickHandler}
              >
                <navItem.icon className="h-4 w-4 mr-3" />
                {navItem.title}
              </button>
            )}
          </Menu.Item>
        ))}
      </nav>
    </BaseMenuDropdown>
  );
};

export default AdminUserDetailsActionMenuDropdown;
