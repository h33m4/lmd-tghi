"use server";

import { MWAAClient, CreateWebLoginTokenCommand } from "@aws-sdk/client-mwaa";

const AIRFLOW_ENV_NAME = process.env.AIRFLOW_ENV_NAME!;
const AWS_REGION = process.env.LMD_AWS_REGION!;

// ─── Auth ──────────────────────────────────────────────────────────────────────

let cachedSession: { cookie: string; hostname: string; expiresAt: number } | null = null;

async function getMwaaSession(): Promise<{ cookie: string; hostname: string }> {
  const now = Date.now();
  if (cachedSession && now < cachedSession.expiresAt) {
    return { cookie: cachedSession.cookie, hostname: cachedSession.hostname };
  }

  const client = new MWAAClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: process.env.LMD_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.LMD_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const res = await client.send(new CreateWebLoginTokenCommand({ Name: AIRFLOW_ENV_NAME }));

  if (!res.WebToken || !res.WebServerHostname) {
    throw new Error("Failed to obtain MWAA web login token");
  }

  // Exchange the web token for a session cookie
  const loginRes = await fetch(
    `https://${res.WebServerHostname}/aws_mwaa/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${res.WebToken}`,
      redirect: "manual",
    }
  );

  const setCookie = loginRes.headers.get("set-cookie");
  const sessionMatch = setCookie?.match(/session=([^;]+)/);
  if (!sessionMatch) {
    throw new Error("Failed to obtain MWAA session cookie from login response");
  }

  // Session cookies are valid for ~12 hours; cache for 11
  cachedSession = {
    cookie: `session=${sessionMatch[1]}`,
    hostname: res.WebServerHostname,
    expiresAt: now + 11 * 60 * 60 * 1000,
  };

  return { cookie: cachedSession.cookie, hostname: cachedSession.hostname };
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function airflowFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { cookie, hostname } = await getMwaaSession();

    const res = await fetch(`https://${hostname}/api/v1${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
        ...(options.headers as Record<string, string>),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      return { data: null, error: `Airflow ${res.status}: ${text}` };
    }

    const data = res.status === 204 ? (null as T) : ((await res.json()) as T);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AirflowDag {
  dag_id: string;
  dag_display_name: string | null;
  description: string | null;
  owners: string[];
  tags: { name: string }[];
  schedule_interval: { __type: string; value: string } | null;
  timetable_description: string | null;
  is_paused: boolean;
  is_active: boolean;
  has_import_errors: boolean;
  next_dagrun: string | null;
  next_dagrun_create_after: string | null;
}

export interface AirflowDagRun {
  dag_run_id: string;
  dag_id: string;
  state: "success" | "failed" | "running" | "queued";
  start_date: string | null;
  end_date: string | null;
  logical_date: string;
  note: string | null;
}

export interface AirflowTaskInstance {
  task_id: string;
  state: string;
  start_date: string | null;
  end_date: string | null;
  duration: number | null;
  try_number: number;
  operator: string | null;
}

export interface AirflowTask {
  task_id: string;
  task_type: string; // e.g. PythonOperator, BashOperator, S3ToRedshiftOperator
  downstream_task_ids: string[];
  ui_color: string | null;
  doc_md: string | null;
}

export interface AirflowHealth {
  metadatabase: { status: "healthy" | "unhealthy" };
  scheduler: { status: "healthy" | "unhealthy"; latest_scheduler_heartbeat: string | null };
  triggerer: { status: "healthy" | "unhealthy"; latest_triggerer_heartbeat: string | null };
  dag_processor?: { status: "healthy" | "unhealthy"; latest_dag_processor_heartbeat: string | null };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/** List all DAGs */
export async function getAirflowDags() {
  return airflowFetch<{ dags: AirflowDag[]; total_entries: number }>("/dags?limit=100");
}

/** Get a single DAG */
export async function getAirflowDag(dagId: string) {
  return airflowFetch<AirflowDag>(`/dags/${dagId}`);
}

/** Get recent runs for a DAG (most recent first) */
export async function getDagRuns(dagId: string, limit = 5) {
  return airflowFetch<{ dag_runs: AirflowDagRun[]; total_entries: number }>(
    `/dags/${dagId}/dagRuns?limit=${limit}&order_by=-start_date`
  );
}

/** Trigger a new DAG run */
export async function triggerDagRun(dagId: string, conf: Record<string, unknown> = {}) {
  return airflowFetch<AirflowDagRun>(`/dags/${dagId}/dagRuns`, {
    method: "POST",
    body: JSON.stringify({ conf }),
  });
}

/** Pause or unpause a DAG */
export async function setDagPaused(dagId: string, isPaused: boolean) {
  return airflowFetch<AirflowDag>(`/dags/${dagId}`, {
    method: "PATCH",
    body: JSON.stringify({ is_paused: isPaused }),
  });
}

/** Get task instances for a specific DAG run (shows per-step state, duration, retries) */
export async function getTaskInstances(dagId: string, dagRunId: string) {
  return airflowFetch<{ task_instances: AirflowTaskInstance[] }>(
    `/dags/${dagId}/dagRuns/${dagRunId}/taskInstances`
  );
}

/** Get task definitions for a DAG (shows pipeline steps and operator/transformation types) */
export async function getDagTasks(dagId: string) {
  return airflowFetch<{ tasks: AirflowTask[]; total_entries: number }>(
    `/dags/${dagId}/tasks`
  );
}

/** Get Airflow system health (scheduler, metadatabase, triggerer) */
export async function getAirflowHealth() {
  return airflowFetch<AirflowHealth>("/health");
}
