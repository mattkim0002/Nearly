import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import ProfileDropdown from '../components/ProfileDropdown';

// Extended mock provider data with GPS coordinates for map
const ALL_PROVIDERS = [
  {
    id: 1,
    name: "Michael Chen",
    service: "Woodworking",
    location: "North Park, San Diego",
    zipCode: "92104",
    lat: 32.7420,
    lng: -117.1290,
    distance: 2.1,
    rating: 4.9,
    jobs: 32,
    startingAt: "$450",
    verified: true,
    description: "Custom furniture and cabinetry with 10+ years experience",
    available: true,
  },
  {
    id: 2,
    name: "Sarah Martinez",
    service: "Ceramics",
    location: "Ocean Beach, San Diego",
    zipCode: "92107",
    lat: 32.7500,
    lng: -117.2500,
    distance: 3.4,
    rating: 4.8,
    jobs: 18,
    startingAt: "$120",
    verified: true,
    description: "Handmade pottery and custom ceramic pieces",
    available: true,
  },
  {
    id: 3,
    name: "James Thompson",
    service: "Photography",
    location: "Downtown, San Diego",
    zipCode: "92101",
    lat: 32.7157,
    lng: -117.1611,
    distance: 1.7,
    rating: 5.0,
    jobs: 54,
    startingAt: "$250",
    verified: true,
    description: "Professional photography for events and portraits",
    available: true,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    service: "Painting",
    location: "South Park, San Diego",
    zipCode: "92102",
    lat: 32.7350,
    lng: -117.1250,
    distance: 4.0,
    rating: 4.7,
    jobs: 21,
    startingAt: "$300",
    verified: true,
    description: "Custom artwork and murals",
    available: false,
  },
  {
    id: 5,
    name: "David Park",
    service: "Web Design",
    location: "La Jolla, San Diego",
    zipCode: "92037",
    lat: 32.8328,
    lng: -117.2713,
    distance: 7.2,
    rating: 4.9,
    jobs: 40,
    startingAt: "$900",
    verified: true,
    description: "Modern web design and development",
    available: true,
  },
  {
    id: 6,
    name: "Jessica Liu",
    service: "Logo Design",
    location: "Mission Valley, San Diego",
    zipCode: "92108",
    lat: 32.7740,
    lng: -117.1620,
    distance: 5.3,
    rating: 4.8,
    jobs: 27,
    startingAt: "$280",
    verified: true,
    description: "Brand identity and logo design",
    available: true,
  },
  {
    id: 7,
    name: "Marcus Johnson",
    service: "Woodworking",
    location: "Pacific Beach, San Diego",
    zipCode: "92109",
    lat: 32.7942,
    lng: -117.2350,
    distance: 5.8,
    rating: 4.6,
    jobs: 15,
    startingAt: "$400",
    verified: false,
    description: "Reclaimed wood furniture and decor",
    available: true,
  },
  {
    id: 8,
    name: "Rachel Kim",
    service: "Metalwork",
    location: "Hillcrest, San Diego",
    zipCode: "92103",
    lat: 32.7490,
    lng: -117.1660,
    distance: 2.9,
    rating: 4.9,
    jobs: 28,
    startingAt: "$500",
    verified: true,
    description: "Custom metal art and fabrication",
    available: true,
  },
];

const SERVICES = [
  "All Services",
  "Woodworking",
  "Ceramics",
  "Photography",
  "Painting",
  "Web Design",
  "Logo Design",
  "Metalwork",
  "Jewelry",
];

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '16px',
};

// Center on San Diego
const center = {
  lat: 32.7157,
  lng: -117.1611,
};

interface BrowseProps {
  user: any;
  onSignOut: () => void;
}

export default function Browse({ user, onSignOut }: BrowseProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('92180');
  const [selectedService, setSelectedService] = useState('All Services');
  const [maxDistance, setMaxDistance] = useState(10);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [selectedProvider, setSelectedProvider] = useState<typeof ALL_PROVIDERS[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter and sort providers
  const filteredProviders = ALL_PROVIDERS
    .filter(provider => {
      if (selectedService !== 'All Services' && provider.service !== selectedService) {
        return false;
      }
      
      if (searchQuery && !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) 
          && !provider.service.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (provider.distance > maxDistance) {
        return false;
      }
      
      if (showAvailableOnly && !provider.available) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') {
        const priceA = parseInt(a.startingAt.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.startingAt.replace(/[^0-9]/g, ''));
        return priceA - priceB;
      }
      return 0;
    });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">nearly</span>
            </div>
<div className="flex items-center gap-4">
  {user ? (
    <>
      <button
        onClick={() => navigate('/profile')}
        className="text-slate-700 hover:text-sky-600 transition"
      >
        Hi, {user.user_metadata?.name}!
      </button>
      <button
        onClick={onSignOut}
        className="px-5 py-2.5 rounded-full bg-slate-200 text-slate-900 hover:bg-slate-300 transition"
      >
        Sign Out
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => navigate('/auth')}
        className="px-5 py-2.5 text-slate-700 hover:text-sky-600 transition font-medium"
      >
        Log In
      </button>
      <button
        onClick={() => navigate('/auth')}
        className="px-5 py-2.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition"
      >
        Sign Up
      </button>
    </>
  )}
</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-slate-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                What service?
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Woodworker, Photographer"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="92180"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition shadow-lg">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {filteredProviders.length} Independent {filteredProviders.length === 1 ? 'Worker' : 'Workers'} Near You
          </h2>
          <div className="flex gap-2 bg-white rounded-lg p-1 border-2 border-slate-200">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'map'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗺️ Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'list'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 List View
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-slate-200 sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Filters</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Service Type
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                >
                  {SERVICES.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Max Distance: {maxDistance} miles
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 mi</span>
                  <span>20 mi</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                >
                  <option value="distance">Closest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Available now only</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedService('All Services');
                  setMaxDistance(10);
                  setShowAvailableOnly(false);
                  setSortBy('distance');
                }}
                className="w-full py-2 text-sm text-slate-600 hover:text-sky-600 transition"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Results - Map or List */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
              <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-slate-200">
                <LoadScript 
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
                  loadingElement={<div className="h-[600px] flex items-center justify-center">Loading map...</div>}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    onLoad={onMapLoad}
                    options={{
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                      ],
                    }}
                  >
                    {mapLoaded && (
                      <>
                        {/* User location marker */}
                        <Marker
                          position={center}
                          icon={{
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#3b82f6',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 3,
                          }}
                        />

                        {/* Provider markers */}
                        {filteredProviders.map((provider) => (
                          <Marker
                            key={provider.id}
                            position={{ lat: provider.lat, lng: provider.lng }}
                            onClick={() => setSelectedProvider(provider)}
                            icon={{
                              path: window.google.maps.SymbolPath.CIRCLE,
                              scale: 8,
                              fillColor: provider.available ? '#10b981' : '#ef4444',
                              fillOpacity: 1,
                              strokeColor: '#ffffff',
                              strokeWeight: 2,
                            }}
                          />
                        ))}

                        {/* Info Window */}
                        {selectedProvider && (
                          <InfoWindow
                            position={{ lat: selectedProvider.lat, lng: selectedProvider.lng }}
                            onCloseClick={() => setSelectedProvider(null)}
                          >
                            <div className="p-2 max-w-xs">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg">{selectedProvider.name}</h3>
                                {selectedProvider.verified && (
                                  <span className="text-sky-600" title="Profile verified">✓</span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{selectedProvider.description}</p>
                              <div className="flex items-center gap-4 text-sm mb-3">
                                <span>⭐ {selectedProvider.rating}</span>
                                <span>{selectedProvider.distance} mi away</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sky-600">{selectedProvider.startingAt}</span>
                                <button
                                  onClick={() => !user && navigate('/auth')}
                                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700"
                                >
                                  Contact
                                </button>
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </>
                    )}
                  </GoogleMap>
                </LoadScript>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProviders.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center border-2 border-slate-200">
                    <p className="text-slate-600 text-lg mb-4">No workers found matching your criteria</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedService('All Services');
                        setMaxDistance(10);
                        setShowAvailableOnly(false);
                      }}
                      className="text-sky-600 hover:text-sky-700 font-semibold"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border-2 border-slate-200 hover:border-sky-400 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl text-slate-900">{provider.name}</h3>
                            {provider.verified && (
                              <span className="text-sky-600 text-lg" title="Profile verified">✓</span>
                            )}
                            {provider.available && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                Available Now
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 mb-2">{provider.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="font-medium text-sky-600">{provider.service}</span>
                            <span>📍 {provider.location}</span>
                            <span className="font-semibold text-slate-900">{provider.distance} miles away</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-sm text-slate-600">Rating</span>
                            <p className="font-bold text-slate-900">⭐ {provider.rating}</p>
                          </div>
                          <div>
                            <span className="text-sm text-slate-600">Commissions</span>
                            <p className="font-bold text-slate-900">{provider.jobs}</p>
                          </div>
                          <div>
                            <span className="text-sm text-slate-600">Starting at</span>
                            <p className="font-bold text-slate-900">{provider.startingAt}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => !user && navigate('/auth')}
                          className="px-6 py-3 rounded-full bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}