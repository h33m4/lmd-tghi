import React from "react";
import KpiTopNavBar from "./components/KpiTopNavBar";
import KpiDisclosure, { ICriteriaDataType } from "./components/KpiDisclosure";
import SupportButton from "./components/SupportButton";
import { AcronymsTable } from "./components/AcronymsTable";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | Overview"),
};

const KpiDashboardOverViewPage = () => {
  const CriteriaData: ICriteriaDataType[] = [
    {
      title: "Criteria for Adding New KPIs",
      items: [
        "Reflects long-term commitments (i.e., not one-time activities)",
        "Aligns with country strategic priorities and outcomes or impact in the theory of change",
        "Provides a meaningful representation of project scale, depth, or quality",
        "Has a feasible and reliable measurement method (i.e., consistently able to measure using the same methods under the same circumstances during the remainder of the strategic period)",
      ],
    },
    {
      title: "Criteria for Retiring Existing KPIs",
      items: [
        "A replacement KPI is developed that provides an improved measure of quality (replacing a prior KPI)",
        "The programmatic work contributing to the KPI has been deprioritized for the remainder of the strategic period",
      ],
    },
    {
      title: "Criteria for Revising Targets",
      items: [
        "The programmatic work contributing to the KPI has been reduced in scope or scale (may be due to decisions based on funding, level of impact, or MOH prioritization)",
        "Additional programmatic work is planned that will increase the target",
        "Over performance by >40%",
        "Change in data source or method of calculation that impacts target",
        "New KPI with no historical data and the first year of data collection provides additional context for target setting",
      ],
      notes:
        "Note that target setting for years 1, 3, and 5 of the strategic period originally occurred in December 2022 before FY23 baseline values were finalized. Changes to targets were allowed before FY24 Q1 reporting to account for variations in anticipated vs. actual FY23 baseline values.",
    },
    {
      title: "Criteria for Retiring Existing KPIs",
      items: [
        "Issues were identified in previously reported data",
        "Definitions or calculations were revised resulting in a change to previously reported actuals values",
      ],
      notes:
        "Note that we will only log changes in the &apos;KPI Change Log&apos; for end of fiscal year actuals that have been revised (if quarterly actuals are corrected during the year, those will not be logged)",
    },
  ];
  return (
    <>
      <KpiTopNavBar dashboardName="Overview" />
      <div className=" border border-primary dark:border-border rounded-lg h-full bg-background overflow-y-scroll py-5 px-4 flex flex-col gap-12">
        {/* overview */}
        <div className="">
          <h1 className="th-lmh-header-1">KPI Dashboard Overview</h1>
          <ul className="list-disc space-y-4 text-lmh-dark-grey dark:text-gray-300 th-font-roman px-4">
            <li>
              <span className="th-font-medium text-primary text-lg">
                Purpose
              </span>
              : This dashboard is for Last Mile Health&apos;s leadership,
              country program teams (Liberia, Malawi, Ethiopia, and Sierra
              Leone), Board of Directors, and all staff to review our progress
              against targets for our KPIs on a quarterly basis to identify and
              track priorities or any course corrections needed to reach country
              KPI targets.
            </li>

            <li>
              <span className="th-font-medium text-primary text-lg">
                Process
              </span>
              : The Monitoring, Evaluation, Research and Learning team collects
              data across our programs in order to report progress against KPI
              targets in the data dashboard. The dashboard is categorized by
              country program, with indicators organized based on the level of
              the theory of change they relate to. A data review and use process
              was developed to ensure KPIs are reviewed and learnings are used
              to inform program quality improvement and strategic decisions.
            </li>
          </ul>

          <p className="mt-4 mb-1 text-lmh-dark-grey dark:text-gray-300 th-font-roman ">
            The dashboard is updated quarterly. The data review and use process
            occurs on a biannual basis with the first data review for FY Q1 and
            Q2 beginning in January and ending in February and the second data
            review for FY Q3 & Q4 beginning in July and ending in August. The
            steps in this process are detailed below:
          </p>
          <ol className="list-decimal px-8 space-y-1 text-lmh-dark-grey dark:text-gray-300 th-font-book text-md">
            <li>
              Data are entered by MERL staff who manage the KPI data source,
              data are reviewed by the approver, data visuals and accompanying
              narrative are updated, and programs reviews/approves the
              dashboard.
            </li>
            <li>
              MERL team members for each country program hold a data review with
              program teams on a bi-annual basis.
            </li>
            <li>
              Learnings from data reviews are used to inform program adaptation
              and design. These findings may also be shared in other forums
              (e.g., country deep dives, leadership council, or board of
              director meetings).
            </li>
          </ol>
        </div>

        {/* navigating the dashboard */}
        <div>
          <h1 className="th-lmh-header-1">
            Criteria for Modifying KPIs and Targets
          </h1>

          <div className="flex flex-wrap gap-8 px-0 items-center justify-center  text-lmh-dark-grey dark:text-gray-300 th-font-roman w-full ">
            <p>
              Revisions to KPIs and targets can be made throughout the strategic
              period based on updated country strategic priorities and annual
              plans. These changes will only be made once per year through a
              formalized process as part of annual planning. Requests for
              changes will first be recommended by country teams and then
              approved by Last Mile Health leadership, through a process
              facilitated by Global and country MERL teams. Changes outside of
              this formalized process will be considered on an ad-hoc basis if
              there are exceptional circumstances outside of LMH control. All
              changes to KPIs and targets will be logged in the &apos;KPI Change
              Log&apos; tab, along with the rationale for the change.
            </p>

            <KpiDisclosure data={CriteriaData} />

            <div className="h-[0rem]"></div>
          </div>
        </div>

        <div>
          <h1 className="th-lmh-header-1">Acronyms</h1>
          <AcronymsTable />
        </div>
      </div>

      <SupportButton />
    </>
  );
};

export default KpiDashboardOverViewPage;
