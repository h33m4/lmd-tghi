import { ColDef, ValueFormatterParams } from "ag-grid-community";

export interface IEvents {
  id: string;
  UserEmail: string;
  UserID: string;
  Timestamp: string;
  PageURL?: string;
  EventType?: string;
  // Login
  LoginType?: string;
  // Device
  DeviceOS?: string;
  DeviceType?: string;
  DeviceBrowser?: string;
  DeviceLocationContinent?: string;
  DeviceLocationCountry?: string;
  DeviceLocationCity?: string;
  DeviceIPAddress?: string;
  DeviceCoordinates?: { lat: string; long: string };
  // Session
  SessionDuration?: number;
  SessionEndTime?: string;
  SessionStartTime?: string;
  // KPI bulk upload (kpiBulkUpload)
  Tablename?: string;
  FileName?: string;
  FileSizeBytes?: number;
  RowCount?: number;
  ColumnNames?: string;
  ColumnCount?: number;
  UploadEndpoint?: string;
  UploadStatus?: string;
  UploadDurationMs?: number;
  ApiStatusCode?: number;
  ApiResponseMessage?: string;
  ApiResponseBody?: string;
  ErrorMessage?: string;
  // KPI single upload (kpiSingleUpload)
  RecordPayload?: string;
  FieldCount?: number;
  CreatedRecordId?: string;
  // Legacy fields (kept for backwards compat with old events)
  DatasetName?: string;
  DatasetSize?: number;
  DatasetJson?: string;
  UploadDuration?: string;
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatTimestamp(params: ValueFormatterParams): string {
  if (!params.value) return "—";
  try {
    return new Date(params.value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return params.value;
  }
}

function formatBytes(params: ValueFormatterParams): string {
  const bytes = params.value;
  if (bytes == null || bytes === "") return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDurationMs(params: ValueFormatterParams): string {
  const ms = params.value;
  if (ms == null || ms === "") return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatEmpty(params: ValueFormatterParams): string {
  return params.value ?? "—";
}

// ─── Cell renderers ───────────────────────────────────────────────────────────

// ─── Column definitions ───────────────────────────────────────────────────────

const EventColumns: ColDef<IEvents>[] = [
  // ── Pinned identifiers ──────────────────────────────────────────────────────
  {
    field: "Timestamp",
    headerName: "Timestamp",
    minWidth: 175,
    sort: "desc",
    valueFormatter: formatTimestamp,
  },
  {
    field: "EventType",
    headerName: "Event Type",
    minWidth: 160,
    valueFormatter: formatEmpty,
  },
  {
    field: "UserEmail",
    headerName: "User Email",
    minWidth: 210,
  },

  // ── Upload outcome ──────────────────────────────────────────────────────────
  {
    field: "UploadStatus",
    headerName: "Upload Status",
    minWidth: 130,
    valueFormatter: formatEmpty,
  },
  {
    field: "ApiStatusCode",
    headerName: "API Status",
    minWidth: 110,
    type: "numericColumn",
    valueFormatter: formatEmpty,
  },
  {
    field: "ApiResponseMessage",
    headerName: "API Response",
    minWidth: 220,
    valueFormatter: formatEmpty,
  },
  {
    field: "ErrorMessage",
    headerName: "Error",
    minWidth: 240,
    valueFormatter: formatEmpty,
  },

  // ── KPI upload metadata ─────────────────────────────────────────────────────
  {
    field: "Tablename",
    headerName: "Dataset",
    minWidth: 190,
    valueFormatter: formatEmpty,
  },
  {
    field: "FileName",
    headerName: "File Name",
    minWidth: 200,
    valueFormatter: formatEmpty,
  },
  {
    field: "RowCount",
    headerName: "Rows",
    minWidth: 90,
    type: "numericColumn",
    valueFormatter: (p) =>
      p.value != null ? Number(p.value).toLocaleString() : "—",
  },
  {
    field: "ColumnCount",
    headerName: "Columns",
    minWidth: 95,
    type: "numericColumn",
    valueFormatter: formatEmpty,
  },
  {
    field: "FileSizeBytes",
    headerName: "File Size",
    minWidth: 110,
    type: "numericColumn",
    valueFormatter: formatBytes,
  },
  {
    field: "UploadDurationMs",
    headerName: "Duration",
    minWidth: 110,
    type: "numericColumn",
    valueFormatter: formatDurationMs,
  },
  {
    field: "FieldCount",
    headerName: "Fields (single)",
    minWidth: 130,
    type: "numericColumn",
    valueFormatter: formatEmpty,
  },
  {
    field: "CreatedRecordId",
    headerName: "Created Record ID",
    minWidth: 155,
    valueFormatter: formatEmpty,
  },

  // ── Page / session ──────────────────────────────────────────────────────────
  {
    field: "PageURL",
    headerName: "Page URL",
    minWidth: 260,
    valueFormatter: formatEmpty,
  },
  {
    field: "SessionDuration",
    headerName: "Session (s)",
    minWidth: 110,
    type: "numericColumn",
    valueFormatter: formatEmpty,
  },
  {
    field: "SessionStartTime",
    headerName: "Session Start",
    minWidth: 175,
    valueFormatter: formatTimestamp,
  },
  {
    field: "SessionEndTime",
    headerName: "Session End",
    minWidth: 175,
    valueFormatter: formatTimestamp,
  },

  // ── Device ─────────────────────────────────────────────────────────────────
  {
    field: "DeviceBrowser",
    headerName: "Browser",
    minWidth: 110,
    valueFormatter: formatEmpty,
  },
  {
    field: "DeviceOS",
    headerName: "OS",
    minWidth: 100,
    valueFormatter: formatEmpty,
  },
  {
    field: "DeviceType",
    headerName: "Device",
    minWidth: 100,
    valueFormatter: formatEmpty,
  },
  {
    field: "DeviceLocationCountry",
    headerName: "Country",
    minWidth: 120,
    valueFormatter: formatEmpty,
  },
  {
    field: "DeviceLocationCity",
    headerName: "City",
    minWidth: 120,
    valueFormatter: formatEmpty,
  },
  {
    field: "DeviceLocationContinent",
    headerName: "Continent",
    minWidth: 120,
    valueFormatter: formatEmpty,
  },

  // ── Hidden by default (still accessible via column picker) ─────────────────
  {
    field: "id",
    headerName: "ID",
    minWidth: 100,
    initialHide: true,
  },
  {
    field: "UserID",
    headerName: "User ID",
    minWidth: 120,
  },
  {
    field: "LoginType",
    headerName: "Login Type",
    minWidth: 110,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
  {
    field: "ColumnNames",
    headerName: "Column Names",
    minWidth: 260,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
  {
    field: "UploadEndpoint",
    headerName: "Upload Endpoint",
    minWidth: 260,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
  {
    field: "ApiResponseBody",
    headerName: "API Response Body",
    minWidth: 300,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
  {
    field: "RecordPayload",
    headerName: "Record Payload",
    minWidth: 300,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
  {
    field: "DeviceIPAddress",
    headerName: "IP Address",
    minWidth: 130,
    valueFormatter: formatEmpty,
  },
  {
    field: "DeviceCoordinates",
    headerName: "Coordinates",
    minWidth: 160,
    initialHide: true,
    valueFormatter: (p) => {
      const v = p.value;
      if (!v) return "—";
      if (typeof v === "object") return `${v.lat}, ${v.long}`;
      return v;
    },
  },
  // Legacy
  {
    field: "DatasetName",
    headerName: "Dataset Name (legacy)",
    minWidth: 180,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
  {
    field: "DatasetSize",
    headerName: "Dataset Size (legacy)",
    minWidth: 160,
    initialHide: true,
    valueFormatter: formatBytes,
  },
  {
    field: "DatasetJson",
    headerName: "Dataset JSON (legacy)",
    minWidth: 300,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
  {
    field: "UploadDuration",
    headerName: "Upload Duration (legacy)",
    minWidth: 180,
    initialHide: true,
    valueFormatter: formatEmpty,
  },
];

export default EventColumns;
