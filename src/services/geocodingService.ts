import type { GeoPoint, Restaurant } from '../types/restaurant';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'GourmetRadar/1.0 (+https://github.com/gourmet-radar)';
const CACHE_KEY = 'gourmetRadarGeocodingCache';
const CACHE_EXPIRY_DAYS = 30;
const MIN_REQUEST_INTERVAL = 1100;

interface CacheEntry {
  point: GeoPoint;
  timestamp: number;
}

export class GeocodingService {
  private memoryCache: Map<string, GeoPoint> = new Map();
  private lastRequestTime = 0;

  constructor() {
    this.loadCacheFromLocalStorage();
  }

  private loadCacheFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const cache: Record<string, CacheEntry> = JSON.parse(stored);
        const now = Date.now();
        const expiryMs = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

        for (const [key, entry] of Object.entries(cache)) {
          if (now - entry.timestamp < expiryMs) {
            this.memoryCache.set(key, entry.point);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load geocoding cache from localStorage:', error);
    }
  }

  private saveCacheToLocalStorage(): void {
    try {
      const cache: Record<string, CacheEntry> = {};
      const now = Date.now();
      for (const [key, point] of this.memoryCache.entries()) {
        cache[key] = { point, timestamp: now };
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save geocoding cache to localStorage:', error);
    }
  }

  /**
   * Geocode an address using Nominatim/OpenStreetMap
   */
  async geocodeAddress(address: string): Promise<GeoPoint> {
    const cacheKey = address.toLowerCase().trim();

    // Check memory cache first
    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey)!;
    }

    // Rate limiting
    await this.rateLimit();

    try {
      const url = new URL(NOMINATIM_URL);
      url.searchParams.set('q', address);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', '1');
      url.searchParams.set('addressdetails', '1');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          const geoPoint: GeoPoint = { latitude: lat, longitude: lon };
          this.memoryCache.set(cacheKey, geoPoint);
          this.saveCacheToLocalStorage();
          return geoPoint;
        }
      }

      const nullPoint: GeoPoint = { latitude: null, longitude: null };
      this.memoryCache.set(cacheKey, nullPoint);
      this.saveCacheToLocalStorage();
      return nullPoint;
    } catch (error) {
      console.error('Geocoding error:', error);
      const nullPoint: GeoPoint = { latitude: null, longitude: null };
      this.memoryCache.set(cacheKey, nullPoint);
      this.saveCacheToLocalStorage();
      return nullPoint;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    await this.rateLimit();

    try {
      const url = new URL('https://nominatim.openstreetmap.org/reverse');
      url.searchParams.set('format', 'json');
      url.searchParams.set('lat', latitude.toString());
      url.searchParams.set('lon', longitude.toString());
      url.searchParams.set('addressdetails', '1');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Nominatim reverse API error: ${response.status}`);
      }

      const data = await response.json();
      return data?.display_name ?? null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Geocode multiple restaurants in parallel with rate limiting
   */
  async geocodeRestaurants(restaurants: Restaurant[]): Promise<Restaurant[]> {
    const results = await Promise.all(
      restaurants.map(async (restaurant) => {
        if (restaurant.latitude !== null && restaurant.longitude !== null) {
          return restaurant;
        }

        const addressParts = [
          restaurant.address,
          restaurant.city,
          restaurant.province,
          restaurant.region,
          restaurant.country,
        ].filter(Boolean).join(', ');

        const point = await this.geocodeAddress(addressParts);
        return {
          ...restaurant,
          latitude: point.latitude,
          longitude: point.longitude,
        };
      })
    );
    return results;
  }

  /**
   * Rate limit requests to Nominatim (min 1.1s between requests)
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.memoryCache.clear();
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear geocoding cache from localStorage:', error);
    }
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.memoryCache.size,
      entries: Array.from(this.memoryCache.keys()),
    };
  }
}

export const geocodingService = new GeocodingService();