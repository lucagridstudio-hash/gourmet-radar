import type { Provider, SearchParams, ProviderResult, ProviderDetails } from './providerInterface';

export class TheForkProvider implements Provider {
  name = 'thefork';
  enabled = false;

  async search(_params: SearchParams): Promise<ProviderResult[]> {
    if (!this.enabled) {
      return [];
    }
    // TODO: Implement actual TheFork API/web scraping
    return [];
  }

  async getDetails(_id: string): Promise<ProviderDetails | null> {
    if (!this.enabled) {
      return null;
    }
    // TODO: Implement actual TheFork API/web scraping
    return null;
  }
}