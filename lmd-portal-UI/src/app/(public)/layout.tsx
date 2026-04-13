import Footer from "@/components/footer/Footer";
import MainPortalLayout from "@/components/layouts/main-portal";
import AuthBasedNavbar from "@/components/navbar/AuthBasedNavbar";
import RightSidebar from "@/components/portalFeebdack/rightSideBar/RightSideBar";
import { RightSidebarProvider } from "@/context/rightSideBarContext";
import React from "react";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <main className="page-constraints p-0 flex-col gap-0 h-screen">
      <RightSidebarProvider>
        <AuthBasedNavbar showSignInButton={true} />
        <MainPortalLayout>{children}</MainPortalLayout>
      </RightSidebarProvider>
    </main>
  );
}
