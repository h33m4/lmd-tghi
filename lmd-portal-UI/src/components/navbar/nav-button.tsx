"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTourRef } from "@/context/tourContext";
import { usePortalConfig } from "@/context/PortalConfigContext";

const PRESET_BG: Record<string, string> = {
  green:  "bg-green-500",
  blue:   "bg-blue-500",
  amber:  "bg-amber-400",
  red:    "bg-red-500",
  purple: "bg-purple-500",
  pink:   "bg-pink-500",
  teal:   "bg-teal-500",
};

function badgeKey(id: string, v: number) {
  return `nav_badge_${id}_v${v}`;
}

type Props = { title: string; href: string; tourRef?: string };

export default function NavButton({ title, href = "/home", tourRef }: Props) {
  const pathname = usePathname();
  const active = pathname.includes(href);
  const ref = useTourRef(tourRef || "");
  const linkRef = tourRef ? ref : null;

  const { navBadges } = usePortalConfig();
  const badge = navBadges.find((b) => b.route === href);
  const badgeId = badge?.id ?? null;
  const seenVersion = badge?.seenVersion ?? 1;

  // hydrated: false until localStorage has been read (prevents flash for seen users)
  const [hydrated, setHydrated] = useState(false);
  const [seen, setSeen] = useState(false);

  // Read localStorage once badge is available from the async config fetch
  useEffect(() => {
    console.log("[NavButton]", href, { badgeId, seenVersion, navBadgesCount: navBadges.length });
    if (!badgeId) return;
    const k = badgeKey(badgeId, seenVersion);
    const storedVal = localStorage.getItem(k);
    console.log("[NavButton] localStorage key:", k, "value:", storedVal);
    setSeen(!!storedVal);
    setHydrated(true);
  }, [badgeId, seenVersion, href, navBadges.length]);

  // Persist dismissal when user lands on this route
  useEffect(() => {
    if (!badgeId || !active) return;
    const k = badgeKey(badgeId, seenVersion);
    localStorage.setItem(k, "1");
    setSeen(true);
  }, [badgeId, active, seenVersion]);

  // Only show after localStorage has been read, badge exists, not seen, not active
  const showBadge = hydrated && !!badge && !seen && !active;

  const badgeBgClass = badge ? (PRESET_BG[badge.color] ?? "") : "";
  const badgeBgStyle =
    badge && !PRESET_BG[badge.color] ? { backgroundColor: badge.color } : undefined;

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`th-font-medium text-md 2xl:text-lg px-4 pt-[1px] border-b-[4px] h-full relative inline-flex items-center ${
        active
          ? "border-lmh-pink th-font-heavy text-lmh-pink"
          : "border-transparent hover:bg-primary-foreground text-lmh-dark-blue-foreground hover:border-lmh-blue hover:text-primary rounded-t-md"
      } hover:th-font-black`}
      prefetch={true}
    >
      <span className="relative">
        {title}
        {showBadge && (
          <span
            className={`absolute -top-2 -right-2 min-w-[1.25rem] h-5 flex items-center justify-center px-2 2xl:py-[4px] text-[10px] font-semibold text-white rounded-lg transform translate-x-1/2 shadow-md ${badgeBgClass}`}
            style={badgeBgStyle}
          >
            {badge!.label}
          </span>
        )}
      </span>
    </Link>
  );
}

NavButton.displayName = "NavButton";
