import type { Provider, RestaurantData } from './providerInterface';

export class TripadvisorProvider implements Provider<RestaurantData> {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('gourmetRadarTripadvisorKey') || '';
  }

  async search(_filters: Record<string, any>): Promise<RestaurantData[]> {
    if (!this.isConfigured()) {
      console.warn('Tripadvisor provider is not configured');
      return [];
    }
    // In a real implementation, we would call the Tripadvisor API
    return [];
  }

  async getDetails(_id: string): Promise<RestaurantData | null> {
    if (!this.isConfigured()) {
      console.warn('Tripadvisor provider is not configured');
      return null;
    }
    // In a real implementation, we would call the Tripadvisor API
    return null;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}