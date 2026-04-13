import { ITicketInfo } from "@/types";
import { Modal, Blocks, Elements, Bits, Md } from "slack-block-builder";

const successTicketUpdateModal = () => {
  return Modal({
    title: "Support Ticket",
    submit: "Done",
    callbackId: "success-ticket-callback-id",
  })
    .blocks(Blocks.Header({ text: `📌 Successfully updated ticket` }))
    .buildToJSON();
};

export default successTicketUpdateModal;
