import type { Provider, SearchParams, ProviderResult, ProviderDetails } from './providerInterface';

export class GamberoRossoProvider implements Provider {
  name = 'gamberoRosso';
  enabled = false;

  async search(_params: SearchParams): Promise<ProviderResult[]> {
    if (!this.enabled) {
      return [];
    }
    // TODO: Implement actual Gambero Rosso API/data source
    return [];
  }

  async getDetails(_id: string): Promise<ProviderDetails | null> {
    if (!this.enabled) {
      return null;
    }
    // TODO: Implement actual Gambero Rosso API/data source
    return null;
  }
}