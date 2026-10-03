import type { RouteInfo, Restaurant, GeoPoint } from '../types/restaurant';

const OSRM_ROUTE_URL = 'https://router.project-osrm.org/route/v1/driving';
const OSRM_TABLE_URL = 'https://router.project-osrm.org/table/v1/driving';
const MIN_REQUEST_INTERVAL = 1000;

interface CacheEntry {
  info: RouteInfo;
  timestamp: number;
}

export class RoutingService {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private lastRequestTime = 0;

  /**
   * Calculate route between two points using OSRM Route API
   */
  async calculateRoute(
    origin: GeoPoint,
    destination: GeoPoint
  ): Promise<RouteInfo> {
    if (origin.latitude === null || origin.longitude === null ||
        destination.latitude === null || destination.longitude === null) {
      return { distance: null, duration: null };
    }

    const cacheKey = `route|${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}`;

    // Check cache first
    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      return cached.info;
    }

    // Rate limiting
    await this.rateLimit();

    try {
      const url = new URL(OSRM_ROUTE_URL);
      url.pathname += `/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
      url.searchParams.set('overview', 'false');
      url.searchParams.set('geometries', 'geojson');
      url.searchParams.set('steps', 'false');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OSRM Route API error: ${response.status}`);
      }

      const data = await response.json();

      let routeInfo: RouteInfo = { distance: null, duration: null };

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        routeInfo = {
          distance: route.distance,
          duration: route.duration,
        };
      }

      this.memoryCache.set(cacheKey, { info: routeInfo, timestamp: Date.now() });
      return routeInfo;
    } catch (error) {
      console.error('Routing error:', error);
      return { distance: null, duration: null };
    }
  }

  /**
   * Calculate routes from origin to multiple destinations using OSRM Table API
   * Returns array of RouteInfo in the same order as destinations
   */
  async calculateTable(
    origin: GeoPoint,
    destinations: GeoPoint[]
  ): Promise<Array<RouteInfo | null>> {
    if (origin.latitude === null || origin.longitude === null) {
      return destinations.map(() => null);
    }

    const validDestinations = destinations.filter(
      d => d.latitude !== null && d.longitude !== null
    );

    if (validDestinations.length === 0) {
      return destinations.map(() => null);
    }

    // Rate limiting
    await this.rateLimit();

    try {
      const locations = [
        `${origin.longitude},${origin.latitude}`,
        ...validDestinations.map(d => `${d.longitude},${d.latitude}`),
      ].join(';');

      const url = new URL(OSRM_TABLE_URL);
      url.pathname += `/${locations}`;
      url.searchParams.set('annotations', 'duration,distance');
      url.searchParams.set('sources', '0');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OSRM Table API error: ${response.status}`);
      }

      const data = await response.json();

      const results: Array<RouteInfo | null> = [];

      if (data.durations && data.distances && data.durations[0] && data.distances[0]) {
        const durations = data.durations[0];
        const distances = data.distances[0];

        // Skip first element (origin to origin)
        for (let i = 1; i < durations.length; i++) {
          const duration = durations[i];
          const distance = distances[i];

          if (duration !== null && distance !== null && duration !== undefined && distance !== undefined) {
            results.push({ distance, duration });
          } else {
            results.push(null);
          }
        }
      } else {
        results.push(...validDestinations.map(() => null));
      }

    // Map back to original destinations order
    const finalResults: Array<RouteInfo | null> = [];
    let resultIndex = 0;

    for (const dest of destinations) {
      if (dest.latitude !== null && dest.longitude !== null) {
        finalResults.push(results[resultIndex] ?? null);
        resultIndex++;
      } else {
        finalResults.push(null);
      }
    }

    return finalResults;
    } catch (error) {
      console.error('OSRM table error:', error);
      return destinations.map(() => null);
    }
  }

  /**
   * Calculate routes for multiple restaurants from a single origin
   * Uses Table API for efficiency
   */
  async calculateRoutes(
    restaurants: Restaurant[],
    originAddress: string
  ): Promise<Restaurant[]> {
    // First, geocode the origin if needed
    const originPoint: GeoPoint = { latitude: null, longitude: null };

    try {
      const { geocodingService } = await import('./geocodingService');
      const geocoded = await geocodingService.geocodeAddress(originAddress);
      originPoint.latitude = geocoded.latitude;
      originPoint.longitude = geocoded.longitude;
    } catch {
      // If origin geocoding fails, return restaurants without routing info
      return restaurants;
    }

    if (originPoint.latitude === null || originPoint.longitude === null) {
      return restaurants;
    }

    // Prepare destinations
    const destinations: GeoPoint[] = restaurants.map(r => ({
      latitude: r.latitude,
      longitude: r.longitude,
    }));

    // Calculate routes using Table API
    const routeResults = await this.calculateTable(originPoint, destinations);

    // Apply results to restaurants
    return restaurants.map((restaurant, index) => {
      const routeInfo = routeResults[index];
      if (routeInfo) {
        const distanceKm = routeInfo.distance !== null ? (routeInfo.distance / 1000).toFixed(1) : null;
        const durationMin = routeInfo.duration !== null ? Math.round(routeInfo.duration / 60) : null;

        return {
          ...restaurant,
          driveDistance: distanceKm ? `${distanceKm} km` : null,
          driveTime: durationMin ? `${durationMin} min` : null,
        };
      }
      return restaurant;
    });
  }

  /**
   * Format duration in seconds to human readable string
   */
  formatDuration(seconds: number | null): string | null {
    if (seconds === null || seconds === undefined) return null;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  /**
   * Format distance in meters to human readable string
   */
  formatDistance(meters: number | null): string | null {
    if (meters === null || meters === undefined) return null;
    const km = meters / 1000;
    if (km < 1) {
      return `${Math.round(meters)} m`;
    }
    return `${km.toFixed(1)} km`;
  }

  /**
   * Rate limit requests to OSRM
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
   * Clear cache
   */
  clearCache(): void {
    this.memoryCache.clear();
  }
}

export const routingService = new RoutingService();