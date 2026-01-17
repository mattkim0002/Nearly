import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">●</span>
                </div>
                <span className="font-bold text-slate-900 text-xl">Bluedot</span>
              </div>

              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <button 
                  onClick={() => navigate('/browse')}
                  className="hover:text-sky-600 transition"
                >
                  {isCustomer ? 'Browse Pros' : 'Browse Jobs'}
                </button>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="hover:text-sky-600 transition"
                >
                  Pricing
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <ProfileDropdown user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome to Bluedot, {userName} 👋
          </h1>
          <p className="text-lg text-slate-600">
            {isCustomer 
              ? "Find talented local pros and makers for your next project"
              : "Discover exciting job opportunities from local customers"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
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

        {/* Profile Progress (for customers) */}
        {isCustomer && (
          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-6 mb-12 border-2 border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900 mb-1">Complete Your Profile</h3>
                <p className="text-slate-600">Get personalized recommendations</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        {/* Explore Popular Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900">
              Explore Popular Categories
            </h2>
            <button 
              onClick={() => navigate('/browse')}
              className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-2"
            >
              Show All
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <div
                key={category.name}
                onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-sky-400 hover:shadow-lg transition cursor-pointer group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{category.name}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {isCustomer ? 'Find local pros' : 'Find jobs'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 text-center text-white mb-12">
          <div className="max-w-2xl mx-auto">
            <span className="text-6xl mb-4 block">📍</span>
            <h2 className="text-3xl font-bold mb-4">Supporting Local Makers in San Diego</h2>
            <p className="text-xl text-emerald-50">
              Every job posted supports small businesses and keeps money circulating in your community.
            </p>
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
