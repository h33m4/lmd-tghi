"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { prismaWriter } from "@/lib/prisma";

const CONFIG_FILE = path.join(process.cwd(), "src", "config", "portal-config.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerType = "info" | "warning" | "success";
export type AnnouncementType = "info" | "update" | "warning" | "maintenance";
export type NavBadgeType = "new" | "updated" | "custom";
export type NavBadgeColor = "green" | "blue" | "amber" | "red" | "purple" | "pink" | "teal";

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

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  version?: string;
  active: boolean;
  seenVersion: number;
  createdAt: string;
}

export interface NavBadge {
  id: string;
  route: string;
  label: string;
  type: NavBadgeType;
  color: NavBadgeColor | string;
  seenVersion: number;
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
  // Legacy single-banner fields retained for backwards compat
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

// ─── Defaults ─────────────────────────────────────────────────────────────────

function defaultConfig(): PortalConfig {
  return {
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
      title: "Welcome to LMD Portal 2.0",
      subtitle: "",
      steps: [],
    },
  };
}

// ─── Read ─────────────────────────────────────────────────────────────────────

function mergeConfig(raw: Partial<PortalConfig>): PortalConfig {
  const def = defaultConfig();
  const merged: PortalConfig = {
    ...def,
    ...raw,
    layoutFlags:   { ...def.layoutFlags,  ...(raw.layoutFlags  ?? {}) },
    welcomeTour:   { ...def.welcomeTour,   ...(raw.welcomeTour  ?? {}) },
    banners:       raw.banners       ?? [],
    navBadges:     (raw.navBadges ?? []).map((b) => ({ ...b, seenVersion: b.seenVersion ?? 1 })),
    announcements: raw.announcements ?? [],
  };
  // One-time migration: move old single-banner into banners[]
  if (!raw.banners && raw.layoutFlags?.topBannerMessage) {
    const lf = raw.layoutFlags;
    merged.banners = [{
      id: "banner-migrated",
      message: lf.topBannerMessage,
      type: lf.topBannerType ?? "info",
      icon: lf.topBannerIcon ?? "megaphone",
      customColor: lf.topBannerCustomColor ?? "",
      enabled: lf.topBannerEnabled ?? true,
      seenVersion: lf.topBannerSeenVersion ?? 1,
      createdAt: new Date().toISOString(),
    }];
  }
  return merged;
}

export async function getPortalConfig(): Promise<PortalConfig> {
  // 1. Try DB
  try {
    const row = await prismaWriter.portalConfig.findUnique({ where: { id: "global" } });
    if (row) return mergeConfig(row.config as Partial<PortalConfig>);
  } catch { /* table not yet created — fall through */ }

  // 2. Fall back to JSON file (dev / pre-migration)
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    return mergeConfig(raw);
  } catch { /* file missing */ }

  return defaultConfig();
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function savePortalConfig(
  config: PortalConfig
): Promise<{ ok: boolean; message: string }> {
  // 1. Try DB
  try {
    await prismaWriter.portalConfig.upsert({
      where:  { id: "global" },
      create: { id: "global", config: config as object },
      update: { config: config as object },
    });
    revalidatePath("/settings/portal-management");
    return { ok: true, message: "Configuration saved." };
  } catch { /* table not yet created — fall through */ }

  // 2. Fall back to JSON file (dev / pre-migration)
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
    revalidatePath("/settings/portal-management");
    return { ok: true, message: "Configuration saved." };
  } catch (e) {
    console.error("savePortalConfig error:", e);
    return { ok: false, message: "Failed to save configuration." };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function resetBannerSeen(id: string): Promise<{ ok: boolean; message: string }> {
  const config = await getPortalConfig();
  const banner = config.banners.find((b) => b.id === id);
  if (!banner) return { ok: false, message: "Banner not found." };
  banner.seenVersion = (banner.seenVersion ?? 1) + 1;
  const result = await savePortalConfig(config);
  return result.ok ? { ok: true, message: "Banner reset — all users will see it again." } : result;
}

export async function forceLogoutAllUsers(): Promise<{ ok: boolean; message: string }> {
  const config = await getPortalConfig();
  config.forceLogoutAfter = new Date().toISOString();
  const result = await savePortalConfig(config);
  return result.ok
    ? { ok: true, message: "Force logout set. All users will be signed out on their next page load." }
    : result;
}

export async function clearForceLogout(): Promise<{ ok: boolean; message: string }> {
  const config = await getPortalConfig();
  config.forceLogoutAfter = null;
  return savePortalConfig(config);
}

export async function resetAnnouncementSeen(id: string): Promise<{ ok: boolean; message: string }> {
  const config = await getPortalConfig();
  const ann = config.announcements.find((a) => a.id === id);
  if (!ann) return { ok: false, message: "Announcement not found." };
  ann.seenVersion = (ann.seenVersion ?? 0) + 1;
  return savePortalConfig(config);
}

export async function resetNavBadgeSeen(id: string): Promise<{ ok: boolean; message: string }> {
  const config = await getPortalConfig();
  const badge = config.navBadges.find((b) => b.id === id);
  if (!badge) return { ok: false, message: "Badge not found." };
  badge.seenVersion = (badge.seenVersion ?? 1) + 1;
  const result = await savePortalConfig(config);
  return result.ok ? { ok: true, message: "Badge reset — all users will see it again." } : result;
}

// ─── Public Routes ────────────────────────────────────────────────────────────

const ROUTES_FILE = path.join(process.cwd(), "src", "routes.ts");

export async function getPublicRoutes(): Promise<string[]> {
  try {
    const content = fs.readFileSync(ROUTES_FILE, "utf8");
    const match = content.match(
      /export const publicRoutes:\s*string\[\]\s*=\s*\[([\s\S]*?)\];/
    );
    if (!match) return [];
    return match[1]
      .split("\n")
      .map((l) => l.trim().replace(/[",]/g, "").trim())
      .filter((l) => l.startsWith("/"));
  } catch {
    return [];
  }
}

export async function savePublicRoutes(
  routes: string[]
): Promise<{ ok: boolean; message: string }> {
  try {
    const content = fs.readFileSync(ROUTES_FILE, "utf8");
    const routesList = routes.map((r) => `  "${r}",`).join("\n");
    const newContent = content.replace(
      /export const publicRoutes:\s*string\[\]\s*=\s*\[[\s\S]*?\];/,
      `export const publicRoutes: string[] = [\n${routesList}\n];`
    );
    fs.writeFileSync(ROUTES_FILE, newContent, "utf8");
    revalidatePath("/settings/portal-management");
    return {
      ok: true,
      message: "Routes saved. Restart the server for middleware changes to take effect.",
    };
  } catch {
    return { ok: false, message: "Failed to write routes file. Check server permissions." };
  }
}
