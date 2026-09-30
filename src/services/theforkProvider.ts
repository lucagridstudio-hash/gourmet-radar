import type { Provider, RestaurantData } from './providerInterface';

export class TheForkProvider implements Provider<RestaurantData> {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('gourmetRadarTheForkKey') || '';
  }

  async search(_filters: Record<string, any>): Promise<RestaurantData[]> {
    if (!this.isConfigured()) {
      console.warn('TheFork provider is not configured');
      return [];
    }
    // In a real implementation, we would call TheFork API
    return [];
  }

  async getDetails(_id: string): Promise<RestaurantData | null> {
    if (!this.isConfigured()) {
      console.warn('TheFork provider is not configured');
      return null;
    }
    // In a real implementation, we would call TheFork API
    return null;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}