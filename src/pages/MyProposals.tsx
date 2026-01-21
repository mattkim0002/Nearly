import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface MyProposalsProps {
  user: any;
  onSignOut: () => void;
}

export default function MyProposals({ user, onSignOut }: MyProposalsProps) {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    loadMyProposals();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('my-proposals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposals',
          filter: `pro_id=eq.${user.id}`
        },
        () => {
          console.log('Proposal updated, reloading...');
          loadMyProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const loadMyProposals = async () => {
    try {
      setLoading(true);
      console.log('Loading proposals for user:', user.id);

      // Get proposals with job details
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select('*')
        .eq('pro_id', user.id)
        .order('created_at', { ascending: false });

      if (proposalsError) throw proposalsError;

      // Get job details for each proposal
      const jobIds = proposalsData?.map(p => p.job_id) || [];
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .in('id', jobIds);

      if (jobsError) throw jobsError;

      // Combine proposals with job data
      const enrichedProposals = proposalsData?.map((proposal: any) => {
        const job = jobsData?.find(j => j.id === proposal.job_id);
        return {
          ...proposal,
          jobTitle: job?.title || 'Unknown Job',
          jobCategory: job?.category || '',
          jobBudget: job?.budget || '',
          jobStatus: job?.status || '',
          jobLocation: job?.location || ''
        };
      }) || [];

      console.log('Loaded proposals:', enrichedProposals);
      setProposals(enrichedProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredProposals = proposals.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your proposals...</p>
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Proposals</h1>
          <p className="text-slate-600">Track all your submitted proposals in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Total Proposals</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-amber-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-emerald-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Accepted</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-slate-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                filter === 'all'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                filter === 'pending'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                filter === 'accepted'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accepted ({stats.accepted})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                filter === 'rejected'
                  ? 'text-slate-600 border-b-2 border-slate-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-12 text-center">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {filter === 'all' ? 'No proposals yet' : `No ${filter} proposals`}
            </h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all'
                ? 'Start applying to jobs to see your proposals here!'
                : `You don't have any ${filter} proposals at the moment.`}
            </p>
            <button
              onClick={() => navigate('/browse-jobs')}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                className={`bg-white rounded-2xl shadow-md border-2 p-6 cursor-pointer hover:shadow-lg transition ${
                  proposal.status === 'accepted'
                    ? 'border-emerald-500 bg-emerald-50'
                    : proposal.status === 'rejected'
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-slate-200 hover:border-orange-300'
                }`}
                onClick={() => navigate(`/job/${proposal.job_id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{proposal.jobTitle}</h3>
                      {proposal.status === 'accepted' && (
                        <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold">
                          ✓ Accepted
                        </span>
                      )}
                      {proposal.status === 'pending' && (
                        <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold">
                          ⏳ Pending
                        </span>
                      )}
                      {proposal.status === 'rejected' && (
                        <span className="px-3 py-1 bg-slate-400 text-white rounded-full text-xs font-semibold">
                          ✗ Rejected
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-semibold">
                        {proposal.jobCategory}
                      </span>
                      <span className="text-sm text-slate-600">📍 {proposal.jobLocation}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Submitted</p>
                    <p className="font-semibold text-slate-900">{formatDate(proposal.created_at)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-1">Your Cover Letter:</p>
                  <p className="text-slate-600 line-clamp-2">{proposal.cover_letter}</p>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600">Your Budget</p>
                    <p className="font-bold text-orange-500">{proposal.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Your Timeline</p>
                    <p className="font-bold text-slate-900">{proposal.timeline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Job Budget</p>
                    <p className="font-bold text-slate-600">{proposal.jobBudget}</p>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/job/${proposal.job_id}`);
                      }}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition text-sm"
                    >
                      View Job →
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