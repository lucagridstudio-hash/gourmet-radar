export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string | null;
  province: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  officialWebsite: string | null;
  priceRange: string | null;
  averagePrice: number | null;
  rating: number | null;
  reviewCount: number | null;
  cuisines: string[];
  occasions: string[];
  mealTypes: string[];
  features: string[];
  dietaryOptions: string[];
  michelin: {
    stars: number | null;
    bibGourmand: boolean | null;
    greenStar: boolean | null;
    selected: boolean | null;
  } | null;
  gamberoRosso: {
    forchette: number | null;
    otherAwards: string[];
  } | null;
  theFork: {
    rating: number | null;
    reviewCount: number | null;
    priceRange: string | null;
    offers: boolean | null;
    yums: number | null;
    insider: boolean | null;
    discount: string | null;
  } | null;
  tripadvisor: {
    rating: number | null;
    reviewCount: number | null;
    priceLevel: number | null;
    awards: string[];
  } | null;
  ratings: Array<{
    source: string;
    value: number;
    max: number;
  }>;
  reviewCounts: Array<{
    source: string;
    count: number;
  }>;
  reviews: Array<{
    source: string;
    excerpt: string | null;
    rating: number | null;
    date: string | null;
  }>;
  awards: string[];
  driveTime: string | null;
  driveDistance: string | null;
  sources: Array<{
    provider: string;
    sourceUrl: string;
    retrievedAt: string;
    confidence: 'alto' | 'medio' | 'basso';
  }>;
  retrievedAt: string;
}

export interface SearchFilters {
  section: 'gourmet' | 'restaurants';
  origin: string;
  maxDriveMinutes?: string;
  cuisines: string[];
  occasions: string[];
  priceRange?: string;
  rating?: string;
  minReviews?: string;
}

export interface SearchResult {
  restaurants: Restaurant[];
  totalCount: number;
  queryInfo: {
    originalQuery: string;
    parsedFilters: SearchFilters | null;
    groundingMetadata: any;
    searchMetadata: {
      queryUsed: string;
      totalFound: number;
      searchTimestamp: string;
    };
  };
}

export interface RestaurantSource {
  provider: string;
  sourceUrl: string;
  retrievedAt: string;
  confidence: 'alto' | 'medio' | 'basso';
}

export interface GeminiAnalysis {
  summary: string;
  generatedBy: 'Gemini';
  basedOn: string[];
  verifiedFacts: string[];
  missingInformation: string[];
  discrepancies: Array<{
    field: string;
    values: Array<{ source: string; value: string }>;
  }>;
}

export interface GeoPoint {
  latitude: number | null;
  longitude: number | null;
}

export interface RouteInfo {
  distance: number | null;
  duration: number | null;
}

export interface NaturalLanguageQuery {
  location?: string | null;
  maxDriveMinutes?: number | null;
  cuisines?: string[] | null;
  occasion?: string[] | null;
  priceMin?: number | null;
  priceMax?: number | null;
  ratingMin?: number | null;
  reviewCountMin?: number | null;
  mealTypes?: string[] | null;
  features?: string[] | null;
  dietaryOptions?: string[] | null;
  recognitions?: string[] | null;
}

export interface SearchState {
  idle: boolean;
  loading: boolean;
  success: boolean;
  error: boolean;
  errorMessage?: string;
}

export interface CompareState {
  restaurants: Restaurant[];
  analysis?: GeminiAnalysis;
  loading: boolean;
  error: boolean;
  errorMessage?: string;
}

export interface GeminiStatus {
  gemini: 'idle' | 'testing' | 'success' | 'error';
}

export interface SettingsState {
  geminiApiKey: string;
  geminiModel: string;
  rememberKeys: boolean;
  status: GeminiStatus;
}