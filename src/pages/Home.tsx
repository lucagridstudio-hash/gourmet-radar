import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantSearchService } from '../services/restaurantSearchService';

const Home = () => {
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
    <>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col items-center py-12">
          <div className="flex items-center justify-between mb-6 w-full">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="Gourmet Radar Logo" className="h-10 w-auto" />
            </div>
            <div className="flex-1 flex-col items-start">
              <h3 className="text-xl font-semibold text-gray-900 ml-4 flex-grow">
                RISTORANTI
              </h3>
            </div>
          </div>
          <p className="text-gray-600">
            Tutti i ristoranti, per ogni cucina, budget e occasione.
          </p>
          <div className="mt-6 flex justify-center">
            <span className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
              Esplora Ristoranti
            </span>
          </div>
        </div>

        {/* AI Search Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Cerca con Gemini
          </h2>
          <p className="text-xl text-gray-600 text-center mb-6 max-w-2xl mx-auto">
            Descrivi quello che hai voglia di mangiare in linguaggio naturale e
            lascia che Gemini trovi i ristoranti perfetti per te.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
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
                className="px-6 py-3 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors hover:shadow-md disabled:opacity-50"
              >
                {loading ? 'Cerca...' : 'Cerca con Gemini'}
              </button>
            </div>
            {error && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Features Section */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="bg-indigo-100 text-indigo-800 rounded-full p-4 mb-4 inline-flex">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Ricerca per posizione
            </h3>
            <p className="text-gray-600">
              Inserisci città, indirizzo, CAP o usa la tua posizione GPS per trovare
              ristoranti nelle vicinanze.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="bg-indigo-100 text-indigo-800 rounded-full p-4 mb-4 inline-flex">
              <span className="text-3xl">⏱️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Filtro tempo di guida
            </h3>
            <p className="text-gray-600">
              Trova ristoranti raggiungibili in un determinato tempo di percorrenza
              in automobile, con opzioni da 10 minutes a 2 ore.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="bg-indigo-100 text-indigo-800 rounded-full p-4 mb-4 inline-flex">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Filtri avanzati
            </h3>
            <p className="text-gray-600">
              Cucina, occasione, prezzo, valutazione, caratteristiche e molto altro
              per affinare la ricerca secondo le tue preferenze.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;