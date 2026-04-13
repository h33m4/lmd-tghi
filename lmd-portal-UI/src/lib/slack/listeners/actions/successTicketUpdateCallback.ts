import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
  View,
} from "@slack/bolt";
import modals from "../../modals";

const successfulTicketUpdateCallback = async ({
  ack,
  client,
  body,
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  try {
    await ack();
    console.log("----->>>>>>>------->>>>>");
    const result = await client.views.update({
      view_id: body.view?.id!,
      view: modals.successTicketUpdate() as unknown as View,
    });
    console.log("res", result);
  } catch (error) {
    console.error(error);
  }
};

export default successfulTicketUpdateCallback;
