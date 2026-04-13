import Banner from "@/components/ui/banner/banner";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IKpiMetadata } from "./new/types";
import { cn } from "@/lib/utils";
import { MessageCircleWarning } from "lucide-react";

interface KpiDatasetMetadataProps {
  tablename: string | null;
  className?: string;
}

const METADATA_LOAD_DELAY = 100;

function KpiDatasetMetadata({ tablename, className }: KpiDatasetMetadataProps) {
  const [metadata, setMetadata] = useState<IKpiMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch metadata
  const fetchKpiMetadata = useCallback(async (): Promise<IKpiMetadata[]> => {
    try {
      const kpiMetadata = await import("../_components/kpi-metadata.json");
      return new Promise((resolve) => {
        setTimeout(
          () => resolve(kpiMetadata.default as IKpiMetadata[]),
          METADATA_LOAD_DELAY,
        );
      });
    } catch (error) {
      console.error("Error fetching kpi metadata", error);
      throw new Error("Failed to load KPI metadata");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchKpiMetadata();

        if (isMounted) {
          setMetadata(data);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load metadata";
          setError(errorMessage);
          console.error("Failed to load KPI metadata:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMetadata();

    return () => {
      isMounted = false;
    };
  }, [fetchKpiMetadata]);

  // Exact match only — no fuzzy logic
  const kpiMetadata = useMemo((): IKpiMetadata | null => {
    if (!tablename || metadata.length === 0) return null;
    return metadata.find((item) => item.ID === tablename) ?? null;
  }, [tablename, metadata]);

  // Loading state
  if (isLoading) {
    return (
      <Banner
        collapsible={false}
        variant="info"
        body={
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            <span className="text-sm">Loading indicator metadata...</span>
          </div>
        }
        title="Loading Metadata"
        description=""
        closable={false}
        className={cn("", className)}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <Banner
        collapsible={false}
        variant="error"
        body={
          <div className="text-sm">
            <p>Failed to load metadata: {error}</p>
            <p className="mt-1 text-xs">
              The form will still work, but indicator information won&apos;t be
              available.
            </p>
          </div>
        }
        title="Metadata Load Error"
        description=""
        closable={false}
        className={cn("", className)}
      />
    );
  }

  // Not found state
  if (!kpiMetadata && tablename) {
    return (
      <Banner
        collapsible={false}
        variant="info"
        body={
          <div className="text-sm">
            <p>
              No metadata found for indicator ID: <code>{tablename}</code>
            </p>
            <p className="mt-1 text-xs text-gray-600">
              This indicator may not be in the metadata registry or the ID
              mapping needs to be updated.
            </p>
          </div>
        }
        title="Metadata Not Found"
        description=""
        closable={false}
        className={cn("", className)}
      />
    );
  }

  // Success state - metadata found
  if (kpiMetadata) {
    return (
      <Banner
        collapsible={true}
        defaultOpen={true}
        icon={MessageCircleWarning}
        variant="info"
        title="Indicator Metadata"
        description=""
        closable={false}
        className={cn("", className)}
        body={
          <div className="h-[9rem] overflow-y-scroll">
            <dl className="text-sm space-y-2">
              <div>
                <dt className="font-semibold">ID:</dt>
                <dd>{kpiMetadata.ID}</dd>
              </div>
              <div>
                <dt className="font-semibold underline">Name:</dt>
                <dd>{kpiMetadata["Indicator Name"] || "Not specified"}</dd>
              </div>
              {kpiMetadata.Definition && (
                <div>
                  <dt className="font-semibold underline">Definition:</dt>
                  <dd>{kpiMetadata.Definition}</dd>
                </div>
              )}
              {kpiMetadata["Data Source"] && (
                <div>
                  <dt className="font-semibold underline">Data Source:</dt>
                  <dd>{kpiMetadata["Data Source"]}</dd>
                </div>
              )}
              {kpiMetadata["Contributing Activities"] && (
                <div>
                  <dt className="font-semibold underline">
                    Contributing Activities:
                  </dt>
                  <dd>{kpiMetadata["Contributing Activities"]}</dd>
                </div>
              )}
              {kpiMetadata.Notes && (
                <div>
                  <dt className="font-semibold underline">Notes:</dt>
                  <dd>{kpiMetadata.Notes}</dd>
                </div>
              )}
              <div>
                <dt className="font-semibold underline">TOC Category:</dt>
                <dd>
                  {kpiMetadata.TOC} - {kpiMetadata["TOC Description"]}
                </dd>
              </div>
              {kpiMetadata["Person Responsible"] && (
                <div>
                  <dt className="font-semibold underline">
                    Person Responsible:
                  </dt>
                  <dd>{kpiMetadata["Person Responsible"]}</dd>
                </div>
              )}
              {kpiMetadata.Approvers && (
                <div>
                  <dt className="font-semibold underline">Approvers:</dt>
                  <dd>{kpiMetadata.Approvers}</dd>
                </div>
              )}
            </dl>
          </div>
        }
      />
    );
  }

  // No banner needed
  return null;
}

export default KpiDatasetMetadata;
