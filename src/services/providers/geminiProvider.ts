import type { Provider, SearchParams, ProviderResult, ProviderDetails } from './providerInterface';
import { GeminiService } from '../geminiService';

export class GeminiProvider implements Provider {
  name = 'gemini';
  enabled = false;
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async search(params: SearchParams): Promise<ProviderResult[]> {
    if (!this.enabled) {
      return [];
    }

    try {
      // Initialize Gemini if not already done
      await this.geminiService.initialize();

      // Transform search params to natural language query for Gemini
      const query = this.buildNaturalLanguageQuery(params);
      
      // Use Gemini to interpret the query and get results
      const results = await this.geminiService.searchWithAI(query);
      
      return results;
    } catch (error) {
      console.error('Gemini provider search error:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ProviderDetails | null> {
    if (!this.enabled) {
      return null;
    }

    try {
      // Initialize Gemini if not already done
      await this.geminiService.initialize();
      
      // Use Gemini to get restaurant details
      const details = await this.geminiService.analyzeRestaurant(id);
      
      return details;
    } catch (error) {
      console.error('Gemini provider getDetails error:', error);
      return null;
    }
  }

  private buildNaturalLanguageQuery(params: SearchParams): string {
    // Build a natural language query from the search parameters
    const parts = [];
    
    if (params.origin) {
      parts.push(`near ${params.origin}`);
    }
    
    if (params.maxDriveMinutes) {
      parts.push(`within ${params.maxDriveMinutes} minutes drive`);
    }
    
    if (params.cuisines && params.cuisines.length > 0) {
      parts.push(`with ${params.cuisines.join(' and ')} cuisine`);
    }
    
    if (params.occasion && params.occasion.length > 0) {
      parts.push(`for ${params.occasion.join(' and ')} occasion`);
    }
    
    if (params.priceRange) {
      parts.push(`in the ${params.priceRange} price range`);
    }
    
    if (params.rating) {
      parts.push(`with rating above ${params.rating}`);
    }
    
    if (params.minReviews) {
      parts.push(`with at least ${params.minReviews} reviews`);
    }
    
    if (parts.length === 0) {
      return "Find restaurants";
    }
    
    return `Find restaurants ${parts.join(' ')}.`;
  }
}