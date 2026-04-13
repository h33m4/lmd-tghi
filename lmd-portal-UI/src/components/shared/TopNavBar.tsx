"use client";
import Link from "next/link";
import React, { ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { parseCountryNameForApi } from "@/utils/parseCountryNameForAPI";
import { ICountryNames } from "@/types";

type Breadcrumb = {
  path: string;
  name: string;
  isLast: boolean;
  isClickable: boolean;
};

type CapitalizeWord = string | { [key: string]: string };

const TopNavBar = ({
  pageName = "Page Name",
  country,
  children,
  subPageName,
  excludedBreadcrumbPaths = ["reports"],
  capitalizeWords = [],
}: {
  pageName?: string;
  children?: ReactNode;
  subPageName?: string;
  country: string;
  excludedBreadcrumbPaths?: string[];
  capitalizeWords?: CapitalizeWord[];
}) => {
  const pathname = usePathname();

  // Merge and process capitalize words
  const processedCapitalizeWords = React.useMemo(() => {
    const defaultCapitalizeWords: CapitalizeWord[] = [
      "iCHIS",
      "EGH",
      "CHA",
      "CBMNC",
      "CHWs",
      "for",
      "pre",
      "chw",
    ];

    const capitalizeMap = new Map<string, string>();

    // Add defaults
    defaultCapitalizeWords.forEach((item) => {
      if (typeof item === "string") {
        capitalizeMap.set(item.toLowerCase(), item);
      } else {
        Object.entries(item).forEach(([key, value]) => {
          capitalizeMap.set(key.toLowerCase(), value);
        });
      }
    });

    // Add user-provided words (override defaults)
    capitalizeWords.forEach((item) => {
      if (typeof item === "string") {
        capitalizeMap.set(item.toLowerCase(), item);
      } else {
        Object.entries(item).forEach(([key, value]) => {
          capitalizeMap.set(key.toLowerCase(), value);
        });
      }
    });

    return capitalizeMap;
  }, [capitalizeWords]);

  const generateBreadcrumbs = (): Breadcrumb[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];
    let currentPath = "";

    // Find the index of the country path
    const countryIndex = paths.findIndex(
      (path) => path === parseCountryNameForApi(country as ICountryNames)
    );
    const startIndex = countryIndex !== -1 ? countryIndex + 1 : 0;

    paths.slice(startIndex).forEach((path, index, array) => {
      currentPath += `/${path}`;

      // Skip technical paths
      if (path === "d" || path.length > 50) return;

      let displayName = path
        .split("-")
        .map((word) => {
          // Check if we have a specific capitalization rule for this word
          const lowerWord = word.toLowerCase();
          if (processedCapitalizeWords.has(lowerWord)) {
            return processedCapitalizeWords.get(lowerWord)!;
          }
          // Default capitalization
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");

      // Special transformations
      if (path === "data-reviews") displayName = "Data Reviews";
      if (path === "reports") displayName = "Program Reports";

      // For the last item in the path
      const isLastItem = index === array.length - 1;

      // If it's the last item and we have a subPageName, use that instead
      if (isLastItem && subPageName) {
        displayName = subPageName;
      }

      breadcrumbs.push({
        path: `/country-programs/${country
          .toLowerCase()
          .replace(/\s+/g, "_")}${currentPath}`,
        name: displayName,
        isLast: isLastItem,
        isClickable: !excludedBreadcrumbPaths.includes(path) && !isLastItem,
      });
    });

    return breadcrumbs;
  };

  return (
    <div className="border-b-[2px] border-grey-dark/10 mb-2 h-[41px] flex items-center gap-2 -mt-2">
      <Link href={`/country-programs/${country.toLowerCase()}`}>
        <Image
          src={`/assets/img/country/${country
            .toLowerCase()
            .replace(/\s+/g, "-")}-flag.png`}
          width={40}
          height={20}
          alt={`${country.toLowerCase()} flag`}
          className="bg-background rounded-none border border-white"
        />
      </Link>
      <div className="flex flex-col items-start justify-center gap-0">
        <p className="text-lmh-pink text-xs th-font-black tracking-wide">
          {country} <span className="ml-0">/</span>
        </p>
        <h1 className="-mt-1 text-lmh-dark-blue-foreground th-font-heavy text-sm flex items-center">
          {generateBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <span className="px-1.5">/</span>}
              {crumb.isLast || !crumb.isClickable ? (
                <span className="text-grey-100">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:underline">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </h1>
      </div>
      <div className="w-full flex flex-1 justify-end items-end mt-1">
        {children}
      </div>
    </div>
  );
};

export default TopNavBar;
