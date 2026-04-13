import React from "react";
import Image from "next/image";
import DashboardImage from "@public/assets/img/exploratory-analysis.png";

interface DefaultDashboardProps {
  title?: string;
  message?: string;
}

const DefaultDashboard = ({
  title = "Coming Soon!",
  message = "Feature will be released soon - stay tuned",
}: DefaultDashboardProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center  rounded-lg bg-transparent">
      <div className="text-center p-6 space-y-4">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={DashboardImage}
            alt={"db image"}
            height={100}
            width={100}
            className="text-gray-400"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <p className="text-gray-500 max-w-md">{message}</p>
      </div>
    </div>
  );
};

export default DefaultDashboard;
