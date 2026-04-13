import React from "react";
import NoDataFoundIcon from "@public/assets/icons/no-data-found.svg";
import KpiDataTableComponent from "../_components/KpiDataTableComponent";
import { metaObject } from "@/config/site.config";
import InfoBanner from "@/components/ui/banner/InfoBanner";

export const metadata = {
  ...metaObject("KPI Dashboard | KPI Data Tables"),
};

interface Props {
  params: {
    params?: string[];
  };
  searchParams: {
    country?: string;
    tablename?: string;
  };
}

const KpiDataUploadDashboardPage = ({ params, searchParams }: Props) => {
  const { country, tablename } = searchParams;

  if (!country || !tablename) {
    return (
      <div className="h-full flex flex-col gap-4 justify-between">
        <InfoBanner
          title="Using the KPI Data Table"
          description=""
          body={
            <>
              <div className=" py-2">
                <ul className="list-disc space-y-2 pl-5">
                  <li className="text-gray-800">
                    <span className="font-semibold">Select a Country</span> –
                    Choose your country of interest (e.g., Liberia, Malawi, or
                    Cross-Cutting)
                  </li>

                  <li className="text-gray-800">
                    <span className="font-semibold">
                      Select a KPI Data Table
                    </span>{" "}
                    – After selecting a country, choose the specific KPI table
                    you want to view
                  </li>

                  <li className="text-gray-800">
                    <span className="font-semibold">Search & Filters</span> –
                    These options are available only after a KPI data table is
                    selected and fully loaded
                  </li>

                  <li className="text-gray-800">
                    <span className="font-semibold">Need Help?</span> – Use the
                    support feature to report any bugs or request assistance
                  </li>

                  <li className="text-gray-800">
                    <span className="font-semibold">
                      Updating or Deleting Records
                    </span>{" "}
                    – You can only do that if you have elevated permissions.
                    Please contact support or open ticket if you need elevated
                    permissions or any help
                  </li>
                </ul>
              </div>
            </>
          }
        />
        <div className="border border-primary border-dashed bg-transparent rounded-md w-full h-full flex flex-col items-center justify-center">
          <NoDataFoundIcon />
          <span className="th-font-mediumOblique text-muted-foreground text-sm">
            No Data found, please select a{" "}
            <span className="th-font-heavyOblique">Country</span> and a{" "}
            <span className="th-font-heavyOblique">Tablename</span> above
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <KpiDataTableComponent />
    </>
  );
};

export default KpiDataUploadDashboardPage;
