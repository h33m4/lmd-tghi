"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LMH_ProgramCountries, LmhPrograms } from "@/types";
import { Session } from "next-auth";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Steps } from "antd";
import { toast } from "sonner";
import {
  FileText,
  AlertCircle,
  Plus,
  X,
  ArrowLeftIcon,
  PlusCircle,
} from "lucide-react";
import Banner from "@/components/ui/banner/banner";
import GlobalSelectDropdown, {
  IGlobalSelectDropdownData,
} from "@/app/(protected)/kpi-dashboard/kpi-change-log/globalSelectDropdown";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";

type Props = {
  program: LmhPrograms;
};

const countryToProgram = {
  Liberia: "liberia",
  Malawi: "malawi",
  Ethiopia: "ethiopia",
  Sierra_Leone: "sierra_leone",
  AFF: "aff",
} as const;

interface ReportFormData {
  title: string;
  descriptions: string;
  report_url: string;
  type: string;
  data_source: string;
  project: string;
  tags: string[];
  status: string;
}

const EmbedReportModal = ({ program }: Props) => {
  const modalRef = useRef<BaseModalRef>(null);
  const { data } = useSession();
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    descriptions: "",
    report_url: "",
    type: "",
    data_source: "",
    project: "",
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

  const reportTypeData: IGlobalSelectDropdownData[] = [
    { name: "data_review", label: "Data Review" },
    { name: "donor_report", label: "Donor Report" },
    { name: "impact_report", label: "Impact Report" },
    { name: "quarterly_report", label: "Quarterly Report" },
    { name: "annual_report", label: "Annual Report" },
    { name: "case_study", label: "Case Study" },
    { name: "other", label: "Other" },
  ];

  const statusData: IGlobalSelectDropdownData[] = [
    { name: "draft", label: "Save as Draft" },
    { name: "published", label: "Publish Immediately" },
  ];

  const isUserAllowed = (data: Session) => {
    const programCode = countryToProgram[program];
    const allowedGroups = [
      `${programCode}_publisher`,
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

  // Extract Google Drive file ID from various URL formats
  const extractGoogleDriveId = (url: string): string | null => {
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Get appropriate embed URL for Google Drive content
  const getGoogleDriveEmbedUrl = (url: string): string => {
    const fileId = extractGoogleDriveId(url);
    if (!fileId) return url;

    if (url.includes("/presentation/")) {
      return `https://docs.google.com/presentation/d/${fileId}/embed`;
    }
    if (url.includes("/document/")) {
      return `https://docs.google.com/document/d/${fileId}/preview`;
    }
    if (url.includes("/spreadsheets/")) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
    }

    // Default to file preview
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  // Auto-detect report type from URL
  const detectReportType = (url: string): string => {
    if (!url) return "";

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("donor") || lowerUrl.includes("funder")) {
      return "donor_report";
    } else if (lowerUrl.includes("data") || lowerUrl.includes("analysis")) {
      return "data_review";
    } else if (lowerUrl.includes("impact")) {
      return "impact_report";
    } else if (lowerUrl.includes("quarterly") || /q[1-4]/.test(lowerUrl)) {
      return "quarterly_report";
    } else if (lowerUrl.includes("annual") || lowerUrl.includes("year")) {
      return "annual_report";
    } else if (lowerUrl.includes("case") || lowerUrl.includes("study")) {
      return "case_study";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.descriptions.trim())
      newErrors.descriptions = "Description is required";
    if (!formData.report_url.trim())
      newErrors.report_url = "Report URL is required";
    if (!formData.type) newErrors.type = "Report type selection is required";
    if (!formData.project.trim()) newErrors.project = "Project is required";

    if (formData.report_url && !isValidUrl(formData.report_url)) {
      newErrors.report_url = "Please enter a valid Google Drive URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      // Check if it's a Google Drive URL
      return (
        url.hostname.includes("drive.google.com") ||
        url.hostname.includes("docs.google.com")
      );
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-detect report type when URL changes
    if (field === "report_url") {
      const detectedType = detectReportType(value);
      if (detectedType) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          type: detectedType,
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
            Hi {data?.user.name}, please follow the steps below to add your
            report
          </h1>
          <ul className="text-muted-foreground th-font-book text-sm list-disc ml-4">
            <li>
              Ensure you have a{" "}
              <span className="th-font-medium text-destructive">
                Google Drive link
              </span>{" "}
              to your report (PDF, presentation, document, or spreadsheet)
            </li>
            <li>
              The report should be publicly accessible or shared with
              appropriate permissions
            </li>
            <li>Add relevant tags to help users find your report</li>
          </ul>
        </div>

        <div className="border-t border-border mt-4 px-6 pt-4 flex flex-col">
          <h1>
            Enter the <span className="th-font-heavy">basic information</span>{" "}
            for your report
          </h1>

          <div className="space-y-4 mt-5">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Q4 2024 Impact Assessment"
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
              <Label htmlFor="descriptions">Description *</Label>
              <Textarea
                id="descriptions"
                value={formData.descriptions}
                onChange={(e) =>
                  handleInputChange("descriptions", e.target.value)
                }
                placeholder="Detailed description of what this report contains..."
                rows={3}
                className={errors.descriptions ? "border-red-500" : ""}
              />
              {errors.descriptions && (
                <span className="text-sm text-destructive th-font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.descriptions}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="report_url">Google Drive URL *</Label>
              <Input
                id="report_url"
                value={formData.report_url}
                onChange={(e) =>
                  handleInputChange("report_url", e.target.value)
                }
                placeholder="https://drive.google.com/file/d/..."
                className={errors.report_url ? "border-red-500" : ""}
              />
              {errors.report_url && (
                <span className="text-sm text-destructive th-font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.report_url}
                </span>
              )}
              <Banner
                variant={"info"}
                title="Note on Google Drive URL"
                description="Paste the Google Drive link to your PDF, presentation, document, or spreadsheet. We'll auto-detect the report type for you!"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-4 px-6 pt-4 flex flex-col">
          <h1>
            Select the <span className="th-font-heavy">report type</span> and
            add <span className="th-font-heavy">additional details</span>
          </h1>

          <div className="w-full flex justify-between items-start gap-4 mt-5">
            <div className="w-full">
              <GlobalSelectDropdown
                label="Report Type *"
                wrapperClassName=""
                placeHolderText="Select Report Type (auto-detected from URL)"
                onSelectItem={(sel) =>
                  handleInputChange("type", sel?.name || "")
                }
                data={reportTypeData}
                initialSelected={
                  reportTypeData.find((type) => type.name === formData.type) ||
                  null
                }
              />
              {errors.type && (
                <span className="text-sm text-destructive th-font-medium mt-1">
                  {errors.type}
                </span>
              )}
              {formData.type && (
                <div className="mt-1">
                  <span className="text-xs text-green-600 th-font-medium">
                    ✓ Auto-detected:{" "}
                    {
                      reportTypeData.find((t) => t.name === formData.type)
                        ?.label
                    }
                  </span>
                </div>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="data_source">
                Data Source
                <InfoContainer
                  id={"emebedReportDataSource"}
                  text={
                    "The data sources that provide the underlying data used to generate and support the evidence presented in the report. e.g. `national DHIS2`"
                  }
                >
                  <div className="text-xs th-font-mediumOblique">
                    Not required but highly recommended!
                  </div>
                </InfoContainer>
              </Label>
              <Input
                id="data_source"
                value={formData.data_source}
                onChange={(e) =>
                  handleInputChange("data_source", e.target.value)
                }
                placeholder="e.g., Field Data Collection"
                className="mt-1"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="project">
              Project *{" "}
              <InfoContainer
                id={"emebedReportProjectName"}
                text={
                  "The country project or initiative that the report is associated with. e.g. `Mothers2Mothers`"
                }
              >
                <div className="text-xs th-font-mediumOblique">Required</div>
              </InfoContainer>
            </Label>
            <Input
              id="project"
              value={formData.project}
              onChange={(e) => handleInputChange("project", e.target.value)}
              placeholder="e.g., Health Access Initiative"
              className={`mt-1 ${errors.project ? "border-red-500" : ""}`}
            />
            {errors.project && (
              <span className="text-sm text-destructive th-font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.project}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-border mt-4 px-6 pt-4 flex flex-col">
          <div className="flex">
            <h1>
              Now, add <span className="th-font-heavy">tags</span> to help users
              find your report
            </h1>
            <InfoContainer
              id={"emebedReportTags"}
              text={
                "Tags are short labels that describe what a report is about. They help users quickly search, filter, and find relevant reports. e.g. `cbis`"
              }
            >
              <div className="text-xs th-font-mediumOblique">
                Not required but highly recommended!
              </div>
            </InfoContainer>
          </div>

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
                    className="flex items-center gap-1 border bg-gray-200 border-gray-300 "
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
      <div className="h-full w-full px-4 flex flex-row justify-between gap-4">
        {/* <div className="  border-gray-300 space-y-4 border rounded-sm bg-gray-100 p-4">
          <div className="space-y-4 gap-4 text-sm ">
            <div>
              <span className="font-semibold underline">Title:</span>{" "}
              {formData.title}
            </div>
            <div>
              <span className="font-semibold underline">Report Type:</span>{" "}
              {reportTypeData.find((t) => t.name === formData.type)?.label}
            </div>
            <div className="col-span-2">
              <span className="font-semibold underline">Description:</span>{" "}
              {formData.descriptions}
            </div>
            <div>
              <span className="font-semibold underline">Project:</span>{" "}
              {formData.project}
            </div>
            {formData.data_source && (
              <div>
                <span className="font-semibold underline">Data Source:</span>{" "}
                {formData.data_source}
              </div>
            )}
          </div>

          {formData.tags.length > 0 && (
            <div>
              <span className="font-semibold underline text-sm">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs flex items-center gap-1 border bg-gray-200 border-gray-300 "
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div> */}

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
              src={getGoogleDriveEmbedUrl(formData.report_url)}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Report Preview"
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    );
  }

  function Step3Form() {
    const saveReport = useCallback(async () => {
      if (!data?.user?.email) {
        toast.error("User information not available");
        return;
      }

      setSaveStatus("saving");
      setSaveStatusText("Saving report...");

      try {
        const reportData = {
          title: formData.title,
          description: formData.descriptions,
          report_url: formData.report_url,
          type: formData.type,
          tags: formData.tags.join(","),
          data_source: formData.data_source || "",
          program: countryToProgram[program],
          project: formData.project,
          status: formData.status,
          uploaded_by: data.user.email,
          date_published:
            formData.status === "published" ? new Date().toISOString() : null,
          slug: generateSlug(formData.title),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LMD_API}/reports`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData),
          }
        );

        console.log("Response status:", response);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.message ||
            `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();

        setSaveStatus("success");
        setSaveStatusText("Success ✨ Report has been saved successfully!");
        toast.success("Report saved successfully!");

        console.log("Report saved:", result);
      } catch (error) {
        console.error("Error saving report:", error);
        setSaveStatus("failed");
        setSaveStatusText(`Save failed: ${(error as Error).message}`);
        toast.error(`Failed to save report: ${(error as Error).message}`);
      }
    }, [formData, program, data]);

    return (
      <div className="h-full w-full px-6 border-t flex flex-col justify-start items-start gap-[3vh] pt-[5vh]">
        <div>
          <ul className="space-y-1.5">
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Program:
              </label>
              {program}
            </li>
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Report Title:
              </label>
              {formData.title}
            </li>
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Report Type:
              </label>
              {reportTypeData.find((t) => t.name === formData.type)?.label}
            </li>
            <li className="th-font-medium text-sm">
              <label className="mr-2 th-font-roman text-muted-foreground">
                Project:
              </label>
              {formData.project}
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
                ? "Report will be saved as draft and can be published later."
                : "Report will be immediately available to users with access to the " +
                  program +
                  " program."
            }
          />
        </div>

        <Button
          className="mt-4"
          variant={saveStatus === "failed" ? "green" : "dark-blue"}
          onClick={saveReport}
          isLoading={saveStatus === "saving"}
          disabled={saveStatus === "success"}
        >
          {saveStatus === "default" &&
            `${formData.status === "draft" ? "Save Draft" : "Publish Report"}`}
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
      title: "Report Details",
      content: Step1Form(),
    },
    {
      title: "Preview Report",
      content: Step2Form(),
    },
    {
      title: "Save Report",
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
      descriptions: "",
      report_url: "",
      type: "",
      data_source: "",
      project: "",
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
        <div className="flex-1 mt-4 pt-2 h-[calc(70vh-91px)]">
          {steps[current].content}
        </div>
      </div>
    );
  };

  return (
    <BaseModal
      ref={modalRef}
      title={"Embed Program Report"}
      size={"large"}
      buttonComponent={
        isUserAllowed(data!) ? (
          <Button className="px-4 -mt-0" variant={"dark-blue"} size={"sm"}>
            <FileText className="h-4 w-5 mr-2 hidden md:block" />
            <Plus className="h-4 w-4 md:hidden" />
            <span className="hidden md:block">Add New Report</span>
          </Button>
        ) : (
          <></>
        )
      }
      components={ModalComponent()}
      isCtaDisabled={
        (current === 0 &&
          (!formData.title ||
            !formData.descriptions ||
            !formData.report_url ||
            !formData.type ||
            !formData.project)) ||
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

export default EmbedReportModal;
