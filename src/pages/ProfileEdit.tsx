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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  // Profile data
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Pro-specific
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

  const userType = user?.user_metadata?.user_type || 'customer';
  const isPro = userType === 'pro';

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

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setBio(data.bio || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
        setAvatarUrl(data.avatar_url || '');
        setSkills(data.skills || []);
        setHourlyRate(data.hourly_rate || '');
        setYearsExperience(data.years_experience?.toString() || '');
        setPortfolioImages(data.portfolio_images || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      alert('Avatar uploaded! Click Save Profile to update.');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar: ' + error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const uploadPortfolioImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingPortfolio(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setPortfolioImages([...portfolioImages, publicUrl]);
      alert('Portfolio image uploaded! Click Save Profile to update.');
    } catch (error: any) {
      console.error('Error uploading portfolio image:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const removePortfolioImage = (index: number) => {
    const newImages = portfolioImages.filter((_, i) => i !== index);
    setPortfolioImages(newImages);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const updates = {
        id: user.id,
        full_name: fullName,
        bio,
        phone,
        location,
        avatar_url: avatarUrl,
        user_type: userType,
        updated_at: new Date().toISOString(),
        ...(isPro && {
          skills,
          hourly_rate: hourlyRate,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          portfolio_images: portfolioImages
        })
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
            <span>←</span><span>Back to Profile</span>
          </button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Edit Profile</h1>
          <p className="text-slate-600">Update your profile information and settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white font-bold text-4xl overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  fullName?.charAt(0)?.toUpperCase() || '?'
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-2">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploadingAvatar}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                </label>
                {uploadingAvatar && <p className="text-sm text-sky-600">Uploading...</p>}
                <p className="text-sm text-slate-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={isPro ? "Tell customers about yourself and your experience..." : "Tell pros about what you're looking for..."}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Diego, CA"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pro-Specific Fields */}
          {isPro && (
            <>
              {/* Skills */}
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills & Expertise</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Add Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        placeholder="e.g., Woodworking, Design, Photography"
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                      <button
                        onClick={addSkill}
                        className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:text-sky-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Hourly Rate</label>
                      <input
                        type="text"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="e.g., $50/hour"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="e.g., 5"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio */}
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Portfolio</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="sr-only">Upload portfolio image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadPortfolioImage}
                      disabled={uploadingPortfolio}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                  </label>
                  {uploadingPortfolio && <p className="text-sm text-emerald-600">Uploading...</p>}

                  {portfolioImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {portfolioImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-40 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => removePortfolioImage(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 py-4 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 py-4 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:bg-slate-400"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

