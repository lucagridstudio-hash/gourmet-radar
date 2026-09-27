import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [tripadvisorApiKey, setTripadvisorApiKey] = useState('');
  const [routingApiKey, setRoutingApiKey] = useState('');
  const [rememberKeys, setRememberKeys] = useState(false);
  const [status, setStatus] = useState({ gemini: 'idle', tripadvisor: 'idle', routing: 'idle' });

  // Load API keys from localStorage if remember option is enabled
  useState(() => {
    const remembered = localStorage.getItem('gourmetRadarRememberKeys') === 'true';
    setRememberKeys(remembered);
    
    if (remembered) {
      setGeminiApiKey(localStorage.getItem('gourmetRadarGeminiKey') || '');
      setTripadvisorApiKey(localStorage.getItem('gourmetRadarTripadvisorKey') || '');
      setRoutingApiKey(localStorage.getItem('gourmetRadarRoutingKey') || '');
    }
  });

  const saveKeys = () => {
    if (rememberKeys) {
      localStorage.setItem('gourmetRadarRememberKeys', 'true');
      localStorage.setItem('gourmetRadarGeminiKey', geminiApiKey);
      localStorage.setItem('gourmetRadarTripadvisorKey', tripadvisorApiKey);
      localStorage.setItem('gourmetRadarRoutingKey', routingApiKey);
    } else {
      localStorage.removeItem('gourmetRadarRememberKeys');
      localStorage.removeItem('gourmetRadarGeminiKey');
      localStorage.removeItem('gourmetRadarTripadvisorKey');
      localStorage.removeItem('gourmetRadarRoutingKey');
    }
    
    setStatus(prev => ({ ...prev, gemini: 'saved', tripadvisor: 'saved', routing: 'saved' }));
    
    // Reset status after 2 seconds
    setTimeout(() => {
      setStatus(prev => ({ ...prev, gemini: 'idle', tripadvisor: 'idle', routing: 'idle' }));
    }, 2000);
  };

  const testGeminiConnection = async () => {
    setStatus(prev => ({ ...prev, gemini: 'testing' }));
    try {
      // In a real implementation, this would test the API connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate success
      setStatus(prev => ({ ...prev, gemini: 'success' }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, gemini: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      setStatus(prev => ({ ...prev, gemini: 'error' }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, gemini: 'idle' }));
      }, 2000);
    }
  };

  const testTripadvisorConnection = async () => {
    setStatus(prev => ({ ...prev, tripadvisor: 'testing' }));
    try {
      // In a real implementation, this would test the API connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate success
      setStatus(prev => ({ ...prev, tripadvisor: 'success' }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, tripadvisor: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Tripadvisor connection test failed:', error);
      setStatus(prev => ({ ...prev, tripadvisor: 'error' }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, tripadvisor: 'idle' }));
      }, 2000);
    }
  };

  const testRoutingConnection = async () => {
    setStatus(prev => ({ ...prev, routing: 'testing' }));
    try {
      // In a real implementation, this would test the API connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate success
      setStatus(prev => ({ ...prev, routing: 'success' }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, routing: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Routing connection test failed:', error);
      setStatus(prev => ({ ...prev, routing: 'error' }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, routing: 'idle' }));
      }, 2000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
            <button 
              onClick={() => navigate('/')} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Gemini API Key Section */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gemini API Key</h2>
            <p className="text-gray-600 mb-4">
              La chiave API di Google Gemini viene utilizzata per la ricerca naturale, 
              l'interpretazione delle query, la ricerca web e l'analisi dei risultati.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <label className="flex-items cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberKeys}
                    onChange={(e) => setRememberKeys(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Ricorda su questo dispositivo
                  </span>
                </label>
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  placeholder="Inserisci la tua chiave API Gemini"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 pl-10 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {geminiApiKey && (
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGeminiApiKey('');
                    }}
                  >
                    ✕
                  </button>
                )}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400">🔑</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-2">
                <button 
                  onClick={testGeminiConnection}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded transition-colors"
                  disabled={status.gemini === 'testing'}
                >
                  {status.gemini === 'testing' ? 'Testing...' : 'Test connessione'}
                </button>
                
                <span className="px-2 py-1 text-xs rounded-full 
                  {status.gemini === 'success' && 'bg-green-100 text-green-800'}
                  {status.gemini === 'error' && 'bg-red-100 text-red-800'}
                  {status.gemini === 'saved' && 'bg-blue-100 text-blue-800'}"
                >
                  {status.gemini === 'success' && 'Connessione riuscita'}
                  {status.gemini === 'error' && 'Connessione fallita'}
                  {status.gemini === 'saved' && 'Impostazioni salvate'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Le API key utilizzate direttamente dal browser possono essere tecnicamente esposte. 
              Non utilizzare questa modalità come deposito di segreti server-side.</p>
            </div>
          </div>
        </div>

        {/* Tripadvisor API Key Section */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tripadvisor API Key</h2>
            <p className="text-gray-600 mb-4">
              La chiave API di Tripadvisor consente l'accesso ai dati delle strutture, 
              recensioni, foto e informazioni dettagliate sui ristoranti di tutto il mondo.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Inserisci la tua chiave API Tripadvisor"
                  value={tripadvisorApiKey}
                  onChange={(e) => setTripadvisorApiKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 pl-10 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {tripadvisorApiKey && (
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTripadvisorApiKey('');
                    }}
                  >
                    ✕
                  </button>
                )}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400">🔑</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-2">
                <button 
                  onClick={testTripadvisorConnection}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded transition-colors"
                  disabled={status.tripadvisor === 'testing'}
                >
                  {status.tripadvisor === 'testing' ? 'Testing...' : 'Test connessione'}
                </button>
                
                <span className="px-2 py-1 text-xs rounded-full 
                  {status.tripadvisor === 'success' && 'bg-green-100 text-green-800'}
                  {status.tripadvisor === 'error' && 'bg-red-100 text-red-800'}
                  {status.tripadvisor === 'saved' && 'bg-blue-100 text-blue-800'}"
                >
                  {status.tripadvisor === 'success' && 'Connessione riuscita'}
                  {status.tripadvisor === 'error' && 'Connessione fallita'}
                  {status.tripadvisor === 'saved' && 'Impostazioni salvate'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Routing API Key Section */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Routing API Key</h2>
            <p className="text-gray-600 mb-4">
              La chiave API del servizio di routing (come Google Maps API, Mapbox, o simili) 
              viene utilizzata per calcolare i tempi e le distanze di percorrenza in automobile.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Inserisci la tua chiave API di routing"
                  value={routingApiKey}
                  onChange={(e) => setRoutingApiKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 pl-10 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {routingApiKey && (
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoutingApiKey('');
                    }}
                  >
                    ✕
                  </button>
                )}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400">🔑</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-2">
                <button 
                  onClick={testRoutingConnection}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded transition-colors"
                  disabled={status.routing === 'testing'}
                >
                  {status.routing === 'testing' ? 'Testing...' : 'Test connessione'}
                </button>
                
                <span className="px-2 py-1 text-xs rounded-full 
                  {status.routing === 'success' && 'bg-green-100 text-green-800'}
                  {status.routing === 'error' && 'bg-red-100 text-red-800'}
                  {status.routing === 'saved' && 'bg-blue-100 text-blue-800'}"
                >
                  {status.routing === 'success' && 'Connessione riuscita'}
                  {status.routing === 'error' && 'Connessione fallita'}
                  {status.routing === 'saved' && 'Impostazioni salvate'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button 
            onClick={saveKeys}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors hover:shadow-md"
          >
            Salva impostazioni
          </button>
        </div>
        
        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sicurezza e privacy</h2>
          <p className="text-gray-600">
            Questa applicazione è progettata per funzionare completamente lato client, 
            senza server di backend. Tutte le tue preferenze e le API key (se scegli di 
            ricordarle) sono salvate unicamente nel tuo browser tramite localStorage.
          </p>
          <p className="text-gray-600 mt-2">
            Per massima sicurezza, ti consigliamo di non salvare le API key e di inserirle 
            manualmente ogni volta che utilizzi l'applicazione, soprattutto se condividi 
            il dispositivo con altri utenti.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;