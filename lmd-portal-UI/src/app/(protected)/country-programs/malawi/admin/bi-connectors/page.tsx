import React from "react";

import { metaObject } from "@/config/site.config";
import BIConnectorsPage, {
  ActiveBIConnection,
} from "@/components/shared/program-admin/credentials/credentaialsManager";

export const metadata = {
  ...metaObject("Malawi Program | Admin - BI Connectors"),
};

const activeConections: ActiveBIConnection[] = [
  {
    id: 1,
    connectorType: "powerbi",
    connectorName: "Power BI Dashboard",
    createdAt: "2025-01-08T10:00:00Z",
    expiresAt: "2025-01-30T10:00:00Z",
    schemas: [
      "mlw_cbmnc_training",
      "mlw_ichis_training",
      "mlw_ichis_expansion",
      "mlw_ichis_hsa_supervision",
    ],
    status: "active",
    credentials: {
      host: "dev-lmd-v2.002190277880.us-east-1.redshift-serverless.amazonaws.com",
      port: "5439",
      database: "malawi",
      username: "bi_user_abc123",
      password: "temp_pwd_xyz789",
    },
  },
];

export default function Page() {
  return (
    <div className="h-full">
      <BIConnectorsPage
        activeBiConnections={activeConections}
        program="Malawi"
      />
    </div>
  );
}
