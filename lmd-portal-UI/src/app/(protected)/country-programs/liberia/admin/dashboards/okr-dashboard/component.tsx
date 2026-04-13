"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  RefreshCw,
  Search,
  X,
  Target,
  Hash,
  TrendingUp,
  Layers,
  Clock,
  Settings2,
  PanelRight,
  AppWindow,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AutoExpandTextarea from "@/components/input/AutoExpandTextarea";
import ErrorBanner from "@/components/ui/banner/ErrorBanner";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import {
  createOKR,
  createObjective,
  deleteOKR,
  deleteObjective,
  getAllOKRs,
  getAllObjectives,
  updateObjective,
  updateOKRField,
} from "@/lib/actions/okr-dashboard/okr";
import {
  OkrBaseData,
  OkrBaseInput,
  OkrObjectiveData,
} from "@/types/okrTracker";
import {
  EMPTY_FORM,
  unitColor,
  validateEnums,
} from "./_components/constants";
import { Field } from "./_components/FormPrimitives";
import KRForm from "./_components/KRForm";
import { SlideOver, PanelLayout } from "./_components/SlideOver";
import { OkrTable, OkrGroup } from "./_components/OkrTable";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col h-full p-6 gap-5">
      <div className="h-28 rounded-2xl bg-gradient-to-br from-lmh-dark-blue/20 to-primary/10 animate-pulse" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
      <div className="flex-1 rounded-xl border border-border overflow-hidden animate-pulse">
        <div className="h-11 bg-muted" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-t border-border flex items-center px-4 gap-4"
          >
            <div className="h-3 w-10 bg-muted rounded" />
            <div className="h-3 flex-1 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OKRAdminPage() {
  const [okrs, setOkrs] = useState<OkrBaseData[]>([]);
  const [objectives, setObjectives] = useState<OkrObjectiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );

  // KR slide-over
  const [panelLayout, setPanelLayout] = useState<PanelLayout>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("okr_panel_layout") as PanelLayout) || "slideover"
      );
    }
    return "slideover";
  });

  const togglePanelLayout = (l: PanelLayout) => {
    setPanelLayout(l);
    localStorage.setItem("okr_panel_layout", l);
  };

  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"view" | "edit" | "add">("view");
  const [selectedOkr, setSelectedOkr] = useState<OkrBaseData | null>(null);
  const [formData, setFormData] = useState<Partial<OkrBaseInput>>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  // Objective panel (add + edit)
  const [objPanelOpen, setObjPanelOpen] = useState(false);
  const [objPanelMode, setObjPanelMode] = useState<"add" | "edit">("add");
  const [objEditData, setObjEditData] = useState<{
    id: string; // OkrObjective.id (empty for add mode)
    objective: string;
    toc: string;
  }>({
    id: "",
    objective: "",
    toc: "",
  });
  const [isSavingObj, setIsSavingObj] = useState(false);
  const [objFormError, setObjFormError] = useState<string | undefined>(
    undefined,
  );

  // Delete confirm modals
  const krDeleteModalRef = useRef<BaseModalRef>(null);
  const objDeleteModalRef = useRef<BaseModalRef>(null);
  const [pendingKRDelete, setPendingKRDelete] = useState<{
    id: string;
    okrId: string;
  } | null>(null);
  const [pendingObjDelete, setPendingObjDelete] = useState<{
    objectiveId: string;
    number: number;
    objective: string;
  } | null>(null);
  const [isDeletingKR, setIsDeletingKR] = useState(false);
  const [isDeletingObj, setIsDeletingObj] = useState(false);

  const fetchAll = useCallback(async (opts?: { refresh?: boolean }) => {
    try {
      if (opts?.refresh) setIsRefreshing(true);
      else setLoading(true);
      const [okrRes, objRes] = await Promise.all([
        getAllOKRs(),
        getAllObjectives(),
      ]);
      if (okrRes.success && okrRes.data)
        setOkrs(okrRes.data as unknown as OkrBaseData[]);
      else toast.error(okrRes.error || "Failed to load OKRs");
      if (objRes.success && objRes.data)
        setObjectives(objRes.data as unknown as OkrObjectiveData[]);
    } catch {
      toast.error("Error loading data");
    } finally {
      if (opts?.refresh) setIsRefreshing(false);
      else setLoading(false);
    }
  }, []);

  // alias so existing callers (handleSave etc.) still work
  const fetchOKRs = fetchAll;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleRefresh = useCallback(async () => {
    await fetchAll({ refresh: true });
    toast.success("Refreshed");
  }, [fetchAll]);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setFormError(undefined);
    setTimeout(() => {
      setSelectedOkr(null);
      setFormData(EMPTY_FORM);
    }, 300);
  }, []);

  const openView = (okr: OkrBaseData) => {
    setSelectedOkr(okr);
    setFormData({ ...okr });
    setPanelMode("view");
    setPanelOpen(true);
  };
  const openEdit = (okr: OkrBaseData) => {
    setSelectedOkr(okr);
    setFormData({ ...okr });
    setPanelMode("edit");
    setPanelOpen(true);
  };
  // preObjectiveId = OkrObjective.id; preText/preToc = for display only; objPrefix = for ID suggestion
  const openAdd = (
    preObjectiveId?: string,
    preText?: string,
    preToc?: string,
    objPrefix?: string,
  ) => {
    setSelectedOkr(null);
    setFormData(
      preObjectiveId
        ? {
            ...EMPTY_FORM,
            objectiveId: preObjectiveId,
            objective: preText || "",
            objectiveToc: preToc || "",
            okrId: objPrefix ? suggestKRId(objPrefix) : "",
          }
        : EMPTY_FORM,
    );
    setPanelMode("add");
    setPanelOpen(true);
  };

  // Next auto-number for a new objective (derived from objectives state, not KRs)
  const nextObjectiveNumber = useMemo(() => {
    const nums = objectives.map((o) => o.number).filter((n) => !isNaN(n));
    return nums.length > 0 ? Math.max(...nums) + 1 : 1;
  }, [objectives]);

  // Suggest the next KR id under a given objective prefix (e.g. "2" → "2.3")
  const suggestKRId = useCallback(
    (objPrefix: string) => {
      const krsInGroup = okrs.filter((o) =>
        o.okrId.startsWith(`${objPrefix}.`),
      );
      const suffixes = krsInGroup
        .map((o) => parseInt(o.okrId.split(".")[1]))
        .filter((n) => !isNaN(n));
      const next = suffixes.length > 0 ? Math.max(...suffixes) + 1 : 1;
      return `${objPrefix}.${next}`;
    },
    [okrs],
  );

  const openEditObjective = (
    objectiveId: string,
    text: string,
    toc: string,
  ) => {
    setObjEditData({ id: objectiveId, objective: text, toc });
    setObjPanelMode("edit");
    setObjFormError(undefined);
    setObjPanelOpen(true);
  };

  const openAddObjective = () => {
    setObjEditData({ id: "", objective: "", toc: "" });
    setObjPanelMode("add");
    setObjFormError(undefined);
    setObjPanelOpen(true);
  };

  const closeObjPanel = useCallback(() => {
    setObjPanelOpen(false);
    setObjFormError(undefined);
  }, []);

  const handleSaveObjective = useCallback(async () => {
    if (!objEditData.objective.trim()) {
      setObjFormError("Objective text is required");
      return;
    }

    setObjFormError(undefined);
    setIsSavingObj(true);
    try {
      if (objPanelMode === "add") {
        // Persist the new objective, then open the KR panel
        const r = await createObjective({
          text: objEditData.objective,
          toc: objEditData.toc,
          number: nextObjectiveNumber,
        });
        if (!r.success) {
          setObjFormError(r.error || "Failed to create objective");
          return;
        }
        const newObj = r.data!;
        // Add to local objectives state so it appears in the table immediately
        setObjectives((prev) => [
          ...prev,
          {
            id: newObj.id,
            number: newObj.number,
            text: newObj.text,
            toc: newObj.toc,
          },
        ]);
        setObjPanelOpen(false);
        setTimeout(() => {
          openAdd(newObj.id, newObj.text, newObj.toc, String(newObj.number));
        }, 300);
      } else {
        // Edit mode — one DB call updates all linked KRs via the relation
        const r = await updateObjective(objEditData.id, {
          text: objEditData.objective,
          toc: objEditData.toc,
        });
        if (!r.success) {
          setObjFormError(r.error || "Failed to update objective");
          return;
        }
        // Update local state: reflect the new text/toc on the objectives list and all linked KRs
        setObjectives((prev) =>
          prev.map((obj) =>
            obj.id === objEditData.id
              ? { ...obj, text: objEditData.objective, toc: objEditData.toc }
              : obj,
          ),
        );
        setOkrs((prev) =>
          prev.map((o) =>
            o.objectiveId === objEditData.id
              ? {
                  ...o,
                  objective: objEditData.objective,
                  objectiveToc: objEditData.toc,
                  okrObjective: {
                    ...o.okrObjective,
                    text: objEditData.objective,
                    toc: objEditData.toc,
                  },
                }
              : o,
          ),
        );
        toast.success("Objective updated");
        setObjPanelOpen(false);
      }
    } catch {
      setObjFormError("Error saving objective");
    } finally {
      setIsSavingObj(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objEditData, objPanelMode, nextObjectiveNumber]);

  const handleSave = useCallback(async () => {
    if (!formData.okrId || !formData.objectiveId || !formData.keyResult) {
      setFormError("OKR ID, Objective, and Key Result are required");
      return;
    }
    const idInUse = okrs.some(
      (o) => o.okrId === formData.okrId && o.id !== selectedOkr?.id,
    );
    if (idInUse) {
      setFormError(`ID "${formData.okrId}" is already in use`);
      return;
    }
    if (!formData.periodStart || !formData.periodEnd) {
      setFormError("Period dates are required");
      return;
    }
    const err = validateEnums(formData as Partial<OkrBaseData>);
    if (err) {
      setFormError(err);
      return;
    }

    setFormError(undefined);
    setIsSaving(true);
    try {
      if (selectedOkr && panelMode === "edit") {
        const r = await updateOKRField(selectedOkr.id, formData);
        if (r.success) {
          setOkrs((prev) =>
            prev.map((o) =>
              o.id === selectedOkr.id
                ? { ...o, ...(formData as OkrBaseData) }
                : o,
            ),
          );
          toast.success("Key result updated");
          closePanel();
        } else setFormError(r.error || "Failed to update");
      } else if (panelMode === "add") {
        const r = await createOKR({
          okrId: formData.okrId!,
          objectiveId: formData.objectiveId!,
          keyResult: formData.keyResult!,
          priority: formData.priority || 1,
          status: "okr_under_review",
          progress: 0,
          unit: formData.unit || "percent",
          baseline: formData.baseline || 0,
          targetValue: formData.targetValue || 100,
          minValue: formData.minValue,
          maxValue: formData.maxValue,
          calculationMethod: formData.calculationMethod || "latest",
          valuePrompt: formData.valuePrompt,
          valueHint: formData.valueHint,
          denominator: formData.denominator,
          denominatorLabel: formData.denominatorLabel,
          numeratorLabel: formData.numeratorLabel,
          periodStart: formData.periodStart!,
          periodEnd: formData.periodEnd!,
          chartType: formData.chartType || "bar",
          chartMetricUnit: formData.chartMetricUnit ?? "",
        });
        if (r.success) {
          await fetchOKRs();
          toast.success("Key result added");
          closePanel();
        } else setFormError(r.error || "Failed to add");
      }
    } catch {
      setFormError("Error saving");
    } finally {
      setIsSaving(false);
    }
  }, [formData, selectedOkr, panelMode, okrs, fetchOKRs, closePanel]);

  const handleDelete = useCallback((id: string, okrId: string) => {
    setPendingKRDelete({ id, okrId });
    krDeleteModalRef.current?.openModal();
  }, []);

  const confirmDeleteKR = useCallback(async () => {
    if (!pendingKRDelete) return;
    setIsDeletingKR(true);
    try {
      const r = await deleteOKR(pendingKRDelete.id);
      if (r.success) {
        setOkrs((prev) => prev.filter((o) => o.id !== pendingKRDelete.id));
        if (selectedOkr?.id === pendingKRDelete.id) closePanel();
        krDeleteModalRef.current?.closeModal();
        toast.success(`OKR ${pendingKRDelete.okrId} deleted`);
      } else {
        toast.error(r.error || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting OKR");
    } finally {
      setIsDeletingKR(false);
    }
  }, [pendingKRDelete, selectedOkr, closePanel]);

  const handleDeleteObjective = useCallback(
    (objectiveId: string, number: number, objective: string) => {
      setPendingObjDelete({ objectiveId, number, objective });
      objDeleteModalRef.current?.openModal();
    },
    [],
  );

  const confirmDeleteObjective = useCallback(async () => {
    if (!pendingObjDelete) return;
    setIsDeletingObj(true);
    try {
      const r = await deleteObjective(pendingObjDelete.objectiveId);
      if (r.success) {
        setObjectives((prev) =>
          prev.filter((o) => o.id !== pendingObjDelete.objectiveId),
        );
        objDeleteModalRef.current?.closeModal();
        toast.success(`Objective ${pendingObjDelete.number} deleted`);
      } else {
        toast.error(r.error || "Failed to delete objective");
      }
    } catch {
      toast.error("Error deleting objective");
    } finally {
      setIsDeletingObj(false);
    }
  }, [pendingObjDelete]);

  // Derived: all objectives (including ones with no KRs yet) for the KR form picker
  const existingObjectives = useMemo(() => {
    return objectives.map((obj) => {
      const prefix = String(obj.number);
      return {
        id: obj.id,
        text: obj.text,
        toc: obj.toc || "",
        prefix,
        nextKrId: suggestKRId(prefix),
      };
    });
  }, [objectives, suggestKRId]);

  // Derived: OKRs grouped by objectiveId — objectives with zero KRs are shown as empty groups
  const grouped = useMemo((): OkrGroup[] => {
    const q = search.toLowerCase();

    // Seed every known objective (even zero-KR ones)
    const map = new Map<
      string,
      OkrGroup
    >();
    for (const obj of objectives) {
      map.set(obj.id, {
        objectiveId: obj.id,
        number: obj.number,
        objective: obj.text,
        toc: obj.toc || "",
        okrs: [],
      });
    }

    // Filter and attach KRs
    const filteredOkrs = q
      ? okrs.filter(
          (o) =>
            o.okrId.toLowerCase().includes(q) ||
            o.objective.toLowerCase().includes(q) ||
            o.keyResult.toLowerCase().includes(q),
        )
      : okrs;

    for (const okr of filteredOkrs) {
      const entry = map.get(okr.objectiveId);
      if (entry) entry.okrs.push(okr);
    }

    // When searching, hide objective groups with no matching KRs
    const result = Array.from(map.values());
    return (q ? result.filter((g) => g.okrs.length > 0) : result).sort(
      (a, b) => a.number - b.number,
    );
  }, [objectives, okrs, search]);

  const totalFiltered = grouped.reduce((s, g) => s + g.okrs.length, 0);

  const toggleGroup = (objectiveId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(objectiveId)) next.delete(objectiveId);
      else next.add(objectiveId);
      return next;
    });
  };

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const active = okrs.filter((o) => new Date(o.periodEnd) >= now).length;
    const avgTarget = okrs.length
      ? Math.round(okrs.reduce((s, o) => s + o.targetValue, 0) / okrs.length)
      : 0;
    const topObjectives = objectives.length;
    return { total: okrs.length, active, avgTarget, topObjectives };
  }, [okrs, objectives]);

  if (loading) return <Skeleton />;

  const panelTitle =
    panelMode === "add"
      ? "Add Key Result"
      : panelMode === "edit"
        ? `Edit KR ${selectedOkr?.okrId}`
        : selectedOkr?.keyResult || `KR ${selectedOkr?.okrId}`;

  const panelSubtitle =
    panelMode !== "add" && selectedOkr
      ? selectedOkr.objectiveToc
        ? `[${selectedOkr.objectiveToc}] ${selectedOkr.objective}`
        : selectedOkr.objective
      : undefined;

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-lmh-dark-blue via-[#1e4d62] to-[#1a5c6e] px-3 sm:px-6 py-5 shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">OKR Management</h1>
            </div>
            <p className="text-sm text-white/60 ml-10">
              Define and manage base OKR configurations for the dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => openAdd()}
              className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add KR
            </button>
            <Button
              onClick={openAddObjective}
              variant={"pink"}
              // className="h-9 bg-white text-lmh-dark-blue hover:bg-white/90 font-semibold text-sm flex items-center gap-1.5 shadow-none"
            >
              <Plus className="h-4 w-4" />
              Add Objective
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {[
            {
              label: "Total KRs",
              value: stats.total,
              icon: <Hash className="h-3.5 w-3.5" />,
              color: "bg-white/10",
            },
            {
              label: "Active",
              value: stats.active,
              icon: <Clock className="h-3.5 w-3.5" />,
              color: "bg-lmh-green/30",
            },
            {
              label: "Avg Target",
              value: stats.avgTarget,
              icon: <TrendingUp className="h-3.5 w-3.5" />,
              color: "bg-primary/30",
            },
            {
              label: "Objectives",
              value: stats.topObjectives,
              icon: <Layers className="h-3.5 w-3.5" />,
              color: "bg-lmh-pink/30",
            },
          ].map(({ label, value, icon, color }) => (
            <div
              key={label}
              className="rounded-lg bg-white/8 border border-white/10 px-3 py-2 flex items-center gap-2.5"
            >
              <div
                className={`w-6 h-6 rounded-md ${color} flex items-center justify-center text-white shrink-0`}
              >
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-white leading-none">
                  {value}
                </p>
                <p className="text-[10px] text-white/50 mt-0.5 truncate">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 py-3 border-b bg-background flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, objective, key result…"
            className="pl-9 pr-8 h-9 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <span className="hidden sm:block text-xs text-muted-foreground ml-auto whitespace-nowrap">
          {totalFiltered} of {okrs.length} KRs · {objectives.length} objective
          {objectives.length !== 1 ? "s" : ""}
        </span>

        {/* Panel layout picker */}
        <div className="relative">
          <button
            onClick={() => setLayoutPickerOpen((o) => !o)}
            title="Panel display settings"
            className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Settings2 className="h-4 w-4" />
          </button>
          {layoutPickerOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setLayoutPickerOpen(false)}
              />
              <div className="absolute right-0 top-11 z-40 w-56 rounded-xl border border-border bg-background shadow-lg p-3 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-1 pb-1">
                  Detail panel style
                </p>
                {(
                  [
                    {
                      value: "slideover" as PanelLayout,
                      label: "Slide-over",
                      description: "Slides in from the right",
                      icon: <PanelRight className="h-4 w-4 shrink-0" />,
                    },
                    {
                      value: "modal" as PanelLayout,
                      label: "Modal window",
                      description: "Centered dialog overlay",
                      icon: <AppWindow className="h-4 w-4 shrink-0" />,
                    },
                  ] as {
                    value: PanelLayout;
                    label: string;
                    description: string;
                    icon: React.ReactNode;
                  }[]
                ).map(({ value, label, description, icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      togglePanelLayout(value);
                      setLayoutPickerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      panelLayout === value
                        ? "bg-primary/10 text-primary border border-primary/25"
                        : "hover:bg-muted text-foreground border border-transparent"
                    }`}
                  >
                    <span
                      className={
                        panelLayout === value
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {description}
                      </p>
                    </div>
                    {panelLayout === value && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Grouped table ────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 py-4 flex flex-col flex-1">
        {objectives.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-lmh-dark-blue/8 flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-lmh-dark-blue/40 dark:text-primary/40" />
            </div>
            <p className="text-base font-semibold mb-1">No OKRs yet</p>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs">
              Add your first key result to start tracking objectives.
            </p>
            <Button
              size="sm"
              onClick={() => openAdd()}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add your first Key Result
            </Button>
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 text-center py-12">
            <p className="text-sm text-muted-foreground">
              No OKRs match &ldquo;{search}&rdquo;
            </p>
          </div>
        ) : (
          <OkrTable
            grouped={grouped}
            collapsedGroups={collapsedGroups}
            toggleGroup={toggleGroup}
            selectedOkr={selectedOkr}
            panelOpen={panelOpen}
            openView={openView}
            openEdit={openEdit}
            openEditObjective={openEditObjective}
            openAdd={openAdd}
            handleDelete={handleDelete}
            handleDeleteObjective={handleDeleteObjective}
          />
        )}
      </div>

      {/* ── KR slide-over ────────────────────────────────────────────────── */}
      <SlideOver
        open={panelOpen}
        onClose={closePanel}
        layout={panelLayout}
        title={panelTitle}
        subtitle={panelSubtitle}
        badge={
          selectedOkr && panelMode !== "add" ? (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${unitColor(selectedOkr.unit).bg} ${unitColor(selectedOkr.unit).text}`}
            >
              {selectedOkr.unit}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-white">
              New Key Result
            </span>
          )
        }
        footer={
          panelMode === "view" ? (
            <>
              <Button variant="outline" size="sm" onClick={closePanel}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => setPanelMode("edit")}
                className="flex items-center gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" /> Edit KR
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={closePanel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 min-w-[100px]"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </>
          )
        }
      >
        {formError && (
          <ErrorBanner
            message={formError}
            setFormError={setFormError}
            showCloseButton
            className="sticky top-0 z-10 mx-4 mt-4"
          />
        )}
        <KRForm
          formData={formData}
          onChange={setFormData}
          readOnly={panelMode === "view"}
          lockObjective={panelMode === "edit"}
          existingObjectives={panelMode === "add" ? existingObjectives : []}
          existingIds={okrs
            .filter((o) => o.id !== selectedOkr?.id)
            .map((o) => o.okrId)}
        />
      </SlideOver>

      {/* ── Objective add / edit slide-over ──────────────────────────── */}
      <SlideOver
        open={objPanelOpen}
        onClose={closeObjPanel}
        layout={panelLayout}
        title={
          objPanelMode === "add"
            ? `Add Objective ${nextObjectiveNumber}`
            : "Edit Objective"
        }
        subtitle={
          objPanelMode === "add"
            ? "After creating the objective, you'll add its first key result."
            : "Changes will apply to all key results under this objective."
        }
        badge={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-white">
            {objPanelMode === "add"
              ? `Objective ${nextObjectiveNumber}`
              : "Objective"}
          </span>
        }
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={closeObjPanel}
              disabled={isSavingObj}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveObjective}
              disabled={isSavingObj}
              className="flex items-center gap-1.5 min-w-[140px]"
            >
              {isSavingObj ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : null}
              {isSavingObj
                ? "Saving…"
                : objPanelMode === "add"
                  ? "Next: Add Key Result →"
                  : "Save Objective"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 p-4">
          {objFormError && (
            <ErrorBanner
              message={objFormError}
              setFormError={setObjFormError}
              showCloseButton
            />
          )}
          {objPanelMode === "add" && (
            <div className="rounded-lg bg-lmh-dark-blue/5 border border-lmh-dark-blue/15 px-3 py-2.5 text-xs text-lmh-dark-blue/70 dark:text-primary/70">
              This objective will be numbered{" "}
              <span className="font-bold">{nextObjectiveNumber}</span>. Key
              results under it will be{" "}
              <span className="font-bold">{nextObjectiveNumber}.1</span>,{" "}
              <span className="font-bold">{nextObjectiveNumber}.2</span>, etc.
            </div>
          )}
          <Field
            label="Objective"
            required
            id="edit-objective"
            info="The high-level goal this objective represents."
          >
            <AutoExpandTextarea
              value={objEditData.objective}
              onChange={(e) =>
                setObjEditData((d) => ({ ...d, objective: e.target.value }))
              }
              placeholder="Describe the high-level objective…"
            />
          </Field>
          <Field
            label="TOC"
            id="edit-objective-toc"
            info="Theory of Change reference. Links this objective to a specific pathway or outcome in the program's theory of change."
          >
            <Input
              value={objEditData.toc}
              onChange={(e) =>
                setObjEditData((d) => ({ ...d, toc: e.target.value }))
              }
              placeholder="e.g. Stregthen, Deliver, etc"
            />
          </Field>
        </div>
      </SlideOver>

      {/* ── KR delete confirm ────────────────────────────────────────────── */}
      <BaseModal
        ref={krDeleteModalRef}
        title="Delete Key Result"
        size="very-small"
        buttonComponent={<></>}
        buttonComponentClassName="hidden"
        hasFooter={true}
        isCtaDisabled={isDeletingKR}
        isLoading={isDeletingKR}
        ctaTitle="Delete"
        ctaOnClicked={confirmDeleteKR}
        components={
          <div className="px-4 py-5">
            <p className="text-sm text-foreground">
              Are you sure you want to delete key result{" "}
              <span className="font-bold text-lmh-dark-blue dark:text-primary">
                {pendingKRDelete?.okrId}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        }
      />

      {/* ── Objective delete confirm ──────────────────────────────────── */}
      <BaseModal
        ref={objDeleteModalRef}
        title="Delete Objective"
        size="very-small"
        buttonComponent={<></>}
        buttonComponentClassName="hidden"
        hasFooter={true}
        isCtaDisabled={isDeletingObj}
        isLoading={isDeletingObj}
        ctaTitle="Delete"
        ctaOnClicked={confirmDeleteObjective}
        components={
          <div className="px-4 py-5">
            <p className="text-sm text-foreground">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                Objective {pendingObjDelete?.number}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        }
      />
    </div>
  );
}
