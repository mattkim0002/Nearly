import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';
import ReportUserModal from '../components/ReportUserModal';

interface ProfileProps {
  user: any;
  onSignOut: () => void;
}

export default function Profile({ user, onSignOut }: ProfileProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);

  const userType = user?.user_metadata?.user_type || 'customer';
  const isPro = userType === 'pro';

  useEffect(() => {
    loadProfile();
    loadReviews();
  }, [user.id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)')
        .eq('reviewee_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-5xl mb-4 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile?.full_name?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {profile?.full_name || 'User'}
                </h1>
                <p className="text-slate-600 mb-4">{profile?.location || 'Location not set'}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-full">
                    {isPro ? '⭐ Pro Maker' : '👤 Customer'}
                  </span>
                  {profile?.email_verified && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              {isPro && (
                <div className="space-y-3 pt-6 border-t border-slate-200 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Rating</span>
                    <span className="font-bold text-slate-900">
                      ⭐ {profile?.average_rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Reviews</span>
                    <span className="font-bold text-slate-900">{profile?.total_reviews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Completed Jobs</span>
                    <span className="font-bold text-slate-900">{profile?.completed_jobs || 0}</span>
                  </div>
                  {profile?.hourly_rate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Hourly Rate</span>
                      <span className="font-bold text-emerald-600">{profile.hourly_rate}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Edit Profile
                </button>
                
                {/* Report Button - Only show on other users' profiles in production */}
                {/* For now, always visible for testing */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full py-3 rounded-xl bg-white border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
                >
                  <span>🚩</span>
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Skills */}
            {isPro && profile?.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
              {profile?.bio ? (
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
              ) : (
                <p className="text-slate-400 italic">No bio added yet. Click Edit Profile to add one.</p>
              )}
            </div>

            {/* Portfolio */}
            {isPro && profile?.portfolio_images && profile.portfolio_images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.portfolio_images.map((url: string, index: number) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={url}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">⭐</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews yet</h3>
                  <p className="text-slate-600">
                    {isPro ? 'Complete your first job to get reviews!' : 'Post jobs and work with pros to leave reviews!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-200 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {review.reviewer?.avatar_url ? (
                            <img src={review.reviewer.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            review.reviewer?.full_name?.charAt(0)?.toUpperCase() || '?'
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-bold text-slate-900">{review.reviewer?.full_name || 'Anonymous'}</p>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-slate-300'}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-slate-500">{formatDate(review.created_at)}</span>
                          </div>
                          <p className="text-slate-600">{review.review_text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportUserModal
          reportedUserId={user.id}
          reportedUserName={profile?.full_name || 'User'}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}