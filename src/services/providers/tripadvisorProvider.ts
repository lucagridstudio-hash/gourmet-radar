import type { Provider, SearchParams, ProviderResult, ProviderDetails } from './providerInterface';

export class TripadvisorProvider implements Provider {
  name = 'tripadvisor';
  enabled = false;

  async search(_params: SearchParams): Promise<ProviderResult[]> {
    if (!this.enabled) {
      return [];
    }
    // TODO: Implement actual Tripadvisor API
    return [];
  }

  async getDetails(_id: string): Promise<ProviderDetails | null> {
    if (!this.enabled) {
      return null;
    }
    // TODO: Implement actual Tripadvisor API
    return null;
  }
}