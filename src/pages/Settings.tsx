import { useState } from 'react';
import type { GeminiStatus } from '../types/restaurant';
import { geminiService } from '../services/geminiService';
import { ApiKeyService } from '../utils/storage';

const Settings = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState(() => {
    const stored = localStorage.getItem('gourmetRadarGeminiModel');
    return stored || 'gemini-3.8-flash';
  });
  const [rememberKey, setRememberKey] = useState(false);
  const [status, setStatus] = useState<GeminiStatus>({
    gemini: 'idle',
  });

  const handleSaveKey = () => {
    if (geminiApiKey.trim()) {
      ApiKeyService.saveGeminiKey(geminiApiKey.trim(), rememberKey);
      geminiService.setApiKey(geminiApiKey.trim());
    }
  };

  const testGeminiConnection = async () => {
    if (!geminiApiKey.trim()) {
      setStatus(prev => ({ ...prev, gemini: 'error' }));
      return;
    }

    setStatus(prev => ({ ...prev, gemini: 'testing' }));

    try {
      geminiService.setApiKey(geminiApiKey.trim());
      const success = await geminiService.testConnection();

      if (success) {
        setStatus(prev => ({ ...prev, gemini: 'success' }));
        if (rememberKey) {
          ApiKeyService.saveGeminiKey(geminiApiKey.trim(), true);
        }
      } else {
        setStatus(prev => ({ ...prev, gemini: 'error' }));
      }

      setTimeout(() => {
        setStatus(prev => ({ ...prev, gemini: 'idle' }));
      }, 3000);
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      setStatus(prev => ({ ...prev, gemini: 'error' }));

      setTimeout(() => {
        setStatus(prev => ({ ...prev, gemini: 'idle' }));
      }, 3000);
    }
  };

  const handleReset = () => {
    setGeminiApiKey('');
    setGeminiModel('gemini-3.8-flash');
    setRememberKey(false);
    ApiKeyService.clearAllKeys();
    geminiService.setApiKey('');
    setStatus({ gemini: 'idle' });
  };

  const getStatusClass = () => {
    switch (status.gemini) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'testing': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusTextClass = () => {
    switch (status.gemini) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status.gemini) {
      case 'success': return 'Connesso';
      case 'error': return 'Errore';
      case 'testing': return 'In test...';
      default: return 'Non testato';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Impostazioni
        </h1>
        <p className="text-gray-600 text-center max-w-xl">
          Configura le API e le preferenze dell'applicazione
        </p>
      </div>

      {/* Settings Form */}
      <form className="bg-white rounded-xl shadow-md p-6 space-y-6" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chiave API Gemini
          </label>
          <input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="Inserisci la tua chiave API Gemini"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="mt-2 text-sm text-gray-500">
            Ottieni una chiave API gratuita su <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modello Gemini
          </label>
          <select
            value={geminiModel}
            onChange={(e) => {
              const newModel = e.target.value;
              setGeminiModel(newModel);
              localStorage.setItem('gourmetRadarGeminiModel', newModel);
              geminiService.setModel(newModel);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (Default)</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Modello fisso: gemini-3.8-flash
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="rememberKey"
            checked={rememberKey}
            onChange={(e) => setRememberKey(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="rememberKey" className="text-sm text-gray-700">
            Ricorda la chiave su questo dispositivo (salva in localStorage)
          </label>
        </div>

        <div className="flex items-center space-x-3 flex-wrap">
          <button
            type="button"
            onClick={testGeminiConnection}
            disabled={status.gemini === 'testing'}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors disabled:opacity-50"
          >
            {status.gemini === 'testing' && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing...</span>
              </div>
            )}
            {status.gemini !== 'testing' && 'Test Connessione Gemini'}
          </button>

          <button
            type="button"
            onClick={handleSaveKey}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
          >
            Salva Chiave
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded transition-colors"
          >
            Reset
          </button>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-sm ml-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${getStatusClass()}`}
            ></div>
            <span className={getStatusTextClass()}>
              {getStatusText()}
            </span>
          </div>

          {status.gemini === 'error' && (
            <p className="mt-1 text-sm text-red-600">
              Verifica la tua chiave API e riprova
            </p>
          )}
        </div>
      </form>

      {/* Information Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Informazioni sulle API
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gemini API
            </h3>
            <p className="text-gray-600">
              Utilizzata per la comprensione del linguaggio naturale e l'analisi dei dati sui ristoranti.
              Richiede una chiave API gratuita da Google AI Studio.
              Modello default: gemini-3.8-flash
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nominatim/OpenStreetMap
            </h3>
            <p className="text-gray-600">
              Utilizzata per la geocodifica degli indirizzi (convertire indirizzi in coordinate).
              Servizio gratuito, non richiede chiave API. Cache locale per 30 giorni.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              OSRM (Open Source Routing Machine)
            </h3>
            <p className="text-gray-600">
              Utilizzata per il calcolo preciso dei tempi e delle distanze di guida.
              Servizio gratuito, non richiede chiave API. Usa Table API per batch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;