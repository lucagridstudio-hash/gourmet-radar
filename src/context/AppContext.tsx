import React, { useState } from 'react';
import type { Restaurant, SearchFilters } from '../types/restaurant';
import { FavoritesService } from '../utils/storage';
import { AppContext, type AppContextType } from './AppContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Restaurant[]>(() => {
    return FavoritesService.getFavorites();
  });
  const [compareList, setCompareList] = useState<Restaurant[]>(() => {
    const stored = localStorage.getItem('gourmetRadarCompare');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
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

  const addToCompare = (restaurant: Restaurant) => {
    setCompareList(prev => {
      if (prev.some(r => r.id === restaurant.id)) {
        return prev;
      }
      if (prev.length >= 3) {
        return prev;
      }
      const updated = [...prev, restaurant];
      localStorage.setItem('gourmetRadarCompare', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (restaurantId: string) => {
    setCompareList(prev => {
      const updated = prev.filter(r => r.id !== restaurantId);
      localStorage.setItem('gourmetRadarCompare', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('gourmetRadarCompare');
  };

  const value: AppContextType = {
    favorites,
    toggleFavorite,
    isFavorite,
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    searchFilters,
    setSearchFilters,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};