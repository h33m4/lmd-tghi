import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeftIcon,
  Check,
  Copy,
  Download,
  Shield,
  Clock,
  Database,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";
import { LmhPrograms } from "@/types";

type ConnectorType = "powerbi" | "tableau" | "looker" | "metabase" | "generic";

interface GenerateCredentialsFormData {
  connectorType: ConnectorType;
  connectorName: string;
  schemas: string[];
  expirationDays: number;
}

interface GeneratedCredentials {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

interface GenerateCredentialsModalProps {
  onSave: (connection: any) => void;
  availableSchemas: string[];
  program: LmhPrograms;
}

function GenerateCredentialsModal({
  onSave,
  availableSchemas = ["health", "surveys", "hr", "finance"],
  program,
}: GenerateCredentialsModalProps) {
  const modalRef = useRef<BaseModalRef>(null);
  const [current, setCurrent] = useState(0);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "generating" | "success"
  >("idle");
  const [generatedCredentials, setGeneratedCredentials] =
    useState<GeneratedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<GenerateCredentialsFormData>({
    connectorType: "powerbi",
    connectorName: "",
    schemas: [],
    expirationDays: 7,
  });

  const connectorTypes = [
    {
      value: "powerbi",
      label: "Power BI",
      icon: "📊",
      description: "Microsoft Power BI Desktop",
    },
    {
      value: "tableau",
      label: "Tableau",
      icon: "📈",
      description: "Tableau Desktop/Online",
    },
    {
      value: "looker",
      label: "Looker",
      icon: "🔍",
      description: "Google Looker Studio",
    },
    {
      value: "metabase",
      label: "Metabase",
      icon: "📉",
      description: "Open-source analytics",
    },
    {
      value: "generic",
      label: "Generic",
      icon: "💾",
      description: "Any SQL client (DBeaver, pgAdmin, etc.)",
    },
  ];

  const expirationOptions = [
    { days: 0, label: "1 hour (AWS GetClusterCredentials)" },
    { days: 1, label: "24 hours" },
    { days: 7, label: "7 days" },
    { days: 30, label: "30 days" },
  ];

  const toggleSchema = (schema: string) => {
    if (formData.schemas.includes(schema)) {
      setFormData({
        ...formData,
        schemas: formData.schemas.filter((s) => s !== schema),
      });
    } else {
      setFormData({
        ...formData,
        schemas: [...formData.schemas, schema],
      });
    }
  };

  const handleNext = () => {
    if (current < 2) {
      setCurrent(current + 1);
    } else {
      // Final step - generate credentials
      setSaveStatus("generating");

      // Simulate API call to generate temporary credentials
      setTimeout(() => {
        const credentials: GeneratedCredentials = {
          host: "dev-lmd-v2.002190277880.us-east-1.redshift-serverless.amazonaws.com",
          port: "5439",
          database: program.toLowerCase(),
          username:
            formData.expirationDays === 0
              ? `IAM:bi_user_${Math.random().toString(36).substr(2, 9)}`
              : `bi_user_${Math.random().toString(36).substr(2, 9)}`,
          password: `temp_${Math.random().toString(36).substr(2, 12)}`,
        };

        setGeneratedCredentials(credentials);
        setSaveStatus("success");

        // Create connection object
        const newConnection = {
          id: Date.now(),
          connectorType: formData.connectorType,
          connectorName: formData.connectorName,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() +
              (formData.expirationDays === 0
                ? 60 * 60 * 1000 // 1 hour in milliseconds
                : formData.expirationDays * 24 * 60 * 60 * 1000)
          ).toISOString(),
          schemas: formData.schemas,
          status: "active" as const,
          credentials,
        };

        onSave(newConnection);
      }, 1500);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSaveStatus("idle");
    setGeneratedCredentials(null);
    setFormData({
      connectorType: "powerbi",
      connectorName: "",
      schemas: [],
      expirationDays: 7,
    });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyAllAsJSON = () => {
    if (generatedCredentials) {
      const json = JSON.stringify(generatedCredentials, null, 2);
      navigator.clipboard.writeText(json);
      setCopiedField("json");
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const isStepValid = () => {
    switch (current) {
      case 0:
        return formData.connectorName.trim() !== "";
      case 1:
        return formData.schemas.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { title: "Connector", description: "Select BI tool" },
    { title: "Access", description: "Choose schemas" },
    { title: "Expiration", description: "Set validity period" },
  ];

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="connectorName">
                Connection Name *{" "}
                <InfoContainer
                  id="connectorName"
                  text="Just any name to uniquely identify this connection credentials"
                ></InfoContainer>
              </Label>
              <Input
                id="connectorName"
                value={formData.connectorName}
                onChange={(e) =>
                  setFormData({ ...formData, connectorName: e.target.value })
                }
                placeholder="e.g., Power BI Dashboard"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>
                Select Connector Type *{" "}
                <InfoContainer
                  id="connectorType"
                  text="Select the BI system that this credential is being requested for. Best practise is to create credentials for each BI tool"
                ></InfoContainer>
              </Label>
              <div className="grid grid-cols-1 gap-3 mt-3">
                {connectorTypes.map((connector) => (
                  <button
                    key={connector.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        connectorType: connector.value as ConnectorType,
                      })
                    }
                    className={`flex items-start gap-4 p-4 border rounded-lg text-left transition-all ${
                      formData.connectorType === connector.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-background"
                    }`}
                  >
                    <div className="text-3xl flex-shrink-0">
                      {connector.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {connector.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {connector.description}
                      </div>
                    </div>
                    {formData.connectorType === connector.value && (
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label>Select Schemas to Grant Access *</Label>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Choose which schemas this connection can read from. Access is
                read-only.
              </p>

              <div className="space-y-2">
                {availableSchemas.map((schema) => (
                  <div
                    key={schema}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.schemas.includes(schema)
                        ? "border-blue-500 bg-blue-50 dark:bg-lmh-blue/10 dark:text-white"
                        : "border-gray-200 hover:border-gray-300 bg-background"
                    }`}
                    onClick={() => toggleSchema(schema)}
                  >
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {schema}
                        </div>
                        <div className="text-sm text-gray-600">
                          Read-only access to all tables
                        </div>
                      </div>
                    </div>
                    <Checkbox
                      checked={formData.schemas.includes(schema)}
                      onCheckedChange={() => toggleSchema(schema)}
                    />
                  </div>
                ))}
              </div>

              {formData.schemas.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">
                      Selected {formData.schemas.length} schema(s):{" "}
                      {formData.schemas.join(", ")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Credential Expiration *</Label>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                How long should these credentials remain valid?
              </p>

              <div className="grid grid-cols-2 gap-3">
                {expirationOptions.map((option) => (
                  <button
                    key={option.days}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, expirationDays: option.days })
                    }
                    className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                      formData.expirationDays === option.days
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.days === 0
                          ? "Max duration for AWS IAM method"
                          : `Expires in ${option.days} day${
                              option.days > 1 ? "s" : ""
                            }`}
                      </div>
                    </div>
                    {formData.expirationDays === option.days && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-background border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Connector:</span>
                  <span className="font-medium text-gray-900">
                    {
                      connectorTypes.find(
                        (c) => c.value === formData.connectorType
                      )?.label
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connection Name:</span>
                  <span className="font-medium text-gray-900">
                    {formData.connectorName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Schemas:</span>
                  <span className="font-medium text-gray-900">
                    {formData.schemas.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiration:</span>
                  <span className="font-medium text-gray-900">
                    {formData.expirationDays === 0
                      ? "1 hour (AWS IAM)"
                      : `${formData.expirationDays} day${
                          formData.expirationDays > 1 ? "s" : ""
                        }`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSuccessScreen = () => {
    if (!generatedCredentials) return null;

    return (
      <div className="space-y-6 h-full overflow-y-scroll pr-2">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Credentials Generated!
          </h3>
          <p className="text-gray-600">
            Your temporary connection is ready. Copy these credentials to
            connect your BI tool.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(generatedCredentials).map(([key, value]) => (
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
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            🔒 <strong>SSL Required:</strong> Ensure your BI tool has SSL/TLS
            enabled for Redshift connections
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllAsJSON}
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copiedField === "json" ? "Copied!" : "Copy All as JSON"}
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Connection File
            </Button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">
            Setup Instructions for {formData.connectorName}
          </h5>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Copy the connection details above</li>
            <li>
              Open your BI tool (
              {
                connectorTypes.find((c) => c.value === formData.connectorType)
                  ?.label
              }
              )
            </li>
            <li>
              Add new data source → Select <strong>Amazon Redshift</strong> or{" "}
              <strong>PostgreSQL</strong>
            </li>
            <li>Paste the connection details (ensure SSL is enabled)</li>
            <li>Test connection and save</li>
          </ol>
          {formData.expirationDays === 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-800">
              ⚠️ <strong>Note:</strong> These credentials use AWS IAM and will
              expire in 1 hour. For longer sessions, regenerate with 7+ day
              expiration.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Clock className="h-4 w-4 text-yellow-600" />
          <span>
            These credentials will expire in{" "}
            <strong>
              {formData.expirationDays === 0
                ? "1 hour"
                : `${formData.expirationDays} day${
                    formData.expirationDays > 1 ? "s" : ""
                  }`}
            </strong>
          </span>
        </div>
      </div>
    );
  };

  return (
    <BaseModal
      ref={modalRef}
      title={saveStatus === "success" ? "" : "Generate BI Credentials"}
      size="large"
      isCtaDisabled={!isStepValid() || saveStatus === "generating"}
      ctaTitle={
        saveStatus === "success"
          ? "Done"
          : saveStatus === "generating"
          ? "Generating..."
          : current === 2
          ? "Generate Credentials"
          : "Next"
      }
      cancelOnClicked={() => {
        modalRef.current?.closeModal();
        handleReset();
      }}
      ctaOnClicked={() => {
        if (saveStatus === "success") {
          modalRef.current?.closeModal();
          handleReset();
        } else {
          handleNext();
        }
      }}
      onCloseModal={handleReset}
      onOpenModal={() => {}}
      buttonComponent={
        <Button>
          <Database className="h-4 w-4 mr-2" />
          Generate Credentials
        </Button>
      }
      components={
        <div className="px-6 py-2 h-[60vh] flex flex-col">
          {saveStatus === "success" ? (
            renderSuccessScreen()
          ) : (
            <>
              {/* Progress Steps — FIXED */}
              <div className="flex items-center justify-between shrink-0  ml-[10vw]">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center flex-1 w-fit ">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                          index < current
                            ? "bg-green-500 text-white"
                            : index === current
                            ? "bg-lmh-blue text-white"
                            : "bg-gray-200 text-gray-500"
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
                        <div className="text-xs text-gray-500">
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

              {/* Step Content — SCROLLABLE */}
              <div className="flex-1 overflow-y-auto mt-6 pr-2">
                {renderStepContent()}
              </div>
            </>
          )}
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

export default GenerateCredentialsModal;
