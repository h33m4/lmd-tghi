// Base event type with common properties
export interface BaseAnalyticsEvent {
  UserID: string;
  UserEmail: string;
  EventType: string;
  PageURL?: string;
  Timestamp?: string; // ISO string format
}

// Login event
export interface LoginEvent extends BaseAnalyticsEvent {
  EventType: "login";
  LoginType: "google" | "password";
}

// Page view event
export interface PageEvent extends BaseAnalyticsEvent {
  EventType: "page";
  LoadTime?: number; // in milliseconds
  DeviceType?: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  DeviceOS?: "macOS" | "Windows" | "Linux" | "iOS" | "Android" | "Other";
  DeviceBrowser?: "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Other";
  DeviceLocationCountry: string;
  DeviceLocationCity: string;
  DeviceLocationContinent: string;
  DeviceCoordinates: {
    lat: string;
    long: string;
  };
  DeviceIPAddress: string;
}

// KPI bulk CSV upload event
export interface KpiBulkUploadEvent extends BaseAnalyticsEvent {
  EventType: "kpiBulkUpload";
  Tablename: string;
  FileName: string;
  FileSizeBytes: number;
  RowCount: number;
  ColumnNames: string; // comma-separated
  ColumnCount: number;
  UploadEndpoint: string;
  UploadStatus: "success" | "failed";
  UploadDurationMs: number;
  DatasetJson?: string; // full CSV rows as JSON array string
  // On success
  ApiStatusCode?: number;
  ApiResponseMessage?: string;
  // On failure
  ErrorMessage?: string;
  ApiResponseBody?: string;
  // Device
  DeviceType?: string;
  DeviceOS?: string;
  DeviceBrowser?: string;
}

// KPI single record upload event
export interface KpiSingleUploadEvent extends BaseAnalyticsEvent {
  EventType: "kpiSingleUpload";
  Tablename: string;
  UploadEndpoint: string;
  RecordPayload: string; // JSON stringified form data
  FieldCount: number;
  UploadStatus: "success" | "failed";
  UploadDurationMs: number;
  // On success
  ApiStatusCode?: number;
  ApiResponseMessage?: string;
  CreatedRecordId?: string;
  // On failure
  ErrorMessage?: string;
  ApiStatusCodeOnFailure?: number;
  ApiResponseBody?: string;
  // Device
  DeviceType?: string;
  DeviceOS?: string;
  DeviceBrowser?: string;
}

// Search event
export interface SearchEvent extends BaseAnalyticsEvent {
  EventType: "search";
  SearchQuery: string;
  ResultsCount: number;
}

// Session event
export interface SessionEvent extends BaseAnalyticsEvent {
  EventType: "session";
  SessionStartTime: string; // ISO string
  SessionEndTime: string; // ISO string
  SessionDuration: number; // in seconds
  DeviceType?: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  DeviceOS?: "macOS" | "Windows" | "Linux" | "iOS" | "Android" | "Other";
  DeviceBrowser?: "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Other";
  DeviceLocationCountry: string;
  DeviceLocationCity: string;
  DeviceLocationContinent: string;
  DeviceCoordinates: {
    lat: string;
    long: string;
  };
  DeviceIPAddress: string;
}

// API request event
export interface ApiRequestEvent extends BaseAnalyticsEvent {
  EventType: "apiRequest";
  EndpointUrl: string;
  ResponseTime: number; // in milliseconds
  StatusCode: number;
}

// Union type of all events
export type AnalyticsEvent =
  | LoginEvent
  | PageEvent
  | KpiBulkUploadEvent
  | KpiSingleUploadEvent
  | SearchEvent
  | SessionEvent
  | ApiRequestEvent;

// Param objects for upload tracking methods
export interface KpiBulkUploadParams {
  tablename: string;
  fileName: string;
  fileSizeBytes: number;
  rowCount: number;
  columnNames: string[];
  uploadEndpoint: string;
  uploadStatus: "success" | "failed";
  uploadDurationMs: number;
  datasetJson?: string;
  apiStatusCode?: number;
  apiResponseMessage?: string;
  errorMessage?: string;
  apiResponseBody?: string;
}

export interface KpiSingleUploadParams {
  tablename: string;
  uploadEndpoint: string;
  recordPayload: Record<string, any>;
  uploadStatus: "success" | "failed";
  uploadDurationMs: number;
  apiStatusCode?: number;
  apiResponseMessage?: string;
  createdRecordId?: string | number;
  errorMessage?: string;
  apiResponseBody?: string;
}
