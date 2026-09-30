import { MichelinProvider } from './michelinProvider';
import { GamberoRossoProvider } from './gamberoRossoProvider';
import { TheForkProvider } from './theforkProvider';
import { TripadvisorProvider } from './tripadvisorProvider';
import { WebSearchProvider } from './webSearchProvider';
import type { Restaurant } from '../types/restaurant';
import { geminiService } from './geminiService';
import { RoutingProvider } from './routingProvider';

export class RestaurantService {
  private michelinProvider = new MichelinProvider();
  private gamberoRossoProvider = new GamberoRossoProvider();
  private theForkProvider = new TheForkProvider();
  private tripadvisorProvider = new TripadvisorProvider();
  private webSearchProvider = new WebSearchProvider();
  private routingProvider = new RoutingProvider();

  /**
   * Search for restaurants using all configured providers and merge results
   */
  async search(filters: any): Promise<Restaurant[]> {
    // We'll search each provider and collect results
    const results: Restaurant[] = [];

    // Michelin
    if (this.michelinProvider.isConfigured()) {
      try {
        const michelinResults = await this.michelinProvider.search(filters);
        results.push(...michelinResults.map(r => ({ ...r, provider: 'Michelin' })));
      } catch (e) {
        console.error('Error searching Michelin provider:', e);
      }
    }

    // Gambero Rosso
    if (this.gamberoRossoProvider.isConfigured()) {
      try {
        const gamberoRossoResults = await this.gamberoRossoProvider.search(filters);
        results.push(...gamberoRossoResults.map(r => ({ ...r, provider: 'Gambero Rosso' })));
      } catch (e) {
        console.error('Error searching Gambero Rosso provider:', e);
      }
    }

    // TheFork
    if (this.theForkProvider.isConfigured()) {
      try {
        const theForkResults = await this.theForkProvider.search(filters);
        results.push(...theForkResults.map(r => ({ ...r, provider: 'TheFork' })));
      } catch (e) {
        console.error('Error searching TheFork provider:', e);
      }
    }

    // Tripadvisor
    if (this.tripadvisorProvider.isConfigured()) {
      try {
        const tripadvisorResults = await this.tripadvisorProvider.search(filters);
        results.push(...tripadvisorResults.map(r => ({ ...r, provider: 'Tripadvisor' })));
      } catch (e) {
        console.error('Error searching Tripadvisor provider:', e);
      }
    }

    // Web search
    if (this.webSearchProvider.isConfigured()) {
      try {
        const webSearchResults = await this.webSearchProvider.search(filters);
        results.push(...webSearchResults.map(r => ({ ...r, provider: 'Web Search' })));
      } catch (e) {
        console.error('Error searching Web Search provider:', e);
      }
    }

    // Deduplicate results
    const deduplicated = this.deduplicateRestaurants(results);

    // Enrich with routing data (drive time and distance) if origin is provided
    if (filters.origin) {
      const enriched = await this.addRoutingData(deduplicated, filters.origin);
      return enriched;
    }

    return deduplicated;
  }

  /**
   * Get details for a specific restaurant by ID from the provider that has it
   */
  async getDetails(id: string): Promise<Restaurant | null> {
    // We'll try each provider until we find one that has the restaurant
    const providers = [
      this.michelinProvider,
      this.gamberoRossoProvider,
      this.theForkProvider,
      this.tripadvisorProvider,
      this.webSearchProvider
    ];

    for (const provider of providers) {
      if (provider.isConfigured()) {
        try {
          const result = await provider.getDetails(id);
          if (result) {
            return result;
          }
        } catch (e) {
          console.error(`Error getting details from ${provider.constructor.name}:`, e);
        }
      }
    }

    return null;
  }

  /**
   * Deduplicate restaurants based on name, address, phone, or coordinates
   */
  private deduplicateRestaurants(restaurants: Restaurant[]): Restaurant[] {
    const seen = new Set<string>();
    const unique: Restaurant[] = [];

    for (const restaurant of restaurants) {
      // Create a key based on name, address, and phone (or coordinates if available)
      const key = [
        restaurant.name.toLowerCase().trim(),
        restaurant.address.toLowerCase().trim(),
        restaurant.phone ? restaurant.phone.toLowerCase().trim() : '',
        restaurant.latitude && restaurant.longitude
          ? `${restaurant.latitude},${restaurant.longitude}`
          : ''
      ].join('|');

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(restaurant);
      }
    }

    return unique;
  }

  /**
   * Add drive time and distance for each restaurant based on origin
   */
  private async addRoutingData(
    restaurants: Restaurant[],
    origin: string
  ): Promise<Restaurant[]> {
    // We'll process in parallel but limit to avoid too many requests
    const enrichedPromises = restaurants.map(async (restaurant) => {
      if (!restaurant.latitude || !restaurant.longitude) {
        // If we don't have coordinates, we cannot calculate route
        return restaurant;
      }

      try {
        const route = await this.routingProvider.calculateRoute(
          origin,
          { latitude: restaurant.latitude, longitude: restaurant.longitude }
        );

        if (route) {
          return {
            ...restaurant,
            driveTime: route.driveTime,
            driveDistance: route.driveDistance
          };
        }
      } catch (e) {
        console.error(`Error calculating route for ${restaurant.name}:`, e);
      }

      return restaurant;
    });

    return Promise.all(enrichedPromises);
  }

  /**
   * Use Gemini to analyze a restaurant (summary, etc.)
   */
  async analyzeRestaurant(restaurant: Restaurant): Promise<string> {
    return geminiService.analyzeRestaurant(restaurant.id);
  }

  /**
   * Use Gemini to compare multiple restaurants
   */
  async compareRestaurants(restaurants: Restaurant[]): Promise<string> {
    return geminiService.compareRestaurants(restaurants.map(r => r.id));
  }

  /**
   * Use Gemini to convert natural language to filters
   */
  async naturalLanguageToFilters(query: string): Promise<any> {
    return geminiService.naturalLanguageToFilters(query);
  }
}

// Export a singleton instance
export const restaurantService = new RestaurantService();