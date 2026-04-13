import React from "react";
import Banner from "@/components/ui/banner/banner";
import { IKpiMetadata } from "./types";

interface MetadataBannerProps {
  metadata: IKpiMetadata | null;
  isLoading: boolean;
  error: string | null;
  tableId: string | null;
}

export const MetadataBanner: React.FC<MetadataBannerProps> = ({
  metadata,
  isLoading,
  error,
  tableId,
}) => {
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
        className="mb-4"
      />
    );
  }

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
        className="mb-4"
      />
    );
  }

  if (!metadata) {
    return (
      <Banner
        collapsible={false}
        variant="info"
        body={
          <div className="text-sm">
            <p>
              No metadata found for indicator ID: <code>{tableId}</code>
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
        className="mb-4"
      />
    );
  }

  return (
    <Banner
      collapsible={true}
      defaultOpen={false}
      variant="info"
      body={<MetadataContent metadata={metadata} />}
      title="Indicator Metadata"
      description=""
      closable={false}
      className="mb-4"
    />
  );
};

const MetadataContent: React.FC<{ metadata: IKpiMetadata }> = ({
  metadata,
}) => (
  <div>
    <ol className="text-sm space-y-2">
      <li>ID: {metadata.ID}</li>
      <li>
        <span className="font-semibold underline mr-2">Name:</span>
        {metadata["Indicator Name"] || "Not specified"}
      </li>
      {metadata.Definition && (
        <li>
          <span className="font-semibold underline mr-2">Definition:</span>
          {metadata.Definition}
        </li>
      )}
      {metadata["Data Source"] && (
        <li>
          <span className="font-semibold underline mr-2">Data Source:</span>
          {metadata["Data Source"]}
        </li>
      )}
      {metadata["Contributing Activities"] && (
        <li>
          <span className="font-semibold underline mr-2">
            Contributing Activities:
          </span>
          {metadata["Contributing Activities"]}
        </li>
      )}
      {metadata.Notes && (
        <li>
          <span className="font-semibold underline mr-2">Notes:</span>
          {metadata.Notes}
        </li>
      )}
      <li>
        <span className="font-semibold underline mr-2">TOC Category:</span>
        {metadata.TOC} - {metadata["TOC Description"]}
      </li>
      {metadata["Person Responsible"] && (
        <li>
          <span className="font-semibold underline mr-2">
            Person Responsible:
          </span>
          {metadata["Person Responsible"]}
        </li>
      )}
      {metadata.Approvers && (
        <li>
          <span className="font-semibold underline mr-2">Approvers:</span>
          {metadata.Approvers}
        </li>
      )}
    </ol>
  </div>
);
