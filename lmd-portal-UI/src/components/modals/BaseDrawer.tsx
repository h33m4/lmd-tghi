import { Drawer } from "antd";
import React, { ReactNode } from "react";

type Props = {
  onCloseModal?: () => void;
  isOpen: boolean;
  size?: "small" | "medium" | "large";
  children: ReactNode;
};

function BaseDrawer({
  onCloseModal = () => {},
  isOpen = false,
  size = "small",
  children,
}: Props) {
  return (
    <Drawer
      placement="right"
      onClose={onCloseModal}
      open={isOpen}
      width={size === "small" ? 320 : size === "medium" ? 450 : 550}
      className="rounded-tl-xl rounded-bl-xl p-0"
    >
      {children}
    </Drawer>
  );
}

export default BaseDrawer;
