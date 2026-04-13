// prisma/seed.ts

// Load environment variables FIRST - before any imports
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local explicitly
const envPath = resolve(process.cwd(), ".env.local");
config({ path: envPath });

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found in environment variables!");
  process.exit(1);
}

// NOW import Prisma
import { prismaWriter } from "@/lib/prisma";
import * as fs from "fs";
import * as path from "path";

/**
 * Seed Configuration
 */
const CONFIG = {
  dataFile: "prisma/data/seed-okr-base.json",
  batchSize: 10,
  clearExisting: true,
  logVerbose: true,
};

/**
 * TypeScript interface for seed data
 */
interface SeedOkrData {
  okrId: string;
  objectiveToc: string;
  objective: string;
  keyResult: string;
  priority: number;
  status: string;
  progress: number;
  confidenceLevel: string;
  unit: string;
  baseline: number;
  targetValue: number;
  minValue?: number | null;
  maxValue?: number | null;
  calculationMethod: string;
  valueHint?: string | null;
  valuePrompt?: string | null;
  periodStart: string;
  periodEnd: string;
  chartMetricType: string;
  chartType: string;
  chartMetricUnit: string;
  archived?: boolean;
  archivedAt?: string | null;
  archivedBy?: string | null;

  // NEW: Denominator fields for percentage OKRs
  denominator?: number | null;
  denominatorLabel?: string | null;
  numeratorLabel?: string | null;

  milestones?: Array<{
    milestone: string;
    dueDate: string;
    status: string;
    completionDate?: string;
  }>;
  monthlyUpdates?: Array<{
    month: number;
    year: number;
    value: number;
    numerator?: number | null; // NEW
    denominatorOverride?: number | null; // NEW

    narrative: string;
    status: string;
    risks: string[];
    mitigations: string[];
    createdByEmail?: string | null;
    updatedByEmail?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

/**
 * Test database connection
 */
async function testConnection() {
  console.log("\n🔌 Testing database connection...");
  try {
    await prismaWriter.$connect();
    await prismaWriter.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful!");
    console.log(
      `   Database: ${process.env.DATABASE_URL?.split("@")[1]?.split("?")[0] || "Unknown"}`,
    );
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

/**
 * Load and validate data from JSON file
 */
async function loadData(): Promise<SeedOkrData[]> {
  const dataPath = path.join(process.cwd(), CONFIG.dataFile);

  console.log(`\n📂 Loading data from: ${dataPath}`);

  if (!fs.existsSync(dataPath)) {
    throw new Error(`❌ Data file not found: ${dataPath}`);
  }

  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data: SeedOkrData[] = JSON.parse(rawData);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("❌ Invalid data: Expected non-empty array");
  }

  // Validate required fields
  const requiredFields = [
    "okrId",
    "objectiveToc",
    "objective",
    "keyResult",
    "priority",
    "status",
    "unit",
    "periodStart",
    "periodEnd",
  ];

  let percentageOkrsWithoutDenominator = 0;

  for (const okr of data) {
    // Check required fields
    for (const field of requiredFields) {
      if (!okr[field as keyof SeedOkrData]) {
        throw new Error(
          `❌ Invalid OKR ${okr.okrId || "Unknown"}: Missing required field '${field}'`,
        );
      }
    }

    // NEW: Warn about percentage OKRs without denominators
    if (okr.unit === "percent" && !okr.denominator) {
      percentageOkrsWithoutDenominator++;
      console.warn(
        `⚠️  OKR ${okr.okrId} is percentage-based but missing denominator data`,
      );
    }
  }

  console.log(`✅ Loaded and validated ${data.length} OKRs`);

  if (percentageOkrsWithoutDenominator > 0) {
    console.warn(
      `⚠️  ${percentageOkrsWithoutDenominator} percentage OKRs missing denominator data`,
    );
  }

  return data;
}

/**
 * Clear existing data from database
 */
async function clearDatabase() {
  console.log("\n🗑️  Clearing existing data...");

  try {
    // Delete in order due to foreign key constraints
    const deletedUpdates = await prismaWriter.monthlyUpdate.deleteMany();
    const deletedMilestones = await prismaWriter.milestone.deleteMany();
    const deletedOkrs = await prismaWriter.okr.deleteMany();
    const deletedObjectives = await prismaWriter.okrObjective.deleteMany();

    console.log(`   ✓ Deleted ${deletedUpdates.count} monthly updates`);
    console.log(`   ✓ Deleted ${deletedMilestones.count} milestones`);
    console.log(`   ✓ Deleted ${deletedOkrs.count} OKRs`);
    console.log(`   ✓ Deleted ${deletedObjectives.count} objectives`);
    console.log("✅ Database cleared successfully");
  } catch (error) {
    console.error("❌ Failed to clear database:", error);
    throw error;
  }
}

/**
 * Derive objectives from seed data and upsert them into OkrObjective.
 * Returns a map from `objective` text → OkrObjective.id.
 */
async function upsertObjectives(okrsData: SeedOkrData[]): Promise<Map<string, string>> {
  console.log("\n📌 Upserting objectives...");

  // Collect unique objectives (keyed by text). Use the first occurrence's toc.
  const uniqueObjectives = new Map<string, { toc: string; number: number }>();
  for (const okr of okrsData) {
    if (!uniqueObjectives.has(okr.objective)) {
      const number = parseInt(okr.okrId.split(".")[0], 10) || 0;
      uniqueObjectives.set(okr.objective, { toc: okr.objectiveToc || "", number });
    }
  }

  const objectiveTextToId = new Map<string, string>();

  for (const [text, { toc, number }] of Array.from(uniqueObjectives)) {
    // Try to find an existing objective with this number, upsert by number
    const record = await prismaWriter.okrObjective.upsert({
      where: { number },
      create: { number, text, toc },
      update: { text, toc },
    });
    objectiveTextToId.set(text, record.id);
    console.log(`   ✓ Objective ${number}: "${text.substring(0, 60)}..."`);
  }

  console.log(`✅ Upserted ${uniqueObjectives.size} objectives`);
  return objectiveTextToId;
}

/**
 * Create a single OKR with all relations
 */
async function createOkr(okr: SeedOkrData, objectiveId: string) {
  if (CONFIG.logVerbose) {
    console.log(`   📝 Creating OKR ${okr.okrId}...`);
  }

  return await prismaWriter.okr.create({
    data: {
      // Basic Info
      okrId: okr.okrId,
      objectiveId,
      keyResult: okr.keyResult,
      priority: okr.priority,

      // Tracking
      status: okr.status as any,
      progress: okr.progress,
      confidenceLevel: okr.confidenceLevel as any,

      // Measurement
      unit: okr.unit as any,
      baseline: okr.baseline,
      targetValue: okr.targetValue,
      minValue: okr.minValue ?? null,
      maxValue: okr.maxValue ?? null,
      calculationMethod: okr.calculationMethod as any,
      valuePrompt: okr.valuePrompt ?? null,
      valueHint: okr.valueHint ?? null,

      // NEW: Denominator fields for percentage calculations
      denominator: okr.denominator ?? null,
      denominatorLabel: okr.denominatorLabel ?? null,
      numeratorLabel: okr.numeratorLabel ?? null,

      // Period
      periodStart: new Date(okr.periodStart),
      periodEnd: new Date(okr.periodEnd),

      // Chart metadata
      chartMetricType: okr.chartMetricType as any,
      chartType: okr.chartType as any,
      chartMetricUnit: okr.chartMetricUnit,

      // Soft delete fields
      archived: okr.archived ?? false,
      archivedAt: okr.archivedAt ? new Date(okr.archivedAt) : null,
      archivedBy: okr.archivedBy ?? null,

      // Milestones relation (only if provided)
      ...(okr.milestones &&
        okr.milestones.length > 0 && {
          milestones: {
            create: okr.milestones.map((milestone) => ({
              milestone: milestone.milestone,
              dueDate: new Date(milestone.dueDate),
              status: milestone.status as any,
              completionDate: milestone.completionDate
                ? new Date(milestone.completionDate)
                : null,
            })),
          },
        }),

      // Monthly Updates relation (only if provided)
      ...(okr.monthlyUpdates &&
        okr.monthlyUpdates.length > 0 && {
          monthlyUpdates: {
            create: okr.monthlyUpdates.map((update) => ({
              month: update.month,
              year: update.year,
              value: update.value,
              numerator: update.numerator ?? null, // NEW
              denominatorOverride: update.denominatorOverride ?? null, // NEW
              narrative: update.narrative,
              status: update.status as any,
              risks: update.risks,
              mitigations: update.mitigations,
              createdByEmail: update.createdByEmail ?? null,
              updatedByEmail: update.updatedByEmail ?? null,
              createdAt: new Date(update.createdAt),
              updatedAt: new Date(update.updatedAt),
            })),
          },
        }),
    },
  });
}

/**
 * Seed OKRs with batching for performance
 */
async function seedOkrs(okrsData: SeedOkrData[]) {
  console.log(`\n📊 Seeding ${okrsData.length} OKRs...`);

  // Upsert objectives first and build lookup map
  const objectiveTextToId = await upsertObjectives(okrsData);

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ okrId: string; error: string }> = [];

  // Process in batches for better performance
  for (let i = 0; i < okrsData.length; i += CONFIG.batchSize) {
    const batch = okrsData.slice(i, i + CONFIG.batchSize);

    const results = await Promise.allSettled(
      batch.map(async (okr) => {
        try {
          const objectiveId = objectiveTextToId.get(okr.objective);
          if (!objectiveId) throw new Error(`No objectiveId found for objective: "${okr.objective}"`);
          await createOkr(okr, objectiveId);
          successCount++;
          if (CONFIG.logVerbose) {
            const milestonesCount = okr.milestones?.length || 0;
            const updatesCount = okr.monthlyUpdates?.length || 0;
            console.log(
              `      ✅ OKR ${okr.okrId} created with ${milestonesCount} milestones and ${updatesCount} updates`,
            );
          }
        } catch (error) {
          errorCount++;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          errors.push({
            okrId: okr.okrId,
            error: errorMessage,
          });
          console.error(
            `      ❌ Failed to seed OKR ${okr.okrId}:`,
            errorMessage,
          );
        }
      }),
    );

    // Progress update
    const processed = Math.min(i + CONFIG.batchSize, okrsData.length);
    const percentage = ((processed / okrsData.length) * 100).toFixed(1);
    console.log(
      `   ✓ Processed ${processed}/${okrsData.length} (${percentage}%)`,
    );
  }

  console.log(`\n📈 Seeding Results:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log("\n⚠️  Failed OKRs:");
    errors.forEach(({ okrId, error }) => {
      console.log(`   - ${okrId}: ${error}`);
    });
  }

  return { successCount, errorCount, errors };
}

/**
 * Display comprehensive summary statistics
 */
async function displaySummary() {
  console.log("\n📊 Database Summary:");

  const [
    totalOkrs,
    totalMilestones,
    totalUpdates,
    statusCounts,
    avgProgress,
    byObjective,
    byPriority,
    archivedCount,
  ] = await Promise.all([
    prismaWriter.okr.count(),
    prismaWriter.milestone.count(),
    prismaWriter.monthlyUpdate.count(),
    prismaWriter.okr.groupBy({
      by: ["status"],
      _count: true,
    }),
    prismaWriter.okr.aggregate({
      _avg: { progress: true },
    }),
    prismaWriter.okr.groupBy({
      by: ["objectiveId"],
      _count: true,
    }),
    prismaWriter.okr.groupBy({
      by: ["priority"],
      _count: true,
    }),
    prismaWriter.okr.count({
      where: { archived: true },
    }),
  ]);

  console.log(`   📋 Total OKRs: ${totalOkrs}`);
  console.log(`   🎯 Total Milestones: ${totalMilestones}`);
  console.log(`   📅 Total Monthly Updates: ${totalUpdates}`);
  console.log(`   📦 Archived OKRs: ${archivedCount}`);

  console.log("\n📊 OKRs by Status:");
  statusCounts.forEach(({ status, _count }) => {
    const emoji =
      status === "achieved"
        ? "✅"
        : status === "on_track"
          ? "🟢"
          : status === "at_risk"
            ? "🟡"
            : status === "delayed"
              ? "🔴"
              : "⚪";
    console.log(`   ${emoji} ${status}: ${_count}`);
  });

  console.log(
    `\n📈 Average Progress: ${(avgProgress._avg.progress || 0).toFixed(1)}%`,
  );

  console.log("\n📂 OKRs by Objective:");
  byObjective
    .sort((a, b) => (b._count as number) - (a._count as number))
    .forEach(({ objectiveId, _count }) => {
      console.log(`   • ${objectiveId}: ${_count}`);
    });

  console.log("\n⭐ OKRs by Priority:");
  byPriority
    .sort((a, b) => a.priority - b.priority)
    .forEach(({ priority, _count }) => {
      const stars = "★".repeat(priority) + "☆".repeat(5 - priority);
      console.log(`   ${stars} Priority ${priority}: ${_count}`);
    });

  // Milestone statistics (only if there are any)
  if (totalMilestones > 0) {
    const milestoneStats = await prismaWriter.milestone.groupBy({
      by: ["status"],
      _count: true,
    });

    console.log("\n🎯 Milestones by Status:");
    milestoneStats.forEach(({ status, _count }) => {
      const emoji =
        status === "completed" ? "✅" : status === "in_progress" ? "🔄" : "⏸️";
      console.log(`   ${emoji} ${status}: ${_count}`);
    });
  }

  // Monthly updates by year (only if there are any)
  if (totalUpdates > 0) {
    const updatesByYear = await prismaWriter.monthlyUpdate.groupBy({
      by: ["year"],
      _count: true,
    });

    console.log("\n📅 Monthly Updates by Year:");
    updatesByYear
      .sort((a, b) => a.year - b.year)
      .forEach(({ year, _count }) => {
        console.log(`   📆 ${year}: ${_count} updates`);
      });
  }
}

/**
 * Main seed function
 */
async function main() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║  🌱 OKR Database Seeder               ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);

  const startTime = Date.now();

  try {
    // 0. Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error("Database connection failed");
    }

    // 1. Load and validate data
    const okrsData = await loadData();

    // 2. Clear existing data (optional)
    if (CONFIG.clearExisting) {
      await clearDatabase();
    }

    // 3. Seed data
    const results = await seedOkrs(okrsData);

    // 4. Display summary
    if (results.successCount > 0) {
      await displaySummary();
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n╔════════════════════════════════════════╗");
    console.log(`║  ✅ Seed completed in ${duration}s        ║`);
    console.log("╚════════════════════════════════════════╝\n");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    throw error;
  }
}

/**
 * Execute seed
 */
main()
  .catch((e) => {
    console.error("\n💥 Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("🔌 Disconnecting from database...");
    await prismaWriter.$disconnect();
    console.log("👋 Done!\n");
  });
