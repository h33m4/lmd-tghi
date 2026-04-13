import GTMLoginTracker from "@/components/analytics/client_login_tracker";
import MainPortalLayout from "@/components/layouts/main-portal";
import AuthBasedNavbar from "@/components/navbar/AuthBasedNavbar";
import RightSidebar from "@/components/portalFeebdack/rightSideBar/RightSideBar";
import { RightSidebarProvider } from "@/context/rightSideBarContext";
import { TourProvider } from "@/context/tourContext";
import React from "react";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <>
      {/* <MainPortalLayout>{children}</MainPortalLayout> */}
      <main className="page-constraints p-0 flex-col gap-0">
        <RightSidebarProvider>
          <AuthBasedNavbar />
          <GTMLoginTracker />
          <div className="flex flex-1 w-full">
            {/* Main content area */}
            <div className="flex-1 overflow-auto">{children}</div>

            {/* Right sidebar - always visible */}
            <div className="h-[calc(100vh-80px)] 2xl:h-[calc(100vh-90px)]">
              <RightSidebar />
            </div>
          </div>
        </RightSidebarProvider>
      </main>
    </>
  );
}
