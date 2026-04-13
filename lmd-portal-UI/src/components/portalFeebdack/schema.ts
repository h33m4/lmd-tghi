import { z } from "zod";

export const ticketStatus = [
  "Opened",
  "In Progress",
  "Pending",
  "Closed",
] as const;
export const ticketPriority = ["Low", "Medium", "High"] as const;

export const ticketCategory = [
  "Home Page",
  "KPI Data & Dashboard",
  "Malawi Data, Dashboard & Report",
  "Ethiopia Data, Dashboard & Report",
  "Liberia Data, Dashboard & Report",
  "Sierra Leone Data, Dashboard & Report",
  "AFF Data & Dashbboard",
  "Other",
] as const;

export const TicketFormSchema = z.object({
  status: z.enum(ticketStatus, { required_error: "Ticket status missing" }),
  priority: z.enum(ticketPriority, {
    required_error: "You need to select a priority type.",
  }),
  category: z.enum(ticketCategory, {
    required_error: "You need to select a ticket category type.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  openedBy: z.string().email(),
  pageURL: z.string().url(),
  consentToReachBack: z.boolean().default(false),
});

export const SuggestionFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  suggestedBy: z.string().email(),
  pageURL: z.string().url(),
  consentToReachBack: z.boolean().default(false),
});
