import { metaObject } from "@/config/site.config";
import { Metadata } from "next";
import React from "react";
import { getPublicRoutes, getPortalConfig } from "./actions";
import PortalManagementTabs from "./PortalManagementTabs";

export const metadata: Metadata = {
  ...metaObject("Settings | Portal Management"),
};

export default async function PortalManagementSettingsPage() {
  const [publicRoutes, portalConfig] = await Promise.all([
    getPublicRoutes(),
    getPortalConfig(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Portal Management</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Control page visibility, app settings, announcements, and user sessions.
        </p>
      </div>
      <PortalManagementTabs publicRoutes={publicRoutes} portalConfig={portalConfig} />
    </div>
  );
}
