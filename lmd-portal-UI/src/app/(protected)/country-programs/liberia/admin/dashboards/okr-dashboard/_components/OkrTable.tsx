"use client";

import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { OkrBaseData, isNarrativeUnit } from "@/types/okrTracker";
import { unitColor, fmtDisplay } from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OkrGroup {
  objectiveId: string;
  number: number;
  objective: string;
  toc: string;
  okrs: OkrBaseData[];
}

export interface OkrTableProps {
  grouped: OkrGroup[];
  collapsedGroups: Set<string>;
  toggleGroup: (objectiveId: string) => void;
  selectedOkr: OkrBaseData | null;
  panelOpen: boolean;
  openView: (okr: OkrBaseData) => void;
  openEdit: (okr: OkrBaseData) => void;
  openEditObjective: (objectiveId: string, text: string, toc: string) => void;
  openAdd: (
    preObjectiveId?: string,
    preText?: string,
    preToc?: string,
    objPrefix?: string,
  ) => void;
  handleDelete: (id: string, okrId: string) => void;
  handleDeleteObjective: (
    objectiveId: string,
    number: number,
    objective: string,
  ) => void;
}

// ─── OkrTable ─────────────────────────────────────────────────────────────────

export function OkrTable({
  grouped,
  collapsedGroups,
  toggleGroup,
  selectedOkr,
  panelOpen,
  openView,
  openEdit,
  openEditObjective,
  openAdd,
  handleDelete,
  handleDeleteObjective,
}: OkrTableProps) {
  return (
    <div className="space-y-4">
      {grouped.map((group) => {
        const isCollapsed = collapsedGroups.has(group.objectiveId);
        return (
          <div
            key={group.objectiveId}
            className="rounded-xl border border-border overflow-hidden"
          >
            {/* Objective header — full row is clickable */}
            <button
              type="button"
              onClick={() => toggleGroup(group.objectiveId)}
              className="w-full bg-gradient-to-r from-lmh-dark-blue/8 to-transparent border-b border-border px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 text-left hover:from-lmh-dark-blue/12 transition-colors"
            >
              <span className="shrink-0 text-muted-foreground">
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>

              <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-lmh-dark-blue/50 dark:text-primary/50 uppercase tracking-widest">
                    Objective {group.number}
                  </span>
                  {group.toc && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-lmh-dark-blue/10 text-lmh-dark-blue dark:bg-primary/10 dark:text-primary">
                      {group.toc}
                    </span>
                  )}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {group.objective}
                </span>
              </span>

              <span
                className="flex items-center gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xs text-muted-foreground mr-1">
                  {group.okrs.length} KR
                  {group.okrs.length !== 1 ? "s" : ""}
                </span>
                <span
                  role="button"
                  onClick={() =>
                    openEditObjective(
                      group.objectiveId,
                      group.objective,
                      group.toc,
                    )
                  }
                  className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-lmh-dark-blue hover:bg-lmh-dark-blue/10 transition-colors"
                  title="Edit objective"
                >
                  <Edit className="h-3.5 w-3.5" />
                </span>
                <span
                  role="button"
                  onClick={() => {
                    const prefix =
                      group.okrs[0]?.okrId.split(".")[0] ||
                      String(group.number);
                    openAdd(
                      group.objectiveId,
                      group.objective,
                      group.toc,
                      prefix,
                    );
                  }}
                  className="h-7 px-2 rounded-md flex items-center gap-1 text-xs text-muted-foreground hover:text-lmh-dark-blue hover:bg-lmh-dark-blue/10 transition-colors"
                  title="Add key result under this objective"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add KR
                </span>
                {group.okrs.length === 0 && (
                  <span
                    role="button"
                    onClick={() =>
                      handleDeleteObjective(
                        group.objectiveId,
                        group.number,
                        group.objective,
                      )
                    }
                    className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete objective"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                )}
              </span>
            </button>

            {/* Key results table */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-2 sm:px-4 py-2.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-10">
                        ID
                      </th>
                      <th className="px-2 sm:px-4 py-2.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Key Result
                      </th>
                      <th className="hidden sm:table-cell px-2 sm:px-4 py-2.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Unit
                      </th>
                      <th className="hidden md:table-cell px-2 sm:px-4 py-2.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Target
                      </th>
                      <th className="hidden md:table-cell px-2 sm:px-4 py-2.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Period
                      </th>
                      <th className="px-2 sm:px-4 py-2.5 w-16 sm:w-20" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {group.okrs.map((okr) => {
                      const uc = unitColor(okr.unit);
                      const isSelected =
                        selectedOkr?.id === okr.id && panelOpen;
                      return (
                        <tr
                          key={okr.id}
                          onClick={() => openView(okr)}
                          className={`group cursor-pointer transition-colors ${isSelected ? "bg-lmh-dark-blue/5 dark:bg-primary/5" : "hover:bg-muted/40"}`}
                        >
                          <td className="px-0 py-0 w-10">
                            <div className="flex items-center h-full pl-1">
                              <div
                                className={`w-1 h-9 rounded-full mx-3 ${isSelected ? "bg-lmh-dark-blue" : uc.bar + " opacity-60 group-hover:opacity-100"} transition-opacity`}
                              />
                              <span className="font-bold text-lmh-dark-blue dark:text-primary text-sm">
                                {okr.okrId}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <p className="text-foreground text-xs line-clamp-2">
                              {okr.keyResult}
                            </p>
                          </td>
                          <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${uc.bg} ${uc.text}`}
                            >
                              {okr.unit}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-2 sm:px-4 py-3 whitespace-nowrap">
                            {isNarrativeUnit(okr.unit) ? (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            ) : (
                              <>
                                <span className="font-bold text-foreground">
                                  {okr.targetValue}
                                </span>
                                <span className="text-muted-foreground text-xs ml-1">
                                  {okr.chartMetricUnit}
                                </span>
                              </>
                            )}
                          </td>
                          <td className="hidden md:table-cell px-2 sm:px-4 py-3 whitespace-nowrap">
                            <span className="text-xs text-muted-foreground">
                              {fmtDisplay(okr.periodStart)}
                              <span className="mx-1 text-border">–</span>
                              {fmtDisplay(okr.periodEnd)}
                            </span>
                          </td>
                          <td
                            className="px-1 sm:px-3 py-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                              <button
                                onClick={() => openEdit(okr)}
                                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-lmh-dark-blue hover:bg-lmh-dark-blue/10 transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(okr.id, okr.okrId)
                                }
                                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
