import { slackApp } from "@/lib/slack";
import { generateSuggestionBlock } from "@/utils/slack-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (
      !data?.data?.title ||
      !data?.data?.description ||
      !data?.suggestedBy ||
      !data?.createdOn ||
      !data.data.pageURL
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // First, look up the user's Slack ID using their email
    let slackUserId: string;
    try {
      console.log("Looking up user by email:", data.suggestedBy);
      const userLookup = await slackApp.client.users.lookupByEmail({
        email: data.suggestedBy,
      });

      if (!userLookup.ok || !userLookup?.user?.id!) {
        console.error("User lookup failed:", userLookup.error);
        throw new Error(
          `Could not find Slack user with email ${data.suggestedBy}`
        );
      }

      slackUserId = userLookup?.user?.id!;
      console.log("Found Slack user ID:", slackUserId);
    } catch (userError) {
      console.error("Error looking up user by email:", userError);
      // Continue with ticket creation but don't attempt DM
      slackUserId = "";
    }

    const payloadBlock = generateSuggestionBlock(
      data.data.title,
      data.data.description,
      data.suggestedBy,
      data.createdOn,
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
              text: `✅ Your suggestion has been successfully logged`,
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
            text: {
              type: "mrkdwn",
              text: `*Description:*\t*${data.data.description}*`,
            },
          },

          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Suggestion ID: ${
                  channelResult.ts
                }\nSubmitted on: ${new Date(data.openedOn).toLocaleString()}`,
              },
              {
                type: "mrkdwn",
                text: `*Page URL:*\n${data.data.pageURL || "N/A"}`,
              },
            ],
          },
        ];

        const dmResult = await slackApp.client.chat.postMessage({
          channel: conversationResponse.channel.id,
          blocks: confirmationBlocks,
          text: `Your Suggestion "${data.data.title}" has been successfully logged.`,
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
      message: "Idea sent to Slack!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}
