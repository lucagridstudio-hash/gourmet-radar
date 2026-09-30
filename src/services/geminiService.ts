import { ApiKeyService } from '../utils/storage';

// We'll import the GoogleGenerativeAI statically
import * as googleai from "@google/genai";

export class GeminiService {
  private apiKey: string = '';
  private genAI: googleai.GoogleGenAI | null = null;

  constructor() {
    this.loadApiKey();
  }

  private loadApiKey(): void {
    this.apiKey = ApiKeyService.getGeminiKey();
  }

  async initialize(): Promise<void> {
    this.init();
  }

  private init(): void {
    if (!this.genAI && this.apiKey) {
      this.genAI = new googleai.GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      // Make a test call to the API
      await this.genAI.models.generateContent({
        model: "gemini-pro",
        contents: [{ text: "Hello" }]
      });
      return true;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  async naturalLanguageToFilters(query: string): Promise<any> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      const result = await this.genAI.models.generateContent({
        model: "gemini-pro",
        contents: [{ text: `
        Convert this natural language restaurant search query into structured filters:
        "${query}"

        Return a JSON object with these fields:
        - section: string (either 'restaurants' or 'gourmet')
        - origin: string (starting location)
        - maxDriveMinutes: number (maximum driving time in minutes)
        - cuisines: string[] (array of cuisine types)
        - occasion: string[] (array of occasions)
        - priceRange: string (price range like '€', '€€', etc.)
        - rating: number (minimum rating)
        - minReviews: number (minimum number of reviews)
        - maxPricePerPerson: number (maximum price per person in euros)
      ` }]
      });
      const text = result.text ?? "";
      // Clean up the response to extract JSON
      const cleanedText = text.replace(/```json\s*|\s*```/g, '');
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Failed to parse natural language search:', error);
      throw error;
    }
  }

  async searchWithAI(query: string): Promise<any[]> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      const result = await this.genAI.models.generateContent({
        model: "gemini-pro",
        contents: [{ text: `
        Based on this query: "${query}"
        Provide restaurant recommendations with details.
        For each restaurant, include: name, description, description, cuisine, price range, rating, etc.
        Return as a JSON array of restaurant objects.
      ` }]
      });
      const text = result.text ?? "";
      // Clean up the response to extract JSON
      const cleanedText = text.replace(/```json\s*|\s*```/g, '');
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Gemini AI search failed:', error);
      return [];
    }
  }

  async analyzeRestaurant(restaurantId: string): Promise<any> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      const result = await this.genAI.models.generateContent({
        model: "gemini-pro",
        contents: [{ text: `
        Provide a detailed analysis of restaurant with ID: "${restaurantId}"
        Include: summary of reviews, recommended dishes, best time to visit, etc.
      ` }]
      });
      return result.text
    } catch (error) {
      console.error('Gemini restaurant analysis failed:', error);
      throw error;
    }
  }

  async compareRestaurants(restaurantIds: string[]): Promise<any> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      const result = await this.genAI.models.generateContent({
        model: "gemini-pro",
        contents: [{ text: `
        Compare these restaurants: ${restaurantIds.join(', ')}
        Provide a detailed comparison of their cuisines, prices, atmospheres, and suitability for different occasions.
      ` }]
      });
      return result.text
    } catch (error) {
      console.error('Gemini restaurant comparison failed:', error);
      throw error;
    }
  }

  async summarizeRestaurant(restaurantId: string): Promise<any> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      const result = await this.genAI.models.generateContent({
        model: "gemini-pro",
        contents: [{ text: `
        Provide a concise summary of restaurant with ID: "${restaurantId}"
        Highlight the key points that make it unique or recommendable.
      ` }]
      });
      return result.text
    } catch (error) {
      console.error('Gemini restaurant summarization failed:', error);
      throw error;
    }
  }

  async answerRestaurantQuestion(restaurantId: string, question: string): Promise<any> {
    try {
      this.init();
      if (!this.genAI) {
        throw new Error('Gemini API key not configured');
      }
      const result = await this.genAI.models.generateContent({
        model: "gemini-pro",
        contents: [{ text: `
        Based on information about restaurant with ID: "${restaurantId}"
        Answer this question: "${question}"
      ` }]
      });
      return result.text
    } catch (error) {
      console.error('Gemini question answering failed:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();