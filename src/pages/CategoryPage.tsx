import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

interface CategoryPageProps {
  user: any;
  onSignOut: () => void;
}

// Mock provider data - COMPLETE LIST
const ALL_PROVIDERS = [
  {
    id: 1,
    name: "Michael Chen",
    service: "Woodworking",
    location: "North Park, San Diego",
    zipCode: "92104",
    distance: 2.1,
    rating: 4.9,
    jobs: 32,
    startingAt: "$450",
    verified: true,
    description: "Custom furniture and cabinetry with 10+ years experience",
    available: true,
    image: "MC"
  },
  {
    id: 2,
    name: "Sarah Martinez",
    service: "Ceramics",
    location: "Ocean Beach, San Diego",
    zipCode: "92107",
    distance: 3.4,
    rating: 4.8,
    jobs: 18,
    startingAt: "$120",
    verified: true,
    description: "Handmade pottery and custom ceramic pieces",
    available: true,
    image: "SM"
  },
  {
    id: 3,
    name: "James Thompson",
    service: "Photography",
    location: "Downtown, San Diego",
    zipCode: "92101",
    distance: 1.7,
    rating: 5.0,
    jobs: 54,
    startingAt: "$250",
    verified: true,
    description: "Professional photography for events and portraits",
    available: true,
    image: "JT"
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    service: "Painting",
    location: "South Park, San Diego",
    zipCode: "92102",
    distance: 4.0,
    rating: 4.7,
    jobs: 21,
    startingAt: "$300",
    verified: true,
    description: "Custom artwork and murals",
    available: false,
    image: "ER"
  },
  {
    id: 5,
    name: "David Park",
    service: "Web Design",
    location: "La Jolla, San Diego",
    zipCode: "92037",
    distance: 7.2,
    rating: 4.9,
    jobs: 40,
    startingAt: "$900",
    verified: true,
    description: "Modern web design and development",
    available: true,
    image: "DP"
  },
  {
    id: 6,
    name: "Jessica Liu",
    service: "Logo Design",
    location: "Mission Valley, San Diego",
    zipCode: "92108",
    distance: 5.3,
    rating: 4.8,
    jobs: 27,
    startingAt: "$280",
    verified: true,
    description: "Brand identity and logo design",
    available: true,
    image: "JL"
  },
  {
    id: 7,
    name: "Marcus Johnson",
    service: "Woodworking",
    location: "Pacific Beach, San Diego",
    zipCode: "92109",
    distance: 5.8,
    rating: 4.6,
    jobs: 15,
    startingAt: "$400",
    verified: false,
    description: "Reclaimed wood furniture and decor",
    available: true,
    image: "MJ"
  },
  {
    id: 8,
    name: "Rachel Kim",
    service: "Metalwork",
    location: "Hillcrest, San Diego",
    zipCode: "92103",
    distance: 2.9,
    rating: 4.9,
    jobs: 28,
    startingAt: "$500",
    verified: true,
    description: "Custom metal art and fabrication",
    available: true,
    image: "RK"
  },
];

const CATEGORY_INFO: Record<string, { icon: string; description: string }> = {
  woodworking: {
    icon: "🪵",
    description: "Find skilled woodworkers for custom furniture, cabinetry, and woodcraft projects"
  },
  ceramics: {
    icon: "🏺",
    description: "Discover talented ceramicists for pottery, tiles, and custom ceramic pieces"
  },
  photography: {
    icon: "📸",
    description: "Book professional photographers for events, portraits, and commercial work"
  },
  painting: {
    icon: "🎨",
    description: "Hire artists for custom paintings, murals, and artwork"
  },
  "web design": {
    icon: "💻",
    description: "Connect with web designers for modern, responsive websites"
  },
  "logo design": {
    icon: "✏️",
    description: "Find designers for brand identity and professional logos"
  },
  metalwork: {
    icon: "⚒️",
    description: "Discover metalworkers for custom fabrication and metal art"
  },
  jewelry: {
    icon: "💎",
    description: "Find jewelry makers for custom pieces and repairs"
  },
};

export default function CategoryPage({ user, onSignOut }: CategoryPageProps) {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const categoryName = category?.replace(/-/g, ' ') || '';
  const categoryKey = categoryName.toLowerCase();
  const categoryInfo = CATEGORY_INFO[categoryKey];

  // DEBUG - let's see what we're comparing
  console.log('🔍 CATEGORY DEBUG:');
  console.log('URL param "category":', category);
  console.log('categoryName:', categoryName);
  console.log('categoryKey:', categoryKey);
  console.log('ALL_PROVIDERS:', ALL_PROVIDERS.map(p => ({ name: p.name, service: p.service, serviceLower: p.service.toLowerCase() })));

  // Filter providers by category with improved matching
  const providers = ALL_PROVIDERS
    .filter(provider => {
      // Make both lowercase and trim whitespace for comparison
      const providerService = provider.service.toLowerCase().trim();
      const searchCategory = categoryKey.toLowerCase().trim();
      
      console.log(`Comparing: "${providerService}" === "${searchCategory}" = ${providerService === searchCategory}`);
      
      const matchesCategory = providerService === searchCategory;
      const matchesAvailability = !showAvailableOnly || provider.available;
      
      return matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'price') {
        const priceA = parseInt(a.startingAt.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.startingAt.replace(/[^0-9]/g, ''));
        return priceA - priceB;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
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
                <ProfileDropdown user={user} onSignOut={onSignOut} />
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
                    className="px-5 py-2.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition shadow-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">{categoryInfo?.icon || '🔷'}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 capitalize">{categoryName}</h1>
              <p className="text-slate-600 mt-1">
                {providers.length} {providers.length === 1 ? 'pro' : 'pros'} available
              </p>
            </div>
          </div>
          {categoryInfo && (
            <p className="text-lg text-slate-600">{categoryInfo.description}</p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-sm"
              >
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
                <option value="distance">Closest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        {providers.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No pros found</h3>
            <p className="text-slate-600 mb-6">
              {showAvailableOnly
                ? 'No available pros in this category right now. Try removing the availability filter.'
                : 'No pros found in this category.'}
            </p>
            {showAvailableOnly && (
              <button
                onClick={() => setShowAvailableOnly(false)}
                className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                Show All Pros
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-sky-400 hover:shadow-xl transition p-6 cursor-pointer relative"
                onClick={() => navigate(`/pro/${provider.id}`)}
              >
                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      navigate('/auth');
                    } else {
                      alert('Added to favorites!');
                    }
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-500 rounded-full flex items-center justify-center transition shadow-md z-10"
                  title="Add to favorites"
                >
                  <svg 
                    className="w-5 h-5 text-slate-600"
                    fill="none"
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Provider Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {provider.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900">{provider.name}</h3>
                      {provider.verified && (
                        <span className="text-sky-600 text-lg" title="Verified">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{provider.location}</p>
                  </div>
                </div>

                {/* Availability Badge */}
                {provider.available && (
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-3">
                    Available Now
                  </span>
                )}

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4">{provider.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600">Rating</p>
                    <p className="font-bold text-slate-900">⭐ {provider.rating}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Jobs</p>
                    <p className="font-bold text-slate-900">{provider.jobs}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Distance</p>
                    <p className="font-bold text-slate-900">{provider.distance} mi</p>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600">Starting at</p>
                    <p className="font-bold text-sky-600 text-lg">{provider.startingAt}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        navigate('/auth');
                      } else {
                        navigate(`/pro/${provider.id}`);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition text-sm"
                  >
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        {providers.length > 0 && (
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-3xl p-8 text-center text-white mt-12">
            <h2 className="text-2xl font-bold mb-3">Can't find what you're looking for?</h2>
            <p className="text-sky-100 mb-6">Post a job and let local pros come to you!</p>
            <button
              onClick={() => navigate(user ? '/post-job' : '/auth')}
              className="px-8 py-3 bg-white text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition"
            >
              Post a Job - Free
            </button>
          </div>
        )}

      </div>
    </div>
  );
}