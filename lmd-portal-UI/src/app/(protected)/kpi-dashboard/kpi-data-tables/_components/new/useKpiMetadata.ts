import { useState, useEffect, useMemo } from "react";
import { metadataService } from "./metadata.service";
import { MetadataState } from "./types";

export const useKpiMetadata = (tableId: string | null) => {
  const [state, setState] = useState<MetadataState>({
    data: [],
    isLoading: true,
    error: null,
    currentMetadata: null,
  });

  // Load metadata on mount
  useEffect(() => {
    let mounted = true;

    const loadMetadata = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const metadata = await metadataService.fetchMetadata();

        if (mounted) {
          setState((prev) => ({
            ...prev,
            data: metadata,
            isLoading: false,
          }));
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load metadata",
            isLoading: false,
          }));
        }
      }
    };

    loadMetadata();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Find current metadata when tableId or data changes
  const currentMetadata = useMemo(() => {
    if (!tableId || state.data.length === 0) return null;
    return metadataService.findMetadata(tableId);
  }, [tableId, state.data]);

  return {
    ...state,
    currentMetadata,
    refetch: () => {
      metadataService.clearCache();
      // Trigger re-fetch logic if needed
    },
  };
};
