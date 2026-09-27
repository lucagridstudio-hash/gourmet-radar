export class StorageService {
  static saveItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage key ${key}:`, error);
    }
  }

  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Error getting from localStorage key ${key}:`, error);
      return defaultValue;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key ${key}:`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

import type { Restaurant } from '../types/restaurant';

export class ApiKeyService {
  private static readonly PREFIX = 'gourmetRadar';

  static saveGeminiKey(key: string, remember: boolean = false): void {
    if (remember) {
      StorageService.saveItem(`${this.PREFIX}GeminiKey`, key);
      StorageService.saveItem(`${this.PREFIX}RememberKeys`, 'true');
    } else {
      // For session-only storage, we could use sessionStorage
      // But for simplicity, we'll still use localStorage but clear on unload
      StorageService.saveItem(`${this.PREFIX}GeminiKey`, key);
    }
  }

  static getGeminiKey(): string {
    return StorageService.getItem(`${this.PREFIX}GeminiKey`, '');
  }

  static saveTripadvisorKey(key: string, remember: boolean = false): void {
    if (remember) {
      StorageService.saveItem(`${this.PREFIX}TripadvisorKey`, key);
      StorageService.saveItem(`${this.PREFIX}RememberKeys`, 'true');
    } else {
      StorageService.saveItem(`${this.PREFIX}TripadvisorKey`, key);
    }
  }

  static getTripadvisorKey(): string {
    return StorageService.getItem(`${this.PREFIX}TripadvisorKey`, '');
  }

  static saveRoutingKey(key: string, remember: boolean = false): void {
    if (remember) {
      StorageService.saveItem(`${this.PREFIX}RoutingKey`, key);
      StorageService.saveItem(`${this.PREFIX}RememberKeys`, 'true');
    } else {
      StorageService.saveItem(`${this.PREFIX}RoutingKey`, key);
    }
  }

  static getRoutingKey(): string {
    return StorageService.getItem(`${this.PREFIX}RoutingKey`, '');
  }

  static clearAllKeys(): void {
    StorageService.removeItem(`${this.PREFIX}GeminiKey`);
    StorageService.removeItem(`${this.PREFIX}TripadvisorKey`);
    StorageService.removeItem(`${this.PREFIX}RoutingKey`);
    StorageService.removeItem(`${this.PREFIX}RememberKeys`);
  }
}

export class FavoritesService {
  private static readonly KEY = 'gourmetRadarFavorites';

  static addFavorite(restaurant: Restaurant): void {
    const favorites = this.getFavorites();
    const alreadyExists = favorites.some(fav => fav.id === restaurant.id);
    
    if (!alreadyExists) {
      const updatedFavorites = [...favorites, restaurant];
      StorageService.saveItem(this.KEY, updatedFavorites);
    }
  }

  static removeFavorite(restaurantId: string): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== restaurantId);
    StorageService.saveItem(this.KEY, updatedFavorites);
  }

  static getFavorites(): Restaurant[] {
    return StorageService.getItem<Restaurant[]>(this.KEY, []);
  }

  static isFavorite(restaurantId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === restaurantId);
  }

  static clearFavorites(): void {
    StorageService.removeItem(this.KEY);
  }

  static saveFavorites(favorites: Restaurant[]): void {
    StorageService.saveItem(this.KEY, favorites);
  }
}