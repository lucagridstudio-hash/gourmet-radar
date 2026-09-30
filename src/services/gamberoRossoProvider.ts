import type { Provider, RestaurantData } from './providerInterface';

export class GamberoRossoProvider implements Provider<RestaurantData> {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('gourmetRadarGamberoRossoKey') || '';
  }

  async search(_filters: Record<string, any>): Promise<RestaurantData[]> {
    if (!this.isConfigured()) {
      console.warn('Gambero Rosso provider is not configured');
      return [];
    }
    // In a real implementation, we would call the Gambero Rosso API
    return [];
  }

  async getDetails(_id: string): Promise<RestaurantData | null> {
    if (!this.isConfigured()) {
      console.warn('Gambero Rosso provider is not configured');
      return null;
    }
    // In a real implementation, we would call the Gambero Rosso API
    return null;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}