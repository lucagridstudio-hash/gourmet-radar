import { createContext } from 'react';
import type { Restaurant, SearchFilters } from '../types/restaurant';

export interface AppContextType {
  favorites: Restaurant[];
  toggleFavorite: (restaurant: Restaurant) => void;
  isFavorite: (restaurantId: string) => boolean;
  compareList: Restaurant[];
  addToCompare: (restaurant: Restaurant) => void;
  removeFromCompare: (restaurantId: string) => void;
  clearCompare: () => void;
  searchFilters: SearchFilters | null;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);