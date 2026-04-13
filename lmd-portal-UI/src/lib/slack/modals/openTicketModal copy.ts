import { ITicketInfo } from "@/types";
import { Modal, Blocks, Elements, Bits } from "slack-block-builder";

const OpenTicketModal = (ticketInfo: ITicketInfo) => {
  return {
    type: "modal",
    callback_id: "ticket-modal-callback-id",
    title: {
      type: "plain_text",
      text: "Support Ticket",
    },
    blocks: [
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "You have a new request:\n*<fakeLink.toEmployeeProfile.com|Fred Enriquez - New device request>*",
        },
      },
      {
        type: "input",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select an item",
            emoji: true,
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "*plain_text option 0*",
                emoji: true,
              },
              value: "value-0",
            },
            {
              text: {
                type: "plain_text",
                text: "*plain_text option 1*",
                emoji: true,
              },
              value: "value-1",
            },
            {
              text: {
                type: "plain_text",
                text: "*plain_text option 2*",
                emoji: true,
              },
              value: "value-2",
            },
          ],
          action_id: "static_select-action",
        },
        label: {
          type: "plain_text",
          text: "Ticket Status",
          emoji: true,
        },
      },

      {
        type: "input",
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: "ticket-comments-action",
        },
        label: {
          type: "plain_text",
          text: "Comments",
          emoji: true,
        },
      },
    ],
    close: {
      type: "plain_text",
      text: "Cancel",
    },
    submit: {
      type: "plain_text",
      text: "Update Ticket",
    },
    private_metadata: "Shhhhhhhh",
  };
};

export default OpenTicketModal;
