/**
 * Gets the user's location information in the format needed for analytics events
 * with built-in caching to improve performance
 */
export class LocationService {
  private static instance: LocationService;
  private locationCache: LocationData | null = null;
  private locationPromise: Promise<LocationData> | null = null;
  private lastLocationFetch: number = 0;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get singleton instance of LocationService
   */
  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Gets the user's location with caching
   * @param forceRefresh Set to true to ignore cache and fetch fresh data
   * @returns Promise that resolves to location data
   */
  public async getUserLocation(forceRefresh = false): Promise<LocationData> {
    // Return cached location if it exists and isn't expired
    const now = Date.now();
    if (
      this.locationCache &&
      now - this.lastLocationFetch < this.CACHE_DURATION &&
      !forceRefresh
    ) {
      return this.locationCache;
    }

    // If a request is already in progress, wait for it
    if (this.locationPromise) {
      return this.locationPromise;
    }

    // Default values in case location fetching fails
    const defaultLocation: LocationData = {
      DeviceLocationCountry: "Unknown",
      DeviceLocationCity: "Unknown",
      DeviceLocationContinent: "Unknown",
      DeviceCoordinates: {
        lat: "0",
        long: "0",
      },
      DeviceIPAddress: "0.0.0.0",
    };

    // If running server-side, return defaults
    if (typeof window === "undefined") {
      return defaultLocation;
    }

    // Start a new location request
    this.locationPromise = this.fetchLocationData(defaultLocation);

    try {
      const locationData = await this.locationPromise;
      this.locationCache = locationData;
      this.lastLocationFetch = Date.now();
      return locationData;
    } catch (error) {
      console.error("Error getting location:", error);
      return defaultLocation;
    } finally {
      this.locationPromise = null;
    }
  }

  /**
   * Fetch fresh location data from APIs
   */
  private async fetchLocationData(
    defaultLocation: LocationData
  ): Promise<LocationData> {
    try {
      // Start with getting coordinates from browser geolocation API
      let latitude: number | null = null;
      let longitude: number | null = null;

      try {
        // Try geolocation API with timeout
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            if ("geolocation" in navigator) {
              const timeoutId = setTimeout(
                () => reject(new Error("Geolocation timeout")),
                3000
              );

              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  clearTimeout(timeoutId);
                  resolve(pos);
                },
                (err) => {
                  clearTimeout(timeoutId);
                  reject(err);
                },
                { enableHighAccuracy: false, timeout: 3000, maximumAge: 60000 }
              );
            } else {
              reject(new Error("Geolocation not supported"));
            }
          }
        );

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (error) {
        // Fallback to IP-based geolocation
        try {
          const ipResponse = await fetch("https://geolocation-db.com/json/");
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            latitude = ipData.latitude;
            longitude = ipData.longitude;
          }
        } catch (ipError) {
          console.error("IP geolocation fallback failed:", ipError);
        }
      }

      // If we couldn't get coordinates, return default values
      if (latitude === null || longitude === null) {
        return defaultLocation;
      }

      // Get IP address
      let ipAddress = "0.0.0.0";
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        }
      } catch (ipError) {
        console.error("Failed to fetch IP address:", ipError);
      }

      // Get location data from BigDataCloud API
      const geocodingResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (!geocodingResponse.ok) {
        throw new Error("Failed to fetch location data");
      }

      const geocodingData = await geocodingResponse.json();

      // Return the location data in the required format
      return {
        DeviceLocationCountry:
          geocodingData.countryName || defaultLocation.DeviceLocationCountry,
        DeviceLocationCity:
          geocodingData.city ||
          geocodingData.locality ||
          defaultLocation.DeviceLocationCity,
        DeviceLocationContinent:
          geocodingData.continent || defaultLocation.DeviceLocationContinent,
        DeviceCoordinates: {
          lat: String(latitude),
          long: String(longitude),
        },
        DeviceIPAddress: ipAddress,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return defaultLocation;
    }
  }

  /**
   * Clear the location cache, forcing next call to fetch fresh data
   */
  public clearCache(): void {
    this.locationCache = null;
    this.lastLocationFetch = 0;
  }
}

// Interface for location data format
interface LocationData {
  DeviceLocationCountry: string;
  DeviceLocationCity: string;
  DeviceLocationContinent: string;
  DeviceCoordinates: {
    lat: string;
    long: string;
  };
  DeviceIPAddress: string;
}

// Export a singleton instance for easy access
export const locationService = LocationService.getInstance();

// Convenience function for simpler API
export async function getUserLocation(
  forceRefresh = false
): Promise<LocationData> {
  return locationService.getUserLocation(forceRefresh);
}
