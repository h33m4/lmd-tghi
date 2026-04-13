import { IKpiMetadata } from "./types";

class MetadataService {
  private cache = new Map<string, IKpiMetadata>();
  private metadataList: IKpiMetadata[] = [];

  /**
   * Initialize metadata from source (API or static import)
   */
  async fetchMetadata(): Promise<IKpiMetadata[]> {
    try {
      // In production, this would be an API call
      // For now, using dynamic import to simulate async loading
      const kpiMetadata = await import("../../_components/kpi-metadata.json");
      this.metadataList = kpiMetadata.default as IKpiMetadata[];
      return this.metadataList;
    } catch (error) {
      console.error("Error fetching KPI metadata:", error);
      throw new Error("Failed to load KPI metadata");
    }
  }

  /**
   * Find metadata with intelligent matching
   */
  findMetadata(tableId: string): IKpiMetadata | null {
    if (!tableId || this.metadataList.length === 0) return null;

    // Check cache first
    if (this.cache.has(tableId)) {
      return this.cache.get(tableId)!;
    }

    // Try exact match
    let metadata = this.metadataList.find((item) => item.ID === tableId);

    if (!metadata) {
      // Try normalized matching
      metadata = this.findByNormalizedId(tableId);
    }

    if (!metadata) {
      // Try mapping rules
      metadata = this.findByMappingRules(tableId);
    }

    // Cache the result (even if null to avoid repeated searches)
    if (metadata) {
      this.cache.set(tableId, metadata);
    }

    return metadata || null;
  }

  private findByNormalizedId(tableId: string): IKpiMetadata | undefined {
    const normalizedTableId = this.normalizeId(tableId);

    return this.metadataList.find((item) => {
      const normalizedItemId = this.normalizeId(item.ID);
      return (
        normalizedItemId === normalizedTableId ||
        normalizedItemId.includes(normalizedTableId) ||
        normalizedTableId.includes(normalizedItemId)
      );
    });
  }

  private findByMappingRules(tableId: string): IKpiMetadata | undefined {
    // Configurable mapping rules
    const mappingRules = this.getMappingRules();
    const mappedId = mappingRules[tableId];

    if (mappedId) {
      return this.metadataList.find((item) => item.ID === mappedId);
    }

    return undefined;
  }

  private normalizeId(id: string): string {
    return id
      .toLowerCase()
      .replace(/^([a-z]{2,3}_)/, "") // Remove any country prefix
      .replace(/_(\d+)$/, ""); // Remove any numeric suffix
  }

  private getMappingRules(): Record<string, string> {
    // This could be loaded from configuration
    return {
      cross_cutting_1: "gs_cross_cutting_1",
      cross_cutting_2: "gs_cross_cutting_2",
      strengthen_1: "lib_strengthen_1",
      upskill_1: "lib_upskill_1",
      deliver_1: "lib_deliver_1",
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const metadataService = new MetadataService();
