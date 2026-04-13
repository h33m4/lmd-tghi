import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

// Routes under settings/(admin) are restricted to super_administrator and administrator.
// This layout acts as the server-side guard; the middleware provides the first (edge) layer.
const ALLOWED_GROUPS = ["super_administrator", "administrator"];

export default async function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const groups = session?.user?.groups ?? [];

  const hasAccess = groups.some((g) => ALLOWED_GROUPS.includes(g));
  if (!hasAccess) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
