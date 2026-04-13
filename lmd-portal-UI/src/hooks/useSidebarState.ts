"use client";

import { useCallback, useState, useEffect } from "react";

/**
 * Persists sidebar collapsed state to localStorage.
 *
 * Initialises with `defaultCollapsed` on both server and client to avoid
 * hydration mismatches, then syncs from localStorage after mount.
 */
export function useSidebarState(
  storageKey: string,
  defaultCollapsed = false
): [boolean, () => void] {
  // Always start with defaultCollapsed so server and client render the same HTML.
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  // After hydration, overwrite with the stored preference if one exists.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setIsCollapsed(JSON.parse(stored) as boolean);
      }
    } catch {
      // localStorage unavailable — keep defaultCollapsed
    }
  }, [storageKey]);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // localStorage unavailable — still update state
      }
      return next;
    });
  }, [storageKey]);

  return [isCollapsed, toggle];
}
