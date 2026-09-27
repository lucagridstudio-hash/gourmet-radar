export interface Restaurant {
  id: string;
  name: string;
  provider: string;
  rating: number;
  reviews: number;
  price: string;
  cuisine: string[];
  occasion: string[];
  meals?: string[];
  features: string[];
  address: string;
  phone?: string;
  website: string;
  distance: string;
  driveTime: string;
  latitude?: number;
  longitude?: number;
  
  // Awards and recognitions
  michelin: boolean;
  gamberoRosso: boolean;
  
  // Platform-specific data
  theFork: boolean;
  theForkRating?: number;
  theForkReviews?: number;
  tripadvisor: boolean;
  tripadvisorRating?: number;
  tripadvisorReviews?: number;
  
  // Additional info
  promotions?: Array<{
    type: 'sconto' | 'offerta';
    value: number;
    description: string;
  }>;
  dietary?: string[];
  
  // Data provenance
  sources: Array<{
    provider: string;
    sourceUrl: string;
    retrievedAt: string;
    confidence: 'alto' | 'medio' | 'basso';
  }>;
}

export interface SearchFilters {
  section: 'gourmet' | 'restaurants';
  origin: string;
  maxDriveMinutes?: string;
  cuisines: string[];
  occasion: string[];
  priceRange?: string;
  rating?: string;
  minReviews?: string;
}

export interface SearchResult {
  restaurants: Restaurant[];
  totalCount: number;
  query: SearchFilters;
}

export interface GeminiAnalysis {
  summary: string;
  generatedBy: 'Gemini';
  basedOn: string[];
}