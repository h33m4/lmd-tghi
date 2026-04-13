"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import getKpiTableNames from "@/lib/actions/kpi-data/getKpiTableNames";
import GlobalSelectDropdown, {
  IGlobalSelectDropdownData,
} from "../../kpi-change-log/globalSelectDropdown";

export const kpiCountryData: IGlobalSelectDropdownData[] = [
  { label: "Global", name: "global_scale" },
  { label: "Ethiopia", name: "ethiopia" },
  { label: "Liberia", name: "liberia" },
  { label: "Malawi", name: "malawi" },
  { label: "Sierra Leone", name: "sierra_leone" },
];

function Toolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryName = searchParams.get("country");
  const tableName = searchParams.get("tablename");

  const [isLoading, setIsLoading] = useState(false);
  const [allTablenames, setAllTablenames] = useState<
    IGlobalSelectDropdownData[]
  >([]);
  const [selectedCountry, setSelectedCountry] =
    useState<IGlobalSelectDropdownData | null>(
      countryName
        ? kpiCountryData.find((item) => item.name === countryName) || null
        : null,
    );
  const [selectedTablename, setSelectedTablename] =
    useState<IGlobalSelectDropdownData | null>(null);

  const fetchTableData = useCallback(async (country: string) => {
    setIsLoading(true);
    try {
      const response = await getKpiTableNames(country);
      if (response?.error) {
        toast.error(response.error);
        return;
      }

      console.log("response data:", response.data);

      const transformedData: IGlobalSelectDropdownData[] = response.data.map(
        (item: string) => ({
          name: item,
          label: item,
        }),
      );
      setAllTablenames(transformedData);
    } catch (error) {
      toast.error("Failed to fetch table names");
    } finally {
      setIsLoading(false);
    }
  }, []);

  console.log("allTablenames:", allTablenames);

  const fetchCountryData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCountrySelect = useCallback(
    (item?: IGlobalSelectDropdownData) => {
      // if country selection is cleared
      if (!item) {
        setSelectedCountry(null);
        setSelectedTablename(null);
        router.push("/kpi-dashboard/kpi-data-tables");
        return;
      }
      // if tablename is selected but user selects different country
      if (item.name !== selectedCountry?.name) {
        router.push("/kpi-dashboard/kpi-data-tables");
      }
      setSelectedCountry(item);
    },
    [router, selectedCountry],
  );

  const handleTablenameSelect = useCallback(
    (item?: IGlobalSelectDropdownData) => {
      setSelectedTablename(item || null);
      if (selectedCountry && item) {
        router.push(
          `/kpi-dashboard/kpi-data-tables?country=${selectedCountry.name}&tablename=${item.name}`,
        );
      } else if (!item) {
        router.push("/kpi-dashboard/kpi-data-tables");
      }
    },
    [router, selectedCountry],
  );

  useEffect(() => {
    if (selectedCountry) {
      fetchTableData(selectedCountry.name);
      setSelectedTablename(null);
    }
  }, [selectedCountry, fetchTableData]);

  useEffect(() => {
    if (tableName && allTablenames.length > 0) {
      setSelectedTablename(
        allTablenames.find((item) => item.name === tableName) || null,
      );
    }
  }, [tableName, allTablenames]);

  return (
    <div className="flex gap-4 h-fit">
      <GlobalSelectDropdown
        tooltip={
          selectedCountry
            ? selectedTablename
              ? "Click to select any country program"
              : ""
            : "Click here to select country program first"
        }
        wrapperClassName="w-52"
        placeHolderText="Select Program Country"
        onSelectItem={handleCountrySelect}
        data={kpiCountryData}
        initialSelected={selectedCountry}
        onRefresh={fetchCountryData}
        isLoading={isLoading}
      />

      <GlobalSelectDropdown
        tooltip={
          !selectedCountry
            ? "Feature Blocked. Please select a program country first!"
            : selectedTablename
              ? "Click to select any KPI data table"
              : "Now Select the specific KPI data table of choice"
        }
        disabled={!selectedCountry}
        wrapperClassName="w-72"
        placeHolderText="Select Data Table"
        initialSelected={selectedTablename}
        onSelectItem={handleTablenameSelect}
        onRefresh={() =>
          selectedCountry && fetchTableData(selectedCountry.name)
        }
        data={allTablenames}
        isLoading={isLoading}
      />

      <div className="flex-1 flex items-center justify-end" />
    </div>
  );
}

export default Toolbar;
