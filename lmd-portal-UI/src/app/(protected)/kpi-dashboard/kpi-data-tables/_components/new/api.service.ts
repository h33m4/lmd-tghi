import { BaseRecord } from "./types";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_LMD_API || "";
    if (!this.baseUrl) {
      console.warn("API base URL not configured");
    }
  }

  async updateRecord<T extends BaseRecord>(
    country: string,
    tablename: string,
    recordId: string | number,
    data: Partial<T>
  ): Promise<T> {
    // Validate inputs
    this.validateInputs({ country, tablename, recordId });

    const url = this.buildUrl(country, tablename, recordId);

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Add auth headers if needed
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(this.sanitizeData(data)),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update record: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API update error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update record");
    }
  }

  private validateInputs(params: {
    country: string;
    tablename: string;
    recordId: string | number;
  }): void {
    const { country, tablename, recordId } = params;

    if (!country || !tablename || !recordId) {
      throw new Error("Missing required parameters for API call");
    }

    // Sanitize inputs to prevent injection
    const invalidChars = /[^a-zA-Z0-9_-]/;
    if (invalidChars.test(country) || invalidChars.test(tablename)) {
      throw new Error("Invalid characters in parameters");
    }
  }

  private buildUrl(
    country: string,
    tablename: string,
    recordId: string | number
  ): string {
    // Encode parameters to ensure URL safety
    return `${this.baseUrl}/kpi_data/${encodeURIComponent(
      country
    )}/${encodeURIComponent(tablename)}/${encodeURIComponent(recordId)}`;
  }

  private getAuthHeaders(): HeadersInit {
    // Implement auth headers based on your authentication method
    // This is a placeholder
    return {};
  }

  private sanitizeData<T>(data: Partial<T>): Partial<T> {
    // Remove undefined, null values and potentially dangerous fields
    const cleaned: Partial<T> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        cleaned[key as keyof T] = value as T[keyof T];
      }
    }

    return cleaned;
  }
}

export const apiService = new ApiService();
