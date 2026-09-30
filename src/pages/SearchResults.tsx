import { useEffect, useState, useMemo } from 'react';
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
  const cuisinesStr = searchParams.get('cuisines') || '[]';
  const occasionStr = searchParams.get('occasion') || '[]';
  const cuisines = useMemo(() => JSON.parse(cuisinesStr), [cuisinesStr]);
  const occasion = useMemo(() => JSON.parse(occasionStr), [occasionStr]);
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
                reviewCounts: [{ source: 'Tripadvisor', count: 284 }],
                priceRange: '€€€€',
                cuisines: ['Italiana', 'Napoletana'],
                occasions: ['Romantico', 'Cena speciale'],
                mealTypes: ['Pranzo', 'Cena'],
                dietaryOptions: [],
                features: ['Tavoli all\'aperto', 'Carta dei vini'],
                address: 'Via Cesare Sersale, 1/3, 80139 Napoli NA',
                driveDistance: 1.2,
                driveTime: '5 min',
                website: 'https://www.ristorantedamichele.it/',
                michelin: { stars: 3, bibGourmand: false, greenStar: false, selected: true },
                gamberoRosso: { forchette: 3, otherAwards: [] },
                theFork: { rating: 9.4, reviewCount: 229 },
                tripadvisor: { rating: 4.7, reviewCount: 532 },
                ratings: [],
                reviews: [],
                sources: []
              },
              {
                id: '2',
                name: 'Osteria da Carmela',
                provider: 'Tripadvisor',
                rating: 4.7,
                reviewCounts: [{ source: 'Tripadvisor', count: 156 }],
                priceRange: '€€€',
                cuisines: ['Italiana', 'Mediterranea'],
                occasions: ['Famiglia', 'Pranzo'],
                mealTypes: ['Pranzo', 'Cena'],
                dietaryOptions: [],
                features: ['Wi-Fi', 'Accessibile', 'Tavoli all\'aperto'],
                address: 'Via Paladino, 39, 80134 Napoli NA',
                driveDistance: 2.1,
                driveTime: '8 min',
                website: 'https://www.osteriadacarmela.it/',
                michelin: undefined,
                gamberoRosso: { forchette: 3, otherAwards: [] },
                theFork: { rating: 9.0, reviewCount: 120 },
                tripadvisor: { rating: 4.5, reviewCount: 100 },
                ratings: [],
                reviews: [],
                sources: []
              }
            ]
          : [
              {
                id: '3',
                name: 'Pizzeria Starita',
                provider: 'TheFork',
                rating: 4.5,
                reviewCounts: [{ source: 'Tripadvisor', count: 342 }],
                priceRange: '€€',
                cuisines: ['Pizza', 'Italiana'],
                occasions: ['Famiglia', 'Tra amici'],
                mealTypes: ['Pranzo', 'Cena'],
                dietaryOptions: [],
                features: ['Tavoli all\'aperto', 'Wi-Fi', 'Accessibile'],
                address: 'Via Materdei, 27/28, 80136 Napoli NA',
                driveDistance: 0.8,
                driveTime: '4 min',
                website: 'https://www.pizzeriastarita.it/',
                michelin: undefined,
                gamberoRosso: undefined,
                theFork: { rating: 4.2, reviewCount: 80 },
                tripadvisor: { rating: 4.0, reviewCount: 60 },
                ratings: [],
                reviews: [],
                sources: []
              },
              {
                id: '4',
                name: 'Trattoria da Nennella',
                provider: 'Tripadvisor',
                rating: 4.6,
                reviewCounts: [{ source: 'Tripadvisor', count: 289 }],
                priceRange: '€€',
                cuisines: ['Italiana', 'Napoletana'],
                occasions: ['Famiglia', 'Pranzo di lavoro'],
                mealTypes: ['Pranzo', 'Cena'],
                dietaryOptions: [],
                features: ['Accessibile', 'Tavoli all\'aperto'],
                address: 'Via Agostino Depretis, 324/326, 80134 Napoli NA',
                driveDistance: 1.5,
                driveTime: '6 min',
                website: 'https://www.trattoriadannella.it/',
                michelin: undefined,
                gamberoRosso: undefined,
                theFork: { rating: 4.3, reviewCount: 70 },
                tripadvisor: { rating: 4.2, reviewCount: 55 },
                ratings: [],
                reviews: [],
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
              <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;