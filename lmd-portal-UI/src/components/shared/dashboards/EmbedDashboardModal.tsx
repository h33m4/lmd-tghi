"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LmhPrograms } from "@/types";
import { Session } from "next-auth";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Steps } from "antd";
import { toast } from "sonner";
import { UploadIcon, AlertCircle, Plus, X, ArrowLeftIcon } from "lucide-react";
import Banner from "@/components/ui/banner/banner";
import GlobalSelectDropdown, {
  IGlobalSelectDropdownData,
} from "@/app/(protected)/kpi-dashboard/kpi-change-log/globalSelectDropdown";

type Props = {
  program: LmhPrograms;
};

const countryToCode = {
  Liberia: "liberia",
  Malawi: "malawi",
  Ethiopia: "ethiopia",
  Sierra_Leone: "sierra_leone",
  AFF: "aff",
} as const;

// Map country names to program names as shown in the JSON example
const countryToProgram = {
  Liberia: "Liberia",
  Malawi: "Malawi",
  Ethiopia: "Ethiopia",
  Sierra_Leone: "Sierra_Leone",
  AFF: "Aff",
} as const;

interface DashboardFormData {
  title: string;
  description: string;
  embed_url: string;
  bi_tool: string;
  data_source: string;
  tags: string[];
  status: string;
}

const EmbeddDashboardModal = ({ program }: Props) => {
  const modalRef = useRef<BaseModalRef>(null);
  const { data } = useSession();
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<DashboardFormData>({
    title: "",
    description: "",
    embed_url: "",
    bi_tool: "",
    data_source: "",
    tags: [],
    status: "draft",
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<
    "default" | "saving" | "success" | "failed"
  >("default");
  const [saveStatusText, setSaveStatusText] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const biToolsData: IGlobalSelectDropdownData[] = [
    { name: "powerbi", label: "Power BI" },
    { name: "looker_studio", label: "Looker Studio" },
    { name: "tableau", label: "Tableau" },
    { name: "qlik", label: "Qlik" },
    { name: "other", label: "Other" },
  ];

  const statusData: IGlobalSelectDropdownData[] = [
    { name: "draft", label: "Save as Draft" },
    { name: "published", label: "Publish Immediately" },
  ];

  const isUserAllowed = (data: Session) => {
    const countryCode = countryToCode[program];
    const allowedGroups = [
      `${countryCode}_publisher`,
      "global_publisher",
      "super_administrator",
    ];
    return data.user.groups.some((group: string) =>
      allowedGroups.includes(group)
    );
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const detectBiTool = (url: string): string => {
    if (!url) return "";

    const lowerUrl = url.toLowerCase();

    if (
      lowerUrl.includes("lookerstudio.google.com") ||
      lowerUrl.includes("datastudio.google.com")
    ) {
      return "looker_studio";
    } else if (
      lowerUrl.includes("app.powerbi.com") ||
      lowerUrl.includes("powerbi.microsoft.com")
    ) {
      return "powerbi";
    } else if (
      lowerUrl.includes("public.tableau.com") ||
      lowerUrl.includes("tableau")
    ) {
      return "tableau";
    } else if (lowerUrl.includes("qlik") || lowerUrl.includes("qliksense")) {
      return "qlik";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.embed_url.trim())
      newErrors.embed_url = "Embed URL is required";
    if (!formData.bi_tool) newErrors.bi_tool = "BI Tool selection is required";

    if (formData.embed_url && !isValidUrl(formData.embed_url)) {
      newErrors.embed_url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field: keyof DashboardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-detect BI tool when embed URL changes
    if (field === "embed_url") {
      const detectedTool = detectBiTool(value);
      if (detectedTool) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          bi_tool: detectedTool,
        }));
      }
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  function Step1Form() {
    return (
      <div className="h-full w-full flex flex-col gap-4 justify-start">
        <div className="flex flex-col px-6">
          <h1 className="text-accent-foreground th-font-roman">
            Hi {data?.user.name}, please follow the steps below to embed your
            dashboard
          </h1>
          <ul className="text-muted-foreground th-font-book text-sm list-disc ml-4">
            <li>
              Ensure you have the{" "}
              <span className="th-font-medium text-destructive">embed URL</span>{" "}
              not the regular dashboard URL
            </li>
            <li>
              The dashboard should be publicly accessible or properly configured
              for embedding
            </li>
            <li>Add relevant tags to help users find your dashboard</li>
          </ul>
        </div>

        <div className="border-t border-border mt-4 px-6 pt-4 flex flex-col">
          <h1>
            Enter the <span className="th-font-heavy">basic information</span>{" "}
            for your dashboard
          </h1>

          <div className="space-y-4 mt-5">
            <div className="space-y-2">
              <Label htmlFor="title">Dashboard Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Liberia FY26 OKR Dashboard"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <span className="text-sm text-destructive th-font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Detailed description of what this dashboard shows..."
                rows={3}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <span className="text-sm text-destructive th-font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="embed_url">Embed URL *</Label>
              <Input
                id="embed_url"
                value={formData.embed_url}
                onChange={(e) => handleInputChange("embed_url", e.target.value)}
                placeholder="https://app.powerbi.com/view?r=..."
                className={errors.embed_url ? "border-red-500" : ""}
              />
              {errors.embed_url && (
                <span className="text-sm text-destructive th-font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.embed_url}
                </span>
              )}
              <Banner
                variant={"info"}
                title="Note on Embed URL"
                description="Make sure this is the embed URL, not the regular dashboard URL. We'll auto-detect the BI tool for you!"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-4 px-6 pt-4 flex flex-col">
          <h1>
            Select the <span className="th-font-heavy">BI tool</span> and add{" "}
            <span className="th-font-heavy">additional details</span>
          </h1>

          <div className="w-full flex justify-between items-start mt-5">
            <div className="w-full">
              <GlobalSelectDropdown
                label="BI Tool *"
                wrapperClassName=""
                placeHolderText="Select BI Tool (auto-detected from URL)"
                onSelectItem={(sel) =>
                  handleInputChange("bi_tool", sel?.name || "")
                }
                data={biToolsData}
                initialSelected={
                  biToolsData.find((tool) => tool.name === formData.bi_tool) ||
                  null
                }
              />
              {errors.bi_tool && (
                <span className="text-sm text-destructive th-font-medium mt-1">
                  {errors.bi_tool}
                </span>
              )}
              {formData.bi_tool && (
                <div className="mt-1">
                  <span className="text-xs text-green-600 th-font-medium">
                    ✓ Auto-detected:{" "}
                    {
                      biToolsData.find((t) => t.name === formData.bi_tool)
                        ?.label
                    }
                  </span>
                </div>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="data_source">Data Source</Label>
              <Input
                id="data_source"
                value={formData.data_source}
                onChange={(e) =>
                  handleInputChange("data_source", e.target.value)
                }
                placeholder="e.g., DHIS2, Excel, Custom DB"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-4 px-6 pt-4 flex flex-col">
          <h1>
            Now, add <span className="th-font-heavy">tags</span> to help users
            find your dashboard
          </h1>

          <div className="mt-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                variant="outline"
                size={"sm"}
                onClick={addTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-5 my-5 text-background">h</div>
      </div>
    );
  }

  function Step2Form() {
    useEffect(() => {
      if (current === 1) {
        setIsPreviewLoading(true);
        setTimeout(() => setIsPreviewLoading(false), 1500);
      }
    }, []);

    return (
      <div className="h-full w-full px-4 flex flex-col justify-between border-red-400">
        {/* <h1 className="text-accent-foreground th-font-roman">
          Now, preview your dashboard to confirm everything looks correct
        </h1> */}

        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="th-font-medium text-muted-foreground">
                Title:
              </span>{" "}
              {formData.title}
            </div>
            <div>
              <span className="th-font-medium text-muted-foreground">
                BI Tool:
              </span>{" "}
              {biToolsData.find((t) => t.name === formData.bi_tool)?.label}
            </div>
            <div className="col-span-2">
              <span className="th-font-medium text-muted-foreground">
                Description:
              </span>{" "}
              {formData.description}
            </div>
          </div>

          {formData.tags.length > 0 && (
            <div>
              <span className="th-font-medium text-muted-foreground text-sm">
                Tags:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 h-full border border-primary overflow-auto rounded-sm">
          {isPreviewLoading ? (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading preview...</p>
              </div>
            </div>
          ) : (
            <iframe
              src={formData.embed_url}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Dashboard Preview"
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    );
  }

  function Step3Form() {
    const saveDashboard = useCallback(async () => {
      if (!data?.user?.email) {
        toast.error("User information not available");
        return;
      }

      setSaveStatus("saving");
      setSaveStatusText("Saving dashboard...");

      try {
        // Prepare the dashboard data according to the JSON structure
        const dashboardData = {
          title: formData.title,
          description: formData.description,
          program: countryToProgram[program], // Use proper program mapping
          status: formData.status,
          bi_tool: formData.bi_tool,
          created_by: data.user.email,
          published_at:
            formData.status === "published" ? new Date().toISOString() : null,
          tags: formData.tags.join(","), // Convert array to comma-separated string
          embed_url: formData.embed_url,
          data_source: formData.data_source || "", // Ensure it's not undefined
          slug: generateSlug(formData.title),
          country: program,
        };

        // Make the API call to save the dashboard
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LMD_API}/dashboards`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any required authentication headers here
              // "Authorization": `Bearer ${token}`, // if you use JWT tokens
            },
            body: JSON.stringify(dashboardData),
          }
        );

        if (!response.ok) {
          // Try to get error message from response
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.message ||
            `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();

        setSaveStatus("success");
        setSaveStatusText("Success ✨ Dashboard has been saved successfully!");
        toast.success("Dashboard saved successfully!");

        console.log("Dashboard saved:", result);
      } catch (error) {
        console.error("Error saving dashboard:", error);
        setSaveStatus("failed");
        setSaveStatusText(`Save failed: ${(error as Error).message}`);
        toast.error(`Failed to save dashboard: ${(error as Error).message}`);
      }
    }, [formData, program, data]);

    return (
      <div className="h-full w-full px-6 border-t flex flex-col justify-start items-start gap-[3vh] pt-[5vh]">
        <div>
          <ul className="space-y-1.5">
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Country:
              </label>
              {program}
            </li>
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Program:
              </label>
              {countryToProgram[program]}
            </li>
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Dashboard Title:
              </label>
              {formData.title}
            </li>
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                BI Tool:
              </label>
              {biToolsData.find((t) => t.name === formData.bi_tool)?.label}
            </li>
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Status:
              </label>
              {statusData.find((s) => s.name === formData.status)?.label}
            </li>
            {formData.data_source && (
              <li className="th-font-medium text-sm">
                <label className="mr-2 th-font-roman text-muted-foreground">
                  Data Source:
                </label>
                {formData.data_source}
              </li>
            )}
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Tags:
              </label>
              {formData.tags.length > 0 ? formData.tags.join(", ") : "None"}
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="w-72">
            <GlobalSelectDropdown
              label="Publication Status"
              wrapperClassName="w-72"
              placeHolderText="Select Status"
              onSelectItem={(sel) =>
                handleInputChange("status", sel?.name || "draft")
              }
              data={statusData}
              initialSelected={
                statusData.find((s) => s.name === formData.status) ||
                statusData[0]
              }
            />
          </div>

          <Banner
            title="Important Note"
            variant={"info"}
            description={
              formData.status === "draft"
                ? "Dashboard will be saved as draft and can be published later."
                : "Dashboard will be immediately available to users with access to the " +
                  program +
                  " program."
            }
          />
        </div>

        <Button
          className="mt-4"
          variant={saveStatus === "failed" ? "green" : "dark-blue"}
          onClick={saveDashboard}
          isLoading={saveStatus === "saving"}
          disabled={saveStatus === "success"}
        >
          {saveStatus === "default" &&
            `${
              formData.status === "draft" ? "Save Draft" : "Publish Dashboard"
            }`}
          {saveStatus === "failed" && "Retry Save"}
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "success" && "Save Complete"}
        </Button>

        {saveStatus !== "default" && (
          <span className={saveStatus === "failed" ? "text-destructive" : ""}>
            {saveStatusText}
          </span>
        )}
      </div>
    );
  }

  const steps = [
    {
      title: "Dashboard Details",
      content: Step1Form(),
    },
    {
      title: "Preview Dashboard",
      content: Step2Form(),
    },
    {
      title: "Save Dashboard",
      content: Step3Form(),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const onCTAClickedHandler = () => {
    if (current === 0) {
      if (validateForm()) {
        setCurrent(current + 1);
      }
    } else if (current === 1) {
      setCurrent(current + 1);
    } else if (current === 2) {
      onCancelClickedHandler();
      modalRef.current?.closeModal();
    }
  };

  const onCancelClickedHandler = () => {
    setCurrent(0);
    setFormData({
      title: "",
      description: "",
      embed_url: "",
      bi_tool: "",
      data_source: "",
      tags: [],
      status: "draft",
    });
    setNewTag("");
    setErrors({});
    setSaveStatus("default");
    setSaveStatusText("");
  };

  const ModalComponent = () => {
    return (
      <div className="bg-background pt-4 pb-2 overflow-y-auto h-[70vh] border-y">
        <Steps
          current={current}
          items={items}
          className="text-foreground"
          rootClassName="border-red-500 mt-2 px-6"
        />
        <div className="flex-1   mt-4 pt-2 h-[calc(70vh-91px)] ">
          {steps[current].content}
        </div>
      </div>
    );
  };

  return (
    <BaseModal
      ref={modalRef}
      title={"Embed Program Dashboard"}
      size={"large"}
      buttonComponent={
        isUserAllowed(data!) ? (
          <Button className="px-4  -mt-0" variant={"dark-blue"} size={"sm"}>
            <UploadIcon className="h-4 w-5 mr-2 hidden md:block" />
            <span className="hidden md:block">Embed New Dashboard</span>
          </Button>
        ) : (
          <></>
        )
      }
      components={ModalComponent()}
      isCtaDisabled={
        (current === 0 &&
          (!formData.title ||
            !formData.description ||
            !formData.embed_url ||
            !formData.bi_tool)) ||
        (current === 2 && saveStatus !== "success")
      }
      ctaTitle={current === steps.length - 1 ? "Done" : "Next"}
      ctaOnClicked={onCTAClickedHandler}
      cancelOnClicked={onCancelClickedHandler}
      onCloseModal={onCancelClickedHandler}
      leftButtonComponent={
        current > 0 && saveStatus !== "success" ? (
          <Button
            variant={"dark-blue"}
            onClick={() => setCurrent(current - 1)}
            className="px-4 h-[30px]"
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
};

export default EmbeddDashboardModal;
