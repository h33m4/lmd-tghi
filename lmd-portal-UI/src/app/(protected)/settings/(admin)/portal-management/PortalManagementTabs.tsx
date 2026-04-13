"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ShieldCheckIcon,
  Cog6ToothIcon,
  MegaphoneIcon,
  UserGroupIcon,
  TagIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import PageVisibilityClient from "./PageVisibilityClient";
import AppSettingsClient from "./AppSettingsClient";
import AnnouncementsClient from "./AnnouncementsClient";
import SessionsClient from "./SessionsClient";
import NavBadgesClient from "./NavBadgesClient";
import WelcomeTourClient from "./WelcomeTourClient";
import { PortalConfig } from "./actions";

type Tab = "visibility" | "app-settings" | "nav-badges" | "announcements" | "welcome-tour" | "sessions";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "visibility",    label: "Page Visibility", icon: <ShieldCheckIcon className="h-4 w-4" /> },
  { id: "app-settings",  label: "App Settings",    icon: <Cog6ToothIcon className="h-4 w-4" /> },
  { id: "nav-badges",    label: "Nav Badges",       icon: <TagIcon className="h-4 w-4" /> },
  { id: "announcements", label: "Announcements",    icon: <MegaphoneIcon className="h-4 w-4" /> },
  { id: "welcome-tour",  label: "Welcome Tour",     icon: <SparklesIcon className="h-4 w-4" /> },
  { id: "sessions",      label: "Sessions",         icon: <UserGroupIcon className="h-4 w-4" /> },
];

type Props = {
  publicRoutes: string[];
  portalConfig: PortalConfig;
};

export default function PortalManagementTabs({ publicRoutes, portalConfig }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("visibility");

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 border-b border-border overflow-x-auto pb-0 -mb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors -mb-px",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="pt-1">
        {activeTab === "visibility"    && <PageVisibilityClient initialPublicRoutes={publicRoutes} />}
        {activeTab === "app-settings"  && <AppSettingsClient initialConfig={portalConfig} />}
        {activeTab === "nav-badges"    && <NavBadgesClient initialConfig={portalConfig} />}
        {activeTab === "announcements" && <AnnouncementsClient initialConfig={portalConfig} />}
        {activeTab === "welcome-tour"  && <WelcomeTourClient initialConfig={portalConfig} />}
        {activeTab === "sessions"      && <SessionsClient initialConfig={portalConfig} />}
      </div>
    </div>
  );
}
