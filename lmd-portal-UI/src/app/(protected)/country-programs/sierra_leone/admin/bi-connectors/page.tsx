import React from "react";
import { metaObject } from "@/config/site.config";
import BIConnectorsPage, {
  ActiveBIConnection,
} from "@/components/shared/program-admin/credentials/credentaialsManager";

export const metadata = {
  ...metaObject("Sierra Leone Program | Admin - BI Connectors"),
};

const activeConnections: ActiveBIConnection[] = [
  {
    id: 1,
    connectorType: "powerbi",
    connectorName: "Power BI Dashboard",
    createdAt: "2025-01-08T10:00:00Z",
    expiresAt: "2025-01-30T10:00:00Z",
    schemas: ["sl_chw_training", "sl_nchwp_training", "sl_supervision_data"],
    status: "active",
    credentials: {
      host: "dev-lmd-v2.002190277880.us-east-1.redshift-serverless.amazonaws.com",
      port: "5439",
      database: "sierra_leone",
      username: "bi_user_abc123",
      password: "temp_pwd_xyz789",
    },
  },
];

export default function Page() {
  return (
    <div className="h-full">
      <BIConnectorsPage
        activeBiConnections={activeConnections}
        program="Sierra_Leone"
      />
    </div>
  );
}
