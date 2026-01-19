import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface BrowseWorkersProps {
  user?: any;
  onSignOut?: () => void;
}

export default function BrowseWorkers({ user, onSignOut }: BrowseWorkersProps) {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Woodworking', 'Ceramics', 'Photography', 'Painting', 'Web Design', 'Logo Design', 'Metalwork', 'Jewelry'];

  // Mock worker data - replace with real data from Supabase
  const mockWorkers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Master Woodworker',
      location: 'San Diego, CA',
      rating: 4.9,
      reviews: 47,
      completedProjects: 156,
      hourlyRate: 85,
      skills: ['Custom Furniture', 'Woodturning', 'Restoration'],
      bio: 'Passionate woodworker with 15+ years of experience creating custom furniture and home décor. Specializing in mid-century modern and rustic styles.',
      avatar: 'SJ',
      verified: true,
      recentProjects: [
        { title: 'Custom Dining Table', image: '🪵', client: 'John D.' },
        { title: 'Live Edge Coffee Table', image: '🌲', client: 'Emily R.' },
        { title: 'Oak Bookshelf', image: '📚', client: 'Michael T.' }
      ]
    },
    {
      id: '2',
      name: 'Marcus Chen',
      title: 'Ceramic Artist',
      location: 'San Diego, CA',
      rating: 4.8,
      reviews: 32,
      completedProjects: 89,
      hourlyRate: 65,
      skills: ['Pottery', 'Sculpture', 'Glazing'],
      bio: 'Creating functional and decorative ceramics inspired by nature. Every piece is handmade with care and attention to detail.',
      avatar: 'MC',
      verified: true,
      recentProjects: [
        { title: 'Handmade Dinnerware Set', image: '🏺', client: 'Lisa M.' },
        { title: 'Garden Planters', image: '🌿', client: 'David K.' }
      ]
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      title: 'Portrait Photographer',
      location: 'San Diego, CA',
      rating: 5.0,
      reviews: 68,
      completedProjects: 203,
      hourlyRate: 150,
      skills: ['Portraits', 'Event Photography', 'Editing'],
      bio: 'Award-winning photographer specializing in portraits and lifestyle photography. I capture authentic moments that tell your story.',
      avatar: 'ER',
      verified: true,
      recentProjects: [
        { title: 'Family Portrait Session', image: '📸', client: 'The Smiths' },
        { title: 'Wedding Photography', image: '💍', client: 'Sarah & Tom' },
        { title: 'Corporate Headshots', image: '👔', client: 'Tech Startup Inc.' }
      ]
    },
    {
      id: '4',
      name: 'Alex Turner',
      title: 'Logo & Brand Designer',
      location: 'San Diego, CA',
      rating: 4.7,
      reviews: 54,
      completedProjects: 127,
      hourlyRate: 95,
      skills: ['Logo Design', 'Branding', 'Illustration'],
      bio: 'Helping businesses stand out with memorable brand identities. From startups to established companies, I create designs that resonate.',
      avatar: 'AT',
      verified: false,
      recentProjects: [
        { title: 'Coffee Shop Logo', image: '☕', client: 'Brew Haven' },
        { title: 'Tech Startup Branding', image: '💻', client: 'DataFlow' }
      ]
    }
  ];

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    setLoading(true);
    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabase
    //   .from('profiles')
    //   .select('*')
    //   .eq('user_type', 'pro');
    
    setTimeout(() => {
      setWorkers(mockWorkers);
      setLoading(false);
    }, 500);
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           worker.skills.some((skill: string) => skill.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
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
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <ProfileDropdown user={user} onSignOut={onSignOut!} />
              ) : (
                <>
                  <button onClick={() => navigate('/auth')} className="px-5 py-2.5 text-slate-700 hover:text-sky-600 transition font-medium">Log In</button>
                  <button onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition shadow-lg">Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition">
          <span>←</span><span>Back</span>
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Independent Workers</h1>
              <p className="text-lg text-slate-600">Connect with talented local workers for your next commission</p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="px-6 py-3 bg-white border-2 border-slate-300 rounded-xl font-semibold hover:border-sky-500 transition flex items-center gap-2"
            >
              <span>🗺️</span>
              <span>Map View</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skill, or category..."
                className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Showing {filteredWorkers.length} independent {filteredWorkers.length === 1 ? 'worker' : 'workers'}
          </p>
        </div>

        {/* Workers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading workers...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-200">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No workers found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredWorkers.map((worker) => (
              <div 
                key={worker.id} 
                onClick={() => navigate(`/worker/${worker.id}`)}
                className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-sky-500 transition cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Avatar & Basic Info */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-3">
                      {worker.avatar}
                    </div>
                    {worker.verified && (
                      <div className="flex items-center gap-1 text-sm text-emerald-600 font-semibold">
                        <span>✓</span>
                        <span>Profile Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Middle: Profile Details */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{worker.name}</h3>
                      <p className="text-lg text-sky-600 font-semibold mb-2">{worker.title}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>📍 {worker.location}</span>
                        <span>⭐ {worker.rating} ({worker.reviews} reviews)</span>
                        <span>💼 {worker.completedProjects} commissions</span>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-4 leading-relaxed">{worker.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {worker.skills.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Recent Projects */}
                    {worker.recentProjects.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3">Recent Projects:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {worker.recentProjects.map((project: any, index: number) => (
                            <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                              <div className="text-2xl mb-2">{project.image}</div>
                              <p className="font-semibold text-slate-900 text-sm mb-1">{project.title}</p>
                              <p className="text-xs text-slate-600">Client: {project.client}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Pricing & CTA */}
                  <div className="flex-shrink-0 text-right">
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <p className="text-sm text-slate-600 mb-1">Starting at</p>
                      <p className="text-3xl font-bold text-sky-600">${worker.hourlyRate}</p>
                      <p className="text-xs text-slate-500">per hour</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/worker/${worker.id}`);
                      }}
                      className="w-full px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}