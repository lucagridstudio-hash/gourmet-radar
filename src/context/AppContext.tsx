import React, { createContext, useState, useContext } from 'react';
import type { Restaurant, SearchFilters } from '../types/restaurant';
import { FavoritesService } from '../utils/storage';

export interface AppContextType {
  favorites: Restaurant[];
  toggleFavorite: (restaurant: Restaurant) => void;
  isFavorite: (restaurantId: string) => boolean;
  searchFilters: SearchFilters | null;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Restaurant[]>(() => {
    return FavoritesService.getFavorites();
  });
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);

  const toggleFavorite = (restaurant: Restaurant) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === restaurant.id);
      const updatedFavorites = isAlreadyFavorite
        ? prev.filter(fav => fav.id !== restaurant.id)
        : [...prev, restaurant];
      FavoritesService.saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  const isFavorite = (restaurantId: string): boolean => {
    return FavoritesService.isFavorite(restaurantId);
  };

  const value: AppContextType = {
    favorites,
    toggleFavorite,
    isFavorite,
    searchFilters,
    setSearchFilters,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};