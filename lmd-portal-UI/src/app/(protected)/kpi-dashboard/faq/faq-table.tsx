"use client";

import { Button } from "@/components/ui/button";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, Pencil1Icon } from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";
import EditFaqModal from "./editFaqModal";
import { Input } from "@/components/ui/input";

import SearchIcon from "@public/assets/icons/search.svg";
import MagnifyingWithCrossIcon from "@/components/icons/magnifying-with-cross";
import { isUserAllowed } from "@/utils/isUserAllowed";
import { useSession } from "next-auth/react";

export interface IFAQData {
  title: string;
  value: string;
}

const initialFAQData: IFAQData[] = [
  // {
  //   title: "sample",
  //   value:
  //     "<p><strong>hhhh</strong></p><p><br></p><ol><li><strong>hello</strong></li><li><strong>how are you?</strong></li></ol><blockquote><strong>can we do that now?</strong></blockquote>",
  // },
  {
    title: "What is the KPI dashboard? Who is it for?",
    value: `This 'dashboard' is a set of data tables, graphs and descriptions related to LMH's Key Performance Indicators (KPIs), 
      representing actual results compared to current targets and historical trends. This dashboard is meant for Last Mile 
      Health's leadership, country program teams (Liberia, Malawi, Ethiopia, and Sierra Leone), Board of Directors, and all staff 
      to review our progress against targets for our KPIs on a quarterly basis to identify and track priorities or any course 
      corrections needed to reach country KPI targets.`,
  },
  {
    title: "Where can I find it?",
    value: `
      <p>The KPI Dashboard can be found by clicking on this <a href="https://lastmilehealthdata.org/kpi-dashboard" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204);"><u>link</u></a>. 
      This is a live document and will reflect the most recent version of the KPI Dashboard. You can also find the dashboard by searching: "KPI Dashboard for Closing the Distance (FY24-28)" in the Google Shared Drive. 
      If you are interested in accessing the external version of the dashboard, please see the answer to the question below.</p>`,
  },
  {
    title: "How often is it updated?",
    value: `
      <p>The KPI Dashboard is updated on a quarterly basis and is typically ready about one month after the quarter ends (e.g., Q2 ends Dec 31 and the dashboard should be final by Feb 2). 
      This allows 3 weeks for country teams to finish data collection and entry and 1-2 weeks for the GMERL and programs teams to update the visuals and complete the narratives. Liberia typically 
      takes the full 3 weeks for data entry, whereas data from other countries are less complex and usually ready earlier. A schedule for updating the dashboard can be found in the '<a href="https://lastmilehealthdata.org/kpi-dashboard" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204);"><u>Coversheet</u></a>' tab.</p> `,
  },
  {
    title: "Can the KPI Dashboard be shared externally (outside of LMH staff)?",
    value: `
      <p>Each quarter, after the dashboard is complete, we make a copy for external use. We remove a few things for the external version, such as removing the variance tables (where targets and actual results are detailed and explanations for significant differences are provided) at the top of each country tab as they sometimes include notes that are more for internal purposes. 
      The external version of the dashboard is shared with the Partnerships &amp; Communication team for donor reporting and inclusion on the LMH website. <u>If you are ever sharing the dashboard with an external audience, please use the external version</u>. A new link is provided each quarter and can be found at the bottom of the <a href="https://lastmilehealth.org/impact/" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204);"><u>LMH Impact Page</u></a>.</p>
    `,
  },
  {
    title: "Who is responsible for updating the dashboard?",
    value: `
      The Global MERL team has overall responsibility for maintaining the KPI Dashboard and ensuring it is updated appropriately and on-time by country MERL and programs teams. Country MERL teams enter data into the respective 'Data Tables' tabs. Each KPI has a designated person responsible for entry and person/people responsible for approval. Once data has been entered and approved, the GMERL team updates the visuals and summary tables. The country MERL team then works with the programs teams to review all data in the dashboard, provide variance narratives in summary table, and review/update narratives for data visuals. GMERL provides a final review to ensure the dashboard is complete and creates the external version. This process is outlined in the schedule section of the 'Coversheet.'
    `,
  },
  {
    title:
      "What is the difference between annual, cumulative (FY24-28), and cumulative (all time) values?",
    value: `
      <ul>
        <li>Annual numbers are a reflection of programmatic activities in a given year, so the data provided is restricted to data collected during the fiscal year (July to June).
          <ul>
            <li>Sometimes the same individuals are being reached each year (e.g., all CHAs/CHSSs in the Liberia National Community Health Program are counted each year). However, some country programs reach new individuals or a combination of new/returning individuals each year (e.g., we only count the HEWs/Supervisors in Ethiopia for the year(s) they receive training)</li>
            <li>If you see "FY Actual" or "FY (or Annual) Target" written in the dashboard, it signifies that we are only capturing data from the fiscal year (FY). FY Actuals are typically displayed as dark blue bars, and FY targets are typically shown as light green boxes.</li>
          </ul>
        </li>
        <li>Cumulative FY24-28 numbers are a reflection of the programmatic activities during the Closing the Distance strategic period, so the data provided is restricted to data collected during the strategic period (from July 2023 to June 2028).
          <ul>
            <li>While community/frontline health workers may be supported multiple years during the strategy, they are only counted once for the strategic period cumulative value. This should be a reflection of the number of unique people supported or served during the strategic period.</li>
            <li>During year 1 of the strategic period (FY24), we are not displaying the cumulative FY24-28 data since it will be the same as year 1 annual data.</li>
          </ul>
        </li>
        <li>Cumulative (all time) numbers are a reflection of the programmatic activities since the start of our programmatic work in each country. See the question below regarding when we start counting cumulative (all time) data.
          <ul>
            <li>If you see "Cumulative Actual (since [year])" written in the dashboard, it signifies that we are showing the cumulative all time data – the year indicates when the programmatic activities contributing towards that KPI began. Cumulative actuals are typically displayed as purple lines. Cumulative targets are typically not displayed in the charts, but these can be found in the 'KPI Progress Summary' tab.</li>
          </ul>
        </li>
      </ul>
    `,
  },
  {
    title:
      "When does cumulative all-time begin– when a country program was founded at LMH, or are we pulling from additional figures for the all-time figure?",
    value: `
      Cumulative all-time for the cross-cutting KPIs would be whenever a country program started supporting community and frontline health workers (for example: 2020 for Ethiopia and Malawi; 2021 for Sierra Leone). For other project-specific KPIs, the cumulative data begins when the project or intervention was first deployed (e.g., blended learning in Ethiopia began in 2021; iCHIS in Malawi began in 2022; eCBIS in Liberia began in 2023). 
      Often the year for cumulative data is noted in the legend of the KPI visual and also mentioned in the narrative.
    `,
  },
  {
    title:
      "Have FY25 (year 2) and FY27 (year 4) targets been set? Where can I find them?",
    value: `
      We are currently working with country teams to draft FY25 and FY27 targets, which should be ready by the end of November. These will not be included in the KPI Dashboard at this time, but will be available to country and P&C teams for planning purposes and proposal development.
    `,
  },
  {
    title:
      "Can KPIs and targets be updated during the strategic period? What is the criteria for updating KPIs and targets? How are changes communicated?",
    value: `
      Revisions to KPIs and targets can be made throughout the strategic period based on updated country strategic priorities and annual plans. These changes will only be made once per year through a formalized process as part of annual planning. Requests for changes will first be recommended by country teams and then approved by Last Mile Health leadership, through a process facilitated by Global and country MERL teams. Changes outside of this formalized process will be considered on an ad-hoc basis if there are exceptional circumstances outside of LMH control. Criteria for updating KPIs and targets are outlined in the 'Coversheet' tab. All changes to KPIs and targets will be logged in the 'KPI Change Log' tab, along with the rationale for the change. 
    `,
  },
  {
    title:
      "Are we still tracking global learners who have accessed courses for health systems leaders (formally HSLD)?",
    value: `
      No, we are no longer tracking access to course content for health leaders (HSLD) as this work is currently deprioritized in all country programs. As programmatic activities are developed to target upskilling health leaders, appropriate project-level indicators can be developed, but these are not currently part of our KPIs. There are KPIs related to the training of community and frontline health workers under Upskill for all country programs (although Liberia and Sierra Leone will not be reporting on these KPIs in FY24).

    `,
  },
  {
    title:
      "Why is the KPI for treatments delivered under the Strengthen pillar instead of Deliver? This seems like a service delivery KPI.",
    value: `
      Treatments delivered nationally has always been a Strengthen level KPI. This is because the Strengthen pillar is related to the work we do nationally to support the National Community Health Program in Liberia, whereas Deliver focuses only on the direct service delivery in LMH-managed counties. In the past we had national number of treatments delivered under Strengthen (since we pulled data from managed and non-managed counties) and then the number of treatments delivered in LMH-managed counties only under Deliver. The Liberia team decided to only include the national/strengthen level KPI in this strategic period, although we still do disaggregate treatments delivered in managed vs non-managed counties.
    `,
  },
  {
    title:
      "Who has edit access for the KPI dashboard? How can I make edits if I don't have this access?",
    value: `
<p>Only a selected group of MERL and program staff are given access to edit the dashboard. The data tables tabs can only be edited by those who are responsible for data entry or approval. Selected programs staff also have edit access to the relevant country dashboard tabs in order to make edits to the narratives for the variance table and data visuals. Selected GMERL staff have edit access to the full dashboard. If you would like to make an edit to the dashboard but do not have access, you can include your suggested edit as a comment. If you need direct edit access, please reach out to your country MERL lead and Gideon Agbeshie
 (<a href="mailto:gagbeshie@lastmilehealth.org" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204);">gagbeshie@lastmilehealth.org</a>).</p>
    `,
  },
  {
    title:
      "How does the new KPI Dashboard (FY24-28) differ from the old KPI Dashboard (FY20-23)?",
    value: `
      <ul>
        <li>New KPIs for the Closing the Distance strategy period have been included (along with targets for years 1, 3, and 5) and retired KPIs have been removed</li>
        <li>The Cover Sheet has been revised and now provides more detail about the timeline and process for updating the dashboard, criteria for updating KPIs and targets, and a list of acronyms/abbreviations</li>
        <li>KPIs in the Progress Summary tab are now organized primarily by country program, with a section at the top that totals our reach for our two cross-cutting KPIs across all four LMH country programs.</li>
        <li>The formatting has been updated, with a focus on simplifying the data visuals and narratives. Most KPIs now have only one data visual, which may include both annual and cumulative values (where both values are of interest).</li>
        <li>A tab for Africa Frontline First (AFF) will be included beginning in Q2 to track progress against our AFF targets.</li>
        <li>Each country program now has its own tab for data entry to allow for more country ownership of KPI reporting.</li>
        <li>The KPI Change Log has been simplified, making it easier to use while still maintaining a record of any changes made to KPIs, targets, or actual numbers</li>
        <li>The Data Dictionary has been removed from the new dashboard as the information it holds is available in other parts of the dashboard</li>
      </ul>
    `,
  },
  {
    title: "What about Last Mile Data (LMD) 2.0?",
    value: `
      The data systems team (under GMERL) is currently working on the development of LMD 2.0. We expect that LMD 2.0 will be ready to house the KPI Dashboard beginning in FY25. In the meantime, the KPI Dashboard will be maintained as a Google spreadsheet, as linked above.
    `,
  },
  {
    title:
      "How can I get the horizontal span of the dashboard to fit my computer screen?",
    value: `
      <ul><li>Depending on the size and settings of your computer screen, you may or may not be able to see the full horizontal span of the dashboard all at the same time at the standard 100% page zoom of your web browser. </li><li>Reducing the zoom downwards will help fix this.</li></ul>

    `,
  },
];

export default function FAQtable() {
  const session = useSession();
  const inputRef = useRef(null);
  const [faqData, setFaqData] = useState<IFAQData[]>(initialFAQData);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleFaqUpdate = (updatedFaq: IFAQData, index: number) => {
    const updatedFAQs = faqData.map((item, idx) =>
      idx === index ? updatedFaq : item
    );
    setFaqData(updatedFAQs);
  };

  const filteredFaqData = faqData.filter(
    (data) =>
      data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex  justify-center border-b">
        <div className="w-[30rem] mb-3">
          <Input
            placeholder="Search frequently asked questions..."
            className="bg-gray-200 dark:bg-transparent active:bg-transparent focus:bg-transparent pl-9 rounded-[5px] dark:text-white w-full"
            wrapperClassName="h-[34px]"
            value={searchQuery}
            ref={inputRef}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixx={<SearchIcon width="15" height="19" viewBox="0 0 19 19" />}
            suffixx={
              searchQuery && (
                <Button
                  className="rounded-full text-xs"
                  variant={"link"}
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchQuery("");
                  }}
                >
                  clear
                </Button>
              )
            }
          />
        </div>
      </div>

      <div className="rounded-lg h-full  overflow-y-scroll py-5 px-4 flex flex-col items-center gap-4">
        {filteredFaqData.map((data, index) => (
          <Disclosure
            key={index}
            as={"div"}
            className={
              "active border border-border bg-background rounded-md w-full max-w-5xl"
            }
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between items-center rounded-md  px-4 py-2 text-left text-sm font-medium text-background hover:bg-none focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75 transition-all">
                  <span className="text-lg text-lmh-pink dark:text-gray-300 th-font-heavy">
                    {data.title}
                  </span>

                  <div>
                    <ChevronUpIcon
                      className={`${
                        !open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-lmh-pink dark:text-gray-300`}
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="w-full transition-[height] duration-500 flex justify-between">
                  <div className="px-6 ms-10 mb-4 border-s-2 pt-2 border-lmh-green">
                    <div
                      className="mb-2 faq-content"
                      dangerouslySetInnerHTML={{ __html: data.value }}
                    />
                    <style jsx global>{`
                      .faq-content ul {
                        list-style-type: disc;
                        margin-left: 20px;
                        margin-bottom: 10px;
                      }
                      .faq-content ul li {
                        margin-bottom: 8px;
                      }
                      .faq-content ul ul {
                        list-style-type: circle;
                        margin-left: 20px;
                        margin-top: 8px;
                      }
                    `}</style>
                    {/* {data.value} */}
                  </div>
                  <div className="mr-3">
                    {isUserAllowed(session.data!, [
                      "global_publisher",
                      "super_administrator",
                    ]) && (
                      <EditFaqModal
                        faqData={data}
                        onCloseModal={(updatedData: IFAQData) => {
                          handleFaqUpdate(updatedData, index); // Update the FAQ data
                          console.log("Submitted data:", updatedData);
                        }}
                      />
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}

        {filteredFaqData.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center pb-[5vh] ">
            <MagnifyingWithCrossIcon className="h-[5rem] w-[5rem] mb-4" />
            <p className="text-muted-foreground">
              No results found for your query
            </p>
          </div>
        )}
      </div>
    </>
  );
}
