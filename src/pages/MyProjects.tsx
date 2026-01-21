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
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'delivered' | 'completed'>('all');

  useEffect(() => {
    loadJobs();
  }, [user.id]);

  const loadJobs = async () => {
    try {
      setLoading(true);

      // Get jobs posted by this user
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // For each job, get proposal count
      const jobsWithProposals = await Promise.all(
        jobsData?.map(async (job: any) => {
          const { data: proposalsData, error: proposalsError } = await supabase
            .from('proposals')
            .select('*')
            .eq('job_id', job.id);

          if (proposalsError) throw proposalsError;

          const acceptedProposal = proposalsData?.find((p: any) => p.status === 'accepted');

          return {
            ...job,
            proposalCount: proposalsData?.length || 0,
            acceptedProposal
          };
        }) || []
      );

      setJobs(jobsWithProposals);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    in_progress: jobs.filter(j => j.status === 'in_progress').length,
    delivered: jobs.filter(j => j.status === 'delivered').length,
    completed: jobs.filter(j => j.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your jobs...</p>
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Jobs</h1>
          <p className="text-slate-600">Manage all your posted jobs in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Total Jobs</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-emerald-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Open</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.open}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-amber-200 p-6">
            <p className="text-sm text-slate-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-amber-600">{stats.in_progress}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-blue-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Delivered</p>
            <p className="text-3xl font-bold text-orange-600">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-purple-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-purple-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 mb-6">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-6 py-4 font-semibold transition whitespace-nowrap ${
                filter === 'all'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`flex-1 px-6 py-4 font-semibold transition whitespace-nowrap ${
                filter === 'open'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Open ({stats.open})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`flex-1 px-6 py-4 font-semibold transition whitespace-nowrap ${
                filter === 'in_progress'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({stats.in_progress})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`flex-1 px-6 py-4 font-semibold transition whitespace-nowrap ${
                filter === 'delivered'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delivered ({stats.delivered})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 px-6 py-4 font-semibold transition whitespace-nowrap ${
                filter === 'completed'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-12 text-center">
            <span className="text-6xl mb-4 block">💼</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {filter === 'all' ? 'No jobs yet' : `No ${filter.replace('_', ' ')} jobs`}
            </h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all'
                ? 'Post your first job to get started!'
                : `You don't have any ${filter.replace('_', ' ')} jobs at the moment.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/post-job')}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
              >
                Post a Job
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 hover:border-orange-300 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                        job.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                        job.status === 'delivered' ? 'bg-blue-100 text-orange-700' :
                        job.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {job.status === 'open' ? '🟢 Open' :
                         job.status === 'in_progress' ? '⏳ In Progress' :
                         job.status === 'delivered' ? '📦 Delivered' :
                         job.status === 'completed' ? '✅ Completed' :
                         '❌ Cancelled'}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 mb-3">{job.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600">
                        <span className="font-semibold text-orange-500">{job.budget}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-600">📍 {job.location}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-600">Posted {formatDate(job.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-slate-600">Proposals</p>
                      <p className="font-bold text-slate-900">{job.proposalCount}</p>
                    </div>
                    {job.acceptedProposal && (
                      <div>
                        <p className="text-xs text-slate-600">Assigned To</p>
                        <p className="font-bold text-slate-900">Pro User</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition text-sm"
                  >
                    View Details →
                  </button>
                </div>

                {/* Action needed badges */}
                {job.status === 'delivered' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                    <span className="text-orange-600">⚠️</span>
                    <span className="text-sm font-semibold text-blue-900">Action needed: Review and approve delivery</span>
                  </div>
                )}
                {job.status === 'open' && job.proposalCount > 0 && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                    <span className="text-emerald-600">💡</span>
                    <span className="text-sm font-semibold text-emerald-900">{job.proposalCount} proposal{job.proposalCount !== 1 ? 's' : ''} waiting for review</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}