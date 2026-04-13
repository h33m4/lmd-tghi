"use client";
import React, { useState } from "react";
import {
  Plus,
  Play,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";

// Type definitions
type PipelineStatus = "active" | "syncing" | "error" | "paused";
export type SourceType =
  | "dhis2"
  | "ifi"
  | "rest_api"
  | "google_sheets"
  | "csv_upload"
  | "fhir"
  | "database";
export type SyncType = "incremental" | "full";
export type DataType =
  | "string"
  | "integer"
  | "float"
  | "date"
  | "datetime"
  | "boolean"
  | "json";
export type WarehouseType = "redshift" | "snowflake" | "bigquery";

export interface ColumnMapping {
  originalName: string;
  newName: string;
  dataType: DataType;
}

interface Destination {
  warehouse: WarehouseType;
  schema: string;
  tableName: string;
}

interface TransformationStage {
  enabled: boolean;
  sqlCode: string;
  createOutputTable: boolean;
  outputTableName: string;
}

interface ColumnMappingStage {
  enabled: boolean;
  mappings: ColumnMapping[];
}

interface PipelineStages {
  columnMapping: ColumnMappingStage;
  transformation: TransformationStage;
}

export interface DataSource {
  id: number;
  name: string;
  type: SourceType;
  status: PipelineStatus;
  endpoint: string;
  cronSchedule: string;
  cronDescription: string;
  lastRun: string;
  nextRun: string;
  syncType: SyncType;
  retryAttempts: number;
  alertEmail: string;
  destination: Destination;
  stages: PipelineStages;
  errorMessage?: string;
}

interface SourceTypeOption {
  value: SourceType;
  label: string;
}

interface CronPreset {
  value: string;
  label: string;
}

interface SourceFormProps {
  source: DataSource | null;
  onClose: () => void;
}

const getStatusIcon = (status: PipelineStatus): JSX.Element => {
  switch (status) {
    case "active":
      return <CheckCircle className="w-4 h-4" />;
    case "syncing":
      return <Clock className="w-4 h-4 animate-spin" />;
    case "error":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Settings className="w-4 h-4" />;
  }
};

const getStatusColor = (status: PipelineStatus): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "syncing":
      return "bg-blue-100 text-blue-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "paused":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const PipelineAdmin: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>([
    {
      id: 1,
      name: "DHIS2 Health Facilities",
      type: "dhis2",
      status: "active",
      endpoint: "https://liberia.dhis2.org/api",
      cronSchedule: "0 0 1 * *",
      cronDescription: "Monthly on day 1",
      lastRun: "2025-01-01T00:00:00Z",
      nextRun: "2025-02-01T00:00:00Z",
      syncType: "incremental",
      retryAttempts: 3,
      alertEmail: "admin@health.gov.lr",
      destination: {
        warehouse: "redshift",
        schema: "health",
        tableName: "dhis2_monthly_aggregates",
      },
      stages: {
        columnMapping: {
          enabled: true,
          mappings: [
            {
              originalName: "orgUnit",
              newName: "facility_name",
              dataType: "string",
            },
            {
              originalName: "dataElement",
              newName: "indicator",
              dataType: "string",
            },
            { originalName: "value", newName: "count", dataType: "integer" },
            {
              originalName: "period",
              newName: "report_date",
              dataType: "date",
            },
          ],
        },
        transformation: {
          enabled: true,
          sqlCode: `SELECT 
  facility_name,
  indicator,
  SUM(count) as total_count,
  DATE_TRUNC('month', report_date) as month
FROM raw_data
WHERE report_date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY facility_name, indicator, month`,
          createOutputTable: true,
          outputTableName: "dhis2_monthly_aggregates",
        },
      },
    },
    {
      id: 2,
      name: "IFI Kobo Surveys",
      type: "ifi",
      status: "syncing",
      endpoint: "https://kobo.ifionline.org/api/v2/assets/aBcDeF123",
      cronSchedule: "0 0 15 * *",
      cronDescription: "Monthly on day 15",
      lastRun: "2025-01-10T08:00:00Z",
      nextRun: "2025-01-15T00:00:00Z",
      syncType: "full",
      retryAttempts: 5,
      alertEmail: "data@ifi.org",
      destination: {
        warehouse: "redshift",
        schema: "surveys",
        tableName: "ifi_kobo_responses",
      },
      stages: {
        columnMapping: {
          enabled: false,
          mappings: [],
        },
        transformation: {
          enabled: false,
          sqlCode: "",
          createOutputTable: false,
          outputTableName: "",
        },
      },
    },
    {
      id: 3,
      name: "CHW Masterlist",
      type: "google_sheets",
      status: "error",
      endpoint: "https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F",
      cronSchedule: "0 0 * * 1",
      cronDescription: "Weekly on Monday",
      lastRun: "2025-01-06T00:00:00Z",
      nextRun: "2025-01-13T00:00:00Z",
      syncType: "full",
      retryAttempts: 3,
      alertEmail: "chw@health.gov.lr",
      errorMessage: "Authentication failed",
      destination: {
        warehouse: "redshift",
        schema: "hr",
        tableName: "chw_masterlist",
      },
      stages: {
        columnMapping: {
          enabled: true,
          mappings: [
            {
              originalName: "CHW Name",
              newName: "chw_name",
              dataType: "string",
            },
            { originalName: "County", newName: "county", dataType: "string" },
            {
              originalName: "Status",
              newName: "employment_status",
              dataType: "string",
            },
          ],
        },
        transformation: {
          enabled: false,
          sqlCode: "",
          createOutputTable: false,
          outputTableName: "",
        },
      },
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);

  const sourceTypes: SourceTypeOption[] = [
    { value: "dhis2", label: "DHIS2" },
    { value: "ifi", label: "IFI (Kobo REST API)" },
    { value: "rest_api", label: "Generic REST API" },
    { value: "google_sheets", label: "Google Sheets" },
    { value: "csv_upload", label: "CSV Upload" },
    { value: "fhir", label: "FHIR Server" },
    { value: "database", label: "Database (PostgreSQL/MySQL)" },
  ];

  const cronPresets: CronPreset[] = [
    { value: "0 0 1 * *", label: "Monthly (1st)" },
    { value: "0 0 15 * *", label: "Monthly (15th)" },
    { value: "0 0 * * 1", label: "Weekly (Monday)" },
    { value: "0 0 * * *", label: "Daily" },
    { value: "0 */6 * * *", label: "Every 6 hours" },
  ];

  const handleManualRun = (sourceId: number): void => {
    setSources(
      sources.map((s) =>
        s.id === sourceId ? { ...s, status: "syncing" as PipelineStatus } : s
      )
    );
    // Simulate API call
    setTimeout(() => {
      setSources(
        sources.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                status: "active" as PipelineStatus,
                lastRun: new Date().toISOString(),
              }
            : s
        )
      );
    }, 3000);
  };

  const SourceForm: React.FC<SourceFormProps> = ({ source, onClose }) => {
    const [formData, setFormData] = useState<DataSource>(
      source || {
        id: 0,
        name: "",
        type: "rest_api",
        endpoint: "",
        cronSchedule: "0 0 1 * *",
        cronDescription: "Monthly on day 1",
        lastRun: "",
        nextRun: "",
        syncType: "incremental",
        retryAttempts: 3,
        alertEmail: "",
        status: "paused",
        destination: {
          schema: "public",
          tableName: "",
          warehouse: "redshift",
        },
        stages: {
          columnMapping: {
            enabled: false,
            mappings: [],
          },
          transformation: {
            enabled: false,
            sqlCode: "",
            createOutputTable: false,
            outputTableName: "",
          },
        },
      }
    );

    const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>(
      source?.stages?.columnMapping?.mappings ||
        formData.stages?.columnMapping?.mappings ||
        []
    );

    const addColumnMapping = (): void => {
      setColumnMappings([
        ...columnMappings,
        {
          originalName: "",
          newName: "",
          dataType: "string",
        },
      ]);
    };

    const updateColumnMapping = (
      index: number,
      field: keyof ColumnMapping,
      value: string
    ): void => {
      const updated = [...columnMappings];
      updated[index][field] = value as any;
      setColumnMappings(updated);
    };

    const removeColumnMapping = (index: number): void => {
      setColumnMappings(columnMappings.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      const updatedData: DataSource = {
        ...formData,
        destination: formData.destination,
        stages: {
          columnMapping: {
            enabled: formData.stages.columnMapping.enabled,
            mappings: columnMappings,
          },
          transformation: formData.stages.transformation,
        },
      };

      if (source) {
        setSources(
          sources.map((s) =>
            s.id === source.id ? { ...s, ...updatedData } : s
          )
        );
      } else {
        setSources([...sources, { ...updatedData, id: Date.now() }]);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            {source ? "Edit Data Source" : "Add New Data Source"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Source Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Source Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as SourceType,
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                {sourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Endpoint/URL
              </label>
              <input
                type="text"
                value={formData.endpoint}
                onChange={(e) =>
                  setFormData({ ...formData, endpoint: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="https://api.example.com/data"
                required
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-3">
                Warehouse Destination
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Warehouse
                  </label>
                  <select
                    value={formData.destination.warehouse}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination: {
                          ...formData.destination,
                          warehouse: e.target.value as WarehouseType,
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="redshift">AWS Redshift</option>
                    <option value="snowflake">Snowflake</option>
                    <option value="bigquery">BigQuery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Schema
                  </label>
                  <input
                    type="text"
                    value={formData.destination.schema}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination: {
                          ...formData.destination,
                          schema: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="public"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Table Name
                  </label>
                  <input
                    type="text"
                    value={formData.destination.tableName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination: {
                          ...formData.destination,
                          tableName: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="health_facilities"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Schedule
                </label>
                <select
                  value={formData.cronSchedule}
                  onChange={(e) =>
                    setFormData({ ...formData, cronSchedule: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  {cronPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sync Type
                </label>
                <select
                  value={formData.syncType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      syncType: e.target.value as SyncType,
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="incremental">Incremental</option>
                  <option value="full">Full Refresh</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  value={formData.retryAttempts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      retryAttempts: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Alert Email
                </label>
                <input
                  type="email"
                  value={formData.alertEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, alertEmail: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Pipeline Stages */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-3">Pipeline Stages</h3>

              {/* Stage 1: Column Mapping */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.stages.columnMapping.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stages: {
                            ...formData.stages,
                            columnMapping: {
                              ...formData.stages.columnMapping,
                              enabled: e.target.checked,
                            },
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label className="font-medium">
                      Stage 1: Column Mapping
                    </label>
                  </div>
                </div>

                {formData.stages.columnMapping.enabled && (
                  <div className="mt-3">
                    <div className="bg-white rounded border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-2 border-b">
                              Original Column
                            </th>
                            <th className="text-left p-2 border-b">
                              New Column Name
                            </th>
                            <th className="text-left p-2 border-b">
                              Data Type
                            </th>
                            <th className="w-10 p-2 border-b"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {columnMappings.map((mapping, index) => (
                            <tr key={index}>
                              <td className="p-2 border-b">
                                <input
                                  type="text"
                                  value={mapping.originalName}
                                  onChange={(e) =>
                                    updateColumnMapping(
                                      index,
                                      "originalName",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1 text-sm"
                                  placeholder="source_col"
                                />
                              </td>
                              <td className="p-2 border-b">
                                <input
                                  type="text"
                                  value={mapping.newName}
                                  onChange={(e) =>
                                    updateColumnMapping(
                                      index,
                                      "newName",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1 text-sm"
                                  placeholder="target_col"
                                />
                              </td>
                              <td className="p-2 border-b">
                                <select
                                  value={mapping.dataType}
                                  onChange={(e) =>
                                    updateColumnMapping(
                                      index,
                                      "dataType",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border rounded px-2 py-1 text-sm"
                                >
                                  <option value="string">String</option>
                                  <option value="integer">Integer</option>
                                  <option value="float">Float</option>
                                  <option value="date">Date</option>
                                  <option value="datetime">DateTime</option>
                                  <option value="boolean">Boolean</option>
                                  <option value="json">JSON</option>
                                </select>
                              </td>
                              <td className="p-2 border-b">
                                <button
                                  type="button"
                                  onClick={() => removeColumnMapping(index)}
                                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      onClick={addColumnMapping}
                      className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Column Mapping
                    </button>
                  </div>
                )}
              </div>

              {/* Stage 2: SQL Transformation */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.stages.transformation.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stages: {
                          ...formData.stages,
                          transformation: {
                            ...formData.stages.transformation,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label className="font-medium">
                    Stage 2: SQL Transformation
                  </label>
                </div>

                {formData.stages.transformation.enabled && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SQL Code
                      </label>
                      <textarea
                        value={formData.stages.transformation.sqlCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stages: {
                              ...formData.stages,
                              transformation: {
                                ...formData.stages.transformation,
                                sqlCode: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full border rounded px-3 py-2 font-mono text-sm"
                        rows={6}
                        placeholder="SELECT 
  facility_name,
  COUNT(*) as visit_count,
  AVG(patient_age) as avg_age
FROM raw_data
WHERE visit_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY facility_name"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Write SQL to transform your data. Use
                        &apos;raw_data&apos; as source table.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            formData.stages.transformation.createOutputTable
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stages: {
                                ...formData.stages,
                                transformation: {
                                  ...formData.stages.transformation,
                                  createOutputTable: e.target.checked,
                                },
                              },
                            })
                          }
                          className="w-4 h-4"
                        />
                        <label className="text-sm">Create output table</label>
                      </div>

                      {formData.stages.transformation.createOutputTable && (
                        <input
                          type="text"
                          value={formData.stages.transformation.outputTableName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stages: {
                                ...formData.stages,
                                transformation: {
                                  ...formData.stages.transformation,
                                  outputTableName: e.target.value,
                                },
                              },
                            })
                          }
                          className="border rounded px-3 py-1 text-sm flex-1"
                          placeholder="transformed_facility_stats"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {source ? "Update" : "Create"} Source
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Liberia Data Pipeline Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Manage data source configurations and schedules
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Data Source
          </button>
        </div>

        <div className="grid gap-4">
          {sources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{source.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        source.status
                      )}`}
                    >
                      {getStatusIcon(source.status)}
                      {source.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-4">
                    <div>
                      <div className="font-medium text-gray-900">Type</div>
                      <div className="capitalize">
                        {source.type.replace("_", " ")}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Schedule</div>
                      <div>{source.cronDescription}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Sync Type</div>
                      <div className="capitalize">{source.syncType}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Last Run</div>
                      <div>{new Date(source.lastRun).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {source.stages &&
                    (source.stages.columnMapping?.enabled ||
                      source.stages.transformation?.enabled) && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {source.stages.columnMapping?.enabled && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Column Mapping (
                            {source.stages.columnMapping.mappings?.length || 0}{" "}
                            cols)
                          </span>
                        )}
                        {source.stages.transformation?.enabled && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                            SQL Transformation
                            {source.stages.transformation.createOutputTable &&
                              ` → ${source.stages.transformation.outputTableName}`}
                          </span>
                        )}
                      </div>
                    )}

                  {/* Data Flow Visualization */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-1">
                        <div className="font-medium text-gray-500 text-xs mb-1">
                          SOURCE
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2">
                          <div
                            className="font-mono text-sm text-blue-900 truncate"
                            title={source.endpoint}
                          >
                            {source.endpoint}
                          </div>
                        </div>
                      </div>

                      <div className="text-gray-400">→</div>

                      {source.stages?.columnMapping?.enabled && (
                        <>
                          <div className="flex-shrink-0">
                            <div className="bg-purple-50 border border-purple-200 rounded px-3 py-2 text-center">
                              <div className="text-xs font-medium text-purple-900">
                                Map Cols
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-400">→</div>
                        </>
                      )}

                      {source.stages?.transformation?.enabled && (
                        <>
                          <div className="flex-shrink-0">
                            <div className="bg-indigo-50 border border-indigo-200 rounded px-3 py-2 text-center">
                              <div className="text-xs font-medium text-indigo-900">
                                Transform
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-400">→</div>
                        </>
                      )}

                      <div className="flex-1">
                        <div className="font-medium text-gray-500 text-xs mb-1">
                          DESTINATION
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-green-700 uppercase">
                              {source.destination?.warehouse || "Redshift"}
                            </span>
                            <span className="text-gray-400">·</span>
                            <div className="font-mono text-sm text-green-900 truncate">
                              {source.destination?.schema || "public"}.
                              {source.destination?.tableName || "unnamed_table"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {source.status === "error" && source.errorMessage && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded p-3 flex items-center gap-2 text-sm text-red-800">
                      <AlertCircle className="w-4 h-4" />
                      {source.errorMessage}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleManualRun(source.id)}
                    disabled={source.status === "syncing"}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                    title="Run Now"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingSource(source)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSources(sources.filter((s) => s.id !== source.id))
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sources.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">
              No data sources configured yet. Add your first source to get
              started.
            </p>
          </div>
        )}
      </div>

      {(showAddModal || editingSource) && (
        <SourceForm
          source={editingSource}
          onClose={() => {
            setShowAddModal(false);
            setEditingSource(null);
          }}
        />
      )}
    </div>
  );
};

export default PipelineAdmin;
export { getStatusIcon, getStatusColor };
