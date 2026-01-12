import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import AuthPage from './pages/Authpage';
import Profile from './pages/Profile';
import PricingPage from './pages/PricingPage';
import Browse from './pages/Browse';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import BrowseJobs from './pages/BrowseJobs';
import CategoryPage from './pages/CategoryPage';
import ProProfile from './pages/ProProfile';
import Messages from './pages/Messages';
import ListsPage from './pages/ListPage';
import JobDetail from './pages/JobDetail';
import MyProposals from './pages/MyProposals';
import MyProjects from './pages/MyProjects';
import ProfileEdit from './pages/ProfileEdit';


function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      // Only redirect if we're on the auth page
      if (session?.user && window.location.pathname === '/auth') {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-900">Loading...</div>
      </div>
    );
  }

  return (
   <Routes>
  <Route path="/" element={<Home user={user} onSignOut={handleSignOut} />} />
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/profile" element={<Profile user={user} onSignOut={handleSignOut} />} />
  <Route path="/profile/edit" element={<ProfileEdit user={user} onSignOut={handleSignOut} />} />
  <Route path="/pricing" element={<PricingPage user={user} onSignOut={handleSignOut} />} />
  <Route path="/browse" element={<Browse user={user} onSignOut={handleSignOut} />} />
  <Route path="/dashboard" element={<Dashboard user={user} onSignOut={handleSignOut} />} />
  <Route path="/post-job" element={<PostJob user={user} onSignOut={handleSignOut} />} />
  <Route path="/my-jobs" element={<MyJobs user={user} onSignOut={handleSignOut} />} />
  <Route path="/browse-jobs" element={<BrowseJobs user={user} onSignOut={handleSignOut} />} />
  <Route path="/category/:category" element={<CategoryPage user={user} onSignOut={handleSignOut} />} />
  <Route path="/pro/:id" element={<ProProfile user={user} onSignOut={handleSignOut} />} />
  <Route path="/messages" element={<Messages user={user} onSignOut={handleSignOut} />} />
  <Route path="/lists" element={<ListsPage user={user} onSignOut={handleSignOut} />} />
  <Route path="/job/:id" element={<JobDetail user={user} onSignOut={handleSignOut} />} />
  <Route path="/my-proposals" element={<MyProposals user={user} onSignOut={handleSignOut} />} />
  <Route path="/my-projects" element={<MyProjects user={user} onSignOut={handleSignOut} />} />
</Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;