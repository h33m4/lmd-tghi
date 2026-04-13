import { ITicketInfo } from "@/types";
import { Block, KnownBlock } from "@slack/bolt";

export function generateTicketBlock(
  title: string,
  description: string,
  category: string,
  priority: "Low" | "Medium" | "High",
  openedBy: string,
  openedOn: string,
  pageURL: string
): (Block | KnownBlock)[] {
  return [
    {
      type: "header",
      block_id: "ticket_message_title",
      text: {
        type: "plain_text",
        text: "Support Ticket  📨",
        emoji: true,
      },
    },

    {
      type: "context",
      block_id: "ticket_openedby",
      elements: [
        {
          type: "mrkdwn",
          text: `Opened by: @${openedBy.split("@")[0]} (${openedBy})`,
        },
        {
          type: "mrkdwn",
          text: `Opened on: ${openedOn}`,
        },
        {
          type: "mrkdwn",
          text: `*Page URL:*\n${pageURL || "N/A"}`,
        },
      ],
    },

    {
      type: "divider",
    },
    {
      type: "section",
      block_id: "ticket_category",
      fields: [
        {
          type: "mrkdwn",
          text: `Category:\n*${category}*`,
        },
      ],
    },
    {
      type: "section",
      block_id: "ticket_priority",
      fields: [
        {
          type: "mrkdwn",
          text: `Priority:\n*${priority}*`,
        },
      ],
    },
    {
      type: "section",
      block_id: "ticket_title",
      fields: [
        {
          type: "mrkdwn",
          text: `Title:\n*${title}*`,
        },
      ],
    },
    {
      type: "section",
      block_id: "ticket_description",
      fields: [
        {
          type: "mrkdwn",
          text: `Description:\n*${description}*`,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "actions",
      block_id: "ticket_actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "View Ticket",
          },
          style: "primary",
          value: "click_me_123",
          action_id: "open_ticket_action",
        },
      ],
    },
    {
      type: "divider",
    },
  ];
}

export function generateSuggestionBlock(
  title: string,
  description: string,
  openedBy: string,
  openedOn: string,
  pageURL: string
): (Block | KnownBlock)[] {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Idea Suggestion 💡",
        emoji: true,
      },
    },

    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Suggested by: @${openedBy.split("@")[0]} (${openedBy})`,
        },
        {
          type: "mrkdwn",
          text: `Submitted on: ${openedOn}`,
        },
        {
          type: "mrkdwn",
          text: `Page URL: ${pageURL || "N/A"}`,
        },
      ],
    },

    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `Title:\n*${title}*`,
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `Description:\n*${description}*`,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "View Idea",
          },
          style: "primary",
          value: "click_me_123",
          action_id: "open_idea_modal",
        },
      ],
    },
    {
      type: "divider",
    },
  ];
}

export function parseTicketInfo(jsonString: any): ITicketInfo {
  // console.log("-|_|_|_|_|_|_|_|_|_|_|_|_|_|_|-");
  // console.log(jsonString.blocks);
  // console.log("-|_|_|_|_|_|_|_|_|_|_|_|_|_|_|-");
  // const data = JSON.parse(jsonString);
  // Extracting the required fields from the JSON
  const blocks = jsonString.blocks;

  const titleBlock = blocks.find(
    (block: any) => block.block_id === "ticket_title"
  );
  const descriptionBlock = blocks.find(
    (block: any) => block.block_id === "ticket_description"
  );
  const priorityBlock = blocks.find(
    (block: any) => block.block_id === "ticket_priority"
  );
  const categoryBlock = blocks.find(
    (block: any) => block.block_id === "ticket_category"
  );
  const contextBlock = blocks.find(
    (block: any) => block.block_id === "ticket_openedby"
  );

  const openedByText = contextBlock.elements[0].text;
  const dateOpenedText = contextBlock.elements[1].text;

  // Extracting and formatting the data
  const title = titleBlock.fields[0].text
    .replace("Title:\n*", "")
    .replace("*", "")
    .trim();
  const description = descriptionBlock.fields[0].text
    .replace("Description:\n*", "")
    .replace("*", "")
    .trim();
  const priority = priorityBlock.fields[0].text
    .replace("Priority:\n*", "")
    .replace("*", "")
    .trim();
  const category = categoryBlock.fields[0].text
    .replace("Category:\n*", "")
    .replace("*", "")
    .trim();
  const openedBy = openedByText.match(/<@(\w+)>/)?.[1] ?? "Unknown";
  const dateOpened = dateOpenedText.replace("Opened on: ", "").trim();

  // Status is not provided in the JSON, defaulting to "Open"
  const status = "Opened";

  return {
    title,
    description,
    status,
    priority,
    category,
    openedBy,
    dateOpened,
  };
}

export function generateRequestAccessBlock(
  fullname: string,
  email: string,
  reason: string,
  requestedOn: string
) {
  const date = new Date(requestedOn).toLocaleString();

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🔑 New Access Request",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Full Name:*\n${fullname}`,
        },
        {
          type: "mrkdwn",
          text: `*Email:*\n${email}`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Reason:*\n${reason}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Requested on: ${date}`,
        },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Approve",
            emoji: true,
          },
          style: "primary",
          value: `approve_access_${email}`,
          action_id: "approve_access_request",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Deny",
            emoji: true,
          },
          style: "danger",
          value: `deny_access_${email}`,
          action_id: "deny_access_request",
        },
      ],
    },
  ];
}
