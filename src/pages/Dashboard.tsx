import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

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
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">●</span>
                </div>
                <span className="font-bold text-slate-900 text-xl">Nearly</span>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => navigate('/browse')}
                  className="text-slate-700 hover:text-sky-600 transition font-medium"
                >
                  Browse Workers
                </button>
                <button 
                  onClick={() => navigate('/map')}
                  className="text-slate-700 hover:text-sky-600 transition font-medium"
                >
                  Maps
                </button>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="text-slate-700 hover:text-sky-600 transition font-medium"
                >
                  Pricing
                </button>
              </nav>
            </div>

            {/* Right Side */}
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
            Welcome to Nearly, {userName} 👋
          </h1>
          <p className="text-xl text-slate-600">
            {isCustomer 
              ? 'Find talented independent local workers for your next commission' 
              : 'Find local commissions and connect with clients'}
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Post a Commission */}
          <div 
            onClick={() => navigate('/post-job')}
            className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer group"
          >
            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-sky-200 transition">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Post a Commission</h3>
            <p className="text-slate-600">
              Get tailored offers for your needs. Posting is free!
            </p>
          </div>

          {/* Browse Workers */}
          <div 
            onClick={() => navigate('/browse')}
            className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer group"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Browse Workers</h3>
            <p className="text-slate-600">
              Find independent local workers and service providers near you
            </p>
          </div>

          {/* My Commissions */}
          <div 
            onClick={() => navigate('/my-jobs')}
            className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <span className="text-3xl">💼</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">My Commissions</h3>
            <p className="text-slate-600">
              View and manage your posted commissions
            </p>
          </div>
        </div>

        {/* Complete Profile Banner */}
        <div className="bg-sky-50 rounded-2xl p-8 border-2 border-sky-200 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Complete Your Profile</h3>
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

        {/* Explore Categories */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Explore Popular Categories</h2>
            <button 
              onClick={() => navigate('/browse')}
              className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-2"
            >
              Show All
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Woodworking */}
            <div 
              onClick={() => navigate('/category/woodworking')}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer text-center group"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition">
                <span className="text-3xl">🪵</span>
              </div>
              <h4 className="font-bold text-slate-900">Woodworking</h4>
            </div>

            {/* Ceramics */}
            <div 
              onClick={() => navigate('/category/ceramics')}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer text-center group"
            >
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-200 transition">
                <span className="text-3xl">🏺</span>
              </div>
              <h4 className="font-bold text-slate-900">Ceramics</h4>
            </div>

            {/* Photography */}
            <div 
              onClick={() => navigate('/category/photography')}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer text-center group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition">
                <span className="text-3xl">📸</span>
              </div>
              <h4 className="font-bold text-slate-900">Photography</h4>
            </div>

            {/* Design */}
            <div 
              onClick={() => navigate('/category/design')}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer text-center group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition">
                <span className="text-3xl">🎨</span>
              </div>
              <h4 className="font-bold text-slate-900">Design</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}