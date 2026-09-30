export interface Provider {
  name: string;
  enabled: boolean;
  search(params: any): Promise<any>;
  getDetails(id: string): Promise<any>;
}

export interface SearchParams {
  origin?: string;
  maxDriveMinutes?: number;
  cuisines?: string[];
  occasion?: string[];
  priceRange?: string;
  rating?: number;
  minReviews?: number;
  [key: string]: any;
}

export interface ProviderResult {
  id: string;
  name: string;
  provider: string;
  // Common fields will be added as needed
}

export interface ProviderDetails extends ProviderResult {
  // Detailed fields will be added as needed
}