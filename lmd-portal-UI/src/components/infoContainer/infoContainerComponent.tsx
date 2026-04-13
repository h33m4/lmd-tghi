"use client";

import React from "react";
import { Popover, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export interface InfoContainerProps {
  /** Unique identifier (useful for testing / analytics) */
  id: string;

  /** Main informational text */
  text?: string;

  /** Optional extra content (buttons, links, etc.) */
  children?: React.ReactNode;

  /** Popover placement */
  placement?: "top" | "right" | "bottom" | "left";

  /** Icon size in pixels */
  iconSize?: number;
}

export const InfoContainer: React.FC<InfoContainerProps> = ({
  id,
  text,
  children,
  placement,
  iconSize = 16,
}) => {
  const content = (
    <div className="max-w-xs space-y-2  border-sky-400  ">
      {text && <div className="  border-gray-200 text-sm">{text}</div>}

      {children && <div className="  border-gray-200 text-sm">{children}</div>}
    </div>
  );

  return (
    <Popover
      content={content}
      placement={placement}
      trigger={"hover"}
      className="px-2 w-fit cursor-pointer "
      openClassName=""
      zIndex={9999999999999999}
    >
      <InfoCircleOutlined
        id={id}
        // style={{
        //   fontSize: iconSize,
        //   color: "#8c8c8c",
        //   cursor: "pointer",
        // }}
        className="text-gray-500 dark:text-gray-500 "
        aria-label="More information"
      />
    </Popover>
  );
};
