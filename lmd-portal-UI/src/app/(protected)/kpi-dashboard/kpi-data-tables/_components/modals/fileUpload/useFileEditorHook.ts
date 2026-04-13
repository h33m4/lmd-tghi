import { useState, useEffect } from "react";

type HistorySnapshot = {
  editedHeaders: Record<string, string>;
  editedCells: Record<string, any>;
  deletedColumns: Set<string>;
  addedColumns: string[];
  deletedRows: Set<number>;
  addedRows: any[];
};

export function useFileEditor(fileData: any) {
  // Edit state
  const [editedHeaders, setEditedHeaders] = useState<Record<string, string>>(
    {}
  );
  const [editedCells, setEditedCells] = useState<Record<string, any>>({});
  const [deletedColumns, setDeletedColumns] = useState<Set<string>>(new Set());
  const [addedColumns, setAddedColumns] = useState<string[]>([]);
  const [deletedRows, setDeletedRows] = useState<Set<number>>(new Set());
  const [addedRows, setAddedRows] = useState<any[]>([]);

  // History state
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [future, setFuture] = useState<HistorySnapshot[]>([]);
  const [initialSnapshot, setInitialSnapshot] =
    useState<HistorySnapshot | null>(null);

  // Capture initial snapshot when fileData changes
  useEffect(() => {
    if (fileData) {
      const snapshot = getSnapshot();
      setInitialSnapshot(snapshot);
      setHistory([]);
      setFuture([]);
    }
  }, [fileData]);

  // Helper functions
  const getSnapshot = (): HistorySnapshot => ({
    editedHeaders,
    editedCells,
    deletedColumns: new Set(deletedColumns),
    addedColumns: [...addedColumns],
    deletedRows: new Set(deletedRows),
    addedRows: [...addedRows],
  });

  const restoreSnapshot = (s: HistorySnapshot) => {
    setEditedHeaders({ ...s.editedHeaders });
    setEditedCells({ ...s.editedCells });
    setDeletedColumns(new Set(s.deletedColumns));
    setAddedColumns([...s.addedColumns]);
    setDeletedRows(new Set(s.deletedRows));
    setAddedRows([...s.addedRows]);
  };

  const pushHistory = () => {
    setHistory((prev) => [...prev, getSnapshot()]);
    setFuture([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prevState = history[history.length - 1];
    setFuture((f) => [getSnapshot(), ...f]);
    restoreSnapshot(prevState);
    setHistory((h) => h.slice(0, -1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const nextState = future[0];
    setHistory((h) => [...h, getSnapshot()]);
    restoreSnapshot(nextState);
    setFuture((f) => f.slice(1));
  };

  const handleCancel = () => {
    if (initialSnapshot) {
      restoreSnapshot(initialSnapshot);
      setHistory([]);
      setFuture([]);
    }
  };

  const reset = () => {
    setEditedHeaders({});
    setEditedCells({});
    setDeletedColumns(new Set());
    setAddedColumns([]);
    setDeletedRows(new Set());
    setAddedRows([]);
    setHistory([]);
    setFuture([]);
    setInitialSnapshot(null);
  };

  return {
    // Edit state
    editedHeaders,
    setEditedHeaders,
    editedCells,
    setEditedCells,
    deletedColumns,
    setDeletedColumns,
    addedColumns,
    setAddedColumns,
    deletedRows,
    setDeletedRows,
    addedRows,
    setAddedRows,
    // History functions
    pushHistory,
    handleUndo,
    handleRedo,
    handleCancel,
    reset,
    // History availability
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  };
}
