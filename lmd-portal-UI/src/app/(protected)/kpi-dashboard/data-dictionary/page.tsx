import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";

const KPIDataDictionaryPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="Data Tables" />
      <div className=" border border-primary dark:border-border rounded-lg h-full bg-background">
        <h1 className="text-center text-2xl mt-5">
          Welcome to Data Dictionary
        </h1>
      </div>
    </>
  );
};

export default KPIDataDictionaryPage;
