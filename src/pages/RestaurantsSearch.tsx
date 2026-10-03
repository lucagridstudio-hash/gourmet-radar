import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantSearchService } from '../services/restaurantSearchService';

const RestaurantsSearch = () => {
  const [origin, setOrigin] = useState('');
  const [maxDriveMinutes, setMaxDriveMinutes] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [occasion, setOccasion] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [minReviews, setMinReviews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build natural language query from form inputs
    const queryParts = [];

    if (origin) {
      queryParts.push(`near ${origin}`);
    }

    if (maxDriveMinutes) {
      queryParts.push(`within ${maxDriveMinutes} minutes drive`);
    }

    if (cuisines.length > 0) {
      queryParts.push(`with ${cuisines.join(' and ')} cuisine`);
    }

    if (occasion.length > 0) {
      queryParts.push(`for ${occasion.join(' and ')} occasion`);
    }

    if (priceRange) {
      queryParts.push(`in the ${priceRange} price range`);
    }

    if (rating) {
      queryParts.push(`with rating above ${rating}`);
    }

    if (minReviews) {
      queryParts.push(`with at least ${minReviews} reviews`);
    }

    const query = queryParts.length > 0
      ? `Find restaurants ${queryParts.join(' ')}.`
      : 'Find restaurants';

    // Add restaurants context
    const fullQuery = `In the RISTORANTI section (any type of restaurant): ${query}`;

    setLoading(true);
    setError(null);

    try {
      // Store search parameters for the results page
      localStorage.setItem('gourmetRadarLastQuery', fullQuery);
      localStorage.setItem('gourmetRadarLastSection', 'restaurants');

      // Perform the search
      const searchResult = await restaurantSearchService.searchRestaurants(fullQuery, 'restaurants');

      // Store results in localStorage for the SearchResults page to pick up
      localStorage.setItem('gourmetRadarSearchResults', JSON.stringify(searchResult.restaurants));

      // Navigate to results page with original parameters for filtering/display
      navigate(`/search?section=restaurants&origin=${encodeURIComponent(origin)}&maxDriveMinutes=${encodeURIComponent(maxDriveMinutes)}&cuisines=${encodeURIComponent(JSON.stringify(cuisines))}&occasion=${encodeURIComponent(JSON.stringify(occasion))}&priceRange=${encodeURIComponent(priceRange)}&rating=${encodeURIComponent(rating)}&minReviews=${encodeURIComponent(minReviews)}`);
    } catch (err) {
      setError('Errore durante la ricerca. Riprova più tardi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Trova il ristorante giusto per ogni occasione.
        </h1>
        <p className="text-gray-600 text-center max-w-xl">
          Questa sezione trova ristoranti di qualsiasi fascia, da quelli economici
          ai locali di lusso, per ogni cucina, budget e occasione.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          {/* Origin Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Da dove parti?
            </label>
            <input
              type="text"
              placeholder="Napoli o Via Toledo 100, Napoli"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              disabled={loading}
            />
          </div>

          {/* Max Drive Time */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo massimo in auto
              </label>
              <select
                value={maxDriveMinutes}
                onChange={(e) => setMaxDriveMinutes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              >
                <option value="">Seleziona tempo...</option>
                <option value="10">10 minuti</option>
                <option value="15">15 minuti</option>
                <option value="20">20 minuti</option>
                <option value="30">30 minuti</option>
                <option value="45">45 minuti</option>
                <option value="60">1 ora</option>
                <option value="90">1 ora e 30</option>
                <option value="120">2 ore</option>
                <option value="custom">Personalizzato</option>
              </select>
            </div>

            {/* Custom time input (shown when Personalizzato is selected) */}
            {maxDriveMinutes === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minuti personalizzati
                </label>
                <input
                  type="number"
                  placeholder="Es. 75"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Cuisines */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cucina
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Italiana')
                  ? prev.filter(c => c !== 'Italiana')
                  : [...prev, 'Italiana'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Italiana') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Italiana
              </button>
              <button
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Pizza')
                  ? prev.filter(c => c !== 'Pizza')
                  : [...prev, 'Pizza'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Pizza') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Pizza
              </button>
              <button
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Sushi')
                  ? prev.filter(c => c !== 'Sushi')
                  : [...prev, 'Sushi'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Sushi') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Sushi
              </button>
              <button
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Carne')
                  ? prev.filter(c => c !== 'Carne')
                  : [...prev, 'Carne'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Carne') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Carne
              </button>
              <button
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Pesce')
                  ? prev.filter(c => c !== 'Pesce')
                  : [...prev, 'Pesce'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Pesce') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Pesce
              </button>
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occasione
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOccasion(prev => prev.includes('Romantico')
                  ? prev.filter(o => o !== 'Romantico')
                  : [...prev, 'Romantico'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${occasion.includes('Romantico') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Romantico
              </button>
              <button
                type="button"
                onClick={() => setOccasion(prev => prev.includes('Famiglia')
                  ? prev.filter(o => o !== 'Famiglia')
                  : [...prev, 'Famiglia'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${occasion.includes('Famiglia') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Famiglia
              </button>
              <button
                type="button"
                onClick={() => setOccasion(prev => prev.includes('Business')
                  ? prev.filter(o => o !== 'Business')
                  : [...prev, 'Business'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${occasion.includes('Business') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Business
              </button>
              <button
                type="button"
                onClick={() => setOccasion(prev => prev.includes('Pranzo di lavoro')
                  ? prev.filter(o => o !== 'Pranzo di lavoro')
                  : [...prev, 'Pranzo di lavoro'])}
                disabled={loading}
                className={`px-3 py-2 text-sm rounded ${occasion.includes('Pranzo di lavoro') ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Pranzo di lavoro
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fascia di prezzo
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="">Qualsiasi prezzo</option>
              <option value="€">€</option>
              <option value="€€">€€</option>
              <option value="€€€">€€€</option>
              <option value="€€€€">€€€€</option>
              <option value="0-15">0–15 €</option>
              <option value="15-25">15–25 €</option>
              <option value="25-40">25–40 €</option>
              <option value="40-60">40–60 €</option>
              <option value="60-100">60–100 €</option>
              <option value="100-150">100–150 €</option>
              <option value="150+">150 €+</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valutazione minima
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="">Qualsiasi valutazione</option>
              <option value="3.5">3.5+</option>
              <option value="4.0">4.0+</option>
              <option value="4.3">4.3+</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
              <option value="4.8">4.8+</option>
              <option value="4.9">4.9+</option>
            </select>
          </div>

          {/* Minimum Reviews */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numero minimo di recensioni
            </label>
            <select
              value={minReviews}
              onChange={(e) => setMinReviews(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="">Qualsiasi numero</option>
              <option value="10">Almeno 10</option>
              <option value="25">Almeno 25</option>
              <option value="50">Almeno 50</option>
              <option value="100">Almeno 100</option>
              <option value="250">Almeno 250</option>
              <option value="500">Almeno 500</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 hover:shadow-md"
            >
              {loading ? 'Cerco...' : 'Cerca ristoranti'}
            </button>
            {error && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RestaurantsSearch;