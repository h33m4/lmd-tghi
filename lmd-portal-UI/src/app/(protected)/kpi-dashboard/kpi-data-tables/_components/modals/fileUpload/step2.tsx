"use client";

import Banner from "@/components/ui/banner/banner";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, Undo, Redo, RotateCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { ZodObject, ZodTypeAny } from "zod";
import { useFileEditor } from "./useFileEditorHook";
import { Tooltip } from "antd";
import { z } from "zod";
import { isTextAreaField } from "@/utils/zod-helpers";

type Props = {
  fileData: any;
  schema: ZodObject<Record<string, ZodTypeAny>>;
  onDataChange?: (updatedData: any) => void;
  fileEditor: ReturnType<typeof useFileEditor>;
  fileError?: string;
  setFileError: (err?: string) => void;
};

export default function Step2Preview({
  fileData,
  schema,
  onDataChange,
  fileEditor,
  fileError,
  setFileError,
}: Props) {
  // Local UI state
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: string;
  } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);

  // ========================================================
  // ⚙️ INITIAL DATA
  // ========================================================
  const requiredColumns = schema ? Object.keys(schema.shape) : [];
  const originalHeaders: string[] = fileData?.meta?.fields ?? [];
  const originalRows = fileData?.data ?? [];

  const headers = useMemo(() => {
    return [...originalHeaders, ...fileEditor.addedColumns]
      .filter((h) => !fileEditor.deletedColumns.has(h))
      .map((h) => fileEditor.editedHeaders[h] || h);
  }, [
    originalHeaders,
    fileEditor.addedColumns,
    fileEditor.deletedColumns,
    fileEditor.editedHeaders,
  ]);

  const rows = useMemo(() => {
    const mappedRows = originalRows
      .map((row: any, index: number) => {
        if (fileEditor.deletedRows.has(index)) return null;

        const updatedRow = { ...row };

        // Apply header renames
        Object.entries(fileEditor.editedHeaders).forEach(
          ([oldName, newName]) => {
            if (oldName in updatedRow) {
              updatedRow[newName] = updatedRow[oldName];
              if (oldName !== newName) delete updatedRow[oldName];
            }
          }
        );

        // Apply cell edits
        const cellKey = `${index}`;
        if (fileEditor.editedCells[cellKey])
          Object.assign(updatedRow, fileEditor.editedCells[cellKey]);

        // Remove deleted columns
        fileEditor.deletedColumns.forEach((col) => delete updatedRow[col]);

        // Add empty values for added columns
        fileEditor.addedColumns.forEach((col) => {
          const finalColName = fileEditor.editedHeaders[col] || col;
          if (!(finalColName in updatedRow)) updatedRow[finalColName] = "";
        });

        return updatedRow;
      })
      .filter(Boolean);

    return [...mappedRows, ...fileEditor.addedRows];
  }, [
    originalRows,
    fileEditor.deletedRows,
    fileEditor.editedHeaders,
    fileEditor.editedCells,
    fileEditor.deletedColumns,
    fileEditor.addedColumns,
    fileEditor.addedRows,
  ]);

  // ========================================================
  // 🧠 NOTIFY PARENT
  // ========================================================
  useEffect(() => {
    const currentData = { data: rows, meta: { fields: headers } };
    onDataChange?.(currentData);
  }, [rows, headers, onDataChange]);

  const missingColumns = requiredColumns.filter(
    (col) => !headers.includes(col)
  );

  // ========================================================
  // 🧠 EVENT HANDLERS

  const handleCellChange = (
    rowIndex: number,
    columnName: string,
    newValue: string
  ) => {
    fileEditor.pushHistory();

    if (rowIndex >= originalRows.length) {
      // Editing an added row
      const addedIndex = rowIndex - originalRows.length;
      fileEditor.setAddedRows((prev) => {
        const updated = [...prev];
        updated[addedIndex] = {
          ...updated[addedIndex],
          [columnName]: newValue,
        };
        return updated;
      });
    } else {
      const cellKey = `${rowIndex}`;
      fileEditor.setEditedCells((prev) => ({
        ...prev,
        [cellKey]: { ...(prev[cellKey] || {}), [columnName]: newValue },
      }));
    }
  };

  const handleHeaderChange = (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return;
    fileEditor.pushHistory();
    fileEditor.setEditedHeaders((prev) => ({ ...prev, [oldName]: newName }));
  };

  const handleAddColumn = () => {
    fileEditor.pushHistory();
    const newColumnName = `Column${
      originalHeaders.length + fileEditor.addedColumns.length + 1
    }`;
    fileEditor.setAddedColumns((prev) => [...prev, newColumnName]);
    fileEditor.setAddedRows((prev) =>
      prev.map((r) => ({ ...r, [newColumnName]: "" }))
    );

    //
    setEditingHeader(newColumnName);
  };

  const handleRemoveColumn = (columnName: string) => {
    fileEditor.pushHistory();
    const originalName =
      Object.entries(fileEditor.editedHeaders).find(
        ([_, newName]) => newName === columnName
      )?.[0] || columnName;

    if (fileEditor.addedColumns.includes(originalName)) {
      fileEditor.setAddedColumns((prev) =>
        prev.filter((col) => col !== originalName)
      );
    } else {
      fileEditor.setDeletedColumns((prev) => new Set(prev).add(originalName));
    }
  };

  const handleAddRow = () => {
    fileEditor.pushHistory();
    const newRow: any = {};
    headers.forEach((h) => (newRow[h] = ""));
    fileEditor.setAddedRows((prev) => [...prev, newRow]);
  };

  const handleRemoveRow = (rowIndex: number) => {
    fileEditor.pushHistory();
    if (rowIndex >= originalRows.length) {
      const addedIndex = rowIndex - originalRows.length;
      fileEditor.setAddedRows((prev) =>
        prev.filter((_, i) => i !== addedIndex)
      );
    } else {
      fileEditor.setDeletedRows((prev) => new Set(prev).add(rowIndex));
    }
  };

  const validateCell = (
    columnName: string,
    value: any
  ): { isValid: boolean; error?: string } => {
    if (!schema || !schema.shape[columnName]) {
      return { isValid: true };
    }

    // Strict validation for period_start_date: mm/d/yyyy format
    if (columnName === "period_start_date") {
      const datePattern =
        /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(value)) {
        return {
          isValid: false,
          error:
            "Must be in mm/d/yyyy format (e.g., 3/1/2024 or 12/1/2024): Usually first day of the beginning of the quater",
        };
      }

      // Additional validation: Check if it's a valid date
      const [month, day, year] = value.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getMonth() + 1 !== month || date.getDate() !== day) {
        return {
          isValid: false,
          error: "Invalid date (e.g., 2/30/2024 doesn't exist)",
        };
      }

      return { isValid: true };
    }

    // Strict validation for fy_q: FY[YY] Q[1-4] format
    if (columnName === "fy_q") {
      const fyqPattern = /^FY\d{2} Q[1-4]$/;
      if (!fyqPattern.test(value)) {
        return {
          isValid: false,
          error: "Must be in FY[YY] Q[1-4] format (e.g., FY25 Q1, FY30 Q3)",
        };
      }
      return { isValid: true };
    }

    try {
      schema.shape[columnName].parse(value);
      return { isValid: true };
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || "Invalid value";
      return { isValid: false, error: errorMessage };
    }
  };

  // Check if a column should use textarea
  const isTextareaColumn = (columnName: string): boolean => {
    if (!schema || !schema.shape[columnName]) return false;
    return isTextAreaField(schema.shape[columnName]);
  };

  // ========================================================
  // 🧾 RENDER
  // ========================================================
  return (
    <div className="px-4">
      {/* Banner */}
      <div className="sticky top-0 z-10 bg-background">
        {missingColumns.length > 0 && (
          <Banner
            className="shadow-lg"
            title={`Dataset is missing ${
              missingColumns.length
            } required column${missingColumns.length > 1 ? "s" : ""}`}
            variant="error"
            description=""
            closable={false}
            collapsible={true}
            defaultOpen={true}
            body={
              <div className="flex flex-wrap gap-2 mt-1">
                {missingColumns.map((col) => (
                  <span
                    key={col}
                    className="bg-red-800 text-white px-2 py-1 rounded-full text-xs"
                  >
                    {col}
                  </span>
                ))}
              </div>
            }
          />
        )}

        {fileError && (
          <Banner
            className="shadow-lg"
            title="Upload Failed"
            variant="error"
            description={fileError}
            closable={true}
            collapsible={true}
            defaultOpen={true}
          />
        )}
        <div className="flex justify-between pb-2 pt-2">
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddColumn}>
              <Plus size={16} /> Add Column
            </Button>
            <Button size="sm" variant="green" onClick={handleAddRow}>
              <Plus size={16} /> Add Row
            </Button>
          </div>

          <div className="flex gap-1">
            <Tooltip title="Undo" zIndex={999999900}>
              <Button
                size="icon"
                variant="ghost"
                onClick={fileEditor.handleUndo}
                disabled={!fileEditor.canUndo}
                className="rounded-full"
              >
                <Undo size={16} />
              </Button>
            </Tooltip>

            <Tooltip title="Redo" zIndex={999999900}>
              <Button
                aria-label="Redo"
                size="icon"
                variant="ghost"
                onClick={fileEditor.handleRedo}
                disabled={!fileEditor.canRedo}
                className="rounded-full"
              >
                <Redo size={16} />
              </Button>
            </Tooltip>

            <Tooltip title="Cancel" zIndex={999999900}>
              <Button
                size="icon"
                variant="ghost"
                onClick={fileEditor.handleCancel}
                className="text-red-600 rounded-full"
              >
                <RotateCcw size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-2 py-2 w-10"></th>
              {headers.map((h, i) => {
                const isTextarea = isTextareaColumn(h);
                return (
                  <th
                    key={i}
                    className={`px-4 py-2 text-left group relative ${
                      isTextarea ? "w-1/3 min-w-[310px]" : ""
                    }`}
                  >
                    {editingHeader === h ? (
                      <input
                        type="text"
                        defaultValue={h}
                        autoFocus
                        className="w-full px-2 py-1 border rounded min-w-32"
                        onBlur={(e) => {
                          handleHeaderChange(h, e.target.value);
                          setEditingHeader(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleHeaderChange(h, e.currentTarget.value);
                            setEditingHeader(null);
                          }
                          if (e.key === "Escape") setEditingHeader(null);
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span
                          className="cursor-pointer hover:text-blue-600"
                          onClick={() => setEditingHeader(h)}
                        >
                          {h}
                        </span>
                        <button
                          onClick={() => handleRemoveColumn(h)}
                          className="opacity-0 group-hover:opacity-100 ml-2 text-red-600 hover:text-red-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="group hover:bg-gray-50">
                <td className="px-2 py-2 border-t text-center">
                  <button
                    onClick={() => handleRemoveRow(rowIndex)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
                {headers.map((h, colIndex) => {
                  const validation = validateCell(h, row[h]);
                  const isInvalid = !validation.isValid;
                  const isTextArea = isTextareaColumn(h);
                  return (
                    <td
                      key={colIndex}
                      className={`px-4 py-2 border-t cursor-pointer hover:bg-blue-50 ${
                        isInvalid ? "bg-red-50" : ""
                      }`}
                      onClick={() => setEditingCell({ row: rowIndex, col: h })}
                    >
                      {editingCell?.row === rowIndex &&
                      editingCell?.col === h ? (
                        isTextArea ? (
                          <textarea
                            defaultValue={row[h] || ""}
                            autoFocus
                            //   className="w-full px-2 py-1 border rounded"
                            className={`w-full px-2 py-1 border rounded min-h-[150px] resize-y ${
                              isInvalid ? "border-red-500" : ""
                            }`}
                            onBlur={(e) => {
                              handleCellChange(rowIndex, h, e.target.value);
                              setEditingCell(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCellChange(
                                  rowIndex,
                                  h,
                                  e.currentTarget.value
                                );
                                setEditingCell(null);
                              }
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            defaultValue={row[h] || ""}
                            autoFocus
                            //   className="w-full px-2 py-1 border rounded"
                            className={`w-full px-2 py-1 border rounded ${
                              isInvalid ? "border-red-500" : ""
                            }`}
                            onBlur={(e) => {
                              handleCellChange(rowIndex, h, e.target.value);
                              setEditingCell(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCellChange(
                                  rowIndex,
                                  h,
                                  e.currentTarget.value
                                );
                                setEditingCell(null);
                              }
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                          />
                        )
                      ) : (
                        <Tooltip
                          title={isInvalid ? validation.error : null}
                          zIndex={999999999}
                        >
                          <span
                            className={isTextArea ? "whitespace-pre-wrap" : ""}
                          >
                            {row[h]}
                          </span>
                        </Tooltip>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 50 && (
        <p className="text-muted-foreground mt-2">Showing first 50 rows only</p>
      )}
    </div>
  );
}
