import { ReportType } from "@/types/report";

/**
 * Detects report type from URL based on filename or keywords
 */
export function detectReportTypeFromUrl(url: string): ReportType | null {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("donor") || lowerUrl.includes("funder")) {
    return "donor_report";
  }
  if (lowerUrl.includes("data") || lowerUrl.includes("analysis")) {
    return "data_review";
  }
  if (lowerUrl.includes("impact")) {
    return "impact_report";
  }
  if (
    lowerUrl.includes("quarterly") ||
    lowerUrl.includes("q1") ||
    lowerUrl.includes("q2") ||
    lowerUrl.includes("q3") ||
    lowerUrl.includes("q4")
  ) {
    return "quarterly_report";
  }
  if (lowerUrl.includes("annual") || lowerUrl.includes("year")) {
    return "annual_report";
  }
  if (lowerUrl.includes("case") || lowerUrl.includes("study")) {
    return "case_study";
  }

  return null;
}

/**
 * Extracts Google Drive file ID from various URL formats
 */
export function extractGoogleDriveId(url: string): string | null {
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Gets the appropriate embed URL for Google Drive content
 */
export function getGoogleDriveEmbedUrl(url: string): string {
  const fileId = extractGoogleDriveId(url);
  if (!fileId) return url;

  // Determine content type
  if (url.includes("/presentation/")) {
    return `https://docs.google.com/presentation/d/${fileId}/embed`;
  }
  if (url.includes("/document/")) {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }
  if (url.includes("/spreadsheets/")) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  }

  // Default to preview
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Determines file type from URL
 */
export function getFileType(
  url: string
): "pdf" | "presentation" | "document" | "spreadsheet" | "video" | "unknown" {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes(".pdf") || lowerUrl.includes("/pdf/")) {
    return "pdf";
  }
  if (lowerUrl.includes("/presentation/") || lowerUrl.includes(".ppt")) {
    return "presentation";
  }
  if (lowerUrl.includes("/document/") || lowerUrl.includes(".doc")) {
    return "document";
  }
  if (lowerUrl.includes("/spreadsheets/") || lowerUrl.includes(".xls")) {
    return "spreadsheet";
  }
  if (
    lowerUrl.includes("youtube.com") ||
    lowerUrl.includes("vimeo.com") ||
    lowerUrl.includes(".mp4")
  ) {
    return "video";
  }

  return "unknown";
}

export const getTagsArray = (tags: string): string[] => {
  if (!tags) return [];
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

// Convert Google Drive URLs to preview URLs for embedding
// Note: Files must have "Anyone with the link" sharing enabled for previews to work
export const getGDrivePreviewUrl = (url: string): string => {
  if (!url) return url;

  // Check if it's a Google Drive URL
  if (!url.includes("drive.google.com")) return url;

  // Extract file ID from various Google Drive URL formats
  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  // Format 2: https://drive.google.com/open?id=FILE_ID
  // Format 3: https://drive.google.com/uc?id=FILE_ID

  let fileId = "";

  // Pattern 1: /file/d/{fileId}/
  const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
  if (fileIdMatch) {
    fileId = fileIdMatch[1];
  }

  // Pattern 2: ?id={fileId} or &id={fileId}
  if (!fileId) {
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    }
  }

  // If we found a file ID, construct preview URL
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // Return original URL if we couldn't extract file ID
  return url;
};
