import { App, LogLevel } from "@slack/bolt";
import { Logger } from "@slack/logger";

export const logger: Logger = {
  debug: (...msg) => console.debug(...msg),
  info: (...msg) => console.info(...msg),
  warn: (...msg) => console.warn(...msg),
  error: (...msg) => console.error(...msg),
  setLevel: (level: LogLevel) => {},
  getLevel: () => LogLevel.DEBUG,
  setName: (name: string) => {},
};

class SlackApp {
  private static instance: SlackApp;
  private app: App;

  private constructor() {
    this.app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      socketMode: false,
      logLevel: LogLevel.DEBUG,
      logger: logger,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.app.event("app_mention", async ({ event, say }) => {
      logger.debug(`Received app_mention event: ${JSON.stringify(event)}`);
      await say(`Hello! You mentioned me in <#${event.channel}>`);
    });

    this.app.action("open_modal_action", async ({ ack, body, client }) => {
      await ack();
      try {
        await client.views.open({
          trigger_id: (body as any).trigger_id,
          view: {
            type: "modal",
            callback_id: "open_idea_modal",
            title: {
              type: "plain_text",
              text: "Ticket Details",
            },
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "View and update ticket details:",
                },
              },
              {
                type: "input",
                block_id: "title_block",
                element: {
                  type: "plain_text_input",
                  action_id: "title_input",
                  initial_value: "Current ticket title",
                },
                label: {
                  type: "plain_text",
                  text: "Title",
                },
              },
              {
                type: "input",
                block_id: "description_block",
                element: {
                  type: "plain_text_input",
                  action_id: "description_input",
                  multiline: true,
                  initial_value: "Current ticket description",
                },
                label: {
                  type: "plain_text",
                  text: "Description",
                },
              },
            ],
            submit: {
              type: "plain_text",
              text: "Update",
            },
          },
        });
      } catch (error) {
        logger.error("Error opening modal:", error);
      }
    });
  }

  public static getInstance(): SlackApp {
    if (!SlackApp.instance) {
      SlackApp.instance = new SlackApp();
    }
    return SlackApp.instance;
  }

  public getApp(): App {
    return this.app;
  }
}

export const slackApp = SlackApp.getInstance().getApp();
