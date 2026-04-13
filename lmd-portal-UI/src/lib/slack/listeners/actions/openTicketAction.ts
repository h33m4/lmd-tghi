import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
  View,
} from "@slack/bolt";
import modals from "../../modals";
import { parseTicketInfo } from "@/utils/slack-helpers";

const openTicketCalback = async ({
  ack,
  client,
  body,
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  try {
    console.log("--------------------openTicketAction---------------------");
    await ack();
    const ticket = parseTicketInfo(body.message as unknown as string);
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: modals.openTicket(ticket) as unknown as View,
    });

    console.log("res", result);
  } catch (error) {
    console.error(error);
  }
};

export default openTicketCalback;
