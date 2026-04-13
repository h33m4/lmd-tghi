// lib/actions/okr-dashboard/mthupdatesNew.ts
"use server";

import { prismaReader, prismaWriter } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CalculationMethod, OkrRecord, OkrStatus } from "@/types/okrTracker";

const sampleData = [
  {
    okrID: "2.2",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "Incentive (Correct & On-time Payment)",
    category: "0",
    frequency: 665,
    percent: 81.8,
  },
  {
    okrID: "2.2",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "Incentive (Correct & On-time Payment)",
    category: "1",
    frequency: 148,
    percent: 18.2,
  },
  {
    okrID: "2.6",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "Supervision (2+ Visits)",
    category: "0",
    frequency: 177,
    percent: 21.8,
  },
  {
    okrID: "2.6",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "Supervision (2+ Visits)",
    category: "1",
    frequency: 636,
    percent: 78.2,
  },
  {
    okrID: "2.4",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "Commodities (All Lifesaving in Stock)",
    category: "1",
    frequency: 156,
    percent: 19.2,
  },
  {
    okrID: "2.4",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "Commodities (All Lifesaving in Stock)",
    category: "0",
    frequency: 657,
    percent: 80.8,
  },
  {
    okrID: "",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "CHC Exists",
    category: "1",
    frequency: 761,
    percent: 93.6,
  },
  {
    okrID: "",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "CHC Exists",
    category: "0",
    frequency: 52,
    percent: 6.4,
  },
  {
    okrID: "2.3",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "CHC Meeting (Last Month)",
    category: "0",
    frequency: 322,
    percent: 42.3,
  },
  {
    okrID: "2.3",
    fy_year_quarter: "2026-1",
    managed: 0,
    kpi_name: "CHC Meeting (Last Month)",
    category: "1",
    frequency: 439,
    percent: 57.7,
  },
  {
    okrID: "2.2",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "Incentive (Correct & On-time Payment)",
    category: "0",
    frequency: 3,
    percent: 2.8,
  },
  {
    okrID: "2.2",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "Incentive (Correct & On-time Payment)",
    category: "1",
    frequency: 105,
    percent: 97.2,
  },
  {
    okrID: "2.6",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "Supervision (2+ Visits)",
    category: "1",
    frequency: 105,
    percent: 97.2,
  },
  {
    okrID: "2.6",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "Supervision (2+ Visits)",
    category: "0",
    frequency: 3,
    percent: 2.8,
  },
  {
    okrID: "2.4",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "Commodities (All Lifesaving in Stock)",
    category: "0",
    frequency: 99,
    percent: 91.7,
  },
  {
    okrID: "2.4",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "Commodities (All Lifesaving in Stock)",
    category: "1",
    frequency: 9,
    percent: 8.3,
  },
  {
    okrID: "",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "CHC Exists",
    category: "1",
    frequency: 105,
    percent: 97.2,
  },
  {
    okrID: "",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "CHC Exists",
    category: "0",
    frequency: 3,
    percent: 2.8,
  },
  {
    okrID: "2.3",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "CHC Meeting (Last Month)",
    category: "0",
    frequency: 93,
    percent: 88.6,
  },
  {
    okrID: "2.3",
    fy_year_quarter: "2026-1",
    managed: 1,
    kpi_name: "CHC Meeting (Last Month)",
    category: "1",
    frequency: 12,
    percent: 11.4,
  },
];

// here

// export async function checkMonthlyUpdateExists(
//   okrId: string,
//   okrID: string,
//   month: number,
//   year: number,
// ) {
//   try {
//     if (!okrId || !month || !year) {
//       return {
//         success: false,
//         exists: false,
//         data: null,
//         error: "Missing required parameters",
//       };
//     }

//     console.log("ee", okrId, okrID, month, year);

//     // const update = await prismaReader.monthlyUpdate.findUnique({
//     //   where: {
//     //     okrId_month_year: {
//     //       okrId,
//     //       month,
//     //       year,
//     //     },
//     //   },
//     //   select: {
//     //     numerator: true,
//     //     denominatorOverride: true,
//     //     value: true,
//     //     narrative: true,
//     //     risks: true,
//     //     mitigations: true,
//     //     status: true,
//     //     createdAt: true,
//     //     updatedAt: true,
//     //     createdByEmail: true,
//     //     updatedByEmail: true,
//     //   },
//     // });

//     // Search sampleData for January 2026 updates only
//     let computedNumerator: number | null = null;
//     if (month === 1 && year === 2026) {
//       const matchingRecord = sampleData.find(
//         (record) =>
//           record.okrID === okrID &&
//           record.managed === 1 &&
//           record.category === "1",
//         //   record.fy_year_quarter === "2026-1",
//       );

//       if (matchingRecord) {
//         computedNumerator = matchingRecord.frequency;
//       }

//       console.log("mat", matchingRecord);
//     }

//     // if (!update) {
//     //   return {
//     //     success: true,
//     //     exists: false,
//     //     data:
//     //       computedNumerator !== null ? { numerator: computedNumerator } : null,
//     //     message: "No data found for this month",
//     //   };
//     // }

//     return {
//       success: true,
//       exists: true,
//       data: {
//         // ...update,
//         // Override numerator with computed value if found
//         numerator:
//           computedNumerator !== null ? computedNumerator ,
//       },
//       message: "Data found",
//     };
//   } catch (error) {
//     console.error("Error checking monthly update:", error);
//     return {
//       success: false,
//       exists: false,
//       data: null,
//       error: "Failed to check monthly update",
//     };
//   }
// }

export async function checkMonthlyUpdateExists(
  okrId: string, // DB primary key
  okrCode: string, // Business OKR code (e.g. "2.3")
  month: number,
  year: number,
) {
  try {
    if (!okrId || !okrCode || !month || !year) {
      return {
        success: false,
        exists: false,
        data: null,
        error: "Missing required parameters",
      };
    }

    const fyQuarterKey = `${year}-${month}`;

    // ---- Compute numerator from sample data ----
    const matchingRecord = sampleData.find(
      (record) =>
        record.okrID === okrCode &&
        record.managed === 1 &&
        record.category === "1" &&
        record.fy_year_quarter === fyQuarterKey,
    );

    const computedNumerator = matchingRecord?.frequency ?? null;

    // ---- Return consistent response ----
    return {
      success: true,
      exists: computedNumerator !== null,
      data:
        computedNumerator !== null
          ? {
              numerator: computedNumerator,
              month,
              year,
            }
          : null,
      message:
        computedNumerator !== null
          ? "Computed data found"
          : "No data found for this month",
    };
  } catch (error) {
    console.error("Error checking monthly update:", error);

    return {
      success: false,
      exists: false,
      data: null,
      error: "Failed to check monthly update",
    };
  }
}

/**
 * Get all computed monthly updates for an OKR
 * Useful for bulk operations or dashboard views
 */
export async function getComputedMonthlyUpdates(okrId: string) {
  try {
    const updates = await prismaReader.monthlyUpdate.findMany({
      where: {
        okrId,
        // Filter for auto-computed updates (you can add a flag in the schema)
        narrative: {
          contains: "Auto-computed",
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      select: {
        month: true,
        year: true,
        numerator: true,
        denominatorOverride: true,
        value: true,
        narrative: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: updates,
      count: updates.length,
    };
  } catch (error) {
    console.error("Error fetching computed updates:", error);
    return {
      success: false,
      error: "Failed to fetch computed updates",
      data: [],
      count: 0,
    };
  }
}
