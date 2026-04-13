import { useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { toast } from "sonner";
import { analytics } from "@/services/analytics";
import {
  bulkUpdateApprovalStatus,
  updateApprovalStatus,
} from "@/utils/kpi-approval-helpers";
import { generateFileName } from "@/utils/table-helpers";
import { downloadCSV } from "@/utils/file_reader_functions";
import { IUserPermissions } from "@/utils/app-permission-helpers";

const RETRYABLE_STATUSES = new Set([502, 503, 504]);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000; // 4 s — gives the cold-start service time to warm up

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempt = 0
): Promise<Response> {
  const res = await fetch(url, init);
  if (RETRYABLE_STATUSES.has(res.status) && attempt < MAX_RETRIES) {
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    return fetchWithRetry(url, init, attempt + 1);
  }
  return res;
}

export const APPROVAL_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "not_approved", label: "Not Approved" },
];

export interface ApprovalRecord {
  kpi_id: number;
  approval_status: "pending" | "approved" | "not_approved";
  entered_by: string;
  approved_by: string | null;
  last_update_date: string;
  updated_by: string | null;
}

interface DefaultColumns {
  [x: string]: any;
  id: number;
  last_update_date: string;
  date_inserted: string;
  approval_status?: "pending" | "approved" | "not_approved";
  entered_by?: string;
  approved_by?: string | null;
  updated_by?: string | null;
}

interface UseKpiDataTableProps<T extends DefaultColumns> {
  countryName: string;
  tableName: string;
  userEmail: string;
  permissions: IUserPermissions;
}

interface IDataFilters {
  keyword?: string;
  dataRange: { start: Date | null; end: Date | null };
}

interface ApiResponse<T> {
  data: T[];
  status: number;
  message: string;
}

const INITIAL_FILTERS: IDataFilters = {
  keyword: "",
  dataRange: { start: null, end: null },
};

export function useKpiDataTable<T extends DefaultColumns>({
  countryName,
  tableName,
  userEmail,
  permissions,
}: UseKpiDataTableProps<T>) {
  const gridRef = useRef<AgGridReact>(null);

  // State
  const [rowData, setRowData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataFilters, setDataFilters] = useState<IDataFilters>(INITIAL_FILTERS);
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Fetch data
  const fetchData = useCallback(
    async ({ refresh = false } = {}) => {
      setIsLoading(true);
      setIsRetrying(false);
      setError(null);

      let retryToastId: string | number | undefined;

      try {
        if (!countryName || !tableName) {
          throw new Error("Country name and table name are required");
        }

        // Wrap fetchWithRetry to surface retry state to the UI
        const fetchDataWithStatus = async (
          url: string,
          init: RequestInit
        ): Promise<Response> => {
          const res = await fetch(url, init);
          if (RETRYABLE_STATUSES.has(res.status)) {
            setIsRetrying(true);
            retryToastId = toast.loading(
              "Server is warming up — retrying automatically…"
            );
            return fetchWithRetry(url, init, 1); // already used attempt 0, start at 1
          }
          return res;
        };

        // Fetch dataset and approvals in parallel
        const [dataRes, approvalsRes] = await Promise.all([
          fetchDataWithStatus(
            `/proxy/kpi_data/${countryName}/${tableName}?page=1&per_page=999999`,
            { headers: { "Content-Type": "application/json" }, cache: "no-store" },
          ),
          fetchWithRetry(`/proxy/kpi_data/approvals/dataset/${tableName}`, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }).then((res) => {
            if (!res.ok) {
              analytics.trackApiRequest(
                `/proxy/kpi_data/approvals/dataset/${tableName}`,
                0,
                res.status
              );
            }
            return res;
          }).catch(() => null), // silently fail approvals without blocking
        ]);

        if (!dataRes.ok) {
          const status = dataRes.status;
          if (RETRYABLE_STATUSES.has(status)) {
            throw new Error(
              `The server is warming up and did not respond in time (${status}). Please try refreshing in a few seconds.`
            );
          }
          throw new Error(`Failed to load dataset (${status})`);
        }

        const dataset: ApiResponse<T> = await dataRes.json();

        let approvals: ApprovalRecord[] = [];
        if (approvalsRes?.ok) {
          approvals = await approvalsRes.json();
        }

        // Map approvals by kpi_id for quick lookup
        const approvalsMap = new Map(approvals.map((a) => [a.kpi_id, a]));

        // Merge approvals into dataset (fallback to "pending" if not available)
        const merged = dataset.data.map((row) => {
          const approval = approvalsMap.get(row.id);
          return {
            ...row,
            approval_status: approval?.approval_status ?? "pending",
            entered_by: approval?.entered_by ?? "",
            approved_by: approval?.approved_by ?? null,
            last_update_date:
              approval?.last_update_date ?? row.last_update_date,
            updated_by: approval?.updated_by ?? null,
          };
        });

        setRowData(merged);

        if (gridRef.current?.api) {
          gridRef.current.api.sizeColumnsToFit();
        }

        if (retryToastId !== undefined) {
          toast.dismiss(retryToastId);
          toast.success("Data loaded after server warm-up");
        } else if (refresh) {
          toast.success("Data refreshed successfully");
        }

        if (merged.length === 0) {
          toast.info("No records found");
        }
      } catch (err) {
        if (retryToastId !== undefined) toast.dismiss(retryToastId);
        const error = err as Error;
        const errorMessage = error.message || "Failed to fetch data";
        setError(errorMessage);
        toast.error(errorMessage);
        setRowData([]);
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    [countryName, tableName],
  );

  // Selection handler
  const onSelectionChanged = useCallback(() => {
    if (isBulkUpdating) return;
    const selected = gridRef.current?.api.getSelectedRows() || [];
    setSelectedRows(selected);
  }, [isBulkUpdating]);

  // Cell value change handler
  const onCellValueChanged = useCallback(
    async (event: any) => {
      if (event.colDef.field === "approval_status") {
        const recordId = event.data.id;
        const newStatus = event.newValue;
        const oldStatus = event.oldValue;

        try {
          await updateApprovalStatus({
            recordId,
            newStatus,
            tableName,
            approverEmail: userEmail,
            record: event.data,
            recipients: [
              "jdunyo@lastmilehealth.org",
              "gagbeshie@lastmilehealth.org",
              event.data.entered_by,
            ],
          });

          // Update state with new status
          setRowData((prevData) => {
            if (!prevData) return prevData;
            return prevData.map((row) =>
              row.id === recordId
                ? { ...row, approval_status: newStatus }
                : row,
            );
          });

          toast.success(`Approval status updated to ${newStatus}`);
        } catch (error) {
          // Rollback via state
          setRowData((prevData) => {
            if (!prevData) return prevData;
            return prevData.map((row) =>
              row.id === recordId
                ? { ...row, approval_status: oldStatus }
                : row,
            );
          });

          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update approval status";
          toast.error(errorMessage);
          setError(errorMessage);
        }
      }
    },
    [tableName, userEmail],
  );

  // Filter handler
  const onFilterTextBoxChanged = useCallback((value: string) => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("quickFilterText", value);
    }
  }, []);

  // Export CSV
  const onExportCSV = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    const downloadStartTime = performance.now();

    const visibleColIds = (api.getAllDisplayedColumns() ?? [])
      .map((c) => c.getColId())
      .filter((colId) => colId !== "actions");
    const fileName = generateFileName(tableName);

    const csv = api.getDataAsCsv({
      fileName,
      columnKeys: visibleColIds,
      processHeaderCallback: (params) =>
        params.column.getColDef().field ?? params.column.getColId(),
    });

    downloadCSV(csv!, fileName);

    const downloadDuration = performance.now() - downloadStartTime;

    const rowCount = api.getDisplayedRowCount();
    const columnCount = visibleColIds.length;
    const datasetSize = csv ? new Blob([csv]).size : 0;

    // Track the download event
    analytics.trackDatasetDownload(
      fileName,
      datasetSize,
      rowCount,
      columnCount,
      "csv",
      downloadDuration,
    );
  }, [tableName]);

  // Bulk actions
  const handleBulkDownload = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    const csv = api.getDataAsCsv({
      onlySelected: true,
      fileName: `${tableName}_selected`,
    });

    if (csv) {
      downloadCSV(csv, `${tableName}_selected`);
      toast.success(`Downloaded ${selectedRows.length} selected records`);
    }
  }, [tableName, selectedRows.length]);

  // const handleBulkStatusChange = useCallback(
  //   async (newStatus: "approved" | "pending" | "not_approved") => {
  //     if (!permissions.canApprove || selectedRows.length === 0) return;

  //     setIsBulkUpdating(true);

  //     try {
  //       const recordIds = selectedRows.map((row) => row.id);

  //       const result = await bulkUpdateApprovalStatus({
  //         recordIds,
  //         newStatus,
  //         tableName,
  //         approverEmail: userEmail,
  //         recipients: [
  //           "jdunyo@lastmilehealth.org",
  //           "gagbeshie@lastmilehealth.org",
  //           ...(selectedRows
  //             .map((row) => row.entered_by)
  //             .filter(Boolean) as string[]),
  //         ],
  //       });

  //       const statusLabel = APPROVAL_STATUS_OPTIONS.find(
  //         (opt) => opt.value === newStatus,
  //       )?.label;
  //       toast.success(
  //         `${selectedRows.length} records marked as ${statusLabel}`,
  //       );
  //       await fetchData({ refresh: true });
  //       setSelectedRows([]);
  //     } catch (error) {
  //       toast.error("Bulk status change failed");
  //     } finally {
  //       setIsBulkUpdating(false);
  //     }
  //   },
  //   [selectedRows, permissions.canApprove, tableName, userEmail, fetchData],
  // );

  const handleBulkStatusChange = useCallback(
    async (newStatus: "approved" | "pending" | "not_approved") => {
      if (
        !permissions.canApprove ||
        selectedRows.length === 0 ||
        isBulkUpdating
      )
        return;

      setIsBulkUpdating(true);

      const recordIds = selectedRows.map((row) => row.id);
      const statusLabel = APPROVAL_STATUS_OPTIONS.find(
        (opt) => opt.value === newStatus,
      )?.label;

      const updatePromise = bulkUpdateApprovalStatus({
        recordIds,
        newStatus,
        tableName,
        approverEmail: userEmail,
        recipients: [
          "jdunyo@lastmilehealth.org",
          "gagbeshie@lastmilehealth.org",
          ...(selectedRows
            .map((row) => row.entered_by)
            .filter(Boolean) as string[]),
        ],
      }).then(async () => {
        await fetchData({ refresh: true });
        setSelectedRows([]);
      });

      toast.promise(updatePromise, {
        loading: `Updating ${selectedRows.length} records...`,
        success: `${selectedRows.length} records marked as ${statusLabel}`,
        error: "Bulk status change failed",
        finally: () => setIsBulkUpdating(false),
      });
    },
    [
      selectedRows,
      permissions.canApprove,
      tableName,
      userEmail,
      fetchData,
      isBulkUpdating,
    ],
  );

  const handleBulkApprove = useCallback(async () => {
    await handleBulkStatusChange("approved");
  }, [handleBulkStatusChange]);

  const handleBulkDelete = useCallback(async () => {
    if (!permissions.canDelete || selectedRows.length === 0) return;

    // TODO: Implement bulk delete logic
    toast.info("Bulk delete functionality coming soon");
  }, [selectedRows, permissions.canDelete]);

  const handleDeselectRow = useCallback(
    (rowId: number) => {
      const api = gridRef.current?.api;
      if (!api) return;

      api.forEachNode((node) => {
        if (node.data?.id === rowId) {
          node.setSelected(false);
        }
      });
    },
    [gridRef],
  );

  // Column visibility
  const setColumnVisible = useCallback(
    (fieldOrId: string, visible: boolean) => {
      const api = gridRef.current?.api;
      if (!api) return;
      api.setColumnsVisible([fieldOrId], visible);
    },
    [],
  );

  const getVisibleFields = useCallback(() => {
    const displayedCols = gridRef.current?.api?.getAllDisplayedColumns() ?? [];
    return displayedCols.map((c) => c.getColId());
  }, []);

  const handleToggleColumn = useCallback(
    (field: string, checked: boolean) => {
      setColumnVisible(field, checked);
      setVisibleFields(getVisibleFields());
      if (gridRef.current) {
        gridRef.current.api.sizeColumnsToFit();
      }
    },
    [setColumnVisible, getVisibleFields],
  );

  const refreshData = useCallback(async () => {
    await fetchData({ refresh: true });
  }, [fetchData]);

  const onGridReady = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (gridRef.current) {
      setVisibleFields(getVisibleFields());
    }
  }, [rowData, getVisibleFields]);

  return {
    // Refs
    gridRef,

    // State
    rowData,
    isLoading,
    isRetrying,
    error,
    dataFilters,
    setDataFilters,
    visibleFields,
    selectedRows,

    // Handlers
    onSelectionChanged,
    onCellValueChanged,
    onFilterTextBoxChanged,
    onExportCSV,
    onGridReady,
    refreshData,
    handleToggleColumn,

    // Bulk actions
    handleBulkDownload,
    handleBulkApprove,
    handleBulkDelete,
    handleBulkStatusChange,
    isBulkUpdating,

    // Constants
    INITIAL_FILTERS,
  };
}
