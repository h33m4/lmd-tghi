import { slackApp } from "@/lib/slack";
import { generateRequestAccessBlock } from "@/utils/slack-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Request access data->", data);

    // Verify reCAPTCHA
    const verifyResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.captchaToken}`,
      { method: "POST" },
    );

    const verifyData = await verifyResponse.json();

    console.log("reCAPTCHA verification response:", verifyData);

    if (!verifyData.success || verifyData.score < 0.5) {
      return NextResponse.json(
        { success: false, error: "Security verification failed" },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!data?.fullname || !data?.email || !data?.requestedOn) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Generate Slack blocks for the request access message
    const payloadBlock = generateRequestAccessBlock(
      data.fullname,
      data.email,
      data.reason || "No reason provided",
      data.requestedOn,
    );

    console.log("payload", payloadBlock);

    // Post request to the same Slack channel as tickets
    const channelResult = await slackApp.client.chat.postMessage({
      channel: process.env.SLACK_TICKET_CHANNEL_ID!,
      blocks: payloadBlock,
      text: `New access request from ${data.fullname} (${data.email})`,
    });

    if (!channelResult.ok) {
      return NextResponse.json(
        { success: false, error: channelResult.error },
        { status: 500 },
      );
    }

    // Try to send a confirmation email or notification to the requester
    // This part is optional and would depend on your app's capabilities

    return NextResponse.json({
      success: true,
      message: "Access request sent to the team!",
      requestId: channelResult.ts,
    });
  } catch (error: any) {
    console.error("Error sending access request to Slack:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unknown error occurred." },
      { status: 500 },
    );
  }
}
