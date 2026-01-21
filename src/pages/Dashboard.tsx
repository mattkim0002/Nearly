import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const navigate = useNavigate();
  const userType = user?.user_metadata?.user_type || 'customer';
  const isPro = userType === 'pro';

  const navigationItems = [
    {
      title: 'Browse Workers',
      description: 'View list of local pros and makers',
      icon: '📋',
      path: '/browse-workers',
      color: 'from-orange-300 to-orange-600'
    },
    {
      title: 'Maps',
      description: 'Find workers near you on the map',
      icon: '🗺️',
      path: '/browse',
      color: 'from-emerald-400 to-teal-600'
    },
    {
      title: isPro ? 'Browse Jobs' : 'Post a Job',
      description: isPro ? 'Find available jobs to work on' : 'Get quotes from local pros',
      icon: isPro ? '🔍' : '✨',
      path: isPro ? '/browse-jobs' : '/post-job',
      color: 'from-purple-400 to-pink-600'
    },
    {
      title: 'My Jobs',
      description: isPro ? 'Jobs you\'re working on' : 'Jobs you\'ve posted',
      icon: '💼',
      path: '/my-jobs',
      color: 'from-amber-400 to-orange-600'
    },
    {
      title: 'Messages',
      description: 'Chat with clients and workers',
      icon: '💬',
      path: '/messages',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      title: 'My Profile',
      description: 'Edit your profile and settings',
      icon: '👤',
      path: '/profile',
      color: 'from-pink-400 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
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
            Welcome back, {user?.user_metadata?.full_name || 'there'}! 👋
          </h1>
          <p className="text-xl text-slate-600">
            {isPro 
              ? 'Ready to find your next job?'
              : 'What would you like to do today?'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Active Jobs</span>
              <span className="text-2xl">💼</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Messages</span>
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Completed</span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationItems.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-2xl shadow-md border-2 border-slate-200 hover:border-orange-300 hover:shadow-xl transition cursor-pointer p-6 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-600">No recent activity yet</p>
            <p className="text-slate-500 text-sm mt-2">
              {isPro 
                ? 'Start browsing jobs to get started!'
                : 'Post your first job to get started!'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}