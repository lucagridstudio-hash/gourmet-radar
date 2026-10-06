import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../types/restaurant';
import { useAppContext } from '../context/useAppContext';
import { geminiService } from '../services/geminiService';

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useAppContext();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (compareList.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.compareRestaurants(compareList);
      const parsed = JSON.parse(result.text || '{}');
      
      // Build a comprehensive analysis text from the structured response
      let analysisText = '';
      
      if (parsed.comparisonSummary) {
        analysisText += `## Sintesi del Confronto\n${parsed.comparisonSummary}\n\n`;
      }
      
      if (parsed.priceComparison) {
        analysisText += `## Confronto Prezzi\n${parsed.priceComparison}\n\n`;
      }
      
      if (parsed.ratingComparison) {
        analysisText += `## Confronto Valutazioni\n${parsed.ratingComparison}\n\n`;
      }
      
      if (parsed.cuisineComparison) {
        analysisText += `## Confronto Cucine\n${parsed.cuisineComparison}\n\n`;
      }
      
      if (parsed.occasionSuitability) {
        analysisText += `## Adattabilità per Occasioni\n`;
        Object.entries(parsed.occasionSuitability).forEach(([occasion, restaurants]) => {
          analysisText += `- **${occasion}**: ${(restaurants as string[]).join(', ')}\n`;
        });
        analysisText += '\n';
      }
      
      if (parsed.recognitionComparison) {
        analysisText += `## Confronto Riconoscimenti\n${parsed.recognitionComparison}\n\n`;
      }
      
      if (parsed.distanceComparison) {
        analysisText += `## Confronto Distanze/Tempi\n${parsed.distanceComparison}\n\n`;
      }
      
      if (parsed.recommendations && parsed.recommendations.length > 0) {
        analysisText += `## Raccomandazioni\n`;
        parsed.recommendations.forEach((rec: any) => {
          analysisText += `- **${rec.scenario}**: ${rec.recommendedRestaurant} - ${rec.reason}\n`;
        });
        analysisText += '\n';
      }
      
      if (parsed.discrepancies && parsed.discrepancies.length > 0) {
        analysisText += `## Discrepanze tra Fonti\n`;
        parsed.discrepancies.forEach((disc: any) => {
          analysisText += `- **${disc.field}**: ${disc.values.map((v: any) => `${v.source}: ${v.value}`).join('; ')}\n`;
        });
        analysisText += '\n';
      }
      
      if (parsed.basedOnSources && parsed.basedOnSources.length > 0) {
        analysisText += `## Fonti Utilizzate\n`;
        parsed.basedOnSources.forEach((src: string) => {
          analysisText += `- ${src}\n`;
        });
      }

      setAnalysis(analysisText);
    } catch (err) {
      setError('Errore durante l\'analisi comparativa. Riprova più tardi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return `€${price}`;
  };

  const formatRating = (rating: number | null) => {
    if (rating === null) return 'N/A';
    return `${rating}/5`;
  };

  const formatDriveTime = (time: string | null) => {
    return time || 'N/A';
  };

  const formatDriveDistance = (dist: string | null) => {
    return dist || 'N/A';
  };

  const formatCuisines = (cuisines: string[]) => {
    return cuisines.length > 0 ? cuisines.join(', ') : 'N/A';
  };

  const formatOccasions = (occasions: string[]) => {
    return occasions.length > 0 ? occasions.join(', ') : 'N/A';
  };

  const formatRecognitions = (restaurant: Restaurant) => {
    const items = [];
    if (restaurant.michelin) items.push('Michelin');
    if (restaurant.gamberoRosso && restaurant.gamberoRosso.forchette !== null) items.push(`${restaurant.gamberoRosso.forchette} Forchette`);
    if (restaurant.theFork && restaurant.theFork.rating !== null) items.push(`TheFork ${restaurant.theFork.rating}/10`);
    if (restaurant.tripadvisor && restaurant.tripadvisor.rating !== null) items.push(`TripAdvisor ${restaurant.tripadvisor.rating}/5`);
    return items.length > 0 ? items.join(', ') : 'N/A';
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)]">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Confronta Ristoranti</h1>
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Nuova ricerca
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="text-gray-400 text-8xl">⚖️</div>
            </div>
            <p className="text-gray-500 text-lg">Nessun ristorante selezionato per il confronto</p>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              Aggiungi fino a 3 ristoranti dai risultati di ricerca o dalle pagine dei dettagli per confrontarli qui.
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Confronta Ristoranti</h1>
            <div className="flex items-center space-x-3">
              {compareList.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Eliminare tutti i ristoranti dal confronto?')) {
                      clearCompare();
                    }
                  }}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Pulisci tutto
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

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selected Restaurants Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ristoranti selezionati ({compareList.length}/3)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compareList.map((restaurant: Restaurant, index: number) => (
              <div key={restaurant.id} className="bg-white rounded-xl shadow-md p-4 border">
                <div className="flex items-start justify-between mb-2">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <button
                    onClick={() => removeFromCompare(restaurant.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    aria-label="Rimuovi dal confronto"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{restaurant.address}</p>
                {restaurant.city && <p className="text-sm text-gray-500 mb-2">{restaurant.city}</p>}
                <div className="flex flex-wrap gap-1 mb-2">
                  {restaurant.cuisines.slice(0, 3).map((cuisine: string) => (
                    <span key={cuisine} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {cuisine}
                    </span>
                  ))}
                  {restaurant.cuisines.length > 3 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                      +{restaurant.cuisines.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {compareList.length >= 2 && (
          <div className="overflow-x-auto mb-8">
            <table className="w-full min-w-[800px] bg-white rounded-xl shadow-md overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-white z-10">
                    Campo
                  </th>
                  {compareList.map((restaurant: Restaurant, index: number) => (
                    <th key={restaurant.id} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      <div className="flex items-center">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded mr-2">
                          #{index + 1}
                        </span>
                        {restaurant.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Prezzo medio
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {formatPrice(restaurant.averagePrice)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Fascia prezzo
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {restaurant.priceRange || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Valutazione
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {formatRating(restaurant.rating)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Recensioni
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {restaurant.reviewCount !== null ? restaurant.reviewCount.toLocaleString('it-IT') : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    TheFork
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {restaurant.theFork && restaurant.theFork.rating !== null
                        ? `${restaurant.theFork.rating}/10`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    TripAdvisor
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {restaurant.tripadvisor && restaurant.tripadvisor.rating !== null
                        ? `${restaurant.tripadvisor.rating}/5`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Michelin
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {restaurant.michelin && restaurant.michelin.stars !== null
                        ? `${restaurant.michelin.stars} ⭐`
                        : restaurant.michelin?.bibGourmand
                        ? 'Bib Gourmand'
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Gambero Rosso
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {restaurant.gamberoRosso && restaurant.gamberoRosso.forchette !== null
                        ? `${restaurant.gamberoRosso.forchette} 🍴`
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Tempo di guida
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {formatDriveTime(restaurant.driveTime)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Distanza
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700">
                      {formatDriveDistance(restaurant.driveDistance)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Cucine
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {formatCuisines(restaurant.cuisines)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Occasioni
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {formatOccasions(restaurant.occasions)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 bg-white z-10">
                    Riconoscimenti
                  </td>
                  {compareList.map((restaurant: Restaurant) => (
                    <td key={restaurant.id} className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {formatRecognitions(restaurant)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* AI Analysis */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Analisi AI con Gemini</h2>
            <button
              onClick={handleAnalyze}
              disabled={loading || compareList.length < 2}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analisi in corso...</span>
                </span>
              ) : (
                'Analizza con Gemini'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-xl p-6 prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap">{analysis}</div>
            </div>
          )}

          {!analysis && compareList.length >= 2 && !loading && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600 mb-4">
                Clicca "Analizza con Gemini" per ottenere un confronto dettagliato generato dall'IA
                basato sui dati reali dei ristoranti selezionati.
              </p>
              <p className="text-sm text-gray-500">
                L'analisi includerà: confronto prezzi, valutazioni, cucine, adattabilità per occasioni,
                riconoscimenti, distanze e raccomandazioni personalizzate.
              </p>
            </div>
          )}

          {compareList.length < 2 && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">
                Aggiungi almeno 2 ristoranti per abilitare l'analisi comparativa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;