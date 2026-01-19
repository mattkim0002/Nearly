import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProOnboardingProps {
  user: any;
}

export default function ProOnboarding({ user }: ProOnboardingProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Step 1: Welcome & Platform Role
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Step 2: Profile Info
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  
  // Step 3: Pricing & Availability
  const [hourlyRate, setHourlyRate] = useState('');
  const [availability, setAvailability] = useState('full-time');
  
  const [loading, setLoading] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && skills.length < 10) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Update user profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio: bio,
          skills: skills,
          hourly_rate: hourlyRate,
          availability: availability,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (error) throw error;

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step > num ? '✓' : num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 ${step > num ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-2">
            <span className={`text-sm ${step >= 1 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>Welcome</span>
            <span className={`text-sm ${step >= 2 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>Profile</span>
            <span className={`text-sm ${step >= 3 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>Details</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-8 md:p-12">
          
          {/* STEP 1: Welcome & Platform Understanding */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-3xl">👋</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Welcome to Nearly!</h1>
                <p className="text-lg text-slate-600">Let's get you set up to start finding commissions</p>
              </div>

              {/* Platform Role Education - CRITICAL */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
                <div className="flex gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-3">Important: Understand Nearly's Role</h3>
                    <p className="text-slate-700 mb-3">
                      Nearly is a platform that <strong>facilitates connections and payment processing only</strong>. Here's what that means for you:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-sky-600 mt-0.5">•</span>
                        <span><strong>You are an independent worker</strong> - not an employee of Nearly. You control your own schedule, pricing, and how you perform services.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-600 mt-0.5">•</span>
                        <span><strong>Nearly does not guarantee outcomes</strong> - You are responsible for delivering quality work that meets the terms you agree to with clients.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-600 mt-0.5">•</span>
                        <span><strong>Payment is released per agreed terms</strong> - Clients approve work based on your agreement together. Nearly holds funds but doesn't determine completion.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-600 mt-0.5">•</span>
                        <span><strong>Reviews come from users, not Nearly</strong> - Build your reputation by delivering great work to clients.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">How Nearly Works:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="font-bold text-sky-600">1.</span>
                    <span className="text-slate-700"><strong>Browse Commissions:</strong> Find work that matches your skills in your area</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-sky-600">2.</span>
                    <span className="text-slate-700"><strong>Submit Proposals:</strong> Send your budget, timeline, and why you're the best fit</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-sky-600">3.</span>
                    <span className="text-slate-700"><strong>Get Hired:</strong> When a client accepts your proposal, payment goes into escrow</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-sky-600">4.</span>
                    <span className="text-slate-700"><strong>Complete Work:</strong> Deliver according to your agreed terms and submit for review</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-sky-600">5.</span>
                    <span className="text-slate-700"><strong>Get Paid:</strong> Once the client approves, payment is released to you</span>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-sky-300 transition mb-6">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">
                  I understand that I am an independent worker, not an employee of Nearly. I am responsible for delivering quality work that meets the terms I agree to with clients. Nearly facilitates connections and payment processing only and does not guarantee outcomes.
                </span>
              </label>

              <button
                onClick={() => setStep(2)}
                disabled={!agreedToTerms}
                className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed text-lg"
              >
                Continue to Profile Setup
              </button>
            </>
          )}

          {/* STEP 2: Profile Information */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Build Your Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g., Sarah Johnson"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Professional Bio *
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell clients about your experience, expertise, and what makes you great at what you do..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    💡 Tip: Profiles with detailed bios get 2x more responses!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Skills & Expertise *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="e.g., Woodworking, Logo Design, etc."
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-2 bg-sky-100 text-sky-700 rounded-full">
                          <span className="text-sm font-semibold">{skill}</span>
                          <button
                            onClick={() => handleRemoveSkill(index)}
                            className="text-sky-600 hover:text-sky-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!displayName || !bio || skills.length === 0}
                  className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Pricing & Availability */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Pricing & Availability</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Hourly Rate (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-600 font-semibold">$</span>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="50"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    This is just a guideline - you'll set your price for each proposal
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="full-time">Full-time (40+ hours/week)</option>
                    <option value="part-time">Part-time (20-40 hours/week)</option>
                    <option value="occasional">Occasional (Less than 20 hours/week)</option>
                  </select>
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700">
                    <strong>💡 Next Steps:</strong> After completing setup, add portfolio examples to your profile to showcase your work. Profiles with portfolios get 5x more proposals accepted!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-50"
                >
                  {loading ? 'Completing...' : 'Complete Setup'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}