import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import GourmetSearch from './pages/GourmetSearch';
import RestaurantsSearch from './pages/RestaurantsSearch';
import SearchResults from './pages/SearchResults';
import RestaurantDetails from './pages/RestaurantDetails';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-8 w-auto" src="/logo.png" alt="Gourmet Radar" />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <NavLink 
                      to="/" 
                      className={({ isActive }) => 
                        isActive 
                          ? "border-b-2 border-indigo-600 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" 
                          : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Home
                    </NavLink>
                    <NavLink 
                      to="/gourmet" 
                      className={({ isActive }) => 
                        isActive 
                          ? "border-b-2 border-indigo-600 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" 
                          : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Gourmet
                    </NavLink>
                    <NavLink 
                      to="/restaurants" 
                      className={({ isActive }) => 
                        isActive 
                          ? "border-b-2 border-indigo-600 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" 
                          : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Ristoranti
                    </NavLink>
                    <NavLink 
                      to="/search" 
                      className={({ isActive }) => 
                        isActive 
                          ? "border-b-2 border-indigo-600 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" 
                          : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Cerca
                    </NavLink>
                    <NavLink 
                      to="/favorites" 
                      className={({ isActive }) => 
                        isActive 
                          ? "border-b-2 border-indigo-600 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" 
                          : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Preferiti
                    </NavLink>
                    <NavLink 
                      to="/settings" 
                      className={({ isActive }) => 
                        isActive 
                          ? "border-b-2 border-indigo-600 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium" 
                          : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Impostazioni
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-baseline md:ml-6">
                  <button type="button" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Cerca con Gemini
                  </button>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu (hidden by default) */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "bg-gray-50 block rounded-md px-3 py-2 text-base font-medium text-indigo-600" 
                  : "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/gourmet" 
              className={({ isActive }) => 
                isActive 
                  ? "bg-gray-50 block rounded-md px-3 py-2 text-base font-medium text-indigo-600" 
                  : "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              }
            >
              Gourmet
            </NavLink>
            <NavLink 
              to="/restaurants" 
              className={({ isActive }) => 
                isActive 
                  ? "bg-gray-50 block rounded-md px-3 py-2 text-base font-medium text-indigo-600" 
                  : "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              }
            >
              Ristoranti
            </NavLink>
            <NavLink 
              to="/search" 
              className={({ isActive }) => 
                isActive 
                  ? "bg-gray-50 block rounded-md px-3 py-2 text-base font-medium text-indigo-600" 
                  : "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              }
            >
              Cerca
            </NavLink>
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => 
                isActive 
                  ? "bg-gray-50 block rounded-md px-3 py-2 text-base font-medium text-indigo-600" 
                  : "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              }
            >
              Preferiti
            </NavLink>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                isActive 
                  ? "bg-gray-50 block rounded-md px-3 py-2 text-base font-medium text-indigo-600" 
                  : "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              }
            >
              Impostazioni
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t">
            <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
              Cerca con Gemini
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gourmet" element={<GourmetSearch />} />
            <Route path="/restaurants" element={<RestaurantsSearch />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Page not found</h2><p className="mt-4 text-gray-600">The page you're looking for doesn't exist.</p></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;