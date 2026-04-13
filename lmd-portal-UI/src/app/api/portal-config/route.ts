import { NextResponse } from "next/server";
import { prismaReader } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const CONFIG_FILE = path.join(process.cwd(), "src", "config", "portal-config.json");

const FALLBACK = {
  forceLogoutAfter: null,
  layoutFlags: {
    topBannerEnabled: false,
    topBannerMessage: "",
    topBannerType: "info",
    topBannerLinkText: "",
    topBannerLinkUrl: "",
    topBannerSeenVersion: 1,
  },
  banners: [],
  navBadges: [],
  announcements: [],
  welcomeTour: { enabled: false, seenVersion: 1, title: "", steps: [] },
};

export async function GET() {
  // 1. Try DB
  try {
    const row = await prismaReader.portalConfig.findUnique({ where: { id: "global" } });
    if (row) {
      const config = row.config as any;
      // Normalize navBadges — ensure seenVersion is always present
      if (Array.isArray(config?.navBadges)) {
        config.navBadges = config.navBadges.map((b: any) => ({ seenVersion: 1, ...b }));
      }
      return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
    }
  } catch { /* table not yet created — fall through */ }

  // 2. Fall back to JSON file (dev / pre-migration)
  try {
    const content = fs.readFileSync(CONFIG_FILE, "utf8");
    return NextResponse.json(JSON.parse(content), { headers: { "Cache-Control": "no-store" } });
  } catch { /* file missing */ }

  return NextResponse.json(FALLBACK, { headers: { "Cache-Control": "no-store" } });
}
