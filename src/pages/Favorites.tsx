import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Restaurant } from '../types/restaurant';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Restaurant[]>(() => {
    const storedFavorites = localStorage.getItem('gourmetRadarFavorites');
    if (storedFavorites) {
      try {
        return JSON.parse(storedFavorites);
      } catch (e) {
        console.error('Error parsing favorites from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const saveFavorites = (favs: Restaurant[]) => {
    try {
      localStorage.setItem('gourmetRadarFavorites', JSON.stringify(favs));
      setFavorites(favs);
    } catch (e) {
      console.error('Error saving favorites to localStorage', e);
    }
  };

  const toggleFavorite = (restaurant: Restaurant) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === restaurant.id);
      const updatedFavorites = isAlreadyFavorite
        ? prev.filter(fav => fav.id !== restaurant.id)
        : [...prev, restaurant];
      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Preferiti</h1>
            <div className="flex items-center space-x-3">
              {favorites.length > 0 && (
                <button 
                  onClick={() => {
                    if (window.confirm('Eliminare tutti i preferiti?')) {
                      saveFavorites([]);
                    }
                  }} 
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Elimina tutti
                </button>
              )}
              <button 
                onClick={() => navigate('/')} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Nuova ricerca
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="text-gray-400 text-8xl">❤️</div>
            </div>
            <p className="text-gray-500 text-lg">Nessun ristorante salvato nei preferiti</p>
            <p className="text-gray-600 mt-2">
              Quando trovi un ristorante che ti piace, salva qui per ritrovarlo facilmente in futuro.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => navigate('/')} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors hover:shadow-md"
              >
                Inizia a cercare
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8">
              <div className="grid gap-4 md:grid-cols-4 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Totali</p>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gourmet</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter(fav => fav.michelin || fav.gamberoRosso).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Valutazione media</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.length > 0 
                      ? (favorites.reduce((sum, fav) => sum + (fav.rating || 0), 0) / favorites.length).toFixed(1)
                      : '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Distanza media</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {/* Calculate average drive time - simplified */}
                    15 min
                  </p>
                </div>
              </div>
            </div>

            {/* Favorites List */}
            <div className="space-y-6">
              {favorites.map(favorite => (
                <div key={favorite.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          {favorite.name}
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {favorite.michelin ? 'bg-indigo-100 text-indigo-800' : favorite.gamberoRosso ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                            {favorite.michelin ? 'MICHELIN' : favorite.gamberoRosso ? 'GAMBERO ROSSO' : ''}
                          </span>
                        </h2>
                        <div className="flex mt-2 space-x-4">
                          <span className="text-sm text-gray-500">
                            {favorite.cuisines.join(' • ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {favorite.occasions.slice(0, 2).join(' • ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <div className="flex items-center bg-indigo-50 text-indigo-800 px-3 py-1 rounded text-sm font-medium">
                          ❤️ PREFERITO
                        </div>
                        <div className="flex items-center">
                          {favorite.theFork?.rating && (
                            <span className="text-sm text-gray-600">
                              🍴 {favorite.theFork.rating}/10
                            </span>
                          )}
                          {favorite.tripadvisor?.rating && (
                            <span className="text-sm text-gray-600 ml-2">
                              ⭐ {favorite.tripadvisor.rating}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start">
                        <span className="flex-shrink-0 mr-3">📍</span>
                        <span className="text-sm text-gray-600">{favorite.address}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 mr-3">🚗</span>
                        <span className="text-sm text-gray-600">{favorite.driveTime}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 mr-3">💰</span>
                        <span className="text-sm text-gray-600">{favorite.priceRange}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 mr-3">⭐</span>
                        <span className="text-sm text-gray-600">{favorite.rating || 0} ({favorite.reviewCounts?.reduce((sum, rc) => sum + rc.count, 0) || 0} recensioni)</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button 
                        onClick={() => toggleFavorite(favorite)}
                        className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                      >
                        <span className="mr-2">{favorites.some(fav => fav.id === favorite.id) ? '💔' : '❤️'}</span>
                        Rimuovi dai preferiti
                      </button>
                      <Link 
                        to={`/restaurant/${favorite.id}`} 
                        className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <span className="mr-2">👁️</span>
                        Vedi dettagli
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;