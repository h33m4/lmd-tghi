"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navdata = [
  { title: "Home",          href: "/docs" },
  { title: "About LMD 2.0", href: "/docs/about-lmd2" },
  { title: "User Guides",   href: "/docs/user-guides" },
  { title: "FAQs",          href: "/docs/faqs" },
];

export default function MobileDocNav() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
      {navdata.map((nav) => {
        const isActive = pathname === nav.href || (nav.href !== "/docs" && pathname.startsWith(nav.href));
        return (
          <Link
            key={nav.href}
            href={nav.href}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {nav.title}
          </Link>
        );
      })}
    </div>
  );
}
