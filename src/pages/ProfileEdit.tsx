import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProfileDropdown from '../components/ProfileDropdown';

interface ProfileEditProps {
  user: any;
  onSignOut: () => void;
}

export default function ProfileEdit({ user, onSignOut }: ProfileEditProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Basic fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // Pro fields
  const [hourlyRate, setHourlyRate] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  
  // Files
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [existingPortfolio, setExistingPortfolio] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [existingCerts, setExistingCerts] = useState<string[]>([]);

  const isPro = user?.user_metadata?.user_type === 'pro';

  useEffect(() => {
    loadProfile();
  }, [user.id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFullName(data.full_name || '');
      setBio(data.bio || '');
      setPhone(data.phone || '');
      setLocation(data.location || '');
      setAvatarPreview(data.avatar_url || '');
      setHourlyRate(data.hourly_rate || '');
      setYearsExperience(data.years_experience?.toString() || '');
      setSkills(data.skills || []);
      setResumeUrl(data.resume_url || '');
      setExistingPortfolio(data.portfolio_images || []);
      setExistingCerts(data.certifications || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setResume(file);
      } else {
        alert('Please upload a PDF under 10MB');
      }
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isUnder5MB = file.size <= 5 * 1024 * 1024;
        return isImage && isUnder5MB;
      });
      setPortfolioImages(prev => [...prev, ...validFiles]);
    }
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isPDF = file.type === 'application/pdf';
        const isUnder10MB = file.size <= 10 * 1024 * 1024;
        return isPDF && isUnder10MB;
      });
      setCertifications(prev => [...prev, ...validFiles]);
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPortfolio = (url: string) => {
    setExistingPortfolio(prev => prev.filter(u => u !== url));
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingCert = (url: string) => {
    setExistingCerts(prev => prev.filter(u => u !== url));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = avatarPreview;
      let newResumeUrl = resumeUrl;
      let portfolioUrls = [...existingPortfolio];
      let certUrls = [...existingCerts];

      // Upload avatar
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatar, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatarUrl = data.publicUrl;
        }
      }

      // Upload resume
      if (resume) {
        const fileExt = resume.name.split('.').pop();
        const fileName = `${user.id}-resume-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resume, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('resumes').getPublicUrl(fileName);
          newResumeUrl = data.publicUrl;
        }
      }

      // Upload portfolio images
      for (const file of portfolioImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-portfolio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
          portfolioUrls.push(data.publicUrl);
        }
      }

      // Upload certifications
      for (const file of certifications) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('certifications')
          .upload(fileName, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('certifications').getPublicUrl(fileName);
          certUrls.push(data.publicUrl);
        }
      }

      // Update profile
      const updates: any = {
        full_name: fullName,
        bio,
        phone,
        location,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      if (isPro) {
        updates.hourly_rate = hourlyRate;
        updates.years_experience = parseInt(yearsExperience) || 0;
        updates.skills = skills;
        updates.resume_url = newResumeUrl;
        updates.portfolio_images = portfolioUrls;
        updates.certifications = certUrls;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
            </div>
            <ProfileDropdown user={user} onSignOut={onSignOut} />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Edit Profile</h1>
          <p className="text-slate-600">Update your information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-300 to-red-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0).toUpperCase() || '?'
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-red-600 hover:file:bg-red-50"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                    placeholder="San Diego, CA"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pro Fields */}
          {isPro && (
            <>
              {/* Skills & Expertise */}
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Skills & Expertise</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Add Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="e.g., Woodworking, Design, Photography"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-sky-900 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Hourly Rate</label>
                    <input
                      type="text"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="$50/hour"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Resume / CV</h2>
                {resumeUrl && (
                  <div className="mb-3 p-3 bg-green-50 rounded-xl text-green-700">
                    ✅ Resume uploaded - <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-red-600 hover:file:bg-red-50"
                />
                <p className="text-xs text-slate-500 mt-1">PDF only, max 10MB</p>
              </div>

              {/* Portfolio Images */}
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Portfolio Images</h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePortfolioChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-red-600 hover:file:bg-red-50"
                />
                <p className="text-xs text-slate-500 mt-1">Images only, max 5MB each</p>
                
                {/* Existing portfolio */}
                {existingPortfolio.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Current Images:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {existingPortfolio.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-32 object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => removeExistingPortfolio(url)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New portfolio */}
                {portfolioImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">New Images to Upload:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {portfolioImages.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-32 object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => removePortfolioImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Certifications & Licenses</h2>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleCertificationsChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-red-600 hover:file:bg-red-50"
                />
                <p className="text-xs text-slate-500 mt-1">PDF only, max 10MB each</p>

                {/* Existing certs */}
                {existingCerts.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Current Certifications:</p>
                    <div className="space-y-2">
                      {existingCerts.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                            📄 Certificate {idx + 1}
                          </a>
                          <button
                            type="button"
                            onClick={() => removeExistingCert(url)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New certs */}
                {certifications.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">New Certifications to Upload:</p>
                    <div className="space-y-2">
                      {certifications.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                          <span className="text-green-700">📄 {file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeCertification(idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}