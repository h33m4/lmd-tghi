"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type BannerType = "info" | "warning" | "success";
export type NavBadgeType = "new" | "updated" | "custom";

export interface Banner {
  id: string;
  message: string;
  type: BannerType;
  icon: string;
  customColor: string;
  enabled: boolean;
  seenVersion: number;
  createdAt: string;
}

export interface NavBadge {
  id: string;
  route: string;
  label: string;
  type: NavBadgeType;
  color: string;
  seenVersion: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  version?: string;
  active: boolean;
  seenVersion: number;
  createdAt: string;
}

export interface TourStep {
  id: string;
  title: string;
  description: string;
  emoji?: string;
}

export interface WelcomeTour {
  enabled: boolean;
  seenVersion: number;
  title: string;
  subtitle?: string;
  steps: TourStep[];
}

export interface PortalConfig {
  forceLogoutAfter: string | null;
  layoutFlags: {
    topBannerEnabled: boolean;
    topBannerMessage: string;
    topBannerType: BannerType;
    topBannerLinkText: string;
    topBannerLinkUrl: string;
    topBannerSeenVersion: number;
    topBannerIcon?: string;
    topBannerCustomColor?: string;
  };
  banners: Banner[];
  navBadges: NavBadge[];
  announcements: Announcement[];
  welcomeTour: WelcomeTour;
}

const DEFAULT: PortalConfig = {
  forceLogoutAfter: null,
  layoutFlags: {
    topBannerEnabled: false,
    topBannerMessage: "",
    topBannerType: "info",
    topBannerLinkText: "",
    topBannerLinkUrl: "",
    topBannerSeenVersion: 1,
    topBannerIcon: "megaphone",
    topBannerCustomColor: "",
  },
  banners: [],
  navBadges: [],
  announcements: [],
  welcomeTour: {
    enabled: false,
    seenVersion: 1,
    title: "",
    subtitle: "",
    steps: [],
  },
};

const PortalConfigCtx = createContext<PortalConfig>(DEFAULT);

export function PortalConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PortalConfig>(DEFAULT);

  useEffect(() => {
    fetch("/api/portal-config")
      .then((r) => r.json())
      .then((data) => setConfig({ ...DEFAULT, ...data, layoutFlags: { ...DEFAULT.layoutFlags, ...(data.layoutFlags ?? {}) }, welcomeTour: { ...DEFAULT.welcomeTour, ...(data.welcomeTour ?? {}) }, banners: data.banners ?? [] }))
      .catch(() => {});
  }, []);

  return (
    <PortalConfigCtx.Provider value={config}>
      {children}
    </PortalConfigCtx.Provider>
  );
}

export function usePortalConfig() {
  return useContext(PortalConfigCtx);
}
