import type { Restaurant } from '../types/restaurant';

export interface Provider<T> {
  /**
   * Search for restaurants based on filters
   */
  search(filters: Record<string, any>): Promise<T[]>;

  /**
   * Get details for a specific restaurant by ID
   */
  getDetails(id: string): Promise<T | null>;

  /**
   * Check if the provider is configured (has API key, etc.)
   */
  isConfigured(): boolean;
}

// We'll use the Restaurant interface as the data type
export type RestaurantData = Restaurant;