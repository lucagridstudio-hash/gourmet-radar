export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  city?: string;
  province?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  priceRange?: string; // e.g., '€', '€€', '€€€', '€€€€'
  averagePrice?: number;
  rating?: number; // overall rating, 0-5
  provider?: string; // e.g., 'Michelin', 'Gambero Rosso', 'TheFork', 'Tripadvisor', 'Web Search'
  cuisines: string[];
  occasions: string[];
  mealTypes: string[];
  features: string[];
  dietaryOptions: string[];
  michelin?: {
    stars?: number;
    bibGourmand?: boolean;
    greenStar?: boolean;
    selected?: boolean;
  };
  gamberoRosso?: {
    forchette: number;
    otherAwards?: string[];
  };
  theFork?: {
    rating?: number; // out of 10
    reviewCount?: number;
    priceRange?: string;
    offers?: boolean;
    yums?: number;
    insider?: boolean;
    discount?: string;
  };
  tripadvisor?: {
    rating?: number; // out of 5
    reviewCount?: number;
    priceLevel?: number; // 1 to 4
    awards?: string[];
  };
  ratings?: Array<{
    source: string;
    value: number;
    max: number;
  }>;
  reviewCounts?: Array<{
    source: string;
    count: number;
  }>;
  reviews?: Array<{
    source: string;
    excerpt?: string;
    rating?: number;
    date?: string;
  }>;
  awards?: string[];
  driveTime?: string; // e.g., "25 min"
  driveDistance?: number; // in kilometers
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