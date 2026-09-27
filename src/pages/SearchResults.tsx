import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { Restaurant } from '../types/restaurant';

const SearchResults = () => {
  const { section } = useParams<{ section: string }>();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse search params
  const origin = searchParams.get('origin') || '';
  const maxDriveMinutes = searchParams.get('maxDriveMinutes') || '';
  const cuisines = searchParams.get('cuisines') ? JSON.parse(searchParams.get('cuisines') || '[]') : [];
  const occasion = searchParams.get('occasion') ? JSON.parse(searchParams.get('occasion') || '[]') : [];
  const priceRange = searchParams.get('priceRange') || '';
  const rating = searchParams.get('rating') || '';
  const minReviews = searchParams.get('minReviews') || '';

  useEffect(() => {
    // Simulate API call
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, this would call our search API
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock results based on section
        const mockResults = section === 'gourmet'
          ? [
              {
                id: '1',
                name: 'Ristorante Da Michele',
                provider: 'Michelin',
                rating: 4.9,
                reviews: 284,
                price: '€€€€',
                cuisine: ['Italiana', 'Napoletana'],
                occasion: ['Romantico', 'Cena speciale'],
                features: ['Tavoli all\'aperto', 'Carta dei vini'],
                address: 'Via Cesare Sersale, 1/3, 80139 Napoli NA',
                distance: '1.2 km',
                driveTime: '5 min',
                website: 'https://www.ristorantedamichele.it/',
                michelin: true,
                gamberoRosso: false,
                theFork: true,
                tripadvisor: true,
                sources: []
              },
              {
                id: '2',
                name: 'Osteria da Carmela',
                provider: 'Tripadvisor',
                rating: 4.7,
                reviews: 156,
                price: '€€€',
                cuisine: ['Italiana', 'Mediterranea'],
                occasion: ['Famiglia', 'Pranzo'],
                features: ['Wi-Fi', 'Accessibile', 'Tavoli all\'aperto'],
                address: 'Via Paladino, 39, 80134 Napoli NA',
                distance: '2.1 km',
                driveTime: '8 min',
                website: 'https://www.osteriadacarmela.it/',
                michelin: false,
                gamberoRosso: true,
                theFork: true,
                tripadvisor: true,
                sources: []
              }
            ]
          : [
              {
                id: '3',
                name: 'Pizzeria Starita',
                provider: 'TheFork',
                rating: 4.5,
                reviews: 342,
                price: '€€',
                cuisine: ['Pizza', 'Italiana'],
                occasion: ['Famiglia', 'Tra amici'],
                features: ['Tavoli all\'aperto', 'Wi-Fi', 'Accessibile'],
                address: 'Via Materdei, 27/28, 80136 Napoli NA',
                distance: '0.8 km',
                driveTime: '4 min',
                website: 'https://www.pizzeriastarita.it/',
                michelin: false,
                gamberoRosso: false,
                theFork: true,
                tripadvisor: true,
                sources: []
              },
              {
                id: '4',
                name: 'Trattoria da Nennella',
                provider: 'Tripadvisor',
                rating: 4.6,
                reviews: 289,
                price: '€€',
                cuisine: ['Italiana', 'Napoletana'],
                occasion: ['Famiglia', 'Pranzo di lavoro'],
                features: ['Accessibile', 'Tavoli all\'aperto'],
                address: 'Via Agostino Depretis, 324/326, 80134 Napoli NA',
                distance: '1.5 km',
                driveTime: '6 min',
                website: 'https://www.trattoriadannella.it/',
                michelin: false,
                gamberoRosso: false,
                theFork: true,
                tripadvisor: true,
                sources: []
              }
            ];

        setResults(mockResults);
      } catch (err) {
        setError('Errore durante la ricerca. Riprova più tardi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (origin) {
      fetchResults();
    }
  }, [origin, maxDriveMinutes, cuisines, occasion, priceRange, rating, minReviews, section]);

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

  return (
    <div className="space-y-6 p-6">
      {/* Results List */}
      <div className="space-y-4">
        {results.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span className="text-sm text-gray-600">{restaurant.address}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰</span>
              <span className="text-sm text-gray-600">{restaurant.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;