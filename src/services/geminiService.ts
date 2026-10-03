import { ApiKeyService } from '../utils/storage';
import type { NaturalLanguageQuery } from '../types/restaurant';
import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_MODEL = 'gemini-3.8-flash';

const NATURAL_LANGUAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    location: { type: Type.STRING, nullable: true },
    maxDriveMinutes: { type: Type.NUMBER, nullable: true },
    cuisines: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    occasion: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    priceMin: { type: Type.NUMBER, nullable: true },
    priceMax: { type: Type.NUMBER, nullable: true },
    ratingMin: { type: Type.NUMBER, nullable: true },
    reviewCountMin: { type: Type.NUMBER, nullable: true },
    mealTypes: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    features: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    dietaryOptions: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
    recognitions: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
  },
  required: [],
};

const RESTAURANT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING, nullable: true },
    address: { type: Type.STRING },
    city: { type: Type.STRING, nullable: true },
    province: { type: Type.STRING, nullable: true },
    region: { type: Type.STRING, nullable: true },
    country: { type: Type.STRING, nullable: true },
    phone: { type: Type.STRING, nullable: true },
    website: { type: Type.STRING, nullable: true },
    officialWebsite: { type: Type.STRING, nullable: true },
    priceRange: { type: Type.STRING, nullable: true },
    averagePrice: { type: Type.NUMBER, nullable: true },
    rating: { type: Type.NUMBER, nullable: true },
    reviewCount: { type: Type.NUMBER, nullable: true },
    cuisines: { type: Type.ARRAY, items: { type: Type.STRING } },
    occasions: { type: Type.ARRAY, items: { type: Type.STRING } },
    mealTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
    features: { type: Type.ARRAY, items: { type: Type.STRING } },
    dietaryOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    michelin: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        stars: { type: Type.NUMBER, nullable: true },
        bibGourmand: { type: Type.BOOLEAN, nullable: true },
        greenStar: { type: Type.BOOLEAN, nullable: true },
        selected: { type: Type.BOOLEAN, nullable: true },
      },
    },
    gamberoRosso: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        forchette: { type: Type.NUMBER, nullable: true },
        otherAwards: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    theFork: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        rating: { type: Type.NUMBER, nullable: true },
        reviewCount: { type: Type.NUMBER, nullable: true },
        priceRange: { type: Type.STRING, nullable: true },
        offers: { type: Type.BOOLEAN, nullable: true },
        yums: { type: Type.NUMBER, nullable: true },
        insider: { type: Type.BOOLEAN, nullable: true },
        discount: { type: Type.STRING, nullable: true },
      },
    },
    tripadvisor: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        rating: { type: Type.NUMBER, nullable: true },
        reviewCount: { type: Type.NUMBER, nullable: true },
        priceLevel: { type: Type.NUMBER, nullable: true },
        awards: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          provider: { type: Type.STRING },
          sourceUrl: { type: Type.STRING },
          retrievedAt: { type: Type.STRING },
          confidence: { type: Type.STRING, enum: ['alto', 'medio', 'basso'] },
        },
        required: ['provider', 'sourceUrl', 'retrievedAt', 'confidence'],
      },
    },
  },
  required: ['name', 'address', 'cuisines', 'occasions', 'mealTypes', 'features', 'dietaryOptions', 'sources'],
};

const SEARCH_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    restaurants: { type: Type.ARRAY, items: RESTAURANT_SCHEMA },
    searchMetadata: {
      type: Type.OBJECT,
      properties: {
        queryUsed: { type: Type.STRING },
        totalFound: { type: Type.NUMBER },
        searchTimestamp: { type: Type.STRING },
      },
      required: ['queryUsed', 'totalFound', 'searchTimestamp'],
    },
  },
  required: ['restaurants', 'searchMetadata'],
};

export interface ParsedQuery {
  query: NaturalLanguageQuery;
  groundingMetadata: any;
}

export interface SearchResponse {
  restaurants: any[];
  searchMetadata: {
    queryUsed: string;
    totalFound: number;
    searchTimestamp: string;
  };
  groundingMetadata: any;
}

function extractGroundingMetadata(result: any): any {
  // groundingMetadata is on the first candidate in the response
  return result.candidates?.[0]?.groundingMetadata ?? {};
}

export class GeminiService {
  private apiKey: string = '';
  private genAI: GoogleGenAI | null = null;

  constructor() {
    this.loadApiKey();
  }

  private loadApiKey(): void {
    this.apiKey = ApiKeyService.getGeminiKey();
  }

  private init(): void {
    if (!this.genAI && this.apiKey) {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    this.genAI = null;
    this.init();
  }

  async testConnection(): Promise<boolean> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      await this.genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ text: 'Hello' }],
      });
      return true;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  async parseNaturalLanguageQuery(query: string, section: 'gourmet' | 'restaurants'): Promise<ParsedQuery> {
    this.init();
    if (!this.genAI) {
      throw new Error('Gemini API key not configured');
    }

    const sectionContext = section === 'gourmet'
      ? 'Focus on high-end, Michelin-starred, Gambero Rosso recognized restaurants.'
      : 'Include all types of restaurants, from casual to fine dining.';

    const result = await this.genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{
        text: `Convert this natural language restaurant search query into structured filters.
${sectionContext}

Query: "${query}"

Return a JSON object with these fields (use null for unspecified values):
- location: city, address, or area to search near
- maxDriveMinutes: maximum driving time in minutes
- cuisines: array of cuisine types
- occasion: array of occasions
- priceMin: minimum price per person in euros
- priceMax: maximum price per person in euros
- ratingMin: minimum rating (0-5 scale)
- reviewCountMin: minimum number of reviews
- mealTypes: array of meal types (breakfast, lunch, dinner, etc.)
- features: array of features like outdoor seating, wifi, etc.
- dietaryOptions: array of dietary options like vegetarian, vegan, gluten-free, etc.
- recognitions: array of recognitions like michelin-star, bib-gourmand, forchette, etc.

Only include fields that are explicitly mentioned or strongly implied in the query.
For price ranges like "60-100 euro", set priceMin to 60 and priceMax to 100.
For ratings like "4.5+", set ratingMin to 4.5.`,
      }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: NATURAL_LANGUAGE_SCHEMA,
      },
    });

    const parsed = JSON.parse(result.text ?? '{}') as NaturalLanguageQuery;
    return {
      query: parsed,
      groundingMetadata: extractGroundingMetadata(result),
    };
  }

  async searchRestaurantsWithGrounding(
    parsedQuery: NaturalLanguageQuery,
    section: 'gourmet' | 'restaurants'
  ): Promise<SearchResponse> {
    this.init();
    if (!this.genAI) {
      throw new Error('Gemini API key not configured');
    }

    const sectionContext = section === 'gourmet'
      ? 'Focus on high-end, Michelin-starred, Gambero Rosso recognized restaurants. Prioritize restaurants with verifiable awards and recognition.'
      : 'Include all types of restaurants, from casual to fine dining.';

    const prompt = `Search for real restaurants matching these criteria:
${sectionContext}

Search criteria:
${JSON.stringify(parsedQuery, null, 2)}

For each restaurant found, provide complete, verifiable information.
Only include information that can be confirmed through reliable sources (official websites, Michelin Guide, Gambero Rosso, TheFork, TripAdvisor, reputable review sites).
Do NOT invent, hallucinate, or fabricate any information.
If information cannot be verified, omit the field or set it to null.
Include sources with URLs and retrieval timestamps for all information.

Return structured results.`;

    const result = await this.genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: SEARCH_RESPONSE_SCHEMA,
        tools: [{ googleSearch: {} }],
      },
    });

    const parsed = JSON.parse(result.text ?? '{}') as SearchResponse;
    return {
      ...parsed,
      groundingMetadata: extractGroundingMetadata(result),
    };
  }

  async analyzeRestaurant(restaurantData: any): Promise<{ text: string; groundingMetadata: any }> {
    this.init();
    if (!this.genAI) {
      throw new Error('Gemini API key not configured');
    }

    const result = await this.genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{
        text: `Analyze this restaurant based ONLY on the provided data. Do not use external knowledge.

Restaurant data:
${JSON.stringify(restaurantData, null, 2)}

Provide a detailed analysis including:
- Summary of the restaurant
- Key strengths and highlights
- Recommended dishes (only if mentioned in sources)
- Best time to visit
- Any discrepancies between sources
- Missing information that would be helpful

Format as JSON with these fields:
- summary: string
- strengths: string[]
- recommendedDishes: string[]
- bestTimeToVisit: string
- discrepancies: array of { field: string, values: array of { source: string, value: string } }
- missingInformation: string[]
- verifiedFacts: string[]
- basedOnSources: string[] (list the source URLs used)`,
      }],
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: result.text ?? '',
      groundingMetadata: extractGroundingMetadata(result),
    };
  }

  async compareRestaurants(restaurantsData: any[]): Promise<{ text: string; groundingMetadata: any }> {
    this.init();
    if (!this.genAI) {
      throw new Error('Gemini API key not configured');
    }

    const result = await this.genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{
        text: `Compare these restaurants based ONLY on the provided data. Do not use external knowledge.

Restaurants:
${JSON.stringify(restaurantsData, null, 2)}

Provide a detailed comparison covering:
- Price comparison
- Rating comparison
- Cuisine/style differences
- Occasion suitability
- Recognition/award differences
- Distance/travel time differences (if available)
- Overall recommendations for different scenarios

Format as JSON with these fields:
- comparisonSummary: string
- priceComparison: string
- ratingComparison: string
- cuisineComparison: string
- occasionSuitability: object with occasion keys and restaurant names as values
- recognitionComparison: string
- distanceComparison: string
- recommendations: array of { scenario: string, recommendedRestaurant: string, reason: string }
- discrepancies: array of { field: string, values: array of { source: string, value: string } }
- basedOnSources: string[]`,
      }],
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: result.text ?? '',
      groundingMetadata: extractGroundingMetadata(result),
    };
  }

  async summarizeRestaurant(restaurantData: any): Promise<{ text: string; groundingMetadata: any }> {
    this.init();
    if (!this.genAI) {
      throw new Error('Gemini API key not configured');
    }

    const result = await this.genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{
        text: `Provide a concise summary of this restaurant based ONLY on the provided data.

Restaurant data:
${JSON.stringify(restaurantData, null, 2)}

Highlight key points that make it unique or recommendable.
Only include information from the provided sources.
If information is missing, state it's unknown.

Return a JSON object with:
- summary: string
- keyHighlights: string[]
- missingInformation: string[]
- basedOnSources: string[]`,
      }],
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: result.text ?? '',
      groundingMetadata: extractGroundingMetadata(result),
    };
  }

  async answerRestaurantQuestion(restaurantData: any, question: string): Promise<{ text: string; groundingMetadata: any }> {
    this.init();
    if (!this.genAI) {
      throw new Error('Gemini API key not configured');
    }

    const result = await this.genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{
        text: `Answer this question about the restaurant based ONLY on the provided data.

Restaurant data:
${JSON.stringify(restaurantData, null, 2)}

Question: "${question}"

Only use information from the provided sources. If the answer cannot be determined from the data, state that clearly.

Return a JSON object with:
- answer: string
- confidence: "high" | "medium" | "low"
- basedOnSources: string[]
- missingInformation: string[]`,
      }],
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: result.text ?? '',
      groundingMetadata: extractGroundingMetadata(result),
    };
  }
}

export const geminiService = new GeminiService();