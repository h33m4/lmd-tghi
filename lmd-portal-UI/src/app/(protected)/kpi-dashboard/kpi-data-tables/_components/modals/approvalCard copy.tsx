import Banner from "@/components/ui/banner/banner";
import { Badge } from "@/components/ui/badge";

interface IApprovalData {
  kpi_id: number;
  kpi_dataset_id: string;
  approval_status: string;
  approved_by: string | null;
  entered_by: string;
  last_update_date: string;
  date_inserted: string;
  updated_by: string | null;
}

export const ApprovalInfoBanner: React.FC<{ data: IApprovalData }> = ({
  data,
}) => {
  // Pick badge style based on status
  const getStatusBadge = () => {
    switch (data.approval_status) {
      case "approved":
        return <Badge className="bg-green-600 text-white">Approved</Badge>;
      case "not_approved":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500 text-white">Pending</Badge>;
    }
  };

  // Pick banner variant based on status
  const getBannerVariant = () => {
    switch (data.approval_status) {
      case "approved":
        return "success";
      case "not_approved":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <Banner
      collapsible
      defaultOpen={false}
      variant={getBannerVariant()}
      title="Approval Metadata"
      description=""
      closable={false}
      className="mb-4"
      body={
        <div className="w-full flex flex-row justify-between gap-6">
          {/* Left Column */}
          <dl className="text-sm space-y-2 w-full">
            <div>
              <dt className="font-semibold">Approval Status:</dt>
              <dd>{getStatusBadge()}</dd>
            </div>

            <div>
              <dt className="font-semibold">Date Inserted:</dt>
              <dd>
                {data.date_inserted
                  ? new Date(data.date_inserted).toLocaleString()
                  : "Not available"}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Last Updated:</dt>
              <dd>
                {data.last_update_date
                  ? new Date(data.last_update_date).toLocaleString()
                  : "Not available"}
              </dd>
            </div>
          </dl>

          {/* Right Column */}
          <dl className="text-sm space-y-2 w-full">
            <div className="flex gap-4">
              <div>
                <dt className="font-semibold">
                  {data.approval_status === "not_approved"
                    ? "Reviewed By:"
                    : "Approved By:"}
                </dt>
                <dd>
                  {data.approval_status === "pending"
                    ? "Not yet reviewed"
                    : data.approved_by || "Not available"}
                </dd>
              </div>

              <div>
                <dt className="font-semibold">Approval Date:</dt>
                <dd>
                  {data.last_update_date
                    ? new Date(data.last_update_date).toLocaleString()
                    : "Not available"}
                </dd>
              </div>
            </div>

            <div>
              <dt className="font-semibold">Entered By:</dt>
              <dd>{data.entered_by || "Unknown"}</dd>
            </div>

            <div>
              <dt className="font-semibold">Updated By:</dt>
              <dd>{data.updated_by || "Not available"}</dd>
            </div>
          </dl>
        </div>
      }
    />
  );
};
