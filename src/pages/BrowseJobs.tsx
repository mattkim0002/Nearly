import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface BrowseJobsProps {
  user: any;
  onSignOut: () => void;
}

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  location: string;
  zip_code: string;
  status: string;
  created_at: string;
  user_id: string;
}

const CATEGORIES = [
  "All Categories",
  "Woodworking",
  "Ceramics",
  "Photography",
  "Painting",
  "Web Design",
  "Logo Design",
  "Metalwork",
  "Jewelry",
  "Illustration"
];

export default function BrowseJobs({ user, onSignOut }: BrowseJobsProps) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'budget'>('recent');

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Redirect if user is a customer
  if (user.user_metadata?.user_type === 'customer') {
    navigate('/post-job');
    return null;
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter(job => {
      // Category filter
      if (selectedCategory !== 'All Categories' && job.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) 
          && !job.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        const budgetA = parseInt(a.budget.replace(/[^0-9]/g, '')) || 0;
        const budgetB = parseInt(b.budget.replace(/[^0-9]/g, '')) || 0;
        return budgetB - budgetA;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Bluedot</span>
            </div>

            <div className="flex items-center gap-4">
              <ProfileDropdown user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Jobs</h1>
          <p className="text-slate-600">Find local job opportunities that match your skills</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Search Jobs
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="budget">Highest Budget</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            {loading ? 'Loading...' : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'job' : 'jobs'} available`}
          </p>
          
          {searchQuery || selectedCategory !== 'All Categories' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
              className="text-sky-600 hover:text-sky-700 font-medium text-sm"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading available jobs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || selectedCategory !== 'All Categories'
                ? 'Try adjusting your filters to see more results.'
                : 'No jobs are currently available. Check back soon!'}
            </p>
            {(searchQuery || selectedCategory !== 'All Categories') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                }}
                className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Jobs List */}
        {!loading && filteredJobs.length > 0 && (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-sky-400 hover:shadow-xl transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                        🟢 Open
                      </span>
                    </div>
                    
                    <p className="text-slate-600 mb-3 line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="font-medium text-sky-600">{job.category}</span>
                      <span>📍 {job.location}</span>
                      <span>💰 Budget: {job.budget}</span>
                      <span>📅 Posted {formatDate(job.created_at)}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/job/${job.id}`)}
                      className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition whitespace-nowrap"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => navigate(`/job/${job.id}`)}
                      className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium whitespace-nowrap text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Job Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm">Proposals:</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm">Client Location:</span>
                    <span className="font-bold text-slate-900">{job.zip_code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Card */}
        {!loading && filteredJobs.length > 0 && (
          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-6 mt-8 border-2 border-sky-200">
            <h3 className="font-bold text-lg text-slate-900 mb-2">💡 Tips for Success</h3>
            <ul className="space-y-1 text-slate-700">
              <li>• Respond quickly to stand out from other applicants</li>
              <li>• Include relevant work samples in your proposal</li>
              <li>• Be clear about your timeline and pricing</li>
              <li>• Ask questions to show you understand the project</li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}