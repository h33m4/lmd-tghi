import { NextRequest, NextResponse } from "next/server";
import { slackApp } from "@/lib/slack";

interface IApprovalData {
  kpi_id: number;
  kpi_dataset_id: string;
  approval_status: string;
  approved_by: string | null;
  entered_by: string; // main person who entered dataset
  last_update_date: string;
  date_inserted: string;
}

interface IApprovalNotification {
  record_id: number;
  record_details: Record<string, any>;
  approval_status: "pending" | "approved" | "not_approved";
  entered_by: string;
  approved_by: string | null;
  notified_at: string;
  message: string;
}

function buildApprovalNotification(
  approvalData: IApprovalData,
  newStatus: "approved" | "not_approved" | "pending",
  recordDetails: Record<string, any>
): IApprovalNotification {
  let message = "";

  switch (newStatus) {
    case "approved":
      message = `✅ Your dataset entry (ID: ${approvalData.kpi_dataset_id}) has been *approved*.`;
      break;
    case "not_approved":
      message = `❌ Your dataset entry (ID: ${approvalData.kpi_dataset_id}) has been *rejected*.`;
      break;
    default:
      message = `ℹ️ Your dataset entry (ID: ${approvalData.kpi_dataset_id}) status is now *${newStatus}*.`;
      break;
  }

  return {
    record_id: approvalData.kpi_id,
    record_details: recordDetails,
    approval_status: newStatus,
    entered_by: approvalData.entered_by,
    approved_by: approvalData.approved_by,
    notified_at: new Date().toISOString(),
    message,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { approvalData, newStatus, recordDetails, recipients } = body;

    if (
      !approvalData ||
      !newStatus ||
      !Array.isArray(recipients) ||
      recipients.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields or recipients." },
        { status: 400 }
      );
    }

    // Build notification payload
    const notification = buildApprovalNotification(
      approvalData,
      newStatus,
      recordDetails || {}
    );

    const results: { email: string; success: boolean; error?: string }[] = [];

    for (const email of recipients) {
      try {
        // Lookup Slack user
        const userLookup = await slackApp.client.users.lookupByEmail({ email });
        if (!userLookup.ok || !userLookup?.user?.id) {
          throw new Error(`Could not find Slack user with email ${email}`);
        }

        const slackUserId = userLookup.user.id;

        // Open DM channel
        const conversationResponse = await slackApp.client.conversations.open({
          users: slackUserId,
          return_im: true,
        });

        if (!conversationResponse.ok || !conversationResponse.channel?.id) {
          throw new Error(
            `Failed to open DM channel: ${conversationResponse.error}`
          );
        }

        // Prepare record details, excluding approval_status and approved_by
        const detailText = Object.entries(notification.record_details)
          .filter(([key]) => key !== "approval_status" && key !== "approved_by")
          .slice(0, 10) // optional: limit number of fields
          .map(([key, value]) => `*${key}:* ${String(value)}`)
          .join("\n");

        const blocks: any[] = [
          {
            type: "section",
            text: { type: "mrkdwn", text: notification.message },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Record ID:* ${notification.record_id}\n*Status:* ${
                notification.approval_status
              }\n*Reviewed by:* ${
                notification.approved_by || "N/A"
              }\n*Entered by:* ${notification.entered_by || "N/A"}`,
            },
          },
        ];

        if (detailText) {
          blocks.push({
            type: "section",
            text: { type: "mrkdwn", text: detailText },
          });
        }

        blocks.push({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Updated: ${new Date(
                notification.notified_at
              ).toLocaleString()}`,
            },
          ],
        });

        // Send DM
        const dmResult = await slackApp.client.chat.postMessage({
          channel: conversationResponse.channel.id,
          text: notification.message,
          blocks,
        });

        if (!dmResult.ok) throw new Error(dmResult.error);

        results.push({ email, success: true });
      } catch (err: any) {
        console.error(`Failed to notify ${email}:`, err);
        results.push({ email, success: false, error: err.message });
      }
    }

    return NextResponse.json({ success: true, notification, results });
  } catch (error: any) {
    console.error("Notify API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error." },
      { status: 500 }
    );
  }
}
