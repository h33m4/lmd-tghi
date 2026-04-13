"use client";

import React, { useMemo, useState } from "react";
import UserGroupCard from "./userGroupCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TrashIcon from "@/components/icons/trash";

export interface IUserGroup {
  GroupName: string;
  Description: string;
  LastModifiedDate: Date | string;
  CreationDate: Date | string;
}

// Groups that are country-scoped follow the pattern "<country>_publisher"
const GLOBAL_GROUPS = new Set([
  "super_administrator",
  "administrator",
  "global_publisher",
  "user",
]);

type FilterType = "all" | "global" | "country";

export default function UserGroupTable({ groups }: { groups: IUserGroup[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return groups.filter((g) => {
      const matchesSearch =
        !q ||
        g.GroupName.toLowerCase().includes(q) ||
        g.Description?.toLowerCase().includes(q);

      const isGlobal = GLOBAL_GROUPS.has(g.GroupName);
      const matchesFilter =
        filter === "all" ||
        (filter === "global" && isGlobal) ||
        (filter === "country" && !isGlobal);

      return matchesSearch && matchesFilter;
    });
  }, [groups, search, filter]);

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Global", value: "global" },
    { label: "Country", value: "country" },
  ];

  return (
    <div className="overflow-auto">
      {/* Search + filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-input h-[32px] w-[22rem] pr-8"
          />
          {search && (
            <Button
              variant="ghost2"
              size="sm"
              className="absolute right-0 h-[32px] px-2"
              onClick={() => setSearch("")}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {filterOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={filter === opt.value ? "dark-blue" : "outline"}
              size="sm"
              className="h-[32px] text-xs"
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {(search || filter !== "all") && (
          <span className="text-xs text-th-text-muted">
            {filtered.length} of {groups.length} groups
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-th-text-muted">
          No groups match your search.
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            "@[36.65rem]:grid-cols-2 @[56rem]:grid-cols-3 @[78.5rem]:grid-cols-4 @[100rem]:grid-cols-5"
          )}
        >
          {filtered.map((group, idx) => (
            <UserGroupCard key={group.GroupName + idx} {...group} />
          ))}
        </div>
      )}
    </div>
  );
}
