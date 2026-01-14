import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface MyJobsProps {
  user: any;
  onSignOut: () => void;
}

export default function MyJobs({ user, onSignOut }: MyJobsProps) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const userType = user?.user_metadata?.user_type || 'customer';
  const isPro = userType === 'pro';

  useEffect(() => {
    loadJobs();
  }, [user.id, isPro]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('jobs').select('*');
      
      // Different query based on user type
      if (isPro) {
        // For pros: show jobs they're working on
        query = query.eq('accepted_pro_id', user.id);
      } else {
        // For customers: show jobs they posted
        query = query.eq('customer_id', user.id);
      }
      
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'cancelled' })
        .eq('id', jobId);

      if (error) throw error;
      
      alert('Job cancelled successfully');
      loadJobs();
    } catch (error) {
      console.error('Error cancelling job:', error);
      alert('Error cancelling job');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'in_progress': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'delivered': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'cancelled': return 'bg-slate-100 text-slate-700 border-slate-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const counts = {
    all: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    in_progress: jobs.filter(j => j.status === 'in_progress').length,
    delivered: jobs.filter(j => j.status === 'delivered').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading jobs...</p>
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
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {isPro ? 'My Active Jobs' : 'My Jobs'}
          </h1>
          <p className="text-slate-600">
            {isPro 
              ? 'Jobs you\'re currently working on'
              : 'Manage all your posted jobs in one place'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <p className="text-slate-600 text-sm mb-2">Total Jobs</p>
            <p className="text-4xl font-bold text-slate-900">{counts.all}</p>
          </div>
          {!isPro && (
            <div className="bg-white rounded-2xl shadow-md border-2 border-emerald-200 p-6">
              <p className="text-slate-600 text-sm mb-2">Open</p>
              <p className="text-4xl font-bold text-emerald-600">{counts.open}</p>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-md border-2 border-amber-200 p-6">
            <p className="text-slate-600 text-sm mb-2">In Progress</p>
            <p className="text-4xl font-bold text-amber-600">{counts.in_progress}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-blue-200 p-6">
            <p className="text-slate-600 text-sm mb-2">Delivered</p>
            <p className="text-4xl font-bold text-blue-600">{counts.delivered}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-purple-200 p-6">
            <p className="text-slate-600 text-sm mb-2">Completed</p>
            <p className="text-4xl font-bold text-purple-600">{counts.completed}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-4 font-semibold whitespace-nowrap border-b-4 transition ${
                filter === 'all' 
                  ? 'border-sky-600 text-sky-600' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({counts.all})
            </button>
            {!isPro && (
              <button
                onClick={() => setFilter('open')}
                className={`px-6 py-4 font-semibold whitespace-nowrap border-b-4 transition ${
                  filter === 'open' 
                    ? 'border-sky-600 text-sky-600' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Open ({counts.open})
              </button>
            )}
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-6 py-4 font-semibold whitespace-nowrap border-b-4 transition ${
                filter === 'in_progress' 
                  ? 'border-sky-600 text-sky-600' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({counts.in_progress})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-6 py-4 font-semibold whitespace-nowrap border-b-4 transition ${
                filter === 'delivered' 
                  ? 'border-sky-600 text-sky-600' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Delivered ({counts.delivered})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-4 font-semibold whitespace-nowrap border-b-4 transition ${
                filter === 'completed' 
                  ? 'border-sky-600 text-sky-600' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({counts.completed})
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No jobs yet</h3>
            <p className="text-slate-600 mb-6">
              {isPro 
                ? "You haven't been assigned any jobs yet. Browse available jobs to get started!"
                : "Post your first job to get started!"
              }
            </p>
            <button
              onClick={() => navigate(isPro ? '/browse-jobs' : '/post-job')}
              className="px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              {isPro ? 'Browse Jobs' : 'Post a Job'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-slate-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(job.status)}`}>
                        {getStatusText(job.status)}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold">
                        {job.category}
                      </span>
                      <span className="text-slate-600 text-sm">📍 {job.location}</span>
                      <span className="text-slate-600 text-sm">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <p className="text-3xl font-bold text-sky-600">${job.budget}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
                  >
                    View Details
                  </button>
                  {!isPro && job.status === 'open' && (
                    <button
                      onClick={() => cancelJob(job.id)}
                      className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition"
                    >
                      Cancel Job
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}