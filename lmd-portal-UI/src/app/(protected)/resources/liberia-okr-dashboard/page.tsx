import { metaObject } from "@/config/site.config";
import MDXContent from "@/lib/mdx/mdxContent";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";

export const metadata = {
  ...metaObject("Liberia OKR Dashboard — Resources"),
};

const TOC = [
  { label: "Overview",                    href: "#overview" },
  { label: "Navigating to the Dashboard", href: "#navigating-to-the-dashboard" },
  { label: "Status Indicators",           href: "#understanding-the-status-indicators" },
  { label: "Submitting a Monthly Update", href: "#submitting-a-monthly-update" },
  { label: "Admin Guide",                 href: "#admin-guide---managing-okr-records" },
  { label: "Tips & Best Practices",       href: "#tips--best-practices" },
  { label: "Need Help?",                  href: "#need-help" },
];

export default function LiberiaOkrDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Resources
        </Link>

        <div className="flex gap-12 lg:gap-16">
          {/* Left TOC */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-20">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                On this page
              </p>
              <nav className="flex flex-col gap-0.5">
                {TOC.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground py-1 transition-colors leading-snug"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <MDXContent fileName="liberia-okr-dashboard" showHeader={true} className="" />
          </div>
        </div>
      </div>
    </div>
  );
}
