import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Restaurant } from '../types/restaurant';

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, this would fetch from API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock restaurant data
        const mockRestaurant = {
          id: id!,
          name: 'Ristorante Da Michele',
          provider: 'Michelin',
          rating: 4.9,
          reviewCounts: [{ source: 'Tripadvisor', count: 284 }],
          priceRange: '€€€€',
          cuisines: ['Italiana', 'Napoletana'],
          occasions: ['Romantico', 'Cena speciale', 'Famiglia'],
          mealTypes: ['Pranzo', 'Cena'],
          features: ['Tavoli all\'aperto', 'Carta dei vini', 'Wi-Fi', 'Accessibile', 'Pet friendly'],
          dietaryOptions: ['Vegetariano disponibile'],
          address: 'Via Cesare Sersale, 1/3, 80139 Napoli NA',
          phone: '+39 081 557 8417',
          website: 'https://www.ristorantedamichele.it/',
          driveDistance: 1.2,
          driveTime: '5 min',
          latitude: 40.8484,
          longitude: 14.2526,
          michelin: { stars: 3, bibGourmand: false, greenStar: false, selected: true },
          gamberoRosso: { forchette: 3, otherAwards: [] },
          theFork: { rating: 9.4, reviewCount: 229 },
          tripadvisor: { rating: 4.7, reviewCount: 532 },
          ratings: [],
          reviews: [],
          sources: [
            {
              provider: 'Michelin',
              sourceUrl: 'https://guide.michelin.com/it',
              retrievedAt: new Date().toISOString(),
              confidence: 'alto'
            } as const,
            {
              provider: 'TheFork',
              sourceUrl: 'https://www.thefork.com/restaurant-da-michele',
              retrievedAt: new Date().toISOString(),
              confidence: 'alto'
            } as const,
            {
              provider: 'Tripadvisor',
              sourceUrl: 'https://www.tripadvisor.com/RestaurantReview-123456',
              retrievedAt: new Date().toISOString(),
              confidence: 'alto'
            } as const
          ]
        };

        setRestaurant(mockRestaurant);
      } catch (err) {
        setError('Errore nel caricamento dei dettagli. Riprova più tardi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id, navigate]);

  if (loading && !restaurant) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-6">
        <div className="mb-6">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Torna indietro
        </button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-6">
        <div className="mb-6">
          <div className="text-gray-500 text-6xl mb-4">❓</div>
          <p className="text-gray-600 text-center">Ristorante non trovato</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Torna indietro
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-6">
      <header className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <span className="mr-2">←</span>
          Torna indietro
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {restaurant?.name}
          {restaurant?.michelin && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              MICHELIN
            </span>
          )}
        </h1>
      </header>

      <div className="space-y-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-indigo-600">{restaurant?.rating}</p>
          <p className="text-sm text-gray-500"> /5 ({restaurant?.reviewCounts?.reduce((sum, rc) => sum + rc.count, 0) || 0} recensioni)</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informazioni</h2>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Indirizzo:</p>
            <p className="text-lg text-gray-900">{restaurant?.address}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Telefono:</p>
            <p className="text-lg text-gray-900">{restaurant?.phone}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Sito web:</p>
            <p className="text-lg text-gray-900">
              <a href={restaurant?.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                Sito ufficiale
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;