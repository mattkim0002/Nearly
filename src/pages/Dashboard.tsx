import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import ProfileDropdown from '../components/ProfileDropdown';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

const CATEGORIES = [
  { name: "Woodworking", icon: "🪵", color: "from-amber-500 to-orange-500" },
  { name: "Ceramics", icon: "🏺", color: "from-rose-500 to-pink-500" },
  { name: "Photography", icon: "📸", color: "from-blue-500 to-cyan-500" },
  { name: "Painting", icon: "🎨", color: "from-purple-500 to-pink-500" },
  { name: "Web Design", icon: "💻", color: "from-green-500 to-emerald-500" },
  { name: "Logo Design", icon: "✏️", color: "from-indigo-500 to-purple-500" },
  { name: "Metalwork", icon: "⚒️", color: "from-gray-600 to-slate-600" },
  { name: "Jewelry", icon: "💎", color: "from-yellow-500 to-amber-500" },
];

const NAVIGATION_ITEMS = [
  { 
    name: 'Browse Pros', 
    path: '/browse', 
    icon: '👥',
    keywords: ['browse', 'pros', 'makers', 'professionals', 'find', 'search', 'map', 'map view'],
    description: 'Find local pros and view them on a map'
  },
  { 
    name: 'Browse Jobs', 
    path: '/browse-jobs', 
    icon: '💼',
    keywords: ['browse', 'jobs', 'work', 'projects', 'find', 'search'],
    description: 'Find available jobs in your area'
  },
  { 
    name: 'Post a Job', 
    path: '/post-job', 
    icon: '➕',
    keywords: ['post', 'create', 'new', 'job', 'project', 'hire'],
    description: 'Post a new job and get proposals'
  },
  { 
    name: 'My Jobs', 
    path: '/my-jobs', 
    icon: '📋',
    keywords: ['my', 'jobs', 'orders', 'projects'],
    description: 'View your posted jobs and orders'
  },
  { 
    name: 'My Projects', 
    path: '/my-projects', 
    icon: '🛠️',
    keywords: ['my', 'projects', 'work', 'active'],
    description: 'View your active projects'
  },
  { 
    name: 'Profile', 
    path: '/profile', 
    icon: '👤',
    keywords: ['profile', 'account', 'settings', 'edit'],
    description: 'Edit your profile and settings'
  },
  { 
    name: 'Messages', 
    path: '/messages', 
    icon: '💬',
    keywords: ['messages', 'chat', 'inbox', 'conversations'],
    description: 'View your messages and conversations'
  },
];

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const navigate = useNavigate();
  const userName = user?.user_metadata?.name || 'User';
  const userType = user?.user_metadata?.user_type || 'customer';
  const isCustomer = userType === 'customer';
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    if (showNotifications || showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showSearchResults]);

  // Search function
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const searchTerm = query.toLowerCase();
      
      // Search navigation items first
      const navResults = NAVIGATION_ITEMS.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.keywords.some(keyword => keyword.includes(searchTerm)) ||
        item.description.toLowerCase().includes(searchTerm)
      );

      // Search jobs from database
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .eq('status', 'open')
        .limit(10);

      if (error) throw error;
      
      // Combine results - navigation items first, then jobs
      const combinedResults = [
        ...navResults.map(item => ({ ...item, type: 'navigation' })),
        ...(jobs || []).map(job => ({ ...job, type: 'job' }))
      ];
      
      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => navigate('/dashboard')}>
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl hidden sm:block">Nearly</span>
            </div>

            {/* Search Bar with Results */}
            <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  placeholder="Search for services, jobs, or pros..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-sm"
                />
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-0 top-0 bottom-0 px-4 bg-slate-900 hover:bg-slate-800 rounded-r-lg transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-slate-200 max-h-96 overflow-y-auto z-50">
                    {searchLoading ? (
                      <div className="p-8 text-center">
                        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-slate-600">Searching...</p>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-slate-600 mb-2">No results found for "{searchQuery}"</p>
                        <button
                          onClick={() => {
                            navigate('/browse-jobs');
                            setShowSearchResults(false);
                          }}
                          className="mt-2 text-sky-600 hover:text-sky-700 font-semibold"
                        >
                          Browse all jobs →
                        </button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-sm text-slate-500 mb-3 px-2">
                          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                        </p>
                        {searchResults.map((result: any, index: number) => (
                          <div key={index}>
                            {result.type === 'navigation' ? (
                              // Navigation Item Result
                              <div
                                onClick={() => {
                                  navigate(result.path);
                                  setShowSearchResults(false);
                                  setSearchQuery('');
                                }}
                                className="p-4 hover:bg-sky-50 rounded-xl cursor-pointer transition mb-2 flex items-start gap-3"
                              >
                                <div className="text-3xl">{result.icon}</div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-slate-900 mb-1">{result.name}</h4>
                                  <p className="text-sm text-slate-600">{result.description}</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            ) : (
                              // Job Result
                              <div
                                onClick={() => {
                                  navigate(`/jobs/${result.id}`);
                                  setShowSearchResults(false);
                                  setSearchQuery('');
                                }}
                                className="p-4 hover:bg-sky-50 rounded-xl cursor-pointer transition mb-2"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 mb-1">{result.title}</h4>
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">{result.description}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold">
                                        {result.category}
                                      </span>
                                      <span className="text-sm text-slate-500">{result.location}</span>
                                    </div>
                                  </div>
                                  <span className="font-bold text-sky-600 ml-4">${result.budget}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Upgrade to Pro Button */}
              <button className="hidden lg:block px-4 py-2 text-slate-700 hover:text-sky-600 transition font-medium text-sm whitespace-nowrap">
                Upgrade to Pro
              </button>

              {/* Notifications Icon with Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition relative" 
                  title="Notifications"
                >
                  <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden z-50">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-xl">🔔</span>
                        Notifications (0)
                      </h3>
                    </div>
                    <div className="p-12 text-center">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-3xl">🔔</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-xl text-slate-900 mb-2">No Notifications...yet</h4>
                      <p className="text-slate-600 text-sm">
                        The more you do out there, the<br />
                        more you'll see in here.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <button 
                onClick={() => navigate('/messages')}
                className="p-2 hover:bg-slate-100 rounded-lg transition" 
                title="Messages"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Favorites */}
              <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Favorites">
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Orders/My Work */}
              <button 
                onClick={() => isCustomer ? navigate('/my-jobs') : navigate('/my-projects')}
                className="hidden lg:block px-3 py-2 text-slate-700 hover:text-sky-600 transition font-medium text-sm"
              >
                {isCustomer ? 'Orders' : 'My Work'}
              </button>

              {/* Profile */}
              <ProfileDropdown user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {isCustomer ? `Welcome back, ${userName}! 👋` : `Ready to work, ${userName}? 💪`}
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            {isCustomer 
              ? 'Find skilled local makers and service providers for your next project' 
              : 'Browse local jobs and connect with customers in your area'}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {isCustomer ? (
              <>
                <button 
                  onClick={() => navigate('/post-job')}
                  className="px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition shadow-lg hover:shadow-xl"
                >
                  Post a Job
                </button>
                <button 
                  onClick={() => navigate('/browse')}
                  className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition border-2 border-slate-300"
                >
                  Browse Pros
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/browse-jobs')}
                  className="px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition shadow-lg hover:shadow-xl"
                >
                  Find Jobs
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition border-2 border-slate-300"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-3xl">🔥</span> Trending
            </h2>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/category/${category.name.toLowerCase().replace(' ', '-')}`)}
                className="flex-shrink-0 px-6 py-3 bg-white rounded-full border-2 border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition font-semibold text-slate-700 hover:text-sky-600 whitespace-nowrap"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Work Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Inspiration</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div onClick={() => navigate('/category/woodworking')} className="group cursor-pointer">
              <div className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop" 
                  alt="Custom furniture"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Custom Tables</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div onClick={() => navigate('/category/ceramics')} className="group cursor-pointer">
              <div className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop" 
                  alt="Handmade pottery"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Handmade Pottery</h3>
              </div>
            </div>

            {/* Card 3 - Tall */}
            <div onClick={() => navigate('/category/photography')} className="group cursor-pointer md:row-span-2">
              <div className="relative aspect-[3/4] bg-slate-200 rounded-xl overflow-hidden h-full">
                <img 
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=700&fit=crop" 
                  alt="Professional photography"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg">
                  <span className="text-slate-600">♡</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="font-semibold text-white text-lg">Photography</h3>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div onClick={() => navigate('/category/painting')} className="group cursor-pointer">
              <div className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=300&fit=crop" 
                  alt="Wall art"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Wall Art</h3>
              </div>
            </div>

            {/* Card 5 - Wide */}
            <div onClick={() => navigate('/category/logo-design')} className="group cursor-pointer md:col-span-2 md:row-span-2">
              <div className="relative aspect-[3/2] bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop" 
                  alt="Logo design"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg">
                  <span className="text-slate-600">♡</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="font-semibold text-white text-xl">Logo Design</h3>
                </div>
              </div>
            </div>

            {/* Card 6 */}
            <div onClick={() => navigate('/category/woodworking')} className="group cursor-pointer">
              <div className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop" 
                  alt="Kids furniture"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Kids Furniture</h3>
              </div>
            </div>

            {/* Card 7 */}
            <div onClick={() => navigate('/category/metalwork')} className="group cursor-pointer">
              <div className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615876063169-6e7e6d0d3c9a?w=500&h=500&fit=crop" 
                  alt="Metal work"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Metal Crafts</h3>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {isCustomer ? (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">1️⃣</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Post Your Job</h3>
                  <p className="text-slate-600">Describe what you need done and set your budget</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">2️⃣</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Get Matched</h3>
                  <p className="text-slate-600">Local pros send you quotes and portfolios</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">3️⃣</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Pay Securely</h3>
                  <p className="text-slate-600">Money held in escrow until job is complete</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">1️⃣</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Browse Jobs</h3>
                  <p className="text-slate-600">Find local projects that match your skills</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">2️⃣</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Send Proposal</h3>
                  <p className="text-slate-600">Submit your quote and portfolio</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">3️⃣</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Get Paid</h3>
                  <p className="text-slate-600">Complete the job and receive secure payment</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}