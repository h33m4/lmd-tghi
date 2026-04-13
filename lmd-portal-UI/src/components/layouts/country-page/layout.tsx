"use client";
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import SideBar from "./SideBar";
import { ICountryNames } from "@/types";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

// Constants
const SIDEBAR_COLLAPSED_WIDTH = 55;
const SIDEBAR_EXPANDED_WIDTH = 190;
const SIDEBAR_EXPANDED_WIDTH_2XL = 200;

const COOKIE_KEY_COLLAPSED = "sidebar:collapsed";

// Utility
const saveToCookie = (key: string, value: unknown): void => {
  try {
    document.cookie = `${key}=${JSON.stringify(value)}; path=/`;
  } catch (error) {
    console.error(`Failed to save ${key} to cookie:`, error);
  }
};

// Types
interface CountryDashboardLayoutProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  country: ICountryNames;
  defaultLayout: number[] | undefined;
}

const CountryPageLayout: React.FC<CountryDashboardLayoutProps> = ({
  children,
  defaultCollapsed = false,
  country,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      saveToCookie(COOKIE_KEY_COLLAPSED, newValue);
      return newValue;
    });
  }, []);

  return (
    <div className="w-full flex flex-1 overflow-hidden">
      {/* Fixed-width Sidebar */}
      <aside
        style={{
          width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        }}
        className={cn(
          "flex-shrink-0 transition-all duration-300 ease-in-out",
          `2xl:w-[${SIDEBAR_EXPANDED_WIDTH_2XL}px]`
        )}
      >
        <SideBar isCollapsed={isCollapsed} country={country} />
      </aside>

      {/* Divider with Toggle Button */}
      <div className="relative flex w-px items-center justify-center bg-border">
        <button
          className={cn(
            "z-10 border bg-border rounded-full",
            "absolute right-[-10px] cursor-pointer",
            "hover:bg-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          onClick={handleToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <ArrowRightCircleIcon className="h-5 w-5" />
          ) : (
            <ArrowLeftCircleIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Main Content - Takes remaining space */}
      <main className="flex-1 h-[calc(100vh-80px)] 2xl:h-[calc(100vh-88px)] overflow-auto px-2 py-2">
        {children}
      </main>
    </div>
  );
};

export default CountryPageLayout;
