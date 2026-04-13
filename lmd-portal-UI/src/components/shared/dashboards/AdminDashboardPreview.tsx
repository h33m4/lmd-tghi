"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, ExternalLink, Loader2, Maximize2, Minimize2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDashboardData } from "@/types/dashboard";
import { getStatusBadge, getBIToolBadge } from "./RecentDashboards";
import { DashboardHeaderSkeleton, DashboardContentSkeleton } from "../views/DashboardRenderer";
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
  dashboardId: string;
  country: string;
};

type EditForm = {
  title: string;
  description: string;
  tags: string;
  embed_url: string;
  status: IDashboardData["status"];
  bi_tool: string;
  projects: string[];
};

export default function AdminDashboardPreview({ dashboardId, country }: Props) {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "", description: "", tags: "", embed_url: "", status: "draft", bi_tool: "powerbi", projects: [],
  });
  const [projectInput, setProjectInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(`dashboard_preview_${dashboardId}`);
    if (cached) {
      try {
        setDashboard(JSON.parse(cached));
        setLoading(false);
        return;
      } catch { /* fall through to API */ }
    }
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_LMD_API}/dashboards/${dashboardId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setDashboard(await res.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [dashboardId]);

  const openEdit = () => {
    if (!dashboard) return;
    setEditForm({
      title: dashboard.title,
      description: dashboard.description,
      tags: dashboard.tags,
      embed_url: dashboard.embed_url,
      status: dashboard.status,
      bi_tool: dashboard.bi_tool,
      projects: dashboard.project
        ? dashboard.project.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
    });
    setProjectInput("");
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!dashboard) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LMD_API}/dashboards/${dashboard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          project: editForm.projects.join(", "),
          last_update_date: new Date().toISOString(),
          published_at:
            editForm.status === "published" && dashboard.status !== "published"
              ? new Date().toISOString()
              : dashboard.published_at,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated: IDashboardData = await res.json();
      setDashboard(updated);
      sessionStorage.setItem(`dashboard_preview_${dashboardId}`, JSON.stringify(updated));
      setEditOpen(false);
      toast.success("Dashboard updated successfully");
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
          onClick={() => router.push(`/country-programs/${countryPath}/admin/dashboards`)}
          className="flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboards
        </Button>

        {dashboard && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getBIToolBadge(dashboard.bi_tool)}
              {getStatusBadge(dashboard.status)}
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-xs">
              {dashboard.title}
            </span>
            {dashboard.embed_url && (
              <a href={dashboard.embed_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
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
          <div className="flex flex-col h-full border border-primary/20 rounded-md m-4">
            <DashboardHeaderSkeleton />
            <DashboardContentSkeleton />
          </div>
        )}
        {!loading && error && (
          <div className="flex items-center justify-center h-full text-center p-8">
            <p className="text-lg font-medium mb-2">Dashboard Not Found</p>
          </div>
        )}
        {!loading && dashboard && (
          !dashboard.embed_url ? (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <p className="text-lg font-medium mb-2">{dashboard.title}</p>
                <p className="text-muted-foreground text-sm">No embed URL configured.</p>
                <Button size="sm" variant="outline" className="mt-4" onClick={openEdit}>
                  <Edit className="h-3.5 w-3.5 mr-1.5" /> Add Embed URL
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {iframeLoading && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                  </div>
                </div>
              )}
              <iframe
                src={dashboard.embed_url}
                title={dashboard.title}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                onLoad={() => setIframeLoading(false)}
                style={{ display: iframeLoading ? "none" : "block" }}
              />
            </div>
          )
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit Dashboard
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="d-title">Title</Label>
              <Input id="d-title" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="d-desc">Description</Label>
              <Textarea id="d-desc" rows={3} value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="d-url">Embed URL</Label>
              <Input id="d-url" value={editForm.embed_url} onChange={(e) => setEditForm((p) => ({ ...p, embed_url: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="d-tags">Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input id="d-tags" value={editForm.tags} onChange={(e) => setEditForm((p) => ({ ...p, tags: e.target.value }))} placeholder="health, analytics, 2024" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="d-projects">Projects</Label>
              <div className="flex flex-wrap gap-1.5 min-h-[2rem] p-2 border rounded-md bg-background">
                {editForm.projects.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {p}
                    <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, projects: prev.projects.filter((x) => x !== p) }))} className="hover:text-destructive leading-none">×</button>
                  </span>
                ))}
                <input
                  id="d-projects"
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
                  placeholder={editForm.projects.length === 0 ? "Type and press Enter to add" : ""}
                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm((p) => ({ ...p, status: v as IDashboardData["status"] }))}>
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
                <Label>BI Tool</Label>
                <Select value={editForm.bi_tool} onValueChange={(v) => setEditForm((p) => ({ ...p, bi_tool: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="powerbi">Power BI</SelectItem>
                    <SelectItem value="looker_studio">Looker Studio</SelectItem>
                    <SelectItem value="tableau">Tableau</SelectItem>
                    <SelectItem value="qlik">Qlik</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
