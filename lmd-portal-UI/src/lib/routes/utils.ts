export type Route = {
  label: string;
  name: string;
  href: string;
  description?: string;
  keywords?: string[];
  parentRoute?: string;
  isSearchable?: boolean;
  metadata?: Record<string, any>;
};

export type Metadata = {
  label?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  isSearchable?: boolean;
  [key: string]: any;
};

export function extractMetadata(content: string): Metadata {
  // Extract metadata from JSDoc comments or export const metadata
  const metadataMatch = content.match(
    /export\s+const\s+metadata\s*=\s*({[\s\S]*?});/
  );
  if (!metadataMatch) return {};

  try {
    // Basic parsing - in production you might want a more robust solution
    return JSON.parse(
      metadataMatch[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
    );
  } catch {
    return {};
  }
}

export function getDefaultLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  return segments[0]?.charAt(0).toUpperCase() + segments[0]?.slice(1) || "Home";
}

export function getDefaultName(path: string): string {
  const segments = path.split("/").filter(Boolean);
  return (
    segments[segments.length - 1]?.charAt(0).toUpperCase() +
      segments[segments.length - 1]?.slice(1).replace(/-/g, " ") || "Home"
  );
}

export function generateKeywords(route: Route): string[] {
  const words = [
    route.label,
    route.name,
    ...route.href.split("/").filter(Boolean),
  ];

  const keywordSet = new Map();
  words.forEach((word) => {
    word
      .toLowerCase()
      .replace(/-/g, " ")
      .split(" ")
      .filter(Boolean)
      .forEach((keyword) => keywordSet.set(keyword, true));
  });

  return Array.from(keywordSet.keys());
}

export function mergeRoutes(
  autoRoutes: Route[],
  manualRoutes: Route[]
): Route[] {
  const merged = new Map<string, Route>();

  manualRoutes.forEach((route) => {
    merged.set(route.href, route);
  });

  autoRoutes.forEach((route) => {
    if (merged.has(route.href)) {
      const existing = merged.get(route.href)!;
      const combinedKeywords = new Map();

      [...(existing.keywords || []), ...(route.keywords || [])].forEach((k) =>
        combinedKeywords.set(k, true)
      );

      merged.set(route.href, {
        ...existing,
        ...route,
        keywords: Array.from(combinedKeywords.keys()),
        metadata: { ...(existing.metadata || {}), ...(route.metadata || {}) },
      });
    } else {
      merged.set(route.href, route);
    }
  });

  return Array.from(merged.values());
}
