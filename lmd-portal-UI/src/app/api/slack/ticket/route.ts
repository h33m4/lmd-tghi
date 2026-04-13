import { slackApp } from "@/lib/slack";
import { generateTicketBlock } from "@/utils/slack-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("daaaata->", data);

    if (
      !data?.data?.title ||
      !data?.data?.description ||
      !data?.data?.priority ||
      !data?.openedBy ||
      !data?.openedOn
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // First, look up the user's Slack ID using their email
    let slackUserId: string;
    try {
      console.log("Looking up user by email:", data.openedBy);
      const userLookup = await slackApp.client.users.lookupByEmail({
        email: data.openedBy,
      });

      if (!userLookup.ok || !userLookup?.user?.id!) {
        console.error("User lookup failed:", userLookup.error);
        throw new Error(
          `Could not find Slack user with email ${data.openedBy}`
        );
      }

      slackUserId = userLookup?.user?.id!;
      console.log("Found Slack user ID:", slackUserId);
    } catch (userError) {
      console.error("Error looking up user by email:", userError);
      // Continue with ticket creation but don't attempt DM
      slackUserId = "";
    }

    // Post ticket to channel
    const payloadBlock = generateTicketBlock(
      data.data.title,
      data.data.description,
      data.data.category,
      data.data.priority,
      data.openedBy,
      data.openedOn,
      data.data.pageURL
    );

    const channelResult = await slackApp.client.chat.postMessage({
      channel: process.env.SLACK_TICKET_CHANNEL_ID!,
      blocks: payloadBlock,
      text: data.data.description,
    });

    if (!channelResult.ok) {
      return NextResponse.json(
        { success: false, error: channelResult.error },
        { status: 500 }
      );
    }

    // Only attempt to send DM if we found a valid Slack user ID
    if (slackUserId) {
      try {
        // First, open a DM channel with the user
        const conversationResponse = await slackApp.client.conversations.open({
          // users: [slackUserId],
          users: slackUserId,
          return_im: true,
        });

        console.log("coo------", conversationResponse);

        if (!conversationResponse.ok || !conversationResponse.channel?.id) {
          throw new Error(
            `Failed to open DM channel: ${conversationResponse.error}`
          );
        }

        const confirmationBlocks = [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `✅ Your ticket has been successfully logged`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Title:*\t*${data.data.title}*`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Priority:*\n${data.data.priority}`,
              },
              {
                type: "mrkdwn",
                text: `*Category:*\n${data.data.category || "N/A"}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Page URL:*\n${data.data.pageURL || "N/A"}`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Ticket ID: ${channelResult.ts}\nSubmitted on: ${new Date(
                  data.openedOn
                ).toLocaleString()}`,
              },
            ],
          },
        ];

        const dmResult = await slackApp.client.chat.postMessage({
          channel: conversationResponse.channel.id,
          blocks: confirmationBlocks,
          text: `Your ticket "${data.data.title}" has been successfully logged.`,
        });

        if (!dmResult.ok) {
          throw new Error(`Failed to send DM: ${dmResult.error}`);
        }
      } catch (dmError) {
        console.error("Error sending confirmation DM:", dmError);
        // Continue execution even if DM fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ticket sent to Slack!",
      ticketId: channelResult.ts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}
