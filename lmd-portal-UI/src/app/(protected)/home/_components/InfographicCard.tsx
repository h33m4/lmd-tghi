import React from "react";

// icons
import IndicatorIcon1 from "../../../../../public/assets/icons/indicators/lmh-indicator-1.svg";
import IndicatorIcon2 from "../../../../../public/assets/icons/indicators/lmh-indicator-2.svg";
import Counter from "@/components/ui/Countup";

type Props = {
  indictorType: "Peopled Served" | "Number of CHW";
  cummulative: number | string;
  targetAchieved: number;
  annual: number;
  fy: string;
};

const InfoStats = ({
  value,
  title,
  orientation = "right",
  themeColor = "green",
}: {
  value: number | string;
  title: string;
  orientation?: "left" | "right";
  themeColor?: "pink" | "blue" | "green";
}) => {
  return (
    <div
      className={`flex flex-col ${
        orientation === "right" ? "items-end" : "items-start"
      }`}
    >
      <h1
        className={`text-2xl md:text-3xl th-font-heavy 
        ${themeColor === "blue" && "text-primary"}
        ${themeColor === "pink" && "text-lmh-pink"}
        ${themeColor === "green" && "text-lmh-green"}
        
        `}
      >
        {value === "N/A" ? (
          "N/A"
        ) : (
          <Counter
            end={Number(value)}
            decimals={title.includes("Target") ? 0 : undefined}
          />
        )}{" "}
        {title.includes("Target") && "%"}
      </h1>
      <p className="text-muted-foreground text-sm th-font-book">{title}</p>
    </div>
  );
};

const InfographicCard = ({
  indictorType,
  annual,
  cummulative,
  targetAchieved,
  fy,
}: Props) => {
  return (
    <div className="bg-background  flex flex-col gap-2 py-3 px-4 rounded-[15px] border th-lmh-box-shadow">
      <div className="flex justify-between items-center w-full">
        {indictorType === "Peopled Served" ? (
          <IndicatorIcon1 />
        ) : (
          <IndicatorIcon2 />
        )}
        <InfoStats
          title={`Annual (${fy})`}
          value={annual}
          themeColor={"blue"}
        />
      </div>
      <div className="flex justify-between">
        <InfoStats
          title="Cumulative (since 2020)"
          value={cummulative}
          orientation="left"
          themeColor={"pink"}
        />
        <InfoStats title={`Target Achieved (${fy})`} value={targetAchieved} />
      </div>
      <div className="border-t pt-2">
        <p className="text-sm text-foreground th-font-roman">
          {indictorType === "Peopled Served"
            ? `Population of the communities with improved access to quality, community-based primary healthcare 
            through Last Mile Health and its government partners`
            : `Number of community and frontline health workers supported by 
            Last Mile Health and its government partners to provide quality, community-based primary healthcare services`}
        </p>
      </div>
    </div>
  );
};

export default InfographicCard;
