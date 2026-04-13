"use client";
import React, { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";
import getKpiTableNames from "@/lib/actions/kpi-data/getKpiTableNames";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GlobalSelectDropdown, {
  IGlobalSelectDropdownData,
} from "../../kpi-change-log/globalSelectDropdown";

export const kpiCountryData: IGlobalSelectDropdownData[] = [
  { label: "Global Scale", name: "global_scale" },
  { label: "Liberia", name: "liberia" },
  { label: "Malawi", name: "malawi" },
  { label: "Ethiopia", name: "ethiopia" },
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
      kpiCountryData.find((item) => item.name === countryName) || null
    );
  const [selectedTablename, setSelectedTablename] =
    useState<IGlobalSelectDropdownData | null>(null);

  const fetchData = useCallback(async (country: string) => {
    setIsLoading(true);
    try {
      const response = await getKpiTableNames(country);
      if (response?.error) {
        console.error(response.error);
        toast.error(response.error);
      } else {
        // console.log("res", response.data);
        const transformedData: IGlobalSelectDropdownData[] = response.data.map(
          (item: string) => ({
            name: item,
            label: item,
          })
        );
        // console.log("log", transformedData);
        setAllTablenames(transformedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch table names");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data whenever the selected country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchData(selectedCountry.name);
      setSelectedTablename(null); // Reset the selected table when the country changes
    }
  }, [selectedCountry, fetchData]);

  useEffect(() => {
    if (tableName && allTablenames.length > 0) {
      const initialTablename =
        allTablenames.find((item) => item.name === tableName) || null;
      setSelectedTablename(initialTablename);
    }
  }, [tableName, allTablenames]);

  const handleSearch = useCallback(() => {
    if (selectedCountry && selectedTablename) {
      const url = `/kpi-dashboard/kpi-data-tables?country=${selectedCountry.name}&tablename=${selectedTablename.name}`;
      router.push(url);
    } else if (selectedTablename === null) {
      setSelectedCountry(null);
      router.push("/kpi-dashboard/kpi-data-tables");
    } else {
      toast.error("Please select both a country and a table before searching.");
    }
  }, [selectedCountry, selectedTablename, router]);

  // Handler functions to match the expected types
  const handleCountrySelect = useCallback(
    (item: IGlobalSelectDropdownData | undefined) => {
      console.log("logges", item);
      if (item === undefined) {
        setSelectedTablename(null);
        router.push("/kpi-dashboard/kpi-data-tables");
      }
      setSelectedCountry(item || null);
      // redundant
      if (item === null) {
        setSelectedTablename(null);
      }
    },
    [router]
  );

  const handleTablenameSelect = useCallback(
    (item: IGlobalSelectDropdownData | undefined) => {
      setSelectedTablename(item || null);
      if (selectedCountry && item) {
        const url = `/kpi-dashboard/kpi-data-tables?country=${selectedCountry.name}&tablename=${item.name}`;
        router.push(url);
      } else if (!item) {
        router.push("/kpi-dashboard/kpi-data-tables");
      }
    },
    [router, selectedCountry]
  );

  return (
    <div className="-mt-0.5 flex gap-4 h-fit">
      <GlobalSelectDropdown
        tooltip={
          selectedCountry === null
            ? "Click here to select country program first"
            : selectedTablename === null
            ? ""
            : "Click to select any country program"
        }
        wrapperClassName="w-52"
        placeHolderText="Select Program Country"
        onSelectItem={handleCountrySelect}
        data={kpiCountryData}
        initialSelected={selectedCountry}
      />

      <GlobalSelectDropdown
        tooltip={
          selectedCountry === null
            ? "Feature Blocked. Please select a program country first!"
            : selectedTablename === null
            ? "Now Select the specific KPI data table of choice"
            : "Click to select any KPI data table"
        }
        disabled={selectedCountry === null}
        wrapperClassName="w-72"
        placeHolderText="Select Data Table"
        initialSelected={selectedTablename}
        onSelectItem={handleTablenameSelect}
        onRefresh={() => fetchData(selectedCountry?.name!)}
        data={allTablenames}
        isLoading={isLoading}
      />

      {/* <div className="-ml-1 flex flex-col border-red-600 justify-center">
        <Button className="h-[30px] flex items-center" onClick={handleSearch}>
          {selectedTablename && (
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
          )}
          {!selectedTablename ? "Reset" : "Search"}
        </Button>
      </div> */}

      <div className="flex-1 flex items-center justify-end">
        {/* {!selectedTablename && <UploadKpiDataModal />} */}
      </div>
    </div>
  );
}

export default Toolbar;
