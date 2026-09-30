import type { Provider, RestaurantData } from './providerInterface';

export class WebSearchProvider implements Provider<RestaurantData> {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('gourmetRadarWebSearchKey') || '';
  }

  async search(_filters: Record<string, any>): Promise<RestaurantData[]> {
    if (!this.isConfigured()) {
      console.warn('Web search provider is not configured');
      return [];
    }
    // In a real implementation, we would use a web search API (like Google Custom Search)
    // For now, we return empty array
    return [];
  }

  async getDetails(_id: string): Promise<RestaurantData | null> {
    if (!this.isConfigured()) {
      console.warn('Web search provider is not configured');
      return null;
    }
    // In a real implementation, we would use a web search API
    return null;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}