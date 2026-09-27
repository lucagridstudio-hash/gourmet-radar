import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Trova il posto giusto dove mangiare.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Cerca ristoranti gourmet o qualsiasi altro tipo di ristorante con
          ricerca avanzata, filtri dinamici e AI-powered suggestions.
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gourmet Card */}
        <Link to="/gourmet" className="group">
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 text-indigo-800 rounded-full p-3">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4 flex-grow">
                  GOURMET
                </h3>
              </div>
              <p className="text-gray-600">
                Michelin, Gambero Rosso, alta cucina e ristoranti selezionati.
              </p>
              <div className="mt-6 flex justify-center">
                <span className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Esplora Gourmet
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Restaurants Card */}
        <Link to="/restaurants" className="group">
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 text-green-800 rounded-full p-3">
                  <span className="text-2xl">🍴</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4 flex-grow">
                  RISTORANTI
                </h3>
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
          </div>
        </Link>
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
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Cosa hai voglia di mangiare?"
              className="w-full px-6 py-4 pl-12 pr-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-indigo-500">🤖</span>
            </div>
          </div>
        </div>
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
            in automobile, con opzioni da 10 minuti a 2 ore.
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
            per affinare la tua ricerca secondo le tue preferenze.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;