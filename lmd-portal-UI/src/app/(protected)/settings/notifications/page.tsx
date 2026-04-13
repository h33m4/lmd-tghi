import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("Notification Settings"),
};

export default function NotificationPage() {
  return (
    <div>
      <div className="border-b border-border mb-8 pb-2 pt-4">
        <h1 className="text-2xl th-font-roman mb-2">Notifications</h1>
        <p className="text-sm">Customize your notifications on the portal</p>
      </div>
    </div>
  );
}
