import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type UserType = 'customer' | 'pro';

export default function Auth() {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state?.mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<UserType>('customer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Pro signup - Step 2 fields
  const [showProDetails, setShowProDetails] = useState(false);
  const [yearsExperience, setYearsExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [bio, setBio] = useState('');
  const [location2, setLocation2] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState<File | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If pro signup and haven't filled details yet, show step 2
    if (isSignUp && userType === 'pro' && !showProDetails) {
      setShowProDetails(true);
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // Step 1: Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              user_type: userType,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Step 2: Upload resume if provided
          let resumeUrl = null;
          if (resume) {
            const fileExt = resume.name.split('.').pop();
            const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('resumes')
              .upload(fileName, resume);

            if (uploadError) {
              console.error('Resume upload error:', uploadError);
            } else {
              const { data: urlData } = supabase.storage
                .from('resumes')
                .getPublicUrl(fileName);
              resumeUrl = urlData.publicUrl;
            }
          }

          // Step 3: Create profile with all details
          const profileData: any = {
            id: authData.user.id,
            full_name: name,
            user_type: userType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Add pro-specific fields
          if (userType === 'pro') {
            profileData.years_experience = parseInt(yearsExperience) || 0;
            profileData.hourly_rate = hourlyRate;
            profileData.skills = skills;
            profileData.bio = bio;
            profileData.location = location2;
            profileData.phone = phone;
            profileData.resume_url = resumeUrl;
          }

          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            setMessage('Account created! Profile setup pending. You can complete it later.');
          } else {
            setMessage('Success! Check your email to verify your account.');
          }
        }
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        setMessage('Logged in successfully!');
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setResume(file);
      } else {
        alert('Please upload a PDF file under 10MB');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl border-2 border-slate-200">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">●</span>
          </div>
          <span className="font-bold text-slate-900 text-2xl">Nearly</span>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          {isSignUp ? (showProDetails ? 'Complete Your Profile' : 'Create Account') : 'Welcome Back'}
        </h2>
        <p className="text-slate-600 text-center mb-8">
          {isSignUp 
            ? (showProDetails ? 'Tell us about your skills and experience' : 'Join the Nearly community')
            : 'Sign in to your account'
          }
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('Success') || message.includes('successfully') || message.includes('created')
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {/* Step 1: Basic Info (always shown for signup) */}
          {isSignUp && !showProDetails && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('customer')}
                    className={`py-3 rounded-xl font-medium transition ${
                      userType === 'customer'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('pro')}
                    className={`py-3 rounded-xl font-medium transition ${
                      userType === 'pro'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Pro/Maker
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          {/* Step 2: Pro Details (only for pro signup) */}
          {isSignUp && showProDetails && userType === 'pro' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="5"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Hourly Rate
                  </label>
                  <input
                    type="text"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="$50/hour"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., Woodworking)"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-sky-900 hover:text-orange-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your work..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location2}
                    onChange={(e) => setLocation2(e.target.value)}
                    placeholder="San Diego, CA"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Resume / CV (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-orange-600 hover:file:bg-orange-50"
                />
                <p className="text-xs text-slate-500 mt-1">PDF only, max 10MB</p>
              </div>

              <button
                type="button"
                onClick={() => setShowProDetails(false)}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm"
              >
                ← Back to basic info
              </button>
            </>
          )}

          {/* Login Form */}
          {!isSignUp && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? 'Loading...' 
              : isSignUp 
                ? (showProDetails ? 'Complete Sign Up' : (userType === 'pro' ? 'Next: Add Details' : 'Sign Up'))
                : 'Sign In'
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setShowProDetails(false);
              setMessage('');
            }}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}