import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface MyJobsProps {
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
}

export default function MyJobs({ user, onSignOut }: MyJobsProps) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Redirect if user is a pro
  if (user.user_metadata?.user_type === 'pro') {
    navigate('/browse-jobs');
    return null;
  }

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Jobs</h1>
            <p className="text-slate-600">Manage and track your posted jobs</p>
          </div>
          
          <button
            onClick={() => navigate('/post-job')}
            className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-lg"
          >
            + Post New Job
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 border-2 border-slate-200 w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-red-500 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'open'
                ? 'bg-red-500 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Open ({jobs.filter(j => j.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'closed'
                ? 'bg-red-500 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Closed ({jobs.filter(j => j.status === 'closed').length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading your jobs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
            <span className="text-6xl mb-4 block">📋</span>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {filter === 'all' ? 'No jobs yet' : `No ${filter} jobs`}
            </h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all' 
                ? 'Post your first job and start getting quotes from local pros!'
                : `You don't have any ${filter} jobs at the moment.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/post-job')}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Post Your First Job
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
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-300 hover:shadow-xl transition p-6 cursor-pointer"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'open' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {job.status === 'open' ? '🟢 Open' : '⚫ Closed'}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 mb-3 line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="font-medium text-red-500">{job.category}</span>
                      <span>📍 {job.location}</span>
                      <span>💰 {job.budget}</span>
                      <span>📅 Posted {formatDate(job.created_at)}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className="ml-4 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium text-sm"
                  >
                    View Details →
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm">Proposals:</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm">Views:</span>
                    <span className="font-bold text-slate-900">-</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm">Messages:</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        {!loading && jobs.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-red-600 to-blue-500 rounded-2xl p-6 text-white">
              <h3 className="text-sm font-semibold opacity-90 mb-2">Total Jobs Posted</h3>
              <p className="text-4xl font-bold">{jobs.length}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
              <h3 className="text-sm font-semibold opacity-90 mb-2">Active Jobs</h3>
              <p className="text-4xl font-bold">{jobs.filter(j => j.status === 'open').length}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-sm font-semibold opacity-90 mb-2">Completed Jobs</h3>
              <p className="text-4xl font-bold">{jobs.filter(j => j.status === 'closed').length}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
