import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { updateApprovalStatus } from "@/utils/kpi-approval-helpers";
import { analytics } from "@/services/analytics";

export interface KpiRow {
  id: number;
  last_update_date: string | null;
  date_inserted: string | null;
  approval_status: "pending" | "approved" | "not_approved";
  entered_by?: string;
  approved_by?: string | null;
  updated_by?: string | null;
  [key: string]: any; // other KPI-specific fields
}

export interface ApprovalRecord {
  kpi_id: number;
  approval_status: "pending" | "approved" | "not_approved";
  entered_by: string;
  approved_by: string | null;
  last_update_date: string;
  updated_by: string | null;
}

interface UseKpiDataParams {
  countryName: string;
  tableName: string;
  userEmail?: string;
}

export const useKpiData = ({
  countryName,
  tableName,
  userEmail,
}: UseKpiDataParams) => {
  const [rowData, setRowData] = useState<KpiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!countryName || !tableName)
        throw new Error("Missing country or table");

      // Fetch KPIs
      const res = await fetch(
        `/proxy/kpi_data/${countryName}/${tableName}?page=1&per_page=1000`
      );
      if (!res.ok) throw new Error(`Dataset error: ${res.status}`);
      const data = (await res.json()) as { data: KpiRow[] };

      // Fetch approvals
      let approvals: ApprovalRecord[] = [];
      try {
        const appRes = await fetch(
          `/proxy/kpi_data/approvals/dataset/${tableName}`
        );
        if (appRes.ok) {
          approvals = await appRes.json();
        } else {
          analytics.trackApiRequest(
            `/proxy/kpi_data/approvals/dataset/${tableName}`,
            0,
            appRes.status
          );
        }
      } catch {}

      const approvalsMap = new Map(approvals.map((a) => [a.kpi_id, a]));
      const merged = data.data.map((row) => ({
        ...row,
        approval_status: approvalsMap.get(row.id)?.approval_status ?? "pending",
        entered_by: approvalsMap.get(row.id)?.entered_by ?? "",
        approved_by: approvalsMap.get(row.id)?.approved_by ?? null,
        last_update_date:
          approvalsMap.get(row.id)?.last_update_date ?? row.last_update_date,
        updated_by: approvalsMap.get(row.id)?.updated_by ?? null,
      }));

      setRowData(merged);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [countryName, tableName]);

  const updateApproval = useCallback(
    async (recordId: number, newStatus: KpiRow["approval_status"]) => {
      const oldRow = rowData.find((r) => r.id === recordId);
      if (!oldRow) return;

      setRowData((prev) =>
        prev.map((r) =>
          r.id === recordId ? { ...r, approval_status: newStatus } : r
        )
      );

      try {
        await updateApprovalStatus({
          recordId,
          newStatus,
          tableName,
          approverEmail: userEmail ?? "",
          record: oldRow,
          recipients: [oldRow.entered_by!],
        });
        toast.success(`Status updated to ${newStatus}`);
      } catch (err) {
        setRowData((prev) =>
          prev.map((r) =>
            r.id === recordId
              ? { ...r, approval_status: oldRow.approval_status }
              : r
          )
        );
        toast.error(
          err instanceof Error ? err.message : "Failed to update approval"
        );
      }
    },
    [rowData, tableName, userEmail]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { rowData, loading, error, fetchData, updateApproval, setRowData };
};
