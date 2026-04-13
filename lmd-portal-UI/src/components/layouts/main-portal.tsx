// MainPortalLayout.tsx
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import LayoutLoader from "../loaders/layout-loader";
import { RightSidebarProvider } from "@/context/rightSideBarContext";
import RightSidebar from "../portalFeebdack/rightSideBar/RightSideBar";

// Dynamically import AuthBasedNavbar with ssr disabled
const AuthBasedNavbar = dynamic(() => import("../navbar/AuthBasedNavbar"), {
  ssr: false,
  loading: () => <LayoutLoader />,
});

type MainPortalLayoutProps = {
  children: ReactNode;
};

export default function MainPortalLayout({ children }: MainPortalLayoutProps) {
  return (
    <div className="flex flex-1 w-full  overflow-hidden">
      {/* Main content area */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden   border-red-500"
        data-main-content="true"
      >
        {children}
      </div>

      {/* Right sidebar - fixed height, no scroll */}
      <div className="h-full flex-shrink-0" data-sidebar="true">
        <RightSidebar />
      </div>
    </div>
  );
}
