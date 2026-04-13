// prisma/seed-portal-config.ts
//
// Seeds the PortalConfig table from the existing portal-config.json file.
// Safe to run multiple times — uses upsert.
//
// Usage:
//   npx ts-node --project tsconfig.seed.json prisma/seed-portal-config.ts
//   (or add to package.json scripts)

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found in environment variables!");
  process.exit(1);
}

import { prismaWriter } from "@/lib/prisma";
import * as fs from "fs";
import * as path from "path";

const CONFIG_FILE = path.join(process.cwd(), "src", "config", "portal-config.json");

async function main() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║  🌱 Portal Config Seeder               ║");
  console.log("╚════════════════════════════════════════╝");

  // Load existing config from JSON file
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error(`❌ Config file not found: ${CONFIG_FILE}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  console.log("\n📂 Loaded portal-config.json");

  // Migrate old single-banner into banners[] if needed
  if (!raw.banners && raw.layoutFlags?.topBannerMessage) {
    const lf = raw.layoutFlags;
    console.log("🔄 Migrating legacy single banner → banners[]");
    raw.banners = [{
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

  // Ensure all expected keys exist with defaults
  const seedConfig = {
    forceLogoutAfter: raw.forceLogoutAfter ?? null,
    layoutFlags: {
      topBannerEnabled: false,
      topBannerMessage: "",
      topBannerType: "info",
      topBannerLinkText: "",
      topBannerLinkUrl: "",
      topBannerSeenVersion: 1,
      topBannerIcon: "megaphone",
      topBannerCustomColor: "",
      ...(raw.layoutFlags ?? {}),
    },
    banners:       raw.banners       ?? [],
    navBadges:     raw.navBadges     ?? [],
    announcements: raw.announcements ?? [],
    welcomeTour: {
      enabled: false,
      seenVersion: 1,
      title: "Welcome to LMD Portal 2.0",
      subtitle: "",
      steps: [],
      ...(raw.welcomeTour ?? {}),
    },
  };

  console.log(`\n📊 Config summary:`);
  console.log(`   Banners:       ${seedConfig.banners.length}`);
  console.log(`   Nav badges:    ${seedConfig.navBadges.length}`);
  console.log(`   Announcements: ${seedConfig.announcements.length}`);
  console.log(`   Welcome tour:  ${seedConfig.welcomeTour.enabled ? "enabled" : "disabled"} (${seedConfig.welcomeTour.steps.length} steps)`);
  console.log(`   Force logout:  ${seedConfig.forceLogoutAfter ?? "none"}`);

  const result = await prismaWriter.portalConfig.upsert({
    where:  { id: "global" },
    create: { id: "global", config: seedConfig },
    update: { config: seedConfig },
  });

  console.log(`\n✅ PortalConfig upserted (id: ${result.id})`);
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║  ✅ Portal config seed complete        ║");
  console.log("╚════════════════════════════════════════╝\n");
}

main()
  .catch((e) => {
    console.error("\n💥 Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaWriter.$disconnect();
  });
