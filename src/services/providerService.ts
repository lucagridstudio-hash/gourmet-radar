import type { Provider } from './providers/providerInterface';
import { GeminiProvider } from './providers/geminiProvider';
import { WebSearchProvider } from './providers/webSearchProvider';
import { TheForkProvider } from './providers/theforkProvider';
import { TripadvisorProvider } from './providers/tripadvisorProvider';
import { MichelinProvider } from './providers/michelinProvider';
import { GamberoRossoProvider } from './providers/gamberoRossoProvider';
import { RoutingProvider } from './providers/routingProvider';

export class ProviderService {
  private providers: Provider[];

  constructor() {
    this.providers = [
      new GeminiProvider(),
      new WebSearchProvider(),
      new TheForkProvider(),
      new TripadvisorProvider(),
      new MichelinProvider(),
      new GamberoRossoProvider(),
      new RoutingProvider()
    ];
  }

  getProvider(name: string): Provider | undefined {
    return this.providers.find(p => p.name === name);
  }

  getAllProviders(): Provider[] {
    return this.providers;
  }

  getEnabledProviders(): Provider[] {
    return this.providers.filter(p => p.enabled);
  }

  enableProvider(name: string): void {
    const provider = this.getProvider(name);
    if (provider) {
      provider.enabled = true;
    }
  }

  disableProvider(name: string): void {
    const provider = this.getProvider(name);
    if (provider) {
      provider.enabled = false;
    }
  }

  async searchAllProviders(params: any): Promise<any[]> {
    const enabledProviders = this.getEnabledProviders();
    const searchPromises = enabledProviders.map(provider => provider.search(params));
    const results = await Promise.all(searchPromises);
    return results.flat();
  }

  async getDetailsFromProviders(id: string): Promise<any> {
    const enabledProviders = this.getEnabledProviders();
    for (const provider of enabledProviders) {
      try {
        const details = await provider.getDetails(id);
        if (details) {
          return details;
        }
      } catch (error) {
        console.error(`Error getting details from ${provider.name}:`, error);
        // Continue to next provider
      }
    }
    return null;
  }
}