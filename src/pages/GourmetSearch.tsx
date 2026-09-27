import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GourmetSearch = () => {
  const [origin, setOrigin] = useState('');
  const [maxDriveMinutes, setMaxDriveMinutes] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [occasion, setOccasion] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would validate inputs and navigate to search results
    // with the structured query parameters
    navigate(`/search?section=gourmet&origin=${encodeURIComponent(origin)}&maxDriveMinutes=${encodeURIComponent(maxDriveMinutes)}&cuisines=${encodeURIComponent(JSON.stringify(cuisines))}&occasion=${encodeURIComponent(JSON.stringify(occasion))}&priceRange=${encodeURIComponent(priceRange)}&rating=${encodeURIComponent(rating)}`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Trova ristoranti che valgono il viaggio.
        </h1>
        <p className="text-gray-600 text-center max-w-xl">
          Questa sezione è dedicata ai ristoranti di fascia alta e dà priorità a 
          Michelin, Gambero Rosso, TheFork e informazioni ufficiali del ristorante.
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
              {/* Sample cuisine options - in reality these would be dynamic */}
              <button 
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Italiana') 
                  ? prev.filter(c => c !== 'Italiana') 
                  : [...prev, 'Italiana'])}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Italiana') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Italiana
              </button>
              <button 
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Pesce') 
                  ? prev.filter(c => c !== 'Pesce') 
                  : [...prev, 'Pesce'])}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Pesce') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Pesce
              </button>
              <button 
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Italiana') 
                  ? prev.filter(c => c !== 'Italiana') 
                  : [...prev, 'Italiana'])}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Italiana') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Italiana
              </button>
              <button 
                type="button"
                onClick={() => setCuisines(prev => prev.includes('Giapponese') 
                  ? prev.filter(c => c !== 'Giapponese') 
                  : [...prev, 'Giapponese'])}
                className={`px-3 py-2 text-sm rounded ${cuisines.includes('Giapponese') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Giapponese
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
                className={`px-3 py-2 text-sm rounded ${occasion.includes('Romantico') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Romantico
              </button>
              <button 
                type="button"
                onClick={() => setOccasion(prev => prev.includes('Famiglia') 
                  ? prev.filter(o => o !== 'Famiglia') 
                  : [...prev, 'Famiglia'])}
                className={`px-3 py-2 text-sm rounded ${occasion.includes('Famiglia') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Famiglia
              </button>
              <button 
                type="button"
                onClick={() => setOccasion(prev => prev.includes('Tra amici') 
                  ? prev.filter(o => o !== 'Tra amici') 
                  : [...prev, 'Tra amici'])}
                className={`px-3 py-2 text-sm rounded ${occasion.includes('Tra amici') ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Tra amici
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
            >
              <option value="">Qualsiasi valutazione</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
              <option value="4.8">4.8+</option>
              <option value="4.9">4.9+</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 hover:shadow-md"
          >
            Cerca ristoranti gourmet
          </button>
        </div>
      </form>
    </div>
  );
};

export default GourmetSearch;