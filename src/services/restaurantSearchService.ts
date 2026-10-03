import type { Restaurant, SearchFilters, NaturalLanguageQuery } from '../types/restaurant';
import { geminiService } from './geminiService';
import { geocodingService } from './geocodingService';
import { routingService } from './routingService';

export const restaurantSearchService = {
  /**
   * Main search function that orchestrates the entire search process
   */
  async searchRestaurants(query: string, section: 'gourmet' | 'restaurants'): Promise<{ restaurants: Restaurant[]; totalCount: number; queryInfo: any }> {
    try {
      // Step 1: Parse natural language query with Gemini
      const parsedQuery = await geminiService.parseNaturalLanguageQuery(query, section);

      // Step 2: Search for restaurants using Gemini with Google Search grounding
      const searchResponse = await geminiService.searchRestaurantsWithGrounding(parsedQuery.query, section);

      // Step 3: Extract and normalize restaurant data
      const normalizedRestaurants = await this.extractAndNormalizeRestaurants(searchResponse.restaurants);

      // Step 4: Deduplicate restaurants
      const deduplicatedRestaurants = this.deduplicateRestaurants(normalizedRestaurants);

      // Step 5: Geocode addresses
      const geocodedRestaurants = await geocodingService.geocodeRestaurants(deduplicatedRestaurants);

      // Step 6: Calculate routing information (if origin is provided)
      const origin = parsedQuery.query.location;
      const routedRestaurants = origin
        ? await routingService.calculateRoutes(geocodedRestaurants, origin)
        : geocodedRestaurants;

      // Step 7: Build filters from parsed query
      const filters = this.buildFiltersFromParsedQuery(parsedQuery.query, section, origin ?? '');

      // Step 8: Filter and sort results
      const filteredRestaurants = this.applyFilters(routedRestaurants, filters);
      const sortedRestaurants = this.sortResults(filteredRestaurants, filters);

      return {
        restaurants: sortedRestaurants,
        totalCount: sortedRestaurants.length,
        queryInfo: {
          originalQuery: query,
          parsedFilters: filters,
          groundingMetadata: searchResponse.groundingMetadata,
          searchMetadata: searchResponse.searchMetadata,
        },
      };
    } catch (error) {
      console.error('Error in restaurant search:', error);
      throw new Error('Errore durante la ricerca dei ristoranti');
    }
  },

  /**
   * Build search filters from parsed query
   */
  buildFiltersFromParsedQuery(
    parsed: NaturalLanguageQuery,
    section: 'gourmet' | 'restaurants',
    origin: string
  ): SearchFilters {
    return {
      section,
      origin,
      maxDriveMinutes: parsed.maxDriveMinutes?.toString(),
      cuisines: parsed.cuisines ?? [],
      occasions: parsed.occasion ?? [],
      priceRange: parsed.priceMin !== null && parsed.priceMax !== null
        ? `${parsed.priceMin}-${parsed.priceMax}`
        : undefined,
      rating: parsed.ratingMin?.toString(),
      minReviews: parsed.reviewCountMin?.toString(),
    };
  },

  /**
   * Extract and normalize restaurant data from AI response
   */
  async extractAndNormalizeRestaurants(rawResults: any[]): Promise<Restaurant[]> {
    const restaurants: Restaurant[] = [];
    const now = new Date().toISOString();

    for (const result of rawResults) {
      try {
        const restaurant: Restaurant = {
          id: this.generateId(),
          name: this.normalizeString(result.name),
          description: result.description ?? null,
          address: this.normalizeString(result.address),
          city: result.city ?? null,
          province: result.province ?? null,
          region: result.region ?? null,
          country: result.country ?? null,
          latitude: null,
          longitude: null,
          phone: this.normalizeStringOrNull(result.phone),
          website: this.normalizeURL(result.website),
          officialWebsite: this.normalizeURL(result.officialWebsite),
          priceRange: result.priceRange ?? null,
          averagePrice: result.averagePrice ?? null,
          rating: this.normalizeRating(result.rating),
          reviewCount: this.normalizeCount(result.reviewCount),
          cuisines: this.normalizeArray(result.cuisines),
          occasions: this.normalizeArray(result.occasions),
          mealTypes: this.normalizeArray(result.mealTypes),
          features: this.normalizeArray(result.features),
          dietaryOptions: this.normalizeArray(result.dietaryOptions),
          michelin: result.michelin ? {
            stars: result.michelin.stars ?? null,
            bibGourmand: result.michelin.bibGourmand ?? null,
            greenStar: result.michelin.greenStar ?? null,
            selected: result.michelin.selected ?? null,
          } : null,
          gamberoRosso: result.gamberoRosso ? {
            forchette: result.gamberoRosso.forchette ?? null,
            otherAwards: result.gamberoRosso.otherAwards ?? [],
          } : null,
          theFork: result.theFork ? {
            rating: result.theFork.rating ?? null,
            reviewCount: result.theFork.reviewCount ?? null,
            priceRange: result.theFork.priceRange ?? null,
            offers: result.theFork.offers ?? null,
            yums: result.theFork.yums ?? null,
            insider: result.theFork.insider ?? null,
            discount: result.theFork.discount ?? null,
          } : null,
          tripadvisor: result.tripadvisor ? {
            rating: result.tripadvisor.rating ?? null,
            reviewCount: result.tripadvisor.reviewCount ?? null,
            priceLevel: result.tripadvisor.priceLevel ?? null,
            awards: result.tripadvisor.awards ?? [],
          } : null,
          ratings: result.ratings ?? [],
          reviewCounts: result.reviewCounts ?? [],
          reviews: result.reviews ?? [],
          awards: result.awards ?? [],
          driveTime: null,
          driveDistance: null,
          sources: this.normalizeSources(result.sources),
          retrievedAt: now,
        };

        if (restaurant.name && restaurant.address) {
          restaurants.push(restaurant);
        }
      } catch (err) {
        console.warn('Error processing restaurant result:', err);
      }
    }

    return restaurants;
  },

  /**
   * Generate a unique ID for a restaurant
   */
  generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  },

  /**
   * Normalize a string value
   */
  normalizeString(value: string): string {
    return value.trim();
  },

  /**
   * Normalize a string value or return null
   */
  normalizeStringOrNull(value: string | null | undefined): string | null {
    if (!value) return null;
    return value.trim() || null;
  },

  /**
   * Normalize an array of strings
   */
  normalizeArray(arr: string[] | null | undefined): string[] {
    if (!Array.isArray(arr)) return [];
    return arr
      .map(item => item.trim())
      .filter(item => item.length > 0);
  },

  /**
   * Normalize a URL
   */
  normalizeURL(url: string | null | undefined): string | null {
    if (!url) return null;
    try {
      const normalized = url.trim();
      if (!normalized) return null;
      if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        return `https://${normalized}`;
      }
      return normalized;
    } catch {
      return null;
    }
  },

  /**
   * Normalize a rating value
   */
  normalizeRating(value: any): number | null {
    if (value === null || value === undefined) return null;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 5 ? num : null;
  },

  /**
   * Normalize a count value
   */
  normalizeCount(value: any): number | null {
    if (value === null || value === undefined) return null;
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 ? num : null;
  },

  /**
   * Normalize sources array
   */
  normalizeSources(sources: any[]): Array<{ provider: string; sourceUrl: string; retrievedAt: string; confidence: 'alto' | 'medio' | 'basso' }> {
    if (!Array.isArray(sources)) return [];
    return sources
      .map(source => ({
        provider: String(source.provider ?? '').trim(),
        sourceUrl: String(source.sourceUrl ?? '').trim(),
        retrievedAt: String(source.retrievedAt ?? new Date().toISOString()),
        confidence: (source.confidence === 'alto' || source.confidence === 'medio' || source.confidence === 'basso')
          ? source.confidence
          : 'medio',
      }))
      .filter(source => source.provider.length > 0 && source.sourceUrl.length > 0);
  },

  /**
   * Deduplicate restaurants based on name and address similarity
   */
  deduplicateRestaurants(restaurants: Restaurant[]): Restaurant[] {
    const uniqueRestaurants: Restaurant[] = [];
    const seen = new Set<string>();

    for (const restaurant of restaurants) {
      const key = `${restaurant.name.toLowerCase()}|${restaurant.address.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRestaurants.push(restaurant);
      }
    }

    return uniqueRestaurants;
  },

  /**
   * Apply filters to restaurant results
   */
  applyFilters(restaurants: Restaurant[], filters: SearchFilters): Restaurant[] {
    return restaurants.filter(restaurant => {
      // Cuisine filter
      if (filters.cuisines.length > 0) {
        const hasMatchingCuisine = restaurant.cuisines.some(cuisine =>
          filters.cuisines.some(filter => cuisine.toLowerCase().includes(filter.toLowerCase()))
        );
        if (!hasMatchingCuisine) return false;
      }

      // Occasion filter
      if (filters.occasions.length > 0) {
        const hasMatchingOccasion = restaurant.occasions.some(occasion =>
          filters.occasions.some(filter => occasion.toLowerCase().includes(filter.toLowerCase()))
        );
        if (!hasMatchingOccasion) return false;
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange !== 'Qualsiasi prezzo' && restaurant.priceRange) {
        // Basic price range matching - could be enhanced
      }

      // Rating filter
      if (filters.rating && restaurant.rating !== null) {
        if (restaurant.rating < parseFloat(filters.rating)) {
          return false;
        }
      }

      // Minimum reviews filter
      if (filters.minReviews && restaurant.reviewCount !== null) {
        if (restaurant.reviewCount < parseInt(filters.minReviews, 10)) {
          return false;
        }
      }

      // Max drive time filter
      if (filters.maxDriveMinutes && restaurant.driveTime) {
        const driveMinutes = parseInt(restaurant.driveTime.replace(/\D/g, ''), 10);
        if (!isNaN(driveMinutes) && driveMinutes > parseInt(filters.maxDriveMinutes, 10)) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Sort restaurant results
   */
  sortResults(restaurants: Restaurant[], filters: SearchFilters): Restaurant[] {
    type SortBy = 'relevance' | 'rating' | 'driveTime' | 'driveDistance' | 'price';
    const sortBy: SortBy = filters.rating ? 'rating' : 'relevance';

    return [...restaurants].sort((a, b) => {
      const sortKey = sortBy as SortBy;
      switch (sortKey) {
        case 'rating': {
          const ratingA = a.rating ?? -1;
          const ratingB = b.rating ?? -1;
          if (ratingA !== ratingB) return ratingB - ratingA;
          const reviewsA = a.reviewCount ?? 0;
          const reviewsB = b.reviewCount ?? 0;
          return reviewsB - reviewsA;
        }
        case 'driveTime': {
          const timeA = a.driveTime ? parseInt(a.driveTime.replace(/\D/g, ''), 10) : Infinity;
          const timeB = b.driveTime ? parseInt(b.driveTime.replace(/\D/g, ''), 10) : Infinity;
          if (timeA !== timeB) return timeA - timeB;
          return 0;
        }
        case 'driveDistance': {
          const distA = a.driveDistance ? parseFloat(a.driveDistance.replace(/[^\d.]/g, '')) : Infinity;
          const distB = b.driveDistance ? parseFloat(b.driveDistance.replace(/[^\d.]/g, '')) : Infinity;
          if (distA !== distB) return distA - distB;
          return 0;
        }
        case 'price': {
          const priceA = a.averagePrice ?? Infinity;
          const priceB = b.averagePrice ?? Infinity;
          if (priceA !== priceB) return priceA - priceB;
          return 0;
        }
        case 'relevance':
        default:
          return this.countFields(b) - this.countFields(a);
      }
    });
  },

  /**
   * Count how many fields have data (for sorting by completeness)
   */
  countFields(restaurant: Restaurant): number {
    let count = 0;
    if (restaurant.name) count++;
    if (restaurant.address) count++;
    if (restaurant.phone) count++;
    if (restaurant.website) count++;
    if (restaurant.officialWebsite) count++;
    if (restaurant.cuisines.length > 0) count++;
    if (restaurant.occasions.length > 0) count++;
    if (restaurant.mealTypes.length > 0) count++;
    if (restaurant.features.length > 0) count++;
    if (restaurant.dietaryOptions.length > 0) count++;
    if (restaurant.rating !== null) count++;
    if (restaurant.reviewCount !== null) count++;
    if (restaurant.latitude !== null && restaurant.longitude !== null) count++;
    if (restaurant.driveTime !== null) count++;
    if (restaurant.driveDistance !== null) count++;
    if (restaurant.michelin !== null) count++;
    if (restaurant.gamberoRosso !== null) count++;
    if (restaurant.theFork !== null) count++;
    if (restaurant.tripadvisor !== null) count++;
    if (restaurant.sources.length > 0) count++;
    return count;
  },
};