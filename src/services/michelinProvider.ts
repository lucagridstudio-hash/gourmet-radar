import type { Provider, RestaurantData } from './providerInterface';

export class MichelinProvider implements Provider<RestaurantData> {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('gourmetRadarMichelinKey') || '';
  }

  async search(_filters: Record<string, any>): Promise<RestaurantData[]> {
    if (!this.isConfigured()) {
      console.warn('Michelin provider is not configured');
      return [];
    }
    // In a real implementation, we would call the Michelin API
    // For now, we return empty array to indicate no data
    return [];
  }

  async getDetails(_id: string): Promise<RestaurantData | null> {
    if (!this.isConfigured()) {
      console.warn('Michelin provider is not configured');
      return null;
    }
    // In a real implementation, we would call the Michelin API
    return null;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}