// lib/actions/okr-dashboard/monthly-updates.ts
"use server";

import { prismaReader, prismaWriter } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CalculationMethod, OkrRecord, OkrStatus } from "@/types/okrTracker";
import { deriveConfidenceLevel } from "./utils";

/**
 * Calculate OKR progress based on calculation method
 */
async function calculateOKRProgress(okrId: string) {
  try {
    const okr: any = await prismaReader.okr.findUnique({
      where: { id: okrId },
      include: {
        monthlyUpdates: {
          orderBy: [{ year: "desc" }, { month: "desc" }],
        },
      },
    });

    if (!okr || okr.monthlyUpdates.length === 0) {
      return null;
    }

    // Qualitative/yes_no KRs have no numeric progress — leave as-is
    if (okr.unit === "qualitative") return null;

    const { calculationMethod, targetValue, baseline, chartMetricType } = okr;
    let calculatedValue = 0;

    switch (calculationMethod) {
      case "latest":
        const latestUpdate = okr.monthlyUpdates[0];
        calculatedValue = (latestUpdate.value as number) ?? 0;
        break;

      case "cumulative":
        calculatedValue = okr.monthlyUpdates.reduce(
          (sum: number, update: any) => sum + Number(update.value!),
          0,
        );
        break;

      case "average":
        const total = okr.monthlyUpdates.reduce(
          (sum: number, update: any) => sum + Number(update.value!),
          0,
        );
        calculatedValue = total / okr.monthlyUpdates.length;
        break;

      default:
        calculatedValue = okr.monthlyUpdates[0]?.value || 0;
    }

    let progress: number;

    if (chartMetricType === "percentage") {
      progress = Math.round(calculatedValue);
    } else {
      if (targetValue === baseline) {
        progress = calculatedValue >= targetValue ? 100 : 0;
      } else {
        progress = Math.round(
          ((calculatedValue - baseline) / (targetValue - baseline)) * 100,
        );
      }
    }

    return Math.max(0, Math.min(100, progress));
  } catch (error) {
    console.error("Error calculating OKR progress:", error);
    return null;
  }
}

/**
 * Check if an update is the latest for an OKR
 */
async function isLatestUpdate(
  okrId: string,
  month: number,
  year: number,
): Promise<boolean> {
  const latestUpdate = await prismaReader.monthlyUpdate.findFirst({
    where: { okrId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    select: { month: true, year: true },
  });

  if (!latestUpdate) return true;

  if (year > latestUpdate.year) return true;
  if (year === latestUpdate.year && month >= latestUpdate.month) return true;

  return false;
}

/**
 * Update OKR progress based on calculation method
 */
async function updateOKRProgressIfNeeded(
  okrId: string,
  month: number,
  year: number,
  isNewUpdate: boolean = true,
) {
  try {
    const okr = await prismaReader.okr.findUnique({
      where: { id: okrId },
      select: { calculationMethod: true },
    });

    if (!okr) return;

    let shouldRecalculate = false;

    switch (okr.calculationMethod) {
      case "latest":
        shouldRecalculate = await isLatestUpdate(okrId, month, year);
        break;

      case "cumulative":
      case "average":
        shouldRecalculate = true;
        break;

      default:
        shouldRecalculate = await isLatestUpdate(okrId, month, year);
    }

    if (shouldRecalculate) {
      const newProgress = await calculateOKRProgress(okrId);

      if (newProgress !== null) {
        // Also re-derive confidence level from updated progress + current status/period
        const okrFull = await prismaReader.okr.findUnique({
          where: { id: okrId },
          select: { status: true },
        });

        const confidenceLevel = okrFull
          ? deriveConfidenceLevel(okrFull.status as OkrStatus, newProgress)
          : null;

        await prismaWriter.okr.update({
          where: { id: okrId },
          data: {
            progress: newProgress,
            ...(confidenceLevel && { confidenceLevel }),
            updatedAt: new Date(),
          },
        });
      }
    }
  } catch (error) {
    console.error("Error updating OKR progress:", error);
  }
}

// ============= READ OPERATIONS =============

export async function getMonthlyUpdates(okrId: string) {
  try {
    const updates = await prismaReader.monthlyUpdate.findMany({
      where: { okrId },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return { success: true, data: updates };
  } catch (error) {
    console.error("Error fetching monthly updates:", error);
    return { success: false, error: "Failed to fetch monthly updates" };
  }
}

export async function getMonthlyUpdate(
  okrId: string,
  month: number,
  year: number,
) {
  try {
    const update = await prismaReader.monthlyUpdate.findUnique({
      where: {
        okrId_month_year: {
          okrId,
          month,
          year,
        },
      },
      include: {
        okr: {
          select: {
            okrId: true,
            keyResult: true,
            targetValue: true,
            okrObjective: { select: { text: true } },
          },
        },
      },
    });

    if (!update) {
      return { success: false, error: "Monthly update not found" };
    }

    return { success: true, data: update };
  } catch (error) {
    console.error("Error fetching monthly update:", error);
    return { success: false, error: "Failed to fetch monthly update" };
  }
}

export async function getMonthlyUpdatesByYear(okrId: string, year: number) {
  try {
    const updates = await prismaReader.monthlyUpdate.findMany({
      where: { okrId, year },
      orderBy: { month: "asc" },
    });

    return { success: true, data: updates };
  } catch (error) {
    console.error("Error fetching monthly updates:", error);
    return { success: false, error: "Failed to fetch monthly updates" };
  }
}

export async function getLatestMonthlyUpdate(okrId: string) {
  try {
    const update = await prismaReader.monthlyUpdate.findFirst({
      where: { okrId },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    if (!update) {
      return { success: false, error: "No monthly updates found" };
    }

    return { success: true, data: update };
  } catch (error) {
    console.error("Error fetching latest update:", error);
    return { success: false, error: "Failed to fetch latest update" };
  }
}

// ============= CREATE OPERATIONS =============

export async function addMonthlyUpdate(data: {
  okrId: string;
  month: number;
  year: number;
  numerator?: number | null;
  denominatorOverride?: number | null;
  value?: number | null;
  narrative: string;
  status?: OkrStatus;
  risks?: string[];
  mitigations?: string[];
  createdByEmail?: string;
}) {
  try {
    if (data.month < 1 || data.month > 12) {
      return { success: false, error: "Month must be between 1 and 12" };
    }

    const okr = await prismaReader.okr.findUnique({
      where: { id: data.okrId },
      select: {
        unit: true,
        denominator: true,
        denominatorLabel: true,
        numeratorLabel: true,
      },
    });

    if (!okr) {
      return { success: false, error: "OKR not found" };
    }

    let finalValue = data.value;

    if (okr.unit === "percent") {
      if (data.numerator !== null && data.numerator !== undefined) {
        const denominator = data.denominatorOverride ?? okr.denominator;

        if (!denominator || denominator === 0) {
          return {
            success: false,
            error: "Denominator required for percentage calculation",
          };
        }

        finalValue = (data.numerator / denominator) * 100;
      } else if (finalValue === null || finalValue === undefined) {
        return {
          success: false,
          error:
            "Either numerator or value must be provided for percentage OKRs",
        };
      }
    } else if (okr.unit === "qualitative") {
      // Qualitative KRs have no numeric value — null is correct
      finalValue = null;
    } else {
      if (finalValue === null || finalValue === undefined) {
        finalValue = data.numerator ?? null;
      }
    }

    // Only non-qualitative KRs require a numeric value
    if (okr.unit !== "qualitative" && (finalValue === null || finalValue === undefined)) {
      return { success: false, error: "Value is required" };
    }

    const update = await prismaWriter.monthlyUpdate.create({
      data: {
        okrId: data.okrId,
        month: data.month,
        year: data.year,
        numerator: data.numerator ?? null,
        denominatorOverride: data.denominatorOverride ?? null,
        value: finalValue,
        narrative: data.narrative,
        status: data.status || "on_track",
        risks: data.risks || [],
        mitigations: data.mitigations || [],
        createdByEmail: data.createdByEmail || null,
      },
    });

    // NEW: Update parent OKR denominator if override was provided
    const okrUpdateData: any = {
      updatedAt: new Date(),
    };

    if (data.status) {
      okrUpdateData.status = data.status;
    }

    // If denominatorOverride is provided, update the parent OKR's denominator
    if (
      data.denominatorOverride !== null &&
      data.denominatorOverride !== undefined
    ) {
      okrUpdateData.denominator = data.denominatorOverride;
    }

    await prismaWriter.okr.update({
      where: { id: data.okrId },
      data: okrUpdateData,
    });

    await updateOKRProgressIfNeeded(data.okrId, data.month, data.year, true);

    // For qualitative KRs, calculateOKRProgress returns null, so update confidence from status alone
    if (okr.unit === "qualitative" && data.status) {
      const okrFull = await prismaReader.okr.findUnique({
        where: { id: data.okrId },
        select: { periodStart: true, periodEnd: true, progress: true },
      });
      if (okrFull) {
        const cl = deriveConfidenceLevel(data.status, okrFull.progress);
        await prismaWriter.okr.update({
          where: { id: data.okrId },
          data: { confidenceLevel: cl, updatedAt: new Date() },
        });
      }
    }

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: update };
  } catch (error: any) {
    console.error("Error adding monthly update:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: `Monthly update for ${data.month}/${data.year} already exists`,
      };
    }
    if (error.code === "P2003") {
      return { success: false, error: "OKR not found" };
    }
    return { success: false, error: "Failed to add monthly update" };
  }
}

export async function bulkAddMonthlyUpdates(
  updates: Array<{
    okrId: string;
    month: number;
    year: number;
    numerator?: number | null;
    denominatorOverride?: number | null;
    value?: number | null;
    narrative: string;
    status?: OkrStatus;
    risks?: string[];
    mitigations?: string[];
    createdByEmail?: string;
  }>,
) {
  try {
    if (updates.some((u) => u.month < 1 || u.month > 12)) {
      return { success: false, error: "All months must be between 1 and 12" };
    }

    const okrIds = Array.from(new Set(updates.map((u) => u.okrId)));
    const okrs = await prismaReader.okr.findMany({
      where: { id: { in: okrIds } },
      select: { id: true, unit: true, denominator: true },
    });

    const okrMap = new Map(okrs.map((o: any) => [o.id, o]));

    const processedUpdates = updates.map((update) => {
      const okr: any = okrMap.get(update.okrId);
      if (!okr) throw new Error(`OKR ${update.okrId} not found`);

      let finalValue = update.value;

      if (
        okr.unit === "percent" &&
        update.numerator !== null &&
        update.numerator !== undefined
      ) {
        const denominator = update.denominatorOverride ?? okr.denominator;
        if (!denominator || denominator === 0) {
          throw new Error(`Denominator required for OKR ${update.okrId}`);
        }
        finalValue = (update.numerator / denominator) * 100;
      } else if (finalValue === null || finalValue === undefined) {
        finalValue = update.numerator ?? null;
      }

      if (finalValue === null) {
        throw new Error(
          `Value required for update ${update.okrId} ${update.month}/${update.year}`,
        );
      }

      return {
        ...update,
        value: finalValue,
      };
    });

    const created = await prismaWriter.$transaction(
      processedUpdates.map((data) =>
        prismaWriter.monthlyUpdate.create({
          data: {
            okrId: data.okrId,
            month: data.month,
            year: data.year,
            numerator: data.numerator ?? null,
            denominatorOverride: data.denominatorOverride ?? null,
            value: data.value!,
            narrative: data.narrative,
            status: data.status || "on_track",
            risks: data.risks || [],
            mitigations: data.mitigations || [],
            createdByEmail: data.createdByEmail || null,
          },
        }),
      ),
    );

    for (const okrId of okrIds) {
      const latestUpdate = updates
        .filter((u) => u.okrId === okrId)
        .sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        })[0];

      if (latestUpdate) {
        await updateOKRProgressIfNeeded(
          okrId,
          latestUpdate.month,
          latestUpdate.year,
          true,
        );

        const okrUpdateData: any = {
          updatedAt: new Date(),
        };

        if (latestUpdate.status) {
          okrUpdateData.status = latestUpdate.status;
        }

        // NEW: Update parent OKR denominator if override was provided
        if (
          latestUpdate.denominatorOverride !== null &&
          latestUpdate.denominatorOverride !== undefined
        ) {
          okrUpdateData.denominator = latestUpdate.denominatorOverride;
        }

        await prismaWriter.okr.update({
          where: { id: okrId },
          data: okrUpdateData,
        });
      }
    }

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: created, count: created.length };
  } catch (error: any) {
    console.error("Error bulk adding monthly updates:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "One or more monthly updates already exist",
      };
    }
    return {
      success: false,
      error: error.message || "Failed to add monthly updates",
    };
  }
}

// ============= UPDATE OPERATIONS =============

export async function updateMonthlyUpdate(
  okrId: string,
  month: number,
  year: number,
  data: Partial<{
    numerator: number;
    denominatorOverride: number;
    value: number;
    narrative: string;
    status: OkrStatus;
    risks: string[];
    mitigations: string[];
    updatedByEmail: string;
  }>,
) {
  try {
    const okr = await prismaReader.okr.findUnique({
      where: { id: okrId },
      select: { unit: true, denominator: true },
    });

    if (!okr) {
      return { success: false, error: "OKR not found" };
    }

    let calculatedValue = data.value;

    if (okr.unit === "percent" && data.numerator !== undefined) {
      const denominator = data.denominatorOverride ?? okr.denominator;

      if (!denominator || denominator === 0) {
        return {
          success: false,
          error: "Denominator required for percentage calculation",
        };
      }

      calculatedValue = (data.numerator! / denominator) * 100;
    }

    const update = await prismaWriter.monthlyUpdate.update({
      where: {
        okrId_month_year: {
          okrId,
          month,
          year,
        },
      },
      data: {
        ...(data.numerator !== undefined && { numerator: data.numerator }),
        ...(data.denominatorOverride !== undefined && {
          denominatorOverride: data.denominatorOverride,
        }),
        ...(calculatedValue !== undefined && { value: calculatedValue }),
        ...(data.narrative !== undefined && { narrative: data.narrative }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.risks !== undefined && { risks: data.risks }),
        ...(data.mitigations !== undefined && {
          mitigations: data.mitigations,
        }),
        ...(data.updatedByEmail !== undefined && {
          updatedByEmail: data.updatedByEmail,
        }),
      },
    });

    if (data.status) {
      const latestUpdate = await prismaReader.monthlyUpdate.findFirst({
        where: { okrId },
        orderBy: [{ year: "desc" }, { month: "desc" }],
        select: { month: true, year: true },
      });

      const isLatest =
        !latestUpdate ||
        year > latestUpdate.year ||
        (year === latestUpdate.year && month >= latestUpdate.month);

      if (isLatest) {
        const okrUpdateData: any = {
          status: data.status,
          updatedAt: new Date(),
        };

        // NEW: Update parent OKR denominator if override was provided
        if (
          data.denominatorOverride !== null &&
          data.denominatorOverride !== undefined
        ) {
          okrUpdateData.denominator = data.denominatorOverride;
        }

        await prismaWriter.okr.update({
          where: { id: okrId },
          data: okrUpdateData,
        });
      }
    } else if (
      data.denominatorOverride !== null &&
      data.denominatorOverride !== undefined
    ) {
      // NEW: Even if status is not updated, still update denominator if provided
      await prismaWriter.okr.update({
        where: { id: okrId },
        data: {
          denominator: data.denominatorOverride,
          updatedAt: new Date(),
        },
      });
    }

    if (calculatedValue !== undefined || data.numerator !== undefined) {
      await updateOKRProgressIfNeeded(okrId, month, year, false);
    }

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: update };
  } catch (error: any) {
    console.error("Error updating monthly update:", error);
    if (error.code === "P2025") {
      return { success: false, error: "Monthly update not found" };
    }
    return { success: false, error: "Failed to update monthly update" };
  }
}

export async function addRisks(
  okrId: string,
  month: number,
  year: number,
  newRisks: string[],
) {
  try {
    const existing = await prismaReader.monthlyUpdate.findUnique({
      where: { okrId_month_year: { okrId, month, year } },
      select: { risks: true },
    });

    if (!existing) {
      return { success: false, error: "Monthly update not found" };
    }

    const update = await prismaWriter.monthlyUpdate.update({
      where: { okrId_month_year: { okrId, month, year } },
      data: {
        risks: Array.from(new Set([...existing.risks, ...newRisks])),
        updatedAt: new Date(),
      },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: update };
  } catch (error) {
    console.error("Error adding risks:", error);
    return { success: false, error: "Failed to add risks" };
  }
}

export async function addMitigations(
  okrId: string,
  month: number,
  year: number,
  newMitigations: string[],
) {
  try {
    const existing = await prismaReader.monthlyUpdate.findUnique({
      where: { okrId_month_year: { okrId, month, year } },
      select: { mitigations: true },
    });

    if (!existing) {
      return { success: false, error: "Monthly update not found" };
    }

    const update = await prismaWriter.monthlyUpdate.update({
      where: { okrId_month_year: { okrId, month, year } },
      data: {
        mitigations: Array.from(
          new Set([...existing.mitigations, ...newMitigations]),
        ),
        updatedAt: new Date(),
      },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: update };
  } catch (error) {
    console.error("Error adding mitigations:", error);
    return { success: false, error: "Failed to add mitigations" };
  }
}

// ============= DELETE OPERATIONS =============

export async function deleteMonthlyUpdate(
  okrId: string,
  month: number,
  year: number,
) {
  try {
    await prismaWriter.monthlyUpdate.delete({
      where: {
        okrId_month_year: {
          okrId,
          month,
          year,
        },
      },
    });

    await updateOKRProgressIfNeeded(okrId, month, year, false);

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting monthly update:", error);
    if (error.code === "P2025") {
      return { success: false, error: "Monthly update not found" };
    }
    return { success: false, error: "Failed to delete monthly update" };
  }
}

export async function deleteAllMonthlyUpdates(okrId: string) {
  try {
    const result = await prismaWriter.monthlyUpdate.deleteMany({
      where: { okrId },
    });

    await prismaWriter.okr.update({
      where: { id: okrId },
      data: {
        progress: 0,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error deleting monthly updates:", error);
    return { success: false, error: "Failed to delete monthly updates" };
  }
}

/**
 * Check if a monthly update exists and return its data
 * This is used to auto-fill forms with data computed by AWS Step Functions
 */
// export async function checkMonthlyUpdateExists(
//   okrId: string,
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

//     const update = await prismaReader.monthlyUpdate.findUnique({
//       where: {
//         okrId_month_year: {
//           okrId,
//           month,
//           year,
//         },
//       },
//       select: {
//         numerator: true,
//         denominatorOverride: true,
//         value: true,
//         narrative: true,
//         risks: true,
//         mitigations: true,
//         status: true,
//         createdAt: true,
//         updatedAt: true,
//         createdByEmail: true,
//         updatedByEmail: true,
//       },
//     });

//     if (!update) {
//       return {
//         success: true,
//         exists: false,
//         data: null,
//         message: "No data found for this month",
//       };
//     }

//     return {
//       success: true,
//       exists: true,
//       data: update,
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

/**
 * Get all computed monthly updates for an OKR
 * Useful for bulk operations or dashboard views
 */
// export async function getComputedMonthlyUpdates(okrId: string) {
//   try {
//     const updates = await prismaReader.monthlyUpdate.findMany({
//       where: {
//         okrId,
//         // Filter for auto-computed updates (you can add a flag in the schema)
//         narrative: {
//           contains: "Auto-computed",
//         },
//       },
//       orderBy: [{ year: "desc" }, { month: "desc" }],
//       select: {
//         month: true,
//         year: true,
//         numerator: true,
//         denominatorOverride: true,
//         value: true,
//         narrative: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return {
//       success: true,
//       data: updates,
//       count: updates.length,
//     };
//   } catch (error) {
//     console.error("Error fetching computed updates:", error);
//     return {
//       success: false,
//       error: "Failed to fetch computed updates",
//       data: [],
//       count: 0,
//     };
//   }
// }
