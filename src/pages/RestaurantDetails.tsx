import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Restaurant } from '../types/restaurant';
import { useAppContext } from '../context/useAppContext';

const RestaurantDetailsContent = ({ restaurant, navigate }: { restaurant: Restaurant; navigate: ReturnType<typeof useNavigate> }) => {
  const { addToCompare, removeFromCompare, compareList } = useAppContext();
  const isInCompare = compareList.some((r: Restaurant) => r.id === restaurant.id);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Dettagli Ristorante
        </h1>
        <p className="text-gray-600 text-center max-w-xl">
          Informazioni dettagliate sul ristorante selezionato
        </p>
      </div>

      {/* Restaurant Details */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Badges */}
        <div className="flex items-center space-x-3 mb-4">
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

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-gray-600 mb-6">{restaurant.description}</p>
        )}

        {/* Sections */}
        <div className="space-y-6">
          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📍</span>
              Indirizzo
            </h3>
            <p className="text-gray-600">{restaurant.address}</p>
            {restaurant.city && (
              <p className="text-gray-600">{restaurant.city}, {restaurant.province || ''} {restaurant.region || ''}, {restaurant.country || ''}</p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📞</span>
              Contatti
            </h3>
            {restaurant.phone && (
              <p className="text-gray-600">
                <span className="mr-2">📞</span>
                {restaurant.phone}
              </p>
            )}
            {restaurant.website && (
              <p className="text-gray-600">
                <span className="mr-2">🌐</span>
                <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {restaurant.website}
                </a>
              </p>
            )}
            {restaurant.officialWebsite && (
              <p className="text-gray-600">
                <span className="mr-2">🏢</span>
                <a href={restaurant.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Sito ufficiale
                </a>
              </p>
            )}
          </div>

          {/* Cuisines */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🍽️</span>
              Cucine
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {restaurant.cuisines.map(cuisine => (
                <span key={cuisine} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {cuisine}
                </span>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🎯</span>
              Occasioni
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {restaurant.occasions.map(occasion => (
                <span key={occasion} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {occasion}
                </span>
              ))}
            </div>
          </div>

          {/* Meal Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🕐</span>
              Tipi di pasto
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {restaurant.mealTypes.map(meal => (
                <span key={meal} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {meal}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">✨</span>
              Caratteristiche
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {restaurant.features.map(feature => (
                <span key={feature} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Dietary Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🥗</span>
              Opzioni dietetiche
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {restaurant.dietaryOptions.map(option => (
                <span key={option} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">⭐</span>
              Valutazioni
            </h3>
            <div className="space-y-3">
              {/* Overall rating */}
              {restaurant.rating !== null && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="text-indigo-600 font-medium mr-1">{restaurant.rating}</span>
                  <span>/5</span>
                  {restaurant.reviewCount !== null && (
                    <span className="ml-2">({restaurant.reviewCount} recensioni)</span>
                  )}
                </div>
              )}
              {/* TheFork rating */}
              {restaurant.theFork && restaurant.theFork.rating !== null && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">🍴</span>
                  <span>TheFork: </span>
                  <span className="text-indigo-600 font-medium">{restaurant.theFork.rating}/10</span>
                  {restaurant.theFork.reviewCount !== null && (
                    <span className="ml-2">({restaurant.theFork.reviewCount} recensioni)</span>
                  )}
                </div>
              )}
              {/* TripAdvisor rating */}
              {restaurant.tripadvisor && restaurant.tripadvisor.rating !== null && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">🏨</span>
                  <span>TripAdvisor: </span>
                  <span className="text-indigo-600 font-medium">{restaurant.tripadvisor.rating}/5</span>
                  {restaurant.tripadvisor.reviewCount !== null && (
                    <span className="ml-2">({restaurant.tripadvisor.reviewCount} recensioni)</span>
                  )}
                </div>
              )}
              {/* Ratings array */}
              {restaurant.ratings && restaurant.ratings.length > 0 && (
                <>
                  {restaurant.ratings.map((rat, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">📊</span>
                      <span>{rat.source}: </span>
                      <span className="text-indigo-600 font-medium">{rat.value}/{rat.max}</span>
                    </div>
                  ))}
                </>
              )}
              {restaurant.rating === null && !restaurant.theFork?.rating && !restaurant.tripadvisor?.rating && (!restaurant.ratings || restaurant.ratings.length === 0) && (
                <p className="text-gray-500">Nessuna valutazione disponibile</p>
              )}
            </div>
          </div>

          {/* Michelin Details */}
          {restaurant.michelin && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🏆</span>
                Dettagli Michelin
              </h3>
              <div className="space-y-2">
                {restaurant.michelin.stars !== null && (
                  <p className="text-gray-600">
                    <span className="mr-2">⭐</span>
                    Stelle: {restaurant.michelin.stars}
                  </p>
                )}
                {restaurant.michelin.bibGourmand !== null && (
                  <p className="text-gray-600">
                    <span className="mr-2">🍴</span>
                    Bib Gourmand: {restaurant.michelin.bibGourmand ? 'Sì' : 'No'}
                  </p>
                )}
                {restaurant.michelin.greenStar !== null && (
                  <p className="text-gray-600">
                    <span className="mr-2">🌱</span>
                    Stella Verde: {restaurant.michelin.greenStar ? 'Sì' : 'No'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Gambero Rosso Details */}
          {restaurant.gamberoRosso && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🏆</span>
                Dettagli Gambero Rosso
              </h3>
              <div className="space-y-2">
                {restaurant.gamberoRosso.forchette !== null && (
                  <p className="text-gray-600">
                    <span className="mr-2">🍴</span>
                    Forchette: {restaurant.gamberoRosso.forchette}
                  </p>
                )}
                {restaurant.gamberoRosso.otherAwards && restaurant.gamberoRosso.otherAwards.length > 0 && (
                  <>
                    <p className="text-gray-600 mb-1">
                      <span className="mr-2">🏅</span>
                      Altri premi:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.gamberoRosso.otherAwards.map((award, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {award}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Sources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🔗</span>
              Fonti
            </h3>
            {restaurant.sources.length > 0 && (
              <div className="space-y-3">
                {restaurant.sources.map((source, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-indigo-600">
                        {source.confidence === 'alto' ? '🟢' : source.confidence === 'medio' ? '🟡' : '🔴'}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-gray-900">{source.provider}</p>
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-xs"
                      >
                        {source.sourceUrl}
                      </a>
                      <p className="text-xs text-gray-500">
                        Recuperato il: {new Date(source.retrievedAt).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Recuperato il: {new Date(restaurant.retrievedAt).toLocaleDateString('it-IT')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end mt-8 space-x-4">
            <button
              onClick={() => navigate('/favorites')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded transition-colors"
            >
              Preferiti
            </button>
            <button
              onClick={() => {
                if (isInCompare) {
                  removeFromCompare(restaurant.id);
                } else {
                  addToCompare(restaurant);
                }
              }}
              className={`px-4 py-2 font-medium rounded transition-colors ${
                isInCompare
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              disabled={!isInCompare && compareList.length >= 3}
            >
              {isInCompare ? 'Rimuovi dal confronto' : 'Aggiungi al confronto'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded transition-colors"
            >
              Nuova ricerca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const stored = localStorage.getItem('gourmetRadarSearchResults');
        if (!stored) {
          setError('Nessun risultato di ricerca disponibile. Effettua una nuova ricerca.');
          setLoading(false);
          return;
        }
        let data: Restaurant[] = [];
        try {
          data = JSON.parse(stored);
        } catch {
          setError('Errore nel leggere i risultati di ricerca.');
          setLoading(false);
          return;
        }
        if (!Array.isArray(data) || data.length === 0) {
          setError('Nessun ristorante trovato nei risultati.');
          setLoading(false);
          return;
        }
        const found = data.find(r => r.id === id);
        if (found) {
          setRestaurant(found);
          setLoading(false);
        } else {
          setNotFound(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading restaurant details:', err);
        setError('Errore imprevisto durante il caricamento dei dettagli.');
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dettagli Ristorante
          </h1>
          <p className="text-gray-600 text-center max-w-xl">
            Informazioni dettagliate sul ristorante selezionato
          </p>
        </div>
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dettagli Ristorante
          </h1>
          <p className="text-gray-600 text-center max-w-xl">
            Informazioni dettagliate sul ristorante selezionato
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            ❌
          </div>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors">
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  if (notFound || !restaurant) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dettagli Ristorante
          </h1>
          <p className="text-gray-600 text-center max-w-xl">
            Informazioni dettagliate sul ristorante selezionato
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            🔍
          </div>
          <p className="text-gray-600">Ristorante non trovato. Potrebbe essere stato rimosso dai risultati di ricerca.</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors">
            Nuova ricerca
          </button>
        </div>
      </div>
    );
  }

  return <RestaurantDetailsContent restaurant={restaurant} navigate={navigate} />;
};

export default RestaurantDetails;