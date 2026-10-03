# Gourmet Radar V1

A client-side web application for discovering real restaurants using AI-powered search with Gemini and Google Search grounding.

## Features

- **AI-Powered Natural Language Search**: Describe what you're looking for in plain language
- **Real Restaurant Data**: Finds actual restaurants with verified information
- **Two Search Modes**:
  - **GOURMET**: Focused on Michelin-starred, Gambero Rosso, high-end cuisine
  - **RISTORANTI**: Any type of restaurant for any occasion
- **Advanced Filtering**: By location, drive time, cuisine, occasion, price, rating, and more
- **Real-Time Geocoding**: Uses Nominatim/OpenStreetMap for accurate location data
- **Real Routing**: Uses OSRM for accurate driving times and distances
- **Data Normalization & Deduplication**: Ensures clean, non-duplicate results
- **Source Transparency**: Shows where information comes from with confidence levels
- **Favorites System**: Save and manage your favorite restaurants
- **Restaurant Details**: Comprehensive information including recognition badges
- **Analysis & Comparison**: Use Gemini to analyze and compare restaurants (based on real data only)
- **Client-Side Only**: No backend required - all processing happens in the browser
- **GitHub Pages Ready**: Configured for easy deployment

## How It Works

1. **Natural Language Processing**: Convert your search query into structured filters using Gemini
2. **AI-Powered Search**: Use Gemini with Google Search grounding to find real restaurant information from authoritative sources
3. **Data Extraction & Validation**: Extract structured data from AI responses, verifying against sources
4. **Normalization**: Standardize formats for names, addresses, prices, ratings, etc.
5. **Deduplication**: Intelligently merge results from multiple sources when they represent the same restaurant
6. **Geocoding**: Convert addresses to coordinates using Nominatim/OpenStreetMap
7. **Routing**: Calculate accurate driving times and distances using OSRM
8. **Filtering & Sorting**: Apply user-specified filters and sort results by relevance or other criteria
9. **Presentation**: Display results with source transparency and recognition badges

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **AI**: Google Gemini API (@google/genai v2.24.0) with Google Search grounding
- **Geocoding**: Nominatim/OpenStreetMap
- **Routing**: OSRM (Open Source Routing Machine)
- **State Management**: React Context API + localStorage for persistence
- **Build**: Vite with custom build step for GitHub Pages SPA fallback

## API Keys

The application requires a Gemini API key to function. Other services (Nominatim, OSRM) are free and don't require keys.

To use the application:
1. Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Enter the key in the Settings page
3. Optionally check "Remember on this device" to store the key in localStorage
4. Use the search functionality to find real restaurants

**Important**: API keys are stored only in your browser's localStorage (if you choose to remember them) and never transmitted to any server.

## Deployment

The application is configured for deployment to GitHub Pages:

```bash
# Build for production
npm run build

# The build script automatically creates the 404.html fallback needed for client-side routing
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Data Quality & Sources

- All restaurant information is sourced from real web search results via Gemini's grounding capability
- Information is only included if it can be verified through reliable sources
- When information cannot be verified, it is omitted rather than invented
- Sources are tracked and displayed with confidence levels
- The application prioritizes official sources (restaurant websites, Michelin Guide, Gambero Rosso, etc.)

## Limitations

- Search quality depends on the Gemini API and Google Search grounding capabilities
- Some very new or obscure restaurants may not be well-represented in search results
- Geocoding and routing depend on third-party free services with usage limits
- The application does not invent or hallucinate any restaurant information