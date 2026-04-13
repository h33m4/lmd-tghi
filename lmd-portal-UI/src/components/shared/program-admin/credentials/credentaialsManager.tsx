"use client";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Copy,
  Download,
  Trash2,
  Clock,
  Shield,
  Database,
  Eye,
  EyeOff,
} from "lucide-react";
import React, { useState } from "react";
import GenerateCredentialsModal from "./GenerateConnectionCredentialsModal";
import { LmhPrograms } from "@/types";

type ConnectorType = "powerbi" | "tableau" | "looker" | "metabase" | "generic";

export interface ActiveBIConnection {
  id: number;
  connectorType: ConnectorType;
  connectorName: string;
  createdAt: string;
  expiresAt: string;
  schemas: string[];
  status: "active" | "expired";
  credentials?: {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
  };
}

type Props = {
  activeBiConnections?: ActiveBIConnection[];
  program: LmhPrograms;
};

function BIConnectorsPage({ activeBiConnections = [], program }: Props) {
  const [activeConnections, setActiveConnections] =
    useState<ActiveBIConnection[]>(activeBiConnections);

  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (diffMs < 0) return "Expired";
    if (diffDays > 0) return `${diffDays}d ${diffHours}h remaining`;
    return `${diffHours}h remaining`;
  };

  const handleRevoke = (id: number) => {
    setActiveConnections(activeConnections.filter((conn) => conn.id !== id));
  };

  return (
    <div className="">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                BI Connectors
              </h1>
              <p className="text-gray-600 mt-1">
                Generate temporary credentials for business intelligence tools
              </p>
            </div>
            <GenerateCredentialsModal
              onSave={() => {}}
              availableSchemas={activeConnections[0]?.schemas ?? []}
              program={program}
            />
          </div>
        </div>
      </div>

      {/* Active Connections */}
      <div className=" p-0 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Active Connections
          </h2>
        </div>

        <div className="grid gap-6">
          {activeConnections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onRevoke={handleRevoke}
              getTimeRemaining={getTimeRemaining}
            />
          ))}
        </div>

        {activeConnections.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active connections
            </h3>
            <p className="text-gray-600 mb-6">
              Generate temporary credentials to connect your BI tools
            </p>
            <Button onClick={() => setShowGenerateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Credentials
            </Button>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <GenerateCredentialsModal
          onSave={(newConnection) => {
            setActiveConnections([...activeConnections, newConnection]);
            setShowGenerateModal(false);
          }}
          availableSchemas={activeConnections[0]?.schemas ?? []}
          program={program}
        />
      )}
    </div>
  );
}

// Connection Card Component
function ConnectionCard({
  connection,
  onRevoke,
  getTimeRemaining,
}: {
  connection: ActiveBIConnection;
  onRevoke: (id: number) => void;
  getTimeRemaining: (expiresAt: string) => string;
}) {
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getConnectorIcon = (type: ConnectorType) => {
    const icons = {
      powerbi: "📊",
      tableau: "📈",
      looker: "🔍",
      metabase: "📉",
      generic: "💾",
    };
    return icons[type];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {getConnectorIcon(connection.connectorType)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {connection.connectorName}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                {/* <span className="flex items-center gap-1"> */}
                {/* <Clock className="h-3.5 w-3.5" /> */}
                {/* {getTimeRemaining(connection.expiresAt)} */}
                {/* </span> */}
                {/* <span>•</span> */}
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Read-only access to {connection.schemas.join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              {showCredentials ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRevoke(connection.id)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke
            </Button>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      {showCredentials && connection.credentials && (
        <div className="p-6 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Connection Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(connection.credentials).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 uppercase">
                    {key}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(value, key)}
                    className="h-6 px-2"
                  >
                    {copiedField === key ? (
                      <span className="text-xs text-green-600">Copied!</span>
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="font-mono text-sm text-gray-900 break-all">
                  {key === "password" && !showCredentials ? "••••••••" : value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Connection File
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy All as JSON
            </Button>
          </div>

          {/* Setup Instructions */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-semibold text-blue-900 mb-2">
              Setup Instructions for {connection.connectorName}
            </h5>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Copy the connection details above</li>
              <li>Open {connection.connectorName}</li>
              <li>
                Add new data source → Select <strong>Amazon Redshift</strong> or{" "}
                <strong>PostgreSQL</strong>
              </li>
              <li>Paste the connection details (ensure SSL is enabled)</li>
              <li>Test connection and save</li>
            </ol>
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            Created:{" "}
            {new Date(connection.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>
            Expires:{" "}
            {new Date(connection.expiresAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BIConnectorsPage;
