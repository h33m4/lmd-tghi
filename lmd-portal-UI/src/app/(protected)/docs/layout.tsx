import Footer from "@/components/footer/Footer";
import React from "react";
import DocSidebar from "./DocSidebar";
import MobileDocNav from "./MobileDocNav";
import { auth } from "@/auth";

type Props = {
  children: React.ReactNode;
};

export default async function DocsLayout({ children }: Props) {
  const session = await auth();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Mobile nav — horizontal scrollable tabs */}
        {session && (
          <div className="md:hidden py-3 border-b border-border">
            <MobileDocNav />
          </div>
        )}

        <div className={session ? "md:flex md:gap-10 lg:gap-16 py-8" : "py-10"}>
          {/* Desktop sidebar */}
          {session && (
            <aside className="hidden md:block w-48 lg:w-56 shrink-0">
              <div className="sticky top-20">
                <DocSidebar />
              </div>
            </aside>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
