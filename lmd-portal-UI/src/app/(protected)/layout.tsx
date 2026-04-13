import GTMLoginTracker from "@/components/analytics/client_login_tracker";
import MainPortalLayout from "@/components/layouts/main-portal";
import AuthBasedNavbar from "@/components/navbar/AuthBasedNavbar";
import RightSidebar from "@/components/portalFeebdack/rightSideBar/RightSideBar";
import { RightSidebarProvider } from "@/context/rightSideBarContext";
import ClientPortalOverlays from "@/components/shared/ClientPortalOverlays";
import { PortalConfigProvider } from "@/context/PortalConfigContext";
import React from "react";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <>
      <main className="page-constraints p-0 flex flex-col gap-0 h-screen">
        <PortalConfigProvider>
          <RightSidebarProvider>
            <ClientPortalOverlays />
            <AuthBasedNavbar />
            <GTMLoginTracker />
            <MainPortalLayout>{children}</MainPortalLayout>
          </RightSidebarProvider>
        </PortalConfigProvider>
      </main>
    </>
  );
}
