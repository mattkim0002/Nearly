import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';
import PaymentModal from '../components/PaymentModal';

interface JobDetailProps {
  user: any;
  onSignOut: () => void;
}

export default function JobDetail({ user, onSignOut }: JobDetailProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [acceptedProposal, setAcceptedProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalText, setProposalText] = useState('');
  const [proposalBudget, setProposalBudget] = useState('');
  const [proposalTimeline, setProposalTimeline] = useState('');
  
  // Delivery form states
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [existingReview, setExistingReview] = useState<any>(null);

  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const userType = user?.user_metadata?.user_type || 'customer';
  const isPro = userType === 'pro';
  const isJobOwner = job && user && job.user_id === user.id;
  const isAssignedPro = acceptedProposal && user && acceptedProposal.proId === user.id;

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

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      await Promise.all([loadJob(), loadProposals()]);
      setLoading(false);
    };
    
    fetchData();
    
    const channel = supabase
      .channel(`proposals-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposals',
          filter: `job_id=eq.${id}`
        },
        () => {
          console.log('Proposal changed, reloading...');
          loadProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    if (user && acceptedProposal) {
      loadExistingReview();
    }
  }, [user, acceptedProposal]);

  const loadJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error loading job:', error);
    }
  };

  const loadProposals = async () => {
    try {
      console.log('Loading proposals for job:', id);
      
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('job_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedProposals = data?.map((p: any) => ({
        id: p.id,
        jobId: p.job_id,
        proId: p.pro_id,
        proName: 'Pro User',
        proAvatar: 'PU',
        proRating: 4.5,
        proJobs: 0,
        coverLetter: p.cover_letter,
        budget: p.budget,
        timeline: p.timeline,
        status: p.status,
        deliveryNotes: p.delivery_notes,
        deliveryDate: p.delivery_date,
        submittedAt: formatDate(p.created_at)
      })) || [];
      
      setProposals(transformedProposals);
      
      // Find accepted proposal
      const accepted = transformedProposals.find((p: any) => p.status === 'accepted');
      setAcceptedProposal(accepted || null);
    } catch (error) {
      console.error('Error loading proposals:', error);
      setProposals([]);
    }
  };

  const loadExistingReview = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('job_id', id)
        .eq('reviewer_id', user.id)
        .single();

      if (data) {
        setExistingReview(data);
        setRating(data.rating);
        setReviewText(data.review_text);
      }
    } catch (error) {
      // No review yet, that's fine
      setExistingReview(null);
    }
  };

  const handleSubmitProposal = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!proposalText.trim() || !proposalBudget.trim() || !proposalTimeline.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('proposals')
        .insert([{
          job_id: job.id,
          pro_id: user.id,
          cover_letter: proposalText,
          budget: proposalBudget,
          timeline: proposalTimeline,
          status: 'pending'
        }]);

      if (error) throw error;

      await loadProposals();
      setShowProposalForm(false);
      setProposalText('');
      setProposalBudget('');
      setProposalTimeline('');
      alert('Proposal submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting proposal:', error);
      alert('Error submitting proposal: ' + error.message);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    // Find the proposal
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;
    
    // Show payment modal
    setSelectedProposal(proposal);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Update proposal status to accepted
      const { error: proposalError } = await supabase
        .from('proposals')
        .update({ status: 'accepted' })
        .eq('id', selectedProposal.id);

      if (proposalError) throw proposalError;

      // Update job status to in_progress
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'in_progress' })
        .eq('id', job.id);

      if (jobError) throw jobError;

      // Reload data
      await loadProposals();
      await loadJob();
      
      setShowPaymentModal(false);
      setSelectedProposal(null);
    } catch (error: any) {
      console.error('Error after payment:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'rejected' })
        .eq('id', proposalId);

      if (error) throw error;
      await loadProposals();
      alert('Proposal rejected.');
    } catch (error: any) {
      console.error('Error rejecting proposal:', error);
      alert('Error rejecting proposal: ' + error.message);
    }
  };

  const handleSubmitDelivery = async () => {
    if (!deliveryNotes.trim()) {
      alert('Please provide delivery notes');
      return;
    }

    try {
      const { error: proposalError } = await supabase
        .from('proposals')
        .update({
          delivery_notes: deliveryNotes,
          delivery_date: new Date().toISOString()
        })
        .eq('id', acceptedProposal.id);

      if (proposalError) throw proposalError;

      const { error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'delivered' })
        .eq('id', job.id);

      if (jobError) throw jobError;

      await loadProposals();
      await loadJob();
      setShowDeliveryForm(false);
      setDeliveryNotes('');
      alert('Work delivered! The customer will review it.');
    } catch (error: any) {
      console.error('Error submitting delivery:', error);
      alert('Error submitting delivery: ' + error.message);
    }
  };

  const handleApproveDelivery = async () => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', job.id);

      if (error) throw error;

      await loadJob();
      alert('Job marked as complete! You can now leave a review.');
    } catch (error: any) {
      console.error('Error approving delivery:', error);
      alert('Error approving delivery: ' + error.message);
    }
  };

  const handleRequestRevision = async () => {
    const revisionNotes = prompt('Please describe what needs to be revised:');
    if (!revisionNotes) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'in_progress' })
        .eq('id', job.id);

      if (error) throw error;

      // TODO: Send message to pro with revision notes
      await loadJob();
      alert('Revision requested. The pro has been notified.');
    } catch (error: any) {
      console.error('Error requesting revision:', error);
      alert('Error requesting revision: ' + error.message);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      const revieweeId = isJobOwner ? acceptedProposal.proId : job.user_id;

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            review_text: reviewText
          })
          .eq('id', existingReview.id);

        if (error) throw error;
        alert('Review updated successfully!');
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert([{
            job_id: job.id,
            proposal_id: acceptedProposal.id,
            reviewer_id: user.id,
            reviewee_id: revieweeId,
            rating,
            review_text: reviewText
          }]);

        if (error) throw error;
        alert('Review submitted successfully!');
      }

      setShowReviewForm(false);
      await loadExistingReview();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert('Error submitting review: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Job Not Found</h1>
          <button onClick={() => navigate('/browse-jobs')} className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition">
            Browse Jobs
          </button>
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
              <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
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
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition">
          <span>←</span><span>Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
                      {job.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      job.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
                      job.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      job.status === 'delivered' ? 'bg-blue-100 text-red-700' :
                      job.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {job.status === 'open' ? '🟢 Open for Proposals' :
                       job.status === 'in_progress' ? '⏳ In Progress' :
                       job.status === 'delivered' ? '📦 Delivered - Awaiting Approval' :
                       job.status === 'completed' ? '✅ Completed' :
                       '❌ Cancelled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Budget</p>
                  <p className="font-bold text-xl text-red-500">{job.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Posted</p>
                  <p className="font-bold text-slate-900">{formatDate(job.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Location</p>
                  <p className="font-bold text-slate-900">{job.location}</p>
                </div>
              </div>
            </div>

            {/* Delivery Section - For Pro to Submit Work */}
            {isAssignedPro && job.status === 'in_progress' && (
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl shadow-md border-2 border-red-400 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">📦 Ready to Deliver?</h2>
                <p className="text-slate-600 mb-6">Submit your completed work for the customer to review.</p>
                
                {!showDeliveryForm ? (
                  <button
                    onClick={() => setShowDeliveryForm(true)}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Submit Delivery
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Delivery Notes
                      </label>
                      <textarea
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="Describe what you've completed, provide links to files, or add any important notes..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeliveryForm(false)}
                        className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitDelivery}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                      >
                        Submit Delivery
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Review Section - For Customer to Approve */}
            {isJobOwner && job.status === 'delivered' && acceptedProposal?.deliveryNotes && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md border-2 border-blue-300 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">📦 Work Delivered!</h2>
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-2">Delivered on {formatDate(acceptedProposal.deliveryDate)}</p>
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-line">{acceptedProposal.deliveryNotes}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleApproveDelivery}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                  >
                    ✓ Approve & Complete
                  </button>
                  <button
                    onClick={handleRequestRevision}
                    className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
                  >
                    Request Revision
                  </button>
                </div>
              </div>
            )}

            {/* Review Section - After Completion */}
            {job.status === 'completed' && acceptedProposal && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md border-2 border-purple-300 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">⭐ Leave a Review</h2>
                
                {existingReview ? (
                  <div className="mb-4">
                    <p className="text-emerald-600 font-semibold mb-2">✓ You left a review</p>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= existingReview.rating ? 'text-yellow-500 text-2xl' : 'text-slate-300 text-2xl'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-600 italic">"{existingReview.review_text}"</p>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="mt-4 text-red-500 hover:text-red-600 font-semibold"
                    >
                      Edit Review
                    </button>
                  </div>
                ) : (
                  <>
                    {!showReviewForm ? (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                      >
                        Write a Review
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="text-4xl hover:scale-110 transition"
                              >
                                {star <= rating ? '⭐' : '☆'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder={isJobOwner ? "How was your experience with this pro?" : "How was working with this customer?"}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-purple-500 focus:outline-none resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitReview}
                            className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                          >
                            {existingReview ? 'Update Review' : 'Submit Review'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Proposals Section */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Proposals ({proposals.length})
                </h2>
                {isPro && job.status === 'open' && (
                  <button
                    onClick={() => setShowProposalForm(true)}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Submit Proposal
                  </button>
                )}
              </div>

              {/* Proposal Form */}
              {showProposalForm && (
                <div className="mb-8 p-6 bg-sky-50 rounded-xl border-2 border-sky-200">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Your Proposal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Cover Letter</label>
                      <textarea
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                        placeholder="Explain why you're the best fit for this job..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Your Budget</label>
                        <input
                          type="text"
                          value={proposalBudget}
                          onChange={(e) => setProposalBudget(e.target.value)}
                          placeholder="e.g., $2,500"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Timeline</label>
                        <input
                          type="text"
                          value={proposalTimeline}
                          onChange={(e) => setProposalTimeline(e.target.value)}
                          placeholder="e.g., 5 weeks"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowProposalForm(false)} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition">
                        Cancel
                      </button>
                      <button onClick={handleSubmitProposal} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition">
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Proposals List */}
              <div className="space-y-6">
                {proposals.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">📝</span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No proposals yet</h3>
                    <p className="text-slate-600">
                      {isPro ? 'Be the first to submit a proposal!' : 'Waiting for pros to submit proposals...'}
                    </p>
                  </div>
                ) : (
                  proposals.map((proposal) => (
                    <div key={proposal.id} className={`border-2 rounded-2xl p-6 ${
                      proposal.status === 'accepted' ? 'border-emerald-500 bg-emerald-50' :
                      proposal.status === 'rejected' ? 'border-slate-300 bg-slate-50 opacity-60' :
                      'border-slate-200 hover:border-red-300'
                    } transition`}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {proposal.proAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-slate-900">{proposal.proName}</h3>
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span>⭐ {proposal.proRating}</span>
                                <span>•</span>
                                <span>{proposal.proJobs} jobs completed</span>
                              </div>
                            </div>
                            {proposal.status === 'accepted' && (
                              <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-semibold">✓ Accepted</span>
                            )}
                            {proposal.status === 'rejected' && (
                              <span className="px-3 py-1 bg-slate-400 text-white rounded-full text-sm font-semibold">Rejected</span>
                            )}
                          </div>
                          <p className="text-slate-600 leading-relaxed mb-4">{proposal.coverLetter}</p>
                          <div className="flex items-center gap-6 mb-4">
                            <div>
                              <p className="text-xs text-slate-600">Budget</p>
                              <p className="font-bold text-red-500">{proposal.budget}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">Timeline</p>
                              <p className="font-bold text-slate-900">{proposal.timeline}</p>
                            </div>
                            <div className="ml-auto">
                              <p className="text-xs text-slate-500">{proposal.submittedAt}</p>
                            </div>
                          </div>
                          {isJobOwner && proposal.status === 'pending' && (
                            <div className="flex gap-3">
                              <button onClick={() => handleAcceptProposal(proposal.id)} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">
                                Accept Proposal
                              </button>
                              <button onClick={() => handleRejectProposal(proposal.id)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition">
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Job Status</h3>
              
              {/* Status Progress */}
              <div className="space-y-3 mb-6">
                <div className={`flex items-center gap-3 ${job.status === 'open' || job.status === 'in_progress' || job.status === 'delivered' || job.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className="text-2xl">✓</span>
                  <span className="font-semibold">Posted</span>
                </div>
                <div className={`flex items-center gap-3 ${job.status === 'in_progress' || job.status === 'delivered' || job.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className="text-2xl">{job.status === 'in_progress' || job.status === 'delivered' || job.status === 'completed' ? '✓' : '○'}</span>
                  <span className="font-semibold">In Progress</span>
                </div>
                <div className={`flex items-center gap-3 ${job.status === 'delivered' || job.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className="text-2xl">{job.status === 'delivered' || job.status === 'completed' ? '✓' : '○'}</span>
                  <span className="font-semibold">Delivered</span>
                </div>
                <div className={`flex items-center gap-3 ${job.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className="text-2xl">{job.status === 'completed' ? '✓' : '○'}</span>
                  <span className="font-semibold">Completed</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Posted</span>
                  <span className="font-semibold text-slate-900">{formatDate(job.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Proposals</span>
                  <span className="font-semibold text-slate-900">{proposals.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Location</span>
                  <span className="font-semibold text-slate-900 text-right text-sm">{job.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedProposal && (
        <PaymentModal
          commission={{
            id: job.id,
            title: job.title,
            budget: parseFloat(selectedProposal.budget.toString().replace(/[$,]/g, '')) || 0,
            workerName: selectedProposal.proName,
            workerId: selectedProposal.proId
          }}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedProposal(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}