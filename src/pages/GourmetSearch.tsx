import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantSearchService } from '../services/restaurantSearchService';

const GourmetSearch = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Inserisci una query di ricerca');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Store search parameters for the results page
      localStorage.setItem('gourmetRadarLastQuery', query);
      localStorage.setItem('gourmetRadarLastSection', 'gourmet');

      // Perform the search
      const searchResult = await restaurantSearchService.searchRestaurants(query, 'gourmet');

      // Store results in localStorage for the SearchResults page to pick up
      localStorage.setItem('gourmetRadarSearchResults', JSON.stringify(searchResult.restaurants));

      // Navigate to results page
      navigate('/search?section=gourmet');
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
          Cerca con Gemini
        </h1>
        <p className="text-gray-600 text-center max-w-xl">
          Descrivi quello che hai voglia di mangiare in linguaggio naturale e
          lascia che Gemini trovi i ristoranti perfetti per te.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cosa hai voglia di mangiare? (es. ristorante romantico a Napoli entro 40 minuti, cucina di pesce, circa 60-100 euro)"
              className="w-full px-6 py-4 pl-12 pr-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              disabled={loading}
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              </div>
            )}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-indigo-500">🤖</span>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 hover:shadow-md"
            >
              {loading ? 'Cerco...' : 'Cerca ristoranti gourmet'}
            </button>
          </div>
          {error && (
            <div className="mt-3 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default GourmetSearch;