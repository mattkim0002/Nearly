import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import ProfileDropdown from '../components/ProfileDropdown';

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

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const navigate = useNavigate();
  const userName = user?.user_metadata?.name || 'User';
  const userType = user?.user_metadata?.user_type || 'customer';
  const isCustomer = userType === 'customer';
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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
              <span className="font-bold text-slate-900 text-xl hidden sm:block">Bluedot</span>
            </div>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What service are you looking for today?"
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-sm"
                />
                <button className="absolute right-0 top-0 bottom-0 px-4 bg-slate-900 hover:bg-slate-800 rounded-r-lg transition flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-xl">🔔</span>
                        Notifications (0)
                      </h3>
                      <button className="text-slate-400 hover:text-slate-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Empty State */}
                    <div className="p-12 text-center">
                      <div className="mb-6">
                        <svg className="w-32 h-32 mx-auto text-slate-300" viewBox="0 0 100 100" fill="none">
                          {/* Simple dog illustration */}
                          <ellipse cx="50" cy="65" rx="25" ry="15" fill="currentColor"/>
                          <circle cx="50" cy="40" r="20" fill="currentColor"/>
                          <ellipse cx="40" cy="38" rx="3" ry="4" fill="white"/>
                          <ellipse cx="60" cy="38" rx="3" ry="4" fill="white"/>
                          <path d="M45 45 Q50 48 55 45" stroke="white" strokeWidth="2" fill="none"/>
                          <ellipse cx="30" cy="30" rx="8" ry="12" fill="currentColor"/>
                          <ellipse cx="70" cy="30" rx="8" ry="12" fill="currentColor"/>
                        </svg>
                      </div>
                      <h4 className="font-bold text-xl text-slate-900 mb-2">No Notifications...yet</h4>
                      <p className="text-slate-600 text-sm">
                        The more you do out there, the<br />
                        more you'll see in here.
                      </p>
                    </div>

                    {/* Footer with audio/settings buttons */}
                    <div className="flex items-center gap-3 p-4 border-t border-slate-200 bg-slate-50">
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition" title="Sound">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition" title="Settings">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Icon */}
              <button
                onClick={() => navigate('/messages')}
                className="p-2 hover:bg-slate-100 rounded-lg transition relative"
                title="Messages"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Favorites Icon - Navigate to Lists */}
              <button 
                onClick={() => navigate('/lists')}
                className="hidden md:block p-2 hover:bg-slate-100 rounded-lg transition" 
                title="My Lists"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Orders Link */}
              <button 
                onClick={() => navigate(isCustomer ? '/my-jobs' : '/my-projects')}
                className="hidden lg:block px-3 py-2 text-slate-700 hover:text-sky-600 transition font-medium text-sm"
              >
                Orders
              </button>

              {/* Profile Dropdown */}
              <ProfileDropdown user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Category Navigation - Fiverr Style */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => navigate('/browse-jobs')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              <span>🔥</span>
              <span>Trending</span>
            </button>
            <button
              onClick={() => navigate('/category/woodworking')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Woodworking
            </button>
            <button
              onClick={() => navigate('/category/ceramics')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Ceramics
            </button>
            <button
              onClick={() => navigate('/category/photography')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Photography
            </button>
            <button
              onClick={() => navigate('/category/painting')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Painting
            </button>
            <button
              onClick={() => navigate('/category/web-design')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Web Design
            </button>
            <button
              onClick={() => navigate('/category/logo-design')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Logo Design
            </button>
            <button
              onClick={() => navigate('/category/metalwork')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Metalwork
            </button>
            <button
              onClick={() => navigate('/category/jewelry')}
              className="px-4 py-2 rounded-lg hover:bg-sky-50 transition whitespace-nowrap text-sm font-medium text-slate-700 hover:text-sky-600"
            >
              Jewelry
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome to Bluedot, {userName} 👋
          </h1>
          <p className="text-lg text-slate-600">
            {isCustomer 
              ? "Find talented local pros and makers for your next project"
              : "Discover exciting job opportunities from local customers"}
          </p>
        </div>

        {/* Recommended Cards - Fiverr Style */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Recommended for you</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  {isCustomer ? 'Post a project brief' : 'Complete your profile'}
                </h3>
                <p className="text-xs text-slate-600">
                  {isCustomer ? 'Get tailored offers for your needs.' : 'Get discovered by more customers.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Recommended for you</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Download the Bluedot app</h3>
                <p className="text-xs text-slate-600">Stay productive, anywhere you go.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Profile Progress</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💼</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">You've added 25% of your profile</h3>
                <p className="text-xs text-slate-600">Complete it to get tailored suggestions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isCustomer ? (
            <>
              {/* Post a Job */}
              <div 
                onClick={() => navigate('/post-job')}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-200 transition">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Post a Job</h3>
                <p className="text-slate-600">Get tailored offers for your needs. Posting is free!</p>
              </div>

              {/* Browse Pros */}
              <div 
                onClick={() => navigate('/browse')}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Browse Pros</h3>
                <p className="text-slate-600">Find local makers and service providers near you</p>
              </div>

              {/* My Jobs */}
              <div 
                onClick={() => navigate('/my-jobs')}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">My Jobs</h3>
                <p className="text-slate-600">View and manage your posted jobs</p>
              </div>
            </>
          ) : (
            <>
              {/* Browse Jobs */}
              <div 
                onClick={() => navigate('/browse-jobs')}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-200 transition">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Browse Jobs</h3>
                <p className="text-slate-600">Find local job opportunities that match your skills</p>
              </div>

              {/* My Proposals - NEW! */}
              <div 
                onClick={() => navigate('/my-proposals')}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">My Proposals</h3>
                <p className="text-slate-600">Track all your submitted job proposals</p>
              </div>

              {/* My Services */}
              <div 
                onClick={() => navigate('/my-services')}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">My Services</h3>
                <p className="text-slate-600">Manage your offerings and portfolio</p>
              </div>

              {/* Profile Progress */}
              <div 
                onClick={() => navigate('/profile')}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Complete Profile</h3>
                <p className="text-slate-600">Complete your profile to get more opportunities</p>
              </div>
            </>
          )}
        </div>

        {/* Explore Popular Categories - Fiverr Style */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Explore popular categories on Bluedot</h2>
            <button 
              onClick={() => navigate('/browse')}
              className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
            >
              Show All <span>→</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div 
              onClick={() => navigate('/category/logo-design')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl">✏️</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition">Logo Design</h3>
                <button className="text-slate-400 hover:text-slate-700">⋯</button>
              </div>
            </div>

            <div 
              onClick={() => navigate('/category/web-design')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl">💻</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition">Website Development</h3>
                <button className="text-slate-400 hover:text-slate-700">⋯</button>
              </div>
            </div>

            <div 
              onClick={() => navigate('/category/photography')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl">📸</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition">Photography</h3>
                <button className="text-slate-400 hover:text-slate-700">⋯</button>
              </div>
            </div>

            <div 
              onClick={() => navigate('/category/woodworking')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl">🪵</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition">Woodworking</h3>
                <button className="text-slate-400 hover:text-slate-700">⋯</button>
              </div>
            </div>
          </div>
        </div>

        {/* Get Inspired Section - Portfolio Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Get inspired by work done on Bluedot</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {/* Large vertical card - Woodworking dining table */}
            <div 
              onClick={() => navigate('/category/woodworking')}
              className="group cursor-pointer md:row-span-2"
            >
              <div className="relative aspect-[3/4] bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=700&fit=crop" 
                  alt="Woodworking dining table"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg">
                  <span className="text-slate-600">♡</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <h3 className="font-semibold text-white text-lg">Woodworking</h3>
                </div>
              </div>
            </div>

            {/* Regular card - Outdoor furniture */}
            <div 
              onClick={() => navigate('/category/woodworking')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=300&fit=crop" 
                  alt="Outdoor dining set"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Outdoor Furniture</h3>
                <button className="text-slate-400 hover:text-slate-700">⋯</button>
              </div>
            </div>

            {/* Large horizontal card - Logo designs */}
            <div 
              onClick={() => navigate('/category/logo-design')}
              className="group cursor-pointer md:col-span-2 md:row-span-2"
            >
              <div className="relative aspect-[3/2] bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop" 
                  alt="Logo design showcase"
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

            {/* Regular card - Kids furniture */}
            <div 
              onClick={() => navigate('/category/woodworking')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop" 
                  alt="Children's table set"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Kids Furniture</h3>
                <button className="text-slate-400 hover:text-slate-700">⋯</button>
              </div>
            </div>

            {/* Square card - Dining room */}
            <div 
              onClick={() => navigate('/category/woodworking')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615876063169-6e7e6d0d3c9a?w=500&h=500&fit=crop" 
                  alt="Elegant dining room"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
                  <span className="text-slate-600">♡</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition text-sm">Custom Dining Sets</h3>
                <button className="text-slate-400 hover:text-slate-700">⋯</button>
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