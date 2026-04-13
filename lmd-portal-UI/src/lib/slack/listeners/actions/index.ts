import { App } from "@slack/bolt";
import openTicketCallback from "./openTicketAction";
import successfulTicketUpdateCallback from "./successTicketUpdateCallback";

const slackActions = {
  register: (app: App) => {
    app.action("open_ticket_action", openTicketCallback);
    app.action("update-ticket-callback-id", successfulTicketUpdateCallback);
  },
};

export default slackActions;
