"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, ExternalLink, Loader2, Maximize2, Minimize2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Report, ReportType, ReportStatus } from "@/types/report";
import { getStatusBadge, getReportTypeBadge } from "./reportComponents";
import ReportRenderer from "./ReportRenderer2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Props = {
  reportId: string;
  country: string;
};

type EditForm = {
  title: string;
  description: string;
  report_url: string;
  type: ReportType;
  tags: string;
  data_source: string;
  projects: string[];
  status: ReportStatus;
};

const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: "data_review",      label: "Data Review" },
  { value: "donor_report",     label: "Donor Report" },
  { value: "impact_report",    label: "Impact Report" },
  { value: "quarterly_report", label: "Quarterly Report" },
  { value: "annual_report",    label: "Annual Report" },
  { value: "case_study",       label: "Case Study" },
  { value: "other",            label: "Other" },
];

export default function AdminReportPreview({ reportId, country }: Props) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "", description: "", report_url: "", type: "other",
    tags: "", data_source: "", projects: [], status: "draft",
  });
  const [projectInput, setProjectInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(`report_preview_${reportId}`);
    if (cached) {
      try {
        setReport(JSON.parse(cached));
        setLoading(false);
        return;
      } catch { /* fall through to API */ }
    }
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_LMD_API}/reports/${reportId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setReport(await res.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reportId]);

  const openEdit = () => {
    if (!report) return;
    setEditForm({
      title:       report.title,
      description: report.description,
      report_url:  report.report_url,
      type:        report.type,
      tags:        report.tags,
      data_source: report.data_source,
      projects:    report.project
        ? report.project.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
      status:      report.status,
    });
    setProjectInput("");
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!report) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LMD_API}/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          project: editForm.projects.join(", "),
          date_updated: new Date().toISOString(),
          date_published:
            editForm.status === "published" && report.status !== "published"
              ? new Date().toISOString()
              : report.date_published,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated: Report = await res.json();
      setReport(updated);
      sessionStorage.setItem(`report_preview_${reportId}`, JSON.stringify(updated));
      setEditOpen(false);
      toast.success("Report updated successfully");
    } catch (err) {
      toast.error(`Failed to save: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      contentRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const countryPath = country.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="h-full flex flex-col" ref={contentRef}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/country-programs/${countryPath}/admin/reports`)}
          className="flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>

        {report && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getReportTypeBadge(report.type)}
              {getStatusBadge(report.status)}
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-xs">
              {report.title}
            </span>
            {report.report_url && (
              <a href={report.report_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <Button size="sm" variant="outline" onClick={openEdit} className="flex items-center gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={toggleFullscreen} className="flex items-center gap-1.5">
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              {isFullscreen ? "Exit" : "Fullscreen"}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading report...</p>
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="flex items-center justify-center h-full text-center p-8">
            <p className="text-lg font-medium mb-2">Report Not Found</p>
          </div>
        )}
        {!loading && report && (
          <div className="w-full h-full p-2">
            <ReportRenderer report={report} />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit Report
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="r-title">Title</Label>
              <Input id="r-title" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="r-desc">Description</Label>
              <Textarea id="r-desc" rows={3} value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="r-url">Report URL</Label>
              <Input id="r-url" value={editForm.report_url} onChange={(e) => setEditForm((p) => ({ ...p, report_url: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="r-tags">Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input id="r-tags" value={editForm.tags} onChange={(e) => setEditForm((p) => ({ ...p, tags: e.target.value }))} placeholder="health, quarterly, 2024" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="r-source">Data Source</Label>
                <Input id="r-source" value={editForm.data_source} onChange={(e) => setEditForm((p) => ({ ...p, data_source: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-projects">Projects</Label>
                <div className="flex flex-wrap gap-1.5 min-h-[2rem] p-2 border rounded-md bg-background">
                  {editForm.projects.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {p}
                      <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, projects: prev.projects.filter((x) => x !== p) }))} className="hover:text-destructive leading-none">×</button>
                    </span>
                  ))}
                  <input
                    id="r-projects"
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === ",") && projectInput.trim()) {
                        e.preventDefault();
                        const val = projectInput.trim().replace(/,$/, "");
                        if (val && !editForm.projects.includes(val)) {
                          setEditForm((prev) => ({ ...prev, projects: [...prev.projects, val] }));
                        }
                        setProjectInput("");
                      }
                    }}
                    placeholder={editForm.projects.length === 0 ? "Type and press Enter" : ""}
                    className="flex-1 min-w-[80px] outline-none text-sm bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm((p) => ({ ...p, status: v as ReportStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Draft</span>
                    </SelectItem>
                    <SelectItem value="published">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Published</span>
                    </SelectItem>
                    <SelectItem value="archived">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Archived</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Report Type</Label>
                <Select value={editForm.type} onValueChange={(v) => setEditForm((p) => ({ ...p, type: v as ReportType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
