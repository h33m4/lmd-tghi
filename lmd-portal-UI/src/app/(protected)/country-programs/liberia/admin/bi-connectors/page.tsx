import { metaObject } from "@/config/site.config";
import dynamic from "next/dynamic";
import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";
import { ActiveBIConnection } from "@/components/shared/program-admin/credentials/credentaialsManager";
import React from "react";

export const metadata = {
  ...metaObject("Liberia Program | Admin - BI Connectors"),
};

const BIConnectorsPage = dynamic(
  () =>
    import(
      "@/components/shared/program-admin/credentials/credentaialsManager"
    ),
  {
    ssr: false,
    loading: () => <DashboardManagerSkeleton />,
  },
);

const sampleConnections: ActiveBIConnection[] = [
  {
    id: 1,
    connectorType: "powerbi",
    connectorName: "Power BI Dashboard",
    createdAt: "2025-01-08T10:00:00Z",
    expiresAt: "2025-01-15T10:00:00Z",
    schemas: ["health", "surveys"],
    status: "active",
    credentials: {
      host: "liberia-dw.us-east-1.redshift.amazonaws.com",
      port: "5439",
      database: "health_data",
      username: "bi_user_abc123",
      password: "temp_pwd_xyz789",
    },
  },
  {
    id: 2,
    connectorType: "tableau",
    connectorName: "Tableau Analytics",
    createdAt: "2025-01-05T14:00:00Z",
    expiresAt: "2025-01-12T14:00:00Z",
    schemas: ["hr"],
    status: "active",
    credentials: {
      host: "liberia-dw.us-east-1.redshift.amazonaws.com",
      port: "5439",
      database: "health_data",
      username: "bi_user_def456",
      password: "temp_pwd_abc123",
    },
  },
  {
    id: 3,
    connectorType: "tableau",
    connectorName: "Tableau Analytics",
    createdAt: "2025-01-05T14:00:00Z",
    expiresAt: "2025-01-12T14:00:00Z",
    schemas: ["hr"],
    status: "active",
    credentials: {
      host: "liberia-dw.us-east-1.redshift.amazonaws.com",
      port: "5439",
      database: "health_data",
      username: "bi_user_def456",
      password: "temp_pwd_abc123",
    },
  },
];

export default function Page() {
  return (
    <div className="h-full">
      <BIConnectorsPage
        activeBiConnections={sampleConnections}
        program="Liberia"
      />
    </div>
  );
}
