import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface PostJobProps {
  user: any;
  onSignOut: () => void;
}

const CATEGORIES = [
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

export default function PostJob({ user, onSignOut }: PostJobProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Insert job into database
      const { data, error: insertError } = await supabase
        .from('jobs')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            category,
            budget,
            location,
            zip_code: zipCode,
            status: 'open',
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess(true);
      
      // Redirect to My Jobs after 2 seconds
      setTimeout(() => {
        navigate('/my-jobs');
      }, 2000);

    } catch (err: any) {
      console.error('Error posting job:', err);
      setError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
            </div>

            <div className="flex items-center gap-4">
              <ProfileDropdown user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="font-bold text-emerald-900 text-lg">Job Posted Successfully!</h3>
                <p className="text-emerald-700">Redirecting you to your jobs...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-900 text-lg">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Post a Job</h1>
          <p className="text-slate-600 mb-8">Tell local pros about your project and get quotes</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Custom dining table needed"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-slate-900"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-slate-900"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Project Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project in detail. Include dimensions, materials, timeline, and any specific requirements..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none resize-none text-slate-900"
                required
              />
              <p className="text-sm text-slate-500 mt-2">
                {description.length} characters (min 50 recommended)
              </p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Budget Range *
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., $500-$1000"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-slate-900"
                required
              />
              <p className="text-sm text-slate-500 mt-2">
                This helps pros send accurate quotes
              </p>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., North Park, San Diego"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Zip Code *
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g., 92104"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none text-slate-900"
                  required
                  maxLength={5}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold text-lg hover:bg-sky-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting Job...' : 'Post Job for Free'}
              </button>
            </div>

            <p className="text-sm text-slate-500 text-center">
              By posting, you agree to receive quotes from local pros. You can review and compare before hiring.
            </p>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-200">
            <span className="text-2xl mb-2 block">💰</span>
            <h3 className="font-bold text-slate-900 mb-1">Free to Post</h3>
            <p className="text-sm text-slate-600">No charges until you hire someone</p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200">
            <span className="text-2xl mb-2 block">⚡</span>
            <h3 className="font-bold text-slate-900 mb-1">Fast Responses</h3>
            <p className="text-sm text-slate-600">Get quotes within 24 hours</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
            <span className="text-2xl mb-2 block">🔒</span>
            <h3 className="font-bold text-slate-900 mb-1">Secure Payment</h3>
            <p className="text-sm text-slate-600">Money held in escrow</p>
          </div>
        </div>
      </div>
    </div>
  );
}