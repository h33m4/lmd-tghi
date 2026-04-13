import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftIcon, Check, Plus, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";
import {
  DataSource,
  SourceType,
  WarehouseType,
  SyncType,
  DataType,
  ColumnMapping,
} from "./_component";

interface FormData {
  name: string;
  type: SourceType;
  endpoint: string;
  destination: {
    warehouse: WarehouseType;
    schema: string;
    tableName: string;
  };
  cronSchedule: string;
  syncType: SyncType;
  retryAttempts: number;
  alertEmail: string;
  stages: {
    columnMapping: {
      enabled: boolean;
      mappings: ColumnMapping[];
    };
    transformation: {
      enabled: boolean;
      sqlCode: string;
      createOutputTable: boolean;
      outputTableName: string;
    };
  };
}

interface AddNewDataSourceModalProps {
  onSave: (source: FormData) => void;
}

function AddNewDataSourceModal({ onSave }: AddNewDataSourceModalProps) {
  const modalRef = useRef<BaseModalRef>(null);
  const [current, setCurrent] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">(
    "idle"
  );

  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "rest_api",
    endpoint: "",
    destination: {
      warehouse: "redshift",
      schema: "public",
      tableName: "",
    },
    cronSchedule: "0 0 1 * *",
    syncType: "incremental",
    retryAttempts: 3,
    alertEmail: "",
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
  });

  const sourceTypes: { value: SourceType; label: string }[] = [
    { value: "dhis2", label: "DHIS2" },
    { value: "ifi", label: "IFI (Kobo REST API)" },
    { value: "rest_api", label: "Generic REST API" },
    { value: "google_sheets", label: "Google Sheets" },
    { value: "csv_upload", label: "CSV Upload" },
    { value: "fhir", label: "FHIR Server" },
    { value: "database", label: "Database (PostgreSQL/MySQL)" },
  ];

  const cronPresets = [
    { value: "0 0 1 * *", label: "Monthly (1st)" },
    { value: "0 0 15 * *", label: "Monthly (15th)" },
    { value: "0 0 * * 1", label: "Weekly (Monday)" },
    { value: "0 0 * * *", label: "Daily" },
    { value: "0 */6 * * *", label: "Every 6 hours" },
  ];

  const dataTypes: DataType[] = [
    "string",
    "integer",
    "float",
    "date",
    "datetime",
    "boolean",
    "json",
  ];

  const addColumnMapping = () => {
    setFormData({
      ...formData,
      stages: {
        ...formData.stages,
        columnMapping: {
          ...formData.stages.columnMapping,
          mappings: [
            ...formData.stages.columnMapping.mappings,
            { originalName: "", newName: "", dataType: "string" },
          ],
        },
      },
    });
  };

  const updateColumnMapping = (
    index: number,
    field: keyof ColumnMapping,
    value: string
  ) => {
    const updated = [...formData.stages.columnMapping.mappings];
    updated[index][field] = value as any;
    setFormData({
      ...formData,
      stages: {
        ...formData.stages,
        columnMapping: {
          ...formData.stages.columnMapping,
          mappings: updated,
        },
      },
    });
  };

  const removeColumnMapping = (index: number) => {
    setFormData({
      ...formData,
      stages: {
        ...formData.stages,
        columnMapping: {
          ...formData.stages.columnMapping,
          mappings: formData.stages.columnMapping.mappings.filter(
            (_, i) => i !== index
          ),
        },
      },
    });
  };

  const handleNext = () => {
    if (current < 3) {
      setCurrent(current + 1);
    } else {
      // Final step - save
      setSaveStatus("saving");
      setTimeout(() => {
        setSaveStatus("success");
        onSave(formData);
        setTimeout(() => {
          modalRef.current?.closeModal();
          // Reset form
          setCurrent(0);
          setSaveStatus("idle");
          setFormData({
            name: "",
            type: "rest_api",
            endpoint: "",
            destination: {
              warehouse: "redshift",
              schema: "public",
              tableName: "",
            },
            cronSchedule: "0 0 1 * *",
            syncType: "incremental",
            retryAttempts: 3,
            alertEmail: "",
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
          });
        }, 1500);
      }, 1000);
    }
  };

  const isStepValid = () => {
    switch (current) {
      case 0:
        return (
          formData.name.trim() !== "" &&
          formData.endpoint.trim() !== "" &&
          formData.destination.tableName.trim() !== ""
        );
      case 1:
        return true; // Schedule settings are optional with defaults
      case 2:
        return true; // Column mapping is optional
      case 3:
        return true; // Transformation is optional
      default:
        return false;
    }
  };

  const steps = [
    { title: "Basic Info", description: "Source and destination details" },
    { title: "Schedule", description: "Configure sync settings" },
    { title: "Column Mapping", description: "Map source columns (optional)" },
    {
      title: "Transform",
      description: "SQL transformations (optional)",
    },
  ];

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <div className="space-y-6 px-6 mt-6">
            <div>
              <Label htmlFor="name">Pipeline Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., DHIS2 Health Facilities"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Source Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as SourceType,
                    })
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sourceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="endpoint">Endpoint/URL *</Label>
                <Input
                  id="endpoint"
                  value={formData.endpoint}
                  onChange={(e) =>
                    setFormData({ ...formData, endpoint: e.target.value })
                  }
                  placeholder="https://api.example.com/data"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Warehouse Destination
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <select
                    id="warehouse"
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
                    className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="redshift">AWS Redshift</option>
                    <option value="snowflake">Snowflake</option>
                    <option value="bigquery">BigQuery</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="schema">Schema</Label>
                  <Input
                    id="schema"
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
                    placeholder="public"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="tableName">Table Name *</Label>
                  <Input
                    id="tableName"
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
                    placeholder="health_facilities"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <select
                  id="schedule"
                  value={formData.cronSchedule}
                  onChange={(e) =>
                    setFormData({ ...formData, cronSchedule: e.target.value })
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {cronPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="syncType">Sync Type</Label>
                <select
                  id="syncType"
                  value={formData.syncType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      syncType: e.target.value as SyncType,
                    })
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="incremental">Incremental</option>
                  <option value="full">Full Refresh</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="retryAttempts">Retry Attempts</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.retryAttempts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      retryAttempts: parseInt(e.target.value) || 3,
                    })
                  }
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="alertEmail">Alert Email</Label>
                <Input
                  id="alertEmail"
                  type="email"
                  value={formData.alertEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, alertEmail: e.target.value })
                  }
                  placeholder="admin@example.com"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Checkbox
                id="enableMapping"
                checked={formData.stages.columnMapping.enabled}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    stages: {
                      ...formData.stages,
                      columnMapping: {
                        ...formData.stages.columnMapping,
                        enabled: checked as boolean,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="enableMapping" className="font-semibold">
                Enable Column Mapping
              </Label>
            </div>

            {formData.stages.columnMapping.enabled && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-12 gap-2 p-3 border-b bg-gray-100 text-sm font-medium text-gray-700">
                    <div className="col-span-4">Original Column</div>
                    <div className="col-span-4">New Column Name</div>
                    <div className="col-span-3">Data Type</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="p-3 space-y-2">
                    {formData.stages.columnMapping.mappings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No column mappings yet. Click `Add Mapping` to start.
                      </div>
                    ) : (
                      formData.stages.columnMapping.mappings.map(
                        (mapping, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-center"
                          >
                            <div className="col-span-4">
                              <Input
                                value={mapping.originalName}
                                onChange={(e) =>
                                  updateColumnMapping(
                                    index,
                                    "originalName",
                                    e.target.value
                                  )
                                }
                                placeholder="source_col"
                                className="h-9"
                              />
                            </div>
                            <div className="col-span-4">
                              <Input
                                value={mapping.newName}
                                onChange={(e) =>
                                  updateColumnMapping(
                                    index,
                                    "newName",
                                    e.target.value
                                  )
                                }
                                placeholder="target_col"
                                className="h-9"
                              />
                            </div>
                            <div className="col-span-3">
                              <select
                                value={mapping.dataType}
                                onChange={(e) =>
                                  updateColumnMapping(
                                    index,
                                    "dataType",
                                    e.target.value
                                  )
                                }
                                className="h-9 w-full border border-gray-300 rounded-md px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {dataTypes.map((type) => (
                                  <option
                                    key={type}
                                    value={type}
                                    className="capitalize"
                                  >
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeColumnMapping(index)}
                                className="h-9 w-9 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={addColumnMapping}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </Button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Checkbox
                id="enableTransform"
                checked={formData.stages.transformation.enabled}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    stages: {
                      ...formData.stages,
                      transformation: {
                        ...formData.stages.transformation,
                        enabled: checked as boolean,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="enableTransform" className="font-semibold">
                Enable SQL Transformation
              </Label>
            </div>

            {formData.stages.transformation.enabled && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sqlCode">SQL Code</Label>
                  <Textarea
                    id="sqlCode"
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
                    placeholder="SELECT 
  facility_name,
  COUNT(*) as visit_count
FROM raw_data
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY facility_name"
                    className="mt-1.5 font-mono text-sm"
                    rows={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use &apos;raw_data&apos; as source table name
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="createOutputTable"
                      checked={formData.stages.transformation.createOutputTable}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          stages: {
                            ...formData.stages,
                            transformation: {
                              ...formData.stages.transformation,
                              createOutputTable: checked as boolean,
                            },
                          },
                        })
                      }
                    />
                    <Label htmlFor="createOutputTable">
                      Create output table
                    </Label>
                  </div>

                  {formData.stages.transformation.createOutputTable && (
                    <div className="flex-1">
                      <Input
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
                        placeholder="transformed_table_name"
                        className="h-9"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BaseModal
      ref={modalRef}
      title="Add New Data Source"
      size="large"
      isCtaDisabled={!isStepValid() || saveStatus === "saving"}
      ctaTitle={
        saveStatus === "success"
          ? "Created!"
          : saveStatus === "saving"
          ? "Creating..."
          : current === 3
          ? "Create Pipeline"
          : "Next"
      }
      cancelOnClicked={() => {
        modalRef.current?.closeModal();
      }}
      ctaOnClicked={handleNext}
      onCloseModal={() => {
        setCurrent(0);
        setSaveStatus("idle");
      }}
      onOpenModal={() => {}}
      buttonComponent={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
        </Button>
      }
      components={
        <div className="flex flex-col h-[70vh]">
          {/* Progress Steps */}
          <div className="flex items-center justify-between pt-5  pl-7 pr-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1 ">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      index < current
                        ? "bg-green-500 text-white"
                        : index === current
                        ? "bg-lmh-blue text-white"
                        : "bg-gray-200 text-muted-foreground"
                    }`}
                  >
                    {index < current ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-colors ${
                      index < current ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto mt-5  px-6">
            {renderStepContent()}
          </div>
        </div>
      }
      leftButtonComponent={
        current > 0 && saveStatus !== "success" ? (
          <Button
            variant="outline"
            onClick={() => setCurrent(current - 1)}
            className="px-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </Button>
        ) : (
          <></>
        )
      }
    />
  );
}

export default AddNewDataSourceModal;
