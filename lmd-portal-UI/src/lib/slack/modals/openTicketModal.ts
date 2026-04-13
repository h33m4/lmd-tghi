import { ITicketInfo } from "@/types";
import { Modal, Blocks, Elements, Bits, Md } from "slack-block-builder";

const getPriorityIcon = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "🟢";
    case "medium":
      return "🟠";
    case "high":
      return "🔴";
    default:
      return "⚪";
  }
};

const OpenTicketModal = (ticketInfo: ITicketInfo) => {
  return Modal({
    title: "Support Ticket",
    submit: "Update Ticket",
    callbackId: "update-ticket-callback-id",
  })
    .blocks(
      Blocks.Header({ text: `📌 ${ticketInfo.title}` }),
      Blocks.Divider(),
      Blocks.Section({
        text: `Priority: ${getPriorityIcon(ticketInfo.priority)} ${Md.bold(
          ticketInfo.priority
        )}`,
      }),
      Blocks.Section({
        text: `${Md.bold("Category")} \n${ticketInfo.category}`,
      }),
      Blocks.Section({
        text: `👤 \t${Md.user(ticketInfo.openedBy)}`,
      }),
      Blocks.Section({
        text: `🗓️ \t${Md.bold(ticketInfo.dateOpened)}`,
      }),
      Blocks.Divider(),
      Blocks.Section({
        text: `${Md.bold("Description")} \n${ticketInfo.description}`,
      }),
      Blocks.Divider(),
      Blocks.Input({ label: "Ticket Status" }).element(
        Elements.StaticSelect({ placeholder: `${ticketInfo.status}` })
          .actionId("ticket_status_id")
          .options(
            Bits.Option({ text: "Opened", value: "opened" }),
            Bits.Option({ text: "In Progress", value: "in_progress" }),
            Bits.Option({ text: "Pending", value: "pending" }),
            Bits.Option({ text: "Closed", value: "closed" })
          )
      ),

      Blocks.Input({ label: "💬 Comments" })
        .optional()
        .element(
          Elements.TextInput({
            multiline: true,
            placeholder: "Please add any comments you have here",
          })
        )
    )
    .buildToJSON();
};

export default OpenTicketModal;
