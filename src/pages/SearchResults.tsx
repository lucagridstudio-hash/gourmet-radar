import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Restaurant, SearchResult } from '../types/restaurant';
import { restaurantSearchService } from '../services/restaurantSearchService';
import { useAppContext } from '../context/useAppContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToCompare, compareList } = useAppContext();
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryInfo, setQueryInfo] = useState<SearchResult['queryInfo'] | null>(null);

  // Parse search params
  const origin = searchParams.get('origin') || '';
  const maxDriveMinutes = searchParams.get('maxDriveMinutes') || '';
  const cuisinesStr = searchParams.get('cuisines') || '[]';
  const occasionStr = searchParams.get('occasion') || '[]';
  const cuisines = useMemo(() => {
    try {
      return JSON.parse(cuisinesStr);
    } catch {
      return [];
    }
  }, [cuisinesStr]);
  const occasions = useMemo(() => {
    try {
      return JSON.parse(occasionStr);
    } catch {
      return [];
    }
  }, [occasionStr]);
  const priceRange = searchParams.get('priceRange') || '';
  const rating = searchParams.get('rating') || '';
  const minReviews = searchParams.get('minReviews') || '';
  const section = (searchParams.get('section') as 'gourmet' | 'restaurants') || 'restaurants';

  // Build a natural language query from the search parameters
  const buildQueryFromParams = (): string => {
    const parts = [];

    if (origin) {
      parts.push(`near ${origin}`);
    }

    if (maxDriveMinutes) {
      parts.push(`within ${maxDriveMinutes} minutes drive`);
    }

    if (cuisines.length > 0) {
      parts.push(`with ${cuisines.join(' and ')} cuisine`);
    }

    if (occasions.length > 0) {
      parts.push(`for ${occasions.join(' and ')} occasion`);
    }

    if (priceRange) {
      parts.push(`in the ${priceRange} price range`);
    }

    if (rating) {
      parts.push(`with rating above ${rating}`);
    }

    if (minReviews) {
      parts.push(`with at least ${minReviews} reviews`);
    }

    if (parts.length === 0) {
      return "Find restaurants";
    }

    return `Find restaurants ${parts.join(' ')}.`;
  };

  const query = buildQueryFromParams();

  useEffect(() => {
    const fetchResults = async () => {
      // First check if we have saved results from a previous search
      const stored = localStorage.getItem('gourmetRadarSearchResults');
      const lastQuery = localStorage.getItem('gourmetRadarLastQuery');
      const lastSection = localStorage.getItem('gourmetRadarLastSection');

      if (stored && lastQuery && lastSection === section) {
        try {
          const savedResults = JSON.parse(stored);
          if (Array.isArray(savedResults) && savedResults.length > 0) {
            setResults(savedResults);
            // We still need queryInfo for display, so we'll do a lightweight search for metadata
            // or we can reconstruct basic queryInfo
            setQueryInfo({
              originalQuery: lastQuery,
              parsedFilters: null,
              groundingMetadata: {},
              searchMetadata: {
                queryUsed: lastQuery,
                totalFound: savedResults.length,
                searchTimestamp: new Date().toISOString(),
              },
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse saved search results:', e);
        }
      }

      if (!origin && cuisines.length === 0 && occasions.length === 0 && !priceRange && !rating && !minReviews) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setQueryInfo(null);

      try {
        const searchResult = await restaurantSearchService.searchRestaurants(query, section);
        setResults(searchResult.restaurants);
        setQueryInfo(searchResult.queryInfo);
      } catch (err) {
        setError('Errore durante la ricerca. Riprova più tardi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (origin || cuisines.length > 0 || occasions.length > 0 || priceRange || rating || minReviews) {
      fetchResults();
    }
  }, [origin, maxDriveMinutes, cuisines, occasions, priceRange, rating, minReviews, section, query]);

  const handleFavorite = (restaurant: Restaurant) => {
    toggleFavorite(restaurant);
  };

  const handleCompare = (restaurant: Restaurant) => {
    addToCompare(restaurant);
  };

  const handleDetails = (restaurant: Restaurant) => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  const isInCompare = (restaurantId: string) => {
    return compareList.some((r: Restaurant) => r.id === restaurantId);
  };

  if (loading && results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        <p className="text-gray-500">Caricamento risultati...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          ❌
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (results.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          🔍
        </div>
        <p className="text-gray-600">Nessun ristorante trovato con i criteri specificati.</p>
        {queryInfo && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Query: "{queryInfo.originalQuery}"</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Query Info */}
      {queryInfo && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Informazioni sulla ricerca</h3>
          <p className="text-sm text-gray-600">
            Query elaborata: "{queryInfo.originalQuery}"
          </p>
          {queryInfo.groundingMetadata && Object.keys(queryInfo.groundingMetadata).length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              Dati estratti da fonti verificate tramite ricerca avanzata.
            </div>
          )}
          {queryInfo.searchMetadata && (
            <div className="mt-2 text-xs text-gray-500">
              Trovati {queryInfo.searchMetadata.totalFound} risultati • {new Date(queryInfo.searchMetadata.searchTimestamp).toLocaleString('it-IT')}
            </div>
          )}
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {restaurant.michelin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                    MICHELIN
                  </span>
                )}
                {restaurant.gamberoRosso && restaurant.gamberoRosso.forchette !== null && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                    {`${restaurant.gamberoRosso.forchette} FORCHETTE`}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
                <p className="text-gray-600">{restaurant.description || 'Descrizione non disponibile'}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {restaurant.cuisines.map(cuisine => (
                    <span key={cuisine} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {cuisine}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  {restaurant.rating !== null && (
                    <>
                      <span className="text-indigo-600 font-medium mr-1">{restaurant.rating}</span>
                      <span>/5</span>
                      {restaurant.reviewCount !== null && (
                        <span className="ml-2">({restaurant.reviewCount} recensioni)</span>
                      )}
                    </>
                  )}
                  {restaurant.rating === null && (
                    <span className="text-gray-400">Valutazione non disponibile</span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  {restaurant.driveTime && (
                    <>
                      <span className="mr-2">🚗</span>
                      <span>{restaurant.driveTime}</span>
                      {restaurant.driveDistance && (
                        <span className="ml-2">• {restaurant.driveDistance}</span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📍</span>
                  <span>{restaurant.address}</span>
                  {restaurant.city && <span className="ml-2">• {restaurant.city}</span>}
                </div>
              </div>
              <div className="flex-shrink-0 flex-col items-center space-y-2">
                {restaurant.website && (
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    Sito web
                  </a>
                )}
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleFavorite(restaurant)}
                    className={`p-1 transition-colors ${
                      isFavorite(restaurant.id)
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                    aria-label={isFavorite(restaurant.id) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                  >
                    {isFavorite(restaurant.id) ? '❤️' : '🤍'}
                  </button>
                  <button
                    onClick={() => handleCompare(restaurant)}
                    className={`p-1 transition-colors ${
                      isInCompare(restaurant.id)
                        ? 'text-indigo-600'
                        : 'text-gray-500 hover:text-indigo-600'
                    }`}
                    aria-label={isInCompare(restaurant.id) ? 'Rimuovi dal confronto' : 'Aggiungi al confronto'}
                    disabled={!isInCompare(restaurant.id) && compareList.length >= 3}
                  >
                    ⚖️
                  </button>
                  <button
                    onClick={() => handleDetails(restaurant)}
                    className="text-gray-500 hover:text-indigo-600 p-1"
                    aria-label="Vedi dettagli"
                  >
                    👁️
                  </button>
                </div>
              </div>
            </div>

            {/* Sources */}
            {restaurant.sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-medium mb-1">Fonti:</p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      {source.provider}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;