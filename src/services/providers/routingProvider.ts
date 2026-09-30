import type { Provider, SearchParams, ProviderResult, ProviderDetails } from './providerInterface';

export class RoutingProvider implements Provider {
  name = 'routing';
  enabled = false;

  async search(_params: SearchParams): Promise<ProviderResult[]> {
    if (!this.enabled) {
      return [];
    }
    // TODO: Implement actual routing service (Google Maps, Mapbox, etc.)
    return [];
  }

  async getDetails(_id: string): Promise<ProviderDetails | null> {
    if (!this.enabled) {
      return null;
    }
    // TODO: Implement actual routing service
    return null;
  }
}