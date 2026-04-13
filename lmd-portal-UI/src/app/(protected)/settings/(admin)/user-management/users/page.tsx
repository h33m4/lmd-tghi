import { metaObject } from "@/config/site.config";
import React from "react";
import handleGetAlUsers from "@/lib/actions/auth/handleGetAllUsers";
import UsersTable from "../components/UsersTable";

// css
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export const metadata = {
  ...metaObject("Users Settings"),
};

export default async function UserPage() {
  const { success } = await handleGetAlUsers();
  return (
    <>
      <UsersTable userData={success!} />
    </>
  );
}
