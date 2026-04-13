import slackActions from "@/lib/slack/listeners/actions";
import NextConnectReceiver from "@/utils/NextConnectReceiver";
import { App } from "@slack/bolt";
import { NextRequest, NextResponse } from "next/server";

const receiver = new NextConnectReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "invalid",
  processBeforeResponse: true,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver,
  developerMode: true,
  socketMode: false,
});

slackActions.register(app);

export async function POST(request: NextRequest) {
  // console.log(request);
  // slack sends the request as a application/x-www-form-urlencoded
  const contentType = request.headers.get("content-type") || "";
  let payload: any;
  if (contentType === "application/json") {
    payload = await request.json();
  } else if (contentType === "application/x-www-form-urlencoded") {
    const formData = await request.formData();
    const body = formData.get("payload");
    payload = JSON.parse(body as string);
  } else {
    throw new Error("content type not handled");
  }

  try {
    if (payload.type === "url_verification") {
      return NextResponse.json({ challenge: payload.challenge });
    }
    console.log("---------------payload", payload);
    await app.processEvent({
      body: payload,
      ack: async (response) => {
        console.log("---------Acknowledged", response);
        //  any ack logic
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error handling Slack event:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

receiver.init(app);
