// lib/actions/okr-dashboard/milestones.ts
"use server";

import { prismaReader, prismaWriter } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============= TYPE DEFINITIONS =============

export type MilestoneStatus = "not_started" | "in_progress" | "completed";

export type MilestoneData = {
  milestone: string;
  dueDate: string | Date;
  status: MilestoneStatus;
  completionDate?: string | Date | null;
};

// ============= READ OPERATIONS =============

/**
 * Get all milestones for an OKR
 */
export async function getMilestones(okrId: string) {
  try {
    const milestones = await prismaReader.milestone.findMany({
      where: { okrId },
      orderBy: { dueDate: "asc" },
    });

    return { success: true, data: milestones };
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return { success: false, error: "Failed to fetch milestones" };
  }
}

/**
 * Get a specific milestone by ID
 */
export async function getMilestone(milestoneId: string) {
  try {
    const milestone = await prismaReader.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        okr: {
          select: {
            okrId: true,
            keyResult: true,
            okrObjective: { select: { text: true } },
          },
        },
      },
    });

    if (!milestone) {
      return { success: false, error: "Milestone not found" };
    }

    return { success: true, data: milestone };
  } catch (error) {
    console.error("Error fetching milestone:", error);
    return { success: false, error: "Failed to fetch milestone" };
  }
}

/**
 * Get milestones by status
 */
export async function getMilestonesByStatus(
  okrId: string,
  status: MilestoneStatus,
) {
  try {
    const milestones = await prismaReader.milestone.findMany({
      where: { okrId, status },
      orderBy: { dueDate: "asc" },
    });

    return { success: true, data: milestones };
  } catch (error) {
    console.error("Error fetching milestones by status:", error);
    return { success: false, error: "Failed to fetch milestones" };
  }
}

// ============= CREATE OPERATIONS =============

/**
 * Add a milestone to an OKR
 */
export async function addMilestone(okrId: string, data: MilestoneData) {
  try {
    // Validate required fields
    if (!data.milestone || !data.milestone.trim()) {
      return { success: false, error: "Milestone name is required" };
    }

    if (!data.dueDate) {
      return { success: false, error: "Due date is required" };
    }

    // Verify OKR exists
    const okr = await prismaReader.okr.findUnique({
      where: { id: okrId },
      select: { id: true },
    });

    if (!okr) {
      return { success: false, error: "OKR not found" };
    }

    // Create the milestone
    const milestone = await prismaWriter.milestone.create({
      data: {
        okrId,
        milestone: data.milestone.trim(),
        dueDate: new Date(data.dueDate),
        status: data.status || "not_started",
        ...(data.completionDate && {
          completionDate: new Date(data.completionDate),
        }),
      },
    });

    // Update OKR's updatedAt timestamp
    await prismaWriter.okr.update({
      where: { id: okrId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${okrId}`);

    return { success: true, data: milestone };
  } catch (error: any) {
    console.error("Error adding milestone:", error);
    if (error.code === "P2003") {
      return { success: false, error: "OKR not found" };
    }
    return { success: false, error: "Failed to add milestone" };
  }
}

/**
 * Bulk add milestones
 */
export async function bulkAddMilestones(
  okrId: string,
  milestones: MilestoneData[],
) {
  try {
    // Validate all milestones
    if (milestones.some((m) => !m.milestone || !m.milestone.trim())) {
      return { success: false, error: "All milestones must have a name" };
    }

    if (milestones.some((m) => !m.dueDate)) {
      return { success: false, error: "All milestones must have a due date" };
    }

    // Create all milestones in a transaction
    const created = await prismaWriter.$transaction([
      ...milestones.map((data) =>
        prismaWriter.milestone.create({
          data: {
            okrId,
            milestone: data.milestone.trim(),
            dueDate: new Date(data.dueDate),
            status: data.status || "not_started",
            ...(data.completionDate && {
              completionDate: new Date(data.completionDate),
            }),
          },
        }),
      ),
      // Update OKR timestamp
      prismaWriter.okr.update({
        where: { id: okrId },
        data: { updatedAt: new Date() },
      }),
    ]);

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${okrId}`);

    return {
      success: true,
      data: created.slice(0, -1),
      count: milestones.length,
    };
  } catch (error: any) {
    console.error("Error bulk adding milestones:", error);
    return { success: false, error: "Failed to add milestones" };
  }
}

// ============= UPDATE OPERATIONS =============

/**
 * Update a milestone
 */
export async function updateMilestone(
  milestoneId: string,
  data: Partial<MilestoneData>,
) {
  try {
    const updateData: any = {};

    if (data.milestone !== undefined) {
      if (!data.milestone.trim()) {
        return { success: false, error: "Milestone name cannot be empty" };
      }
      updateData.milestone = data.milestone.trim();
    }

    if (data.dueDate !== undefined) {
      updateData.dueDate = new Date(data.dueDate);
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.completionDate !== undefined) {
      updateData.completionDate = data.completionDate
        ? new Date(data.completionDate)
        : null;
    }

    updateData.updatedAt = new Date();

    const milestone = await prismaWriter.milestone.update({
      where: { id: milestoneId },
      data: updateData,
      include: {
        okr: {
          select: { id: true },
        },
      },
    });

    // Update OKR's updatedAt timestamp
    await prismaWriter.okr.update({
      where: { id: milestone.okr.id },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${milestone.okr.id}`);

    return { success: true, data: milestone };
  } catch (error: any) {
    console.error("Error updating milestone:", error);
    if (error.code === "P2025") {
      return { success: false, error: "Milestone not found" };
    }
    return { success: false, error: "Failed to update milestone" };
  }
}

/**
 * Update milestone status
 */
export async function updateMilestoneStatus(
  milestoneId: string,
  status: MilestoneStatus,
  completionDate?: string | Date,
) {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === "completed" && completionDate) {
      updateData.completionDate = new Date(completionDate);
    } else if (status !== "completed") {
      updateData.completionDate = null;
    }

    const milestone = await prismaWriter.milestone.update({
      where: { id: milestoneId },
      data: updateData,
      include: {
        okr: {
          select: { id: true },
        },
      },
    });

    // Update OKR's updatedAt timestamp
    await prismaWriter.okr.update({
      where: { id: milestone.okr.id },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${milestone.okr.id}`);

    return { success: true, data: milestone };
  } catch (error: any) {
    console.error("Error updating milestone status:", error);
    if (error.code === "P2025") {
      return { success: false, error: "Milestone not found" };
    }
    return { success: false, error: "Failed to update milestone status" };
  }
}

/**
 * Bulk update milestones (replace all milestones for an OKR)
 */
export async function bulkUpdateMilestones(
  okrId: string,
  milestones: Array<MilestoneData & { id?: string }>,
) {
  try {
    // Validate all milestones
    if (milestones.some((m) => !m.milestone || !m.milestone.trim())) {
      return { success: false, error: "All milestones must have a name" };
    }

    if (milestones.some((m) => !m.dueDate)) {
      return { success: false, error: "All milestones must have a due date" };
    }

    // Delete all existing milestones and create new ones in a transaction
    const result = await prismaWriter.$transaction([
      // Delete all existing milestones
      prismaWriter.milestone.deleteMany({
        where: { okrId },
      }),
      // Create new milestones
      ...milestones.map((data) =>
        prismaWriter.milestone.create({
          data: {
            okrId,
            milestone: data.milestone.trim(),
            dueDate: new Date(data.dueDate),
            status: data.status || "not_started",
            ...(data.completionDate && {
              completionDate: new Date(data.completionDate),
            }),
          },
        }),
      ),
      // Update OKR timestamp
      prismaWriter.okr.update({
        where: { id: okrId },
        data: { updatedAt: new Date() },
      }),
    ]);

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${okrId}`);

    // Return created milestones (exclude delete result and update result)
    return {
      success: true,
      data: result.slice(1, -1),
      count: milestones.length,
    };
  } catch (error: any) {
    console.error("Error bulk updating milestones:", error);
    return { success: false, error: "Failed to update milestones" };
  }
}

// ============= DELETE OPERATIONS =============

/**
 * Delete a milestone
 */
export async function deleteMilestone(milestoneId: string) {
  try {
    const milestone = await prismaWriter.milestone.delete({
      where: { id: milestoneId },
      include: {
        okr: {
          select: { id: true },
        },
      },
    });

    // Update OKR's updatedAt timestamp
    await prismaWriter.okr.update({
      where: { id: milestone.okr.id },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${milestone.okr.id}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting milestone:", error);
    if (error.code === "P2025") {
      return { success: false, error: "Milestone not found" };
    }
    return { success: false, error: "Failed to delete milestone" };
  }
}

/**
 * Delete all milestones for an OKR
 */
export async function deleteAllMilestones(okrId: string) {
  try {
    const result = await prismaWriter.milestone.deleteMany({
      where: { okrId },
    });

    // Update OKR's updatedAt timestamp
    await prismaWriter.okr.update({
      where: { id: okrId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${okrId}`);

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error deleting milestones:", error);
    return { success: false, error: "Failed to delete milestones" };
  }
}
