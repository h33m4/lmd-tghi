// utils/approval-status-api.ts

/**
 * API utility for managing KPI approval status updates
 * @module approval-status-api
 */

interface UpdateApprovalStatusParams<T> {
  recordId: string | number;
  newStatus: string;
  tableName: string;
  approverEmail: string;
  record: T;
  recipients?: string[];
}

interface BulkUpdateApprovalStatusParams {
  recordIds: number[];
  newStatus: "approved" | "pending" | "not_approved";
  tableName: string;
  approverEmail: string;
  recipients?: string[];
}

interface ApprovalResponse {
  kpi_id: number;
  kpi_dataset_id: string;
  approval_status: string;
  approved_by: string | null;
  entered_by: string;
  last_update_date: string;
  date_inserted: string;
}

/**
 * Updates the approval status of a KPI record and sends Slack notifications
 *
 * @param params - Configuration object containing:
 *   - recordId: The ID of the record to update
 *   - newStatus: The new approval status (e.g., "approved", "not_approved", "pending")
 *   - tableName: The KPI dataset/table name
 *   - approverEmail: Email of the user approving the record
 *   - record: The complete record object
 *   - recipients: Optional array of email addresses for Slack notifications
 *
 * @returns Promise resolving to the approval response data
 * @throws Error if the update fails
 */
export async function updateApprovalStatus<T extends { entered_by?: string }>(
  params: UpdateApprovalStatusParams<T>,
): Promise<ApprovalResponse> {
  const { recordId, newStatus, tableName, approverEmail, record, recipients } =
    params;

  try {
    // Update approval status in database
    const response = await fetch(`/proxy/kpi_data/approvals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kpi_id: recordId,
        kpi_dataset_id: tableName,
        approval_status: newStatus,
        approved_by: approverEmail,
        entered_by: record?.entered_by,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update approval status");
    }

    const result: ApprovalResponse = await response.json();

    // Send Slack notification (non-blocking)

    fetch("/api/slack/approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approvalData: {
          kpi_id: Number(recordId),
          kpi_dataset_id: tableName || "",
          approval_status: result.approval_status,
          approved_by: approverEmail || null,
          entered_by: result.entered_by || "bulk_upload",
          last_update_date: result.last_update_date || "",
          date_inserted: result.date_inserted || "",
        },
        newStatus: newStatus,
        recordDetails: record,
        recipients: recipients || [
          "jdunyo@lastmilehealth.org",
          "gagbeshie@lastmilehealth.org",
          result.entered_by,
        ],
      }),
    }).catch((slackError) => {
      console.error("Failed to send Slack notification:", slackError);
    });
    // Don't throw - Slack notification failure shouldn't block the approval update

    return result;
  } catch (error) {
    console.error("Error updating approval status:", error);
    throw error;
  }
}

/**
 * Bulk updates the approval status of multiple KPI records
 *
 * @param params - Configuration object containing:
 *   - recordIds: Array of record IDs to update
 *   - newStatus: The new approval status
 *   - tableName: The KPI dataset/table name
 *   - approverEmail: Email of the user approving the records
 *   - recipients: Optional array of email addresses for Slack notifications
 *
 * @returns Promise resolving to the bulk approval response
 * @throws Error if the bulk update fails
 */
export async function bulkUpdateApprovalStatus(
  params: BulkUpdateApprovalStatusParams,
): Promise<any> {
  const { recordIds, newStatus, tableName, approverEmail, recipients } = params;

  try {
    // Bulk update approval status in database
    const response = await fetch(`/proxy/kpi_data/approvals/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kpi_ids: recordIds,
        kpi_dataset_id: tableName,
        approval_status: newStatus,
        approved_by: approverEmail,
        // entered_by: approverEmail, //TODO: confirm if this is correct
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to bulk update approval status",
      );
    }

    const result: any = await response.json();

    // Send Slack notification for bulk update (non-blocking)
    fetch("/api/slack/approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approvalData: {
          kpi_ids: recordIds,
          kpi_dataset_id: tableName,
          approval_status: newStatus,
          approved_by: approverEmail,
          count: result.updated_count,
        },
        newStatus: newStatus,
        isBulk: true,
        recipients: recipients || [
          "jdunyo@lastmilehealth.org",
          "gagbeshie@lastmilehealth.org",
        ],
      }),
    }).catch((slackError) => {
      console.error("Failed to send Slack notification:", slackError);
    });

    return result;
  } catch (error) {
    console.error("Error bulk updating approval status:", error);
    throw error;
  }
}
