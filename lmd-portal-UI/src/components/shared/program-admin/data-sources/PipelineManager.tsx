"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Play,
  MoreVertical,
  Database,
  AlarmClock,
  RefreshCcw,
  PauseCircle,
  PlayCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Activity,
  ArrowRight,
  Globe,
  HardDrive,
  Layers,
  ServerCrash,
} from "lucide-react";
import { toast } from "sonner";
import {
  AirflowDag,
  AirflowDagRun,
  AirflowTaskInstance,
  AirflowHealth,
  getAirflowDags,
  getDagRuns,
  triggerDagRun,
  setDagPaused,
  getTaskInstances,
  getDagTasks,
  getAirflowHealth,
} from "@/lib/actions/airflow/airflow";

// ─── Stage parsing ────────────────────────────────────────────────────────────

interface PipelineStage {
  step: number;
  label: string;
  detail: string;
}

function parseStageTags(tags: { name: string }[]): PipelineStage[] {
  return tags
    .map((t) => {
      const m = t.name.match(/^stage:(\d+)\|([^|]+)\|(.+)$/);
      if (!m) return null;
      return { step: parseInt(m[1]), label: m[2].trim(), detail: m[3].trim() };
    })
    .filter((s): s is PipelineStage => s !== null)
    .sort((a, b) => a.step - b.step);
}

function nonStageTags(tags: { name: string }[]): string[] {
  return tags.filter((t) => !/^stage:\d+\|/.test(t.name)).map((t) => t.name);
}

function stageStyle(label: string): { bg: string; text: string; icon: React.ReactNode } {
  const l = label.toLowerCase();
  if (l.includes("source"))
    return { bg: "bg-blue-50", text: "text-blue-700", icon: <Globe className="h-3 w-3" /> };
  if (l.includes("destination") || l.includes("redshift") || l.includes("rds"))
    return { bg: "bg-purple-50", text: "text-purple-700", icon: <Database className="h-3 w-3" /> };
  if (l.includes("curated"))
    return { bg: "bg-green-50", text: "text-green-700", icon: <Layers className="h-3 w-3" /> };
  if (l.includes("s3") || l.includes("processed") || l.includes("raw"))
    return { bg: "bg-amber-50", text: "text-amber-700", icon: <HardDrive className="h-3 w-3" /> };
  return { bg: "bg-gray-50", text: "text-gray-600", icon: <HardDrive className="h-3 w-3" /> };
}

// ─── Status helpers ───────────────────────────────────────────────────────────

type PipelineStatus = "running" | "success" | "failed" | "paused" | "no_runs";

function derivedStatus(dag: AirflowDag, latestRun?: AirflowDagRun): PipelineStatus {
  if (dag.is_paused) return "paused";
  if (!latestRun) return "no_runs";
  if (latestRun.state === "running" || latestRun.state === "queued") return "running";
  if (latestRun.state === "failed") return "failed";
  return "success";
}

const STATUS_CONFIG: Record<
  PipelineStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  running: {
    label: "RUNNING",
    className: "bg-blue-100 text-blue-800",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  success: {
    label: "ACTIVE",
    className: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  failed: {
    label: "FAILED",
    className: "bg-red-100 text-red-800",
    icon: <XCircle className="h-3 w-3" />,
  },
  paused: {
    label: "PAUSED",
    className: "bg-gray-100 text-gray-600",
    icon: <PauseCircle className="h-3 w-3" />,
  },
  no_runs: {
    label: "NO RUNS",
    className: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="h-3 w-3" />,
  },
};

const TASK_STATE_CONFIG: Record<string, { className: string; icon: React.ReactNode }> = {
  success: { className: "text-green-600", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  failed: { className: "text-red-600", icon: <XCircle className="h-3.5 w-3.5" /> },
  running: { className: "text-blue-600", icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  queued: { className: "text-blue-400", icon: <Clock className="h-3.5 w-3.5" /> },
  skipped: { className: "text-gray-400", icon: <ArrowRight className="h-3.5 w-3.5" /> },
  upstream_failed: { className: "text-orange-500", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  up_for_retry: { className: "text-yellow-600", icon: <RotateCcw className="h-3.5 w-3.5" /> },
};

function taskStateConfig(state: string) {
  return TASK_STATE_CONFIG[state] ?? { className: "text-gray-400", icon: <Clock className="h-3.5 w-3.5" /> };
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number | null) {
  if (seconds === null) return null;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PipelineStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function PipelineFlow({ stages }: { stages: PipelineStage[] }) {
  if (stages.length === 0) return null;
  return (
    <div className="px-5 pb-4">
      <p className="text-xs font-medium text-gray-500 mb-2">Data Flow</p>
      <div className="flex items-stretch gap-1">
        {stages.map((stage, i) => {
          const { bg, text, icon } = stageStyle(stage.label);
          return (
            <React.Fragment key={stage.step}>
              <div className={`flex flex-col items-start rounded-lg px-2.5 py-1.5 ${bg} flex-1 min-w-0`}>
                <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${text}`}>
                  {icon}
                  {stage.label}
                </div>
                <div className={`text-[10px] mt-0.5 w-full truncate ${text} opacity-80`} title={stage.detail}>
                  {stage.detail}
                </div>
              </div>
              {i < stages.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 self-center flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function RunHistory({ runs }: { runs: AirflowDagRun[] }) {
  if (runs.length === 0) return null;
  return (
    <div className="px-5 pb-4">
      <p className="text-xs font-medium text-gray-500 mb-2">Recent Runs</p>
      <div className="flex gap-1">
        {runs.map((run) => (
          <div
            key={run.dag_run_id}
            title={`${run.state} — ${formatDate(run.start_date)}`}
            className={`h-2 flex-1 rounded-full ${
              run.state === "success"
                ? "bg-green-400"
                : run.state === "failed"
                ? "bg-red-400"
                : run.state === "running" || run.state === "queued"
                ? "bg-blue-400 animate-pulse"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TaskSteps({ dagId, dagRunId }: { dagId: string; dagRunId: string }) {
  const [tasks, setTasks] = useState<AirflowTaskInstance[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    const [{ data }, { data: topoData }] = await Promise.all([
      getTaskInstances(dagId, dagRunId),
      getDagTasks(dagId),
    ]);

    // Build topological order from DAG task definitions
    const topoOrder = new Map<string, number>();
    if (topoData?.tasks) {
      const tasks = topoData.tasks;
      const inDegree = new Map<string, number>();
      const downstream = new Map<string, string[]>();
      for (const t of tasks) {
        if (!inDegree.has(t.task_id)) inDegree.set(t.task_id, 0);
        downstream.set(t.task_id, t.downstream_task_ids);
        for (const dep of t.downstream_task_ids) {
          inDegree.set(dep, (inDegree.get(dep) ?? 0) + 1);
        }
      }
      const queue = Array.from(inDegree.entries())
        .filter(([, deg]) => deg === 0)
        .map(([id]) => id)
        .sort();
      let idx = 0;
      while (queue.length > 0) {
        const taskId = queue.shift()!;
        topoOrder.set(taskId, idx++);
        for (const dep of (downstream.get(taskId) ?? []).sort()) {
          const newDeg = (inDegree.get(dep) ?? 1) - 1;
          inDegree.set(dep, newDeg);
          if (newDeg === 0) queue.push(dep);
        }
        queue.sort();
      }
    }

    const instances = data?.task_instances ?? [];
    instances.sort((a, b) => {
      const aIdx = topoOrder.get(a.task_id) ?? Infinity;
      const bIdx = topoOrder.get(b.task_id) ?? Infinity;
      if (aIdx !== bIdx) return aIdx - bIdx;
      // Parallel tasks (same topo level): sort by task_id lexicographically
      return a.task_id < b.task_id ? -1 : a.task_id > b.task_id ? 1 : 0;
    });

    setTasks(instances);
    setLoading(false);
  }, [dagId, dagRunId]);

  const toggle = () => {
    if (!open && tasks === null) load();
    setOpen((v) => !v);
  };

  return (
    <div className="px-5 pb-3">
      <button
        onClick={toggle}
        className="text-[11px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
      >
        {open ? "Hide" : "Show"} last run task details
      </button>
      {open && (
        <div className="mt-2 space-y-1">
          {loading && <p className="text-xs text-gray-400">Loading…</p>}
          {!loading && tasks?.length === 0 && (
            <p className="text-xs text-gray-400">No task data available</p>
          )}
          {!loading &&
            tasks?.map((t) => {
              const cfg = taskStateConfig(t.state);
              return (
                <div key={t.task_id} className="flex items-center justify-between py-1 rounded hover:bg-gray-50 px-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cfg.className}>{cfg.icon}</span>
                    <span className="text-xs text-gray-800 font-mono truncate">
                      {t.task_id.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-[10px] text-gray-400">
                    {t.try_number > 1 && (
                      <span className="text-yellow-600 flex items-center gap-0.5">
                        <RotateCcw className="h-3 w-3" />×{t.try_number}
                      </span>
                    )}
                    {formatDuration(t.duration)}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function HealthBanner({ health }: { health: AirflowHealth }) {
  const components = [
    { name: "Scheduler", ...health.scheduler },
    { name: "Metadatabase", ...health.metadatabase },
    { name: "Triggerer", ...health.triggerer },
    ...(health.dag_processor ? [{ name: "DAG Processor", ...health.dag_processor }] : []),
  ];
  const unhealthy = components.filter((c) => c.status !== "healthy");
  if (unhealthy.length === 0) return null;
  return (
    <div className="mx-5 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
      <Activity className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-medium text-red-900">Airflow health issue</p>
        <p className="text-xs text-red-700 mt-0.5">
          {unhealthy.map((c) => c.name).join(", ")} unhealthy
        </p>
      </div>
    </div>
  );
}

// ─── Pipeline card ─────────────────────────────────────────────────────────────

interface PipelineData {
  dag: AirflowDag;
  runs: AirflowDagRun[];
}

function PipelineCard({
  pipeline,
  onRun,
  onTogglePause,
}: {
  pipeline: PipelineData;
  onRun: (dagId: string) => Promise<void>;
  onTogglePause: (dagId: string, isPaused: boolean) => Promise<void>;
}) {
  const { dag, runs } = pipeline;
  const latestRun = runs[0];
  const status = derivedStatus(dag, latestRun);
  const [isActing, setIsActing] = useState(false);

  const stages = parseStageTags(dag.tags);
  const extraTags = nonStageTags(dag.tags);

  const handleRun = async () => {
    setIsActing(true);
    await onRun(dag.dag_id);
    setIsActing(false);
  };

  const handleToggle = async () => {
    setIsActing(true);
    await onTogglePause(dag.dag_id, dag.is_paused);
    setIsActing(false);
  };

  return (
    <div className="bg-background rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200 truncate">
                {(dag.dag_display_name ?? dag.dag_id).replace(/_/g, " ")}
              </h3>
              <StatusBadge status={status} />
              {dag.has_import_errors && (
                <span className="flex items-center gap-1 text-[10px] text-red-600 font-medium">
                  <ServerCrash className="h-3 w-3" /> Import error
                </span>
              )}
            </div>
            {dag.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dag.description}</p>
            )}
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <AlarmClock className="h-3.5 w-3.5" />
                {dag.timetable_description ?? dag.schedule_interval?.value ?? "Manual"}
              </span>
              {dag.owners.length > 0 && (
                <span className="flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" />
                  {dag.owners.join(", ")}
                </span>
              )}
              {extraTags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {extraTags.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled={isActing}>
                {isActing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRun} disabled={status === "running"}>
                <Play className="h-4 w-4 mr-2" />
                Run Now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggle}>
                {dag.is_paused ? (
                  <><PlayCircle className="h-4 w-4 mr-2" />Unpause</>
                ) : (
                  <><PauseCircle className="h-4 w-4 mr-2" />Pause</>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_AIRFLOW_BASE_URL}/dags/${dag.dag_id}/grid`,
                    "_blank"
                  )
                }
              >
                View in Airflow ↗
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pipeline data flow */}
      <div className="pt-4">
        <PipelineFlow stages={stages} />
      </div>

      {/* Recent run history */}
      <RunHistory runs={runs} />

      {/* Task step details (lazy) */}
      {latestRun && <TaskSteps dagId={dag.dag_id} dagRunId={latestRun.dag_run_id} />}

      {/* Failed run alert */}
      {status === "failed" && latestRun && (
        <div className="mx-5 mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-medium text-red-900">Last run failed</div>
            <div className="text-xs text-red-700 mt-0.5 font-mono">{latestRun.dag_run_id}</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto px-5 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last run: {formatDate(latestRun?.start_date)}</span>
          <span>Next: {formatDate(dag.next_dagrun_create_after)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Manager ──────────────────────────────────────────────────────────────────

function AdminPipelineManager({ ownerFilter }: { ownerFilter?: string | string[] }) {
  const [pipelines, setPipelines] = useState<PipelineData[]>([]);
  const [health, setHealth] = useState<AirflowHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ownerFilter
    ? (Array.isArray(ownerFilter) ? ownerFilter : [ownerFilter]).map((f) => f.toLowerCase())
    : null;

  const matchesOwner = (dag: AirflowDag) => {
    if (!filters) return true;
    return dag.owners.some((o) => filters.some((f) => o.toLowerCase().includes(f)));
  };

  const fetchPipelines = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [{ data: dagsData, error: dagsErr }, { data: healthData }] = await Promise.all([
      getAirflowDags(),
      getAirflowHealth(),
    ]);

    if (dagsErr || !dagsData) {
      setError(dagsErr ?? "Failed to load pipelines");
      setLoading(false);
      return;
    }

    if (healthData) setHealth(healthData);

    const filtered = filters ? dagsData.dags.filter(matchesOwner) : dagsData.dags;

    const results = await Promise.all(
      filtered.map(async (dag) => {
        const { data: runsData } = await getDagRuns(dag.dag_id, 10);
        return { dag, runs: runsData?.dag_runs ?? [] };
      })
    );

    setPipelines(results);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerFilter]);

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  const handleRun = async (dagId: string) => {
    const { error } = await triggerDagRun(dagId);
    if (error) {
      toast.error(`Failed to trigger ${dagId}: ${error}`);
    } else {
      toast.success(`${dagId} triggered`);
      setTimeout(fetchPipelines, 1500);
    }
  };

  const handleTogglePause = async (dagId: string, currentlyPaused: boolean) => {
    const { error } = await setDagPaused(dagId, !currentlyPaused);
    if (error) {
      toast.error(`Failed to update ${dagId}: ${error}`);
    } else {
      toast.success(`${dagId} ${currentlyPaused ? "unpaused" : "paused"}`);
      setPipelines((prev) =>
        prev.map((p) =>
          p.dag.dag_id === dagId
            ? { ...p, dag: { ...p.dag, is_paused: !currentlyPaused } }
            : p
        )
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="flex justify-between items-center p-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Data Pipelines</h1>
            <p className="text-gray-500 text-sm mt-1">
              {loading
                ? "Loading..."
                : error
                ? "Could not connect to Airflow"
                : `${pipelines.length} pipeline${pipelines.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button variant="outline" onClick={fetchPipelines} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {health && <HealthBanner health={health} />}

      {error && (
        <div className="mx-5 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Could not connect to Airflow</p>
            <p className="text-sm text-red-700 mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-5 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-5 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-64" />
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-10 bg-gray-100 rounded-lg flex-1" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-5 pb-6 items-start">
          {pipelines.map((pipeline) => (
            <PipelineCard
              key={pipeline.dag.dag_id}
              pipeline={pipeline}
              onRun={handleRun}
              onTogglePause={handleTogglePause}
            />
          ))}
          {pipelines.length === 0 && (
            <div className="col-span-2 text-center py-16 bg-white rounded-xl border border-gray-200">
              <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No DAGs found</h3>
              <p className="text-sm text-gray-500">No pipelines are registered in Airflow yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPipelineManager;
