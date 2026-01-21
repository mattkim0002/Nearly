import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface BrowseWorkersProps {
  user: any;
  onSignOut: () => void;
}

export default function BrowseWorkers({ user, onSignOut }: BrowseWorkersProps) {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'Woodworking',
    'Ceramics', 
    'Photography',
    'Painting',
    'Web Design',
    'Logo Design',
    'Metalwork',
    'Jewelry',
    'Illustration'
  ];

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      
      // Query profiles where user_type = 'pro'
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'pro');

      const { data, error } = await query;

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      worker.skills?.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading workers...</p>
        </div>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Workers</h1>
          <p className="text-slate-600">Find talented local pros and makers</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name, skills, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              🗺️ Switch to Map View
            </button>
            <span className="text-slate-600">
              {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Workers List */}
        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No workers found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl shadow-md border-2 border-slate-200 hover:border-orange-300 hover:shadow-xl transition p-6 cursor-pointer"
                onClick={() => navigate(`/pro/${worker.id}`)}
              >
                {/* Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {worker.avatar_url ? (
                      <img 
                        src={worker.avatar_url} 
                        alt={worker.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      worker.full_name?.charAt(0).toUpperCase() || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 truncate">
                      {worker.full_name || 'Anonymous Worker'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {worker.location || 'Location not specified'}
                    </p>
                    {worker.hourly_rate && (
                      <p className="text-sm font-semibold text-orange-500 mt-1">
                        {worker.hourly_rate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {worker.bio && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {worker.bio}
                  </p>
                )}

                {/* Skills */}
                {worker.skills && worker.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.slice(0, 4).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                      {worker.skills.length > 4 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                          +{worker.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-sm text-slate-600">
                  {worker.years_experience && (
                    <span>📅 {worker.years_experience} years exp</span>
                  )}
                  {worker.completed_jobs !== undefined && worker.completed_jobs > 0 && (
                    <span>✅ {worker.completed_jobs} jobs</span>
                  )}
                  {worker.rating && worker.rating > 0 && (
                    <span>⭐ {worker.rating.toFixed(1)}</span>
                  )}
                </div>

                {/* View Profile Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pro/${worker.id}`);
                  }}
                  className="mt-4 w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
                >
                  View Full Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}