import Banner from "@/components/ui/banner/banner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IApprovalData {
  kpi_id: number;
  kpi_dataset_id: string;
  approval_status: "approved" | "not_approved" | "pending" | string;
  approved_by: string | null;
  entered_by: string;
  last_update_date: string;
  date_inserted: string;
  updated_by: string | null;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "Not available";

export const ApprovalInfoBanner: React.FC<{ data: IApprovalData }> = ({
  data,
}) => {
  const statusMeta = {
    approved: {
      label: "Approved",
      badge: "bg-green-600 text-white",
      variant: "success",
    },
    not_approved: {
      label: "Rejected",
      badge: "bg-red-600 text-white",
      variant: "error",
    },
    pending: {
      label: "Pending",
      badge: "bg-amber-500 text-white",
      variant: "info",
    },
  } as const;

  const meta =
    statusMeta[data.approval_status as keyof typeof statusMeta] ??
    statusMeta.pending;

  return (
    <Banner
      collapsible
      defaultOpen={false}
      variant={meta.variant}
      title="Approval Metadata"
      description=""
      closable={false}
      className="mb-4"
      body={
        <div className="w-full space-y-4">
          {/* Status Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Status
              </span>
              <Badge className={cn(meta.badge, "py-0.5")}>{meta.label}</Badge>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto ">
            <table className="w-full text-[13px]">
              <tbody>
                <tr className="border-none">
                  <td className="px-1 py-0.5  font-medium text-muted-foreground bg-muted/30  w-1/4">
                    {data.approval_status === "not_approved"
                      ? "Reviewed By:"
                      : "Approved By:"}
                  </td>
                  <td className="px-1 py-0.5  font-semibold  w-1/4">
                    {data.approval_status === "pending"
                      ? "Not yet reviewed"
                      : data.approved_by || "Not available"}
                  </td>
                  <td className="px-1 py-0.5  font-medium text-muted-foreground bg-muted/30  w-1/4">
                    Approval Date:
                  </td>
                  <td className="px-1 py-0.5  w-1/4">
                    {formatDate(data.last_update_date)}
                  </td>
                </tr>
                <tr className="border-none">
                  <td className="px-1 py-0.5  font-medium text-muted-foreground bg-muted/30 ">
                    Entered By:
                  </td>
                  <td className="px-1 py-0.5  font-semibold ">
                    {data.entered_by || "Unknown"}
                  </td>
                  <td className="px-1 py-0.5  font-medium text-muted-foreground bg-muted/30 ">
                    Date Inserted:
                  </td>
                  <td className="px-1 py-0.5 ">
                    {formatDate(data.date_inserted)}
                  </td>
                </tr>
                <tr>
                  <td className="px-1 py-0.5  font-medium text-muted-foreground bg-muted/30 ">
                    Updated By:
                  </td>
                  <td className="px-1 py-0.5  ">
                    {data.updated_by || "Not available"}
                  </td>
                  <td className="px-1 py-0.5  font-medium text-muted-foreground bg-muted/30 ">
                    Last Updated:
                  </td>
                  <td className="px-1 py-0.5 ">
                    {formatDate(data.last_update_date)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }
    />
  );
};
