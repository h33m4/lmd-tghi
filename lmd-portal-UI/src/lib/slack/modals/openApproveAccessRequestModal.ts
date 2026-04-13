import { Modal, Blocks, Md } from "slack-block-builder";

/**
 * Creates a Slack modal for approving access requests
 * @param email Email address of the user requesting access
 * @returns JSON formatted Slack modal
 */
const OpenApproveAccessRequestModal = () => {
  return Modal({
    title: "Approve Access Request",
    submit: "I've Completed This",
    close: "Cancel",
    callbackId: "approve-access-callback-id",
  })
    .blocks(
      Blocks.Header({ text: "🔑 New User Access" }),
      Blocks.Divider(),
      //   Blocks.Section({
      //     text: `You're approving access for: ${Md.bold(email)}`,
      //   }),
      Blocks.Divider(),
      Blocks.Section({
        text: Md.bold("How to create access:"),
      }),
      Blocks.Section({
        text: `• Visit ${Md.link(
          "https://lastmilehealthdata.org/settings/user-management/users",
          "LMD 2.0 User Management Portal"
        )}`,
      }),
      Blocks.Section({
        text: "• Click on 'Add User'",
      }),
      //   Blocks.Section({
      //     text: `• Enter the user's email: ${Md.bold(email)}`,
      //   }),
      Blocks.Section({
        text: "• Select appropriate role and permissions",
      }),
      Blocks.Section({
        text: "• Click 'Send Invitation'",
      }),
      Blocks.Context().elements(
        Md.quote(
          "An email will be automatically sent to the user with login instructions"
        )
      )
    )
    .buildToJSON();
};

export default OpenApproveAccessRequestModal;
