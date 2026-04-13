// services/analytics/index.tsx
import {
  AnalyticsEvent,
  KpiBulkUploadParams,
  KpiSingleUploadParams,
} from "@/types/analytics";
import { getUserLocation } from "./locationData";

const ANALYTICS_ENDPOINT = `${process.env.NEXT_PUBLIC_LMD_API}/portal_events`;

/**
 * Service to track and send analytics events
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private userInfo: { id: string; email: string } | null = null;
  private isServerSide: boolean = typeof window === "undefined";

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get singleton instance of AnalyticsService
   */
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize the analytics service with user information
   */
  public init(userId: string, userEmail: string): void {
    this.userInfo = { id: userId, email: userEmail };
  }

  /**
   * Reset user information (e.g., on logout)
   */
  public reset(): void {
    this.userInfo = null;
  }

  /**
   * Get the current page URL for tracking purposes
   * @returns The current URL or an empty string if on server side
   */
  private getCurrentPageUrl(): string {
    return this.isServerSide
      ? "https://lastmilehealthdata.org/"
      : window.location.href;
  }

  /**
   * Detect device type (Desktop/Mobile/Tablet)
   */
  private detectDeviceType(): "Desktop" | "Mobile" | "Tablet" | "Unknown" {
    if (this.isServerSide) return "Unknown";

    const userAgent = navigator.userAgent;

    // Check for mobile devices
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )
    ) {
      // Check specifically for tablets
      if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) {
        return "Tablet";
      }
      return "Mobile";
    }

    return "Desktop";
  }

  /**
   * Detect operating system
   */
  private detectDeviceOS():
    | "macOS"
    | "Windows"
    | "Linux"
    | "iOS"
    | "Android"
    | "Other" {
    if (this.isServerSide) return "Other";

    const userAgent = navigator.userAgent;

    if (/Macintosh|Mac OS X/i.test(userAgent)) return "macOS";
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Linux/i.test(userAgent)) return "Linux";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
    if (/Android/i.test(userAgent)) return "Android";

    return "Other";
  }

  /**
   * Detect browser
   */
  private detectBrowser():
    | "Chrome"
    | "Safari"
    | "Firefox"
    | "Edge"
    | "Opera"
    | "Other" {
    if (this.isServerSide) return "Other";

    const userAgent = navigator.userAgent;

    if (/Chrome/i.test(userAgent) && !/Edg|OPR/i.test(userAgent))
      return "Chrome";
    if (/Firefox/i.test(userAgent)) return "Firefox";
    if (/Safari/i.test(userAgent) && !/Chrome|Edg|OPR/i.test(userAgent))
      return "Safari";
    if (/Edg/i.test(userAgent)) return "Edge";
    if (/OPR/i.test(userAgent)) return "Opera";

    return "Other";
  }

  /**
   * Track a login event
   */
  public trackLogin(
    loginType: "google" | "password",
    redirectUrl?: string
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const pageUrl = redirectUrl || this.getCurrentPageUrl();

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "login",
      LoginType: loginType,
      PageURL: pageUrl,
      Timestamp: new Date().toISOString(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a page view event with device information
   */
  public async trackPageView(
    pageUrl: string,
    loadTime?: number
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }
    const locationInfo = await getUserLocation();
    // console.log("ll", locationInfo);

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "page",
      PageURL: pageUrl,
      // Include device information
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
      ...(loadTime !== undefined && { LoadTime: loadTime }),
      ...(locationInfo !== undefined && { ...locationInfo }),
      Timestamp: new Date().toISOString(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a search event
   */
  public trackSearch(searchQuery: string, resultsCount: number): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "search",
      SearchQuery: searchQuery,
      ResultsCount: resultsCount,
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),

      // Include device information
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a session event
   */
  public async trackSession(
    sessionStartTime: string,
    sessionEndTime: string,
    sessionDuration: number,
    deviceInfo: string,
    browserInfo: string
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const locationInfo = await getUserLocation();

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "session",
      SessionStartTime: sessionStartTime,
      SessionEndTime: sessionEndTime,
      SessionDuration: sessionDuration,
      ...(locationInfo !== undefined && { ...locationInfo }),
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track an API request event
   */
  public trackApiRequest(
    endpointUrl: string,
    responseTime: number,
    statusCode: number
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "apiRequest",
      EndpointUrl: endpointUrl,
      ResponseTime: responseTime,
      StatusCode: statusCode,
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a sinlge dataset upload event with detailed metrics
   */
  public trackSingleDatasetUpload(
    datasetName: string,
    datasetSize: number,
    uploadEndpoint: string,
    uploadDuration?: string,
    uploadStatus?: "success" | "failed",
    errorMessage?: string,
    datasetJsonString?: string
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "singleDatasetUpload",
      DatasetName: datasetName,
      DatasetSize: datasetSize,
      UploadEndpoint: uploadEndpoint,
      DatasetJson: datasetJsonString,
      ...(uploadDuration !== undefined && { UploadDuration: uploadDuration }),
      ...(uploadStatus !== undefined && { UploadStatus: uploadStatus }),
      ...(errorMessage !== undefined && { ErrorMessage: errorMessage }),
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),

      // Include device information
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a dataset upload event with detailed metrics
   */
  public trackDatasetUpload(
    datasetName: string,
    datasetSize: number,
    uploadEndpoint: string,
    uploadDuration?: string,
    uploadStatus?: "success" | "failed",
    errorMessage?: string,
    datasetJsonString?: string
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "datasetUpload",
      DatasetName: datasetName,
      DatasetSize: datasetSize,
      UploadEndpoint: uploadEndpoint,
      DatasetJson: datasetJsonString,
      ...(uploadDuration !== undefined && { UploadDuration: uploadDuration }),
      ...(uploadStatus !== undefined && { UploadStatus: uploadStatus }),
      ...(errorMessage !== undefined && { ErrorMessage: errorMessage }),
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),

      // Include device information
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a KPI bulk CSV upload (file upload flow)
   */
  public trackKpiBulkUpload(params: KpiBulkUploadParams): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "kpiBulkUpload",
      Tablename: params.tablename,
      FileName: params.fileName,
      FileSizeBytes: params.fileSizeBytes,
      RowCount: params.rowCount,
      ColumnNames: params.columnNames.join(", "),
      ColumnCount: params.columnNames.length,
      UploadEndpoint: params.uploadEndpoint,
      UploadStatus: params.uploadStatus,
      UploadDurationMs: params.uploadDurationMs,
      ...(params.datasetJson !== undefined && {
        DatasetJson: params.datasetJson,
      }),
      ...(params.apiStatusCode !== undefined && {
        ApiStatusCode: params.apiStatusCode,
      }),
      ...(params.apiResponseMessage !== undefined && {
        ApiResponseMessage: params.apiResponseMessage,
      }),
      ...(params.errorMessage !== undefined && {
        ErrorMessage: params.errorMessage,
      }),
      ...(params.apiResponseBody !== undefined && {
        ApiResponseBody: params.apiResponseBody,
      }),
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a KPI single record upload (form submission flow)
   */
  public trackKpiSingleUpload(params: KpiSingleUploadParams): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "kpiSingleUpload",
      Tablename: params.tablename,
      UploadEndpoint: params.uploadEndpoint,
      RecordPayload: JSON.stringify(params.recordPayload),
      FieldCount: Object.keys(params.recordPayload).length,
      UploadStatus: params.uploadStatus,
      UploadDurationMs: params.uploadDurationMs,
      ...(params.apiStatusCode !== undefined && {
        ApiStatusCode: params.apiStatusCode,
      }),
      ...(params.apiResponseMessage !== undefined && {
        ApiResponseMessage: params.apiResponseMessage,
      }),
      ...(params.createdRecordId !== undefined && {
        CreatedRecordId: String(params.createdRecordId),
      }),
      ...(params.errorMessage !== undefined && {
        ErrorMessage: params.errorMessage,
      }),
      ...(params.apiResponseBody !== undefined && {
        ApiResponseBody: params.apiResponseBody,
      }),
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a dataset download event
   */
  public trackDatasetDownload(
    datasetName: string,
    datasetSize: number,
    rowCount?: number,
    columnCount?: number,
    fileFormat?: string,
    downloadDuration?: number
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "datasetDownload",
      DatasetName: datasetName,
      DatasetSize: datasetSize,
      downloadDuration: String(downloadDuration),
      ...(rowCount !== undefined && { RowCount: rowCount }),
      ...(columnCount !== undefined && { ColumnCount: columnCount }),
      ...(fileFormat !== undefined && { FileFormat: fileFormat }),
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),

      // Include device information
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a dataset edit/update event with before and after data
   */
  public trackDatasetEdit(
    datasetName: string,
    recordId: string | number,
    oldData: string,
    newData: string,
    editEndpoint: string,
    editDuration?: string,
    editStatus?: "success" | "failed",
    errorMessage?: string
  ): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    console.log("---------dddd");

    // Parse the strings to calculate what changed
    let changedFields: string[] = [];
    let changes: Record<string, { old: any; new: any }> = {};
    let numberOfFieldsChanged = 0;

    try {
      const oldDataObj = JSON.parse(oldData);
      const newDataObj = JSON.parse(newData);

      changedFields = Object.keys(newDataObj).filter(
        (key) =>
          JSON.stringify(oldDataObj[key]) !== JSON.stringify(newDataObj[key])
      );

      changes = changedFields.reduce((acc, key) => {
        acc[key] = {
          old: oldDataObj[key],
          new: newDataObj[key],
        };
        return acc;
      }, {} as Record<string, { old: any; new: any }>);

      numberOfFieldsChanged = changedFields.length;
    } catch (error) {
      console.error("Error parsing data for change detection:", error);
    }

    const event = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      EventType: "datasetEdit",
      DatasetName: datasetName,
      RecordId: String(recordId),
      EditEndpoint: editEndpoint,
      OldData: oldData,
      NewData: newData,
      ChangedFields: changedFields.join(", "),
      Changes: JSON.stringify(changes),
      NumberOfFieldsChanged: numberOfFieldsChanged,
      ...(editDuration !== undefined && { EditDuration: editDuration }),
      ...(editStatus !== undefined && { EditStatus: editStatus }),
      ...(errorMessage !== undefined && { ErrorMessage: errorMessage }),
      PageURL: this.getCurrentPageUrl(),
      Timestamp: new Date().toISOString(),

      // Include device information
      DeviceType: this.detectDeviceType(),
      DeviceOS: this.detectDeviceOS(),
      DeviceBrowser: this.detectBrowser(),
    };

    return this.sendEvent(event);
  }

  /**
   * Track a custom event
   */
  public trackCustomEvent(event: Partial<AnalyticsEvent>): Promise<void> {
    if (!this.userInfo) {
      console.error("Analytics service not initialized with user info");
      return Promise.resolve();
    }

    const fullEvent = {
      UserID: this.userInfo.id,
      UserEmail: this.userInfo.email,
      Timestamp: new Date().toISOString(),
      PageURL: event.PageURL || this.getCurrentPageUrl(),
      ...event,
    } as AnalyticsEvent;

    return this.sendEvent(fullEvent);
  }

  /**
   * Send event to analytics endpoint
   */
  private async sendEvent(event: any): Promise<void> {
    // console.warn("event", event);
    // Skip in server-side environment
    // if (this.isServerSide) {
    //   console.warn("Analytics tracking attempted on server side, skipping");
    //   return;
    // }

    try {
      // Validate event to ensure correct structure
      if (!event.EventType) {
        throw new Error("EventType is required");
      }

      // Ensure PageURL is present for all events
      if (!event.PageURL) {
        event.PageURL = this.getCurrentPageUrl();
        console.warn(
          `PageURL was missing for ${event.EventType} event, added automatically`
        );
      }

      const response = await fetch(ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Analytics event failed to send: ${response.status}`);
      }

      // console.log("event response=====> ", response);
    } catch (error) {
      // Don't break the app if analytics fails
      console.error("Failed to send analytics event:", error);

      // For debugging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Event that failed to send:", event);
      }
    }
  }
}

// Export a singleton instance
export const analytics = AnalyticsService.getInstance();
