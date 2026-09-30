import type { Provider, SearchParams, ProviderResult, ProviderDetails } from './providerInterface';

export class WebSearchProvider implements Provider {
  name = 'webSearch';
  enabled = false;

  async search(_params: SearchParams): Promise<ProviderResult[]> {
    if (!this.enabled) {
      return [];
    }
    // TODO: Implement actual web search
    return [];
  }

  async getDetails(_id: string): Promise<ProviderDetails | null> {
    if (!this.enabled) {
      return null;
    }
    // TODO: Implement actual web search
    return null;
  }
}