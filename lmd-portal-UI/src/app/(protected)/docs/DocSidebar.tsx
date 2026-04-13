"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  HomeIcon,
  InformationCircleIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const navdata = [
  { title: "Home",          href: "/docs",             icon: HomeIcon },
  { title: "About LMD 2.0", href: "/docs/about-lmd2",  icon: InformationCircleIcon },
  { title: "User Guides",   href: "/docs/user-guides",  icon: BookOpenIcon },
  { title: "FAQs",          href: "/docs/faqs",         icon: QuestionMarkCircleIcon },
];

export default function DocSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
        Documentation
      </p>
      {navdata.map((nav) => {
        const Icon = nav.icon;
        const isActive = pathname === nav.href || (nav.href !== "/docs" && pathname.startsWith(nav.href));
        return (
          <Link
            href={nav.href}
            key={nav.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md py-2 px-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {nav.title}
          </Link>
        );
      })}
    </nav>
  );
}
