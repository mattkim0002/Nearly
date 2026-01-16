import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

// Mock provider data
const PROVIDERS = [
  {
    id: 1,
    name: "Atlas Woodworks",
    service: "Woodworking",
    location: "North Park, San Diego",
    distance: "2.1 mi",
    rating: 4.9,
    jobs: 32,
    startingAt: "$450",
    verified: true,
  },
  {
    id: 2,
    name: "Seafoam Ceramics",
    service: "Ceramics",
    location: "Ocean Beach, San Diego",
    distance: "3.4 mi",
    rating: 4.8,
    jobs: 18,
    startingAt: "$120",
    verified: true,
  },
  {
    id: 3,
    name: "Golden Hour Photo",
    service: "Photography",
    location: "Downtown, San Diego",
    distance: "1.7 mi",
    rating: 5.0,
    jobs: 54,
    startingAt: "$250",
    verified: true,
  },
  {
    id: 4,
    name: "Palette & Co.",
    service: "Painting (Art)",
    location: "South Park, San Diego",
    distance: "4.0 mi",
    rating: 4.7,
    jobs: 21,
    startingAt: "$300",
    verified: true,
  },
  {
    id: 5,
    name: "Pixelwave Studio",
    service: "Web Design",
    location: "La Jolla, San Diego",
    distance: "7.2 mi",
    rating: 4.9,
    jobs: 40,
    startingAt: "$900",
    verified: true,
  },
  {
    id: 6,
    name: "North Star Logos",
    service: "Logo Design",
    location: "Mission Valley, San Diego",
    distance: "5.3 mi",
    rating: 4.8,
    jobs: 27,
    startingAt: "$280",
    verified: true,
  },
];

const SERVICES = [
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

// Dropdown menu data
const HIRE_TALENT_CATEGORIES = [
  {
    title: "Crafts & Making",
    items: ["Woodworkers", "Ceramicists", "Metalworkers", "Jewelry Makers", "Leather Crafters"]
  },
  {
    title: "Creative Services",
    items: ["Photographers", "Illustrators", "Painters", "Logo Designers", "Graphic Designers"]
  },
  {
    title: "Digital Services",
    items: ["Web Designers", "Web Developers", "UI/UX Designers", "App Developers"]
  }
];

const FIND_WORK_ITEMS = [
  "Browse All Commissions",
  "Woodworking Tasks",
  "Design Tasks",
  "Photography Assistance",
  "How to Get Started",
  "Success Stories"
];

interface HomeProps {
  user: any;
  onSignOut: () => void;
}

export default function Home({ user, onSignOut }: HomeProps) {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [showHireTalent, setShowHireTalent] = useState(false);
  const [showFindWork, setShowFindWork] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<any>(null);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth', { state: { mode: 'signup' } });
      return;
    }
    alert('Commission posted! (This is a demo)');
  };

  const handleViewProfile = () => {
    if (!user) {
      navigate('/auth', { state: { mode: 'signup' } });
    } else {
      alert('Profile view coming soon!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-white text-slate-900">
      {/* Decorative background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.1),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
     <header className="flex items-center gap-8 py-6">
  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
    <div className="h-10 w-10 rounded-xl bg-white shadow-md border border-sky-200 flex items-center justify-center">
      <span className="text-sky-600 font-bold text-xl">●</span>
    </div>
    <span className="font-bold text-slate-900 text-xl">Nearly</span>
  </div>
  
  <nav className="flex items-center gap-8 text-sm font-medium flex-1">
    {/* Hire Talent Dropdown */}
<div 
  className="relative"
  onMouseEnter={() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setShowHireTalent(true);
  }}
  onMouseLeave={() => {
    const timeout = setTimeout(() => setShowHireTalent(false), 300);
    setHoverTimeout(timeout);
  }}
>
  <button className="flex items-center gap-1 hover:text-sky-600 transition">
    Hire Talent
    <span className={`transform transition-transform text-xs ${showHireTalent ? 'rotate-180' : ''}`}>
      ▼
    </span>
  </button>
  
  {/* Dropdown Menu */}
  {showHireTalent && (
    <div className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-8 animate-fadeIn z-50">
      <div className="grid grid-cols-3 gap-8">
        {HIRE_TALENT_CATEGORIES.map((category) => (
          <div key={category.title}>
            <h3 className="font-bold text-slate-900 mb-3">{category.title}</h3>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item}>
                  <button className="text-slate-600 hover:text-sky-600 transition text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-slate-200 flex gap-4">
        <button className="text-emerald-600 hover:text-emerald-700 font-semibold">
          Explore all services →
        </button>
        <button 
          onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
          className="text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          Post a commission →
        </button>
      </div>
    </div>
  )}
</div>

  {/* Find Work Dropdown */}
<div 
  className="relative"
  onMouseEnter={() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setShowFindWork(true);
  }}
  onMouseLeave={() => {
    const timeout = setTimeout(() => setShowFindWork(false), 300);
    setHoverTimeout(timeout);
  }}
>
  <button className="flex items-center gap-1 hover:text-sky-600 transition">
    Find Work
    <span className={`transform transition-transform text-xs ${showFindWork ? 'rotate-180' : ''}`}>
      ▼
    </span>
  </button>
  
  {/* Dropdown Menu */}
  {showFindWork && (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-4 animate-fadeIn z-50">
      <ul className="space-y-2">
        {FIND_WORK_ITEMS.map((item) => (
          <li key={item}>
            <button className="w-full text-left px-4 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition">
              {item}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <button 
          onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
          className="w-full text-left px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition font-semibold"
        >
          Sign up as a Pro →
        </button>
      </div>
    </div>
  )}
</div>

    <button onClick={() => navigate('/pricing')} className="hover:text-sky-600 transition">
      Pricing
    </button>
    
    <a href="#how" className="hover:text-sky-600 transition">How it Works</a>
    
<div className="ml-auto flex items-center gap-4">
  {user ? (
    <ProfileDropdown user={user} onSignOut={onSignOut} />
  ) : (
    <>
      <button
        onClick={() => navigate('/auth')}
        className="px-5 py-2.5 text-slate-700 hover:text-sky-600 transition font-medium"
      >
        Log In
      </button>
      <button
        onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
        className="px-5 py-2.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition shadow-lg"
      >
        Sign Up
      </button>
    </>
  )}
</div>
  </nav>
</header>

        {/* Hero Section */}
        <section className="pt-16 pb-24 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight max-w-4xl mx-auto">
            Connect with independent local talent for{' '}
            <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              hands-on work
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Commission local makers, pay through escrow, and support skilled help in your community.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
  onClick={() => document.getElementById('post-job')?.scrollIntoView({ behavior: 'smooth' })}
  className="px-8 py-4 text-lg font-semibold rounded-full bg-sky-600 text-white hover:bg-sky-700 transition shadow-xl shadow-sky-200"
>
  Post a Commission — Free
</button>
<button 
  onClick={() => navigate('/browse')}
  className="px-8 py-4 text-lg font-semibold rounded-full bg-white text-slate-900 hover:bg-slate-50 transition border-2 border-slate-200"
>
Browse Local Talent
</button>
          </div>
        </section>

        {/* Popular Services */}
        <section id="services" className="py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Popular Services</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICES.map((service) => (
              <div
                key={service}
                onClick={() => navigate(`/category/${service.toLowerCase().replace(/\s+/g, '-')}`)}
                className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-sky-400 hover:shadow-lg transition cursor-pointer text-center font-medium"
              >
                {service}
              </div>
            ))}
          </div>
        </section>

        {/* Local Strip */}
        <section className="py-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 border border-emerald-300 rounded-full">
            <span className="text-2xl">📍</span>
            <span className="font-semibold text-emerald-900">
              Supporting local makers in San Diego
            </span>
          </div>
        </section>

        {/* Available Providers */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Independent Local Talent
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-sky-400 hover:shadow-xl transition p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{provider.name}</h3>
                    <p className="text-sm text-slate-600">{provider.service}</p>
                  </div>
                  {provider.verified && (
                    <span className="text-sky-600 text-xl" title="Profile verified">✓</span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <p>📍 {provider.location} · {provider.distance}</p>
                  <p>⭐ {provider.rating} · {provider.jobs} commissions</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="font-semibold text-slate-900">From {provider.startingAt}</span>
                  <button
                    onClick={handleViewProfile}
                    className="px-4 py-2 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 transition font-medium text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="py-16 bg-white rounded-3xl shadow-xl my-16 px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Post Your Commission</h3>
              <p className="text-slate-600">Describe the scope and set your budget</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Review Proposals</h3>
              <p className="text-slate-600">Independent workers send you offers and portfolios</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Pay Securely</h3>
              <p className="text-slate-600">Money held in escrow per agreed terms</p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section id="mission" className="py-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            We're building a platform that connects communities with talented local makers and service providers. 
            Every commission posted supports small businesses and keeps money circulating in your neighborhood.
          </p>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Simple, Fair Pricing</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold mb-2">For Clients</h3>
              <p className="text-4xl font-bold text-sky-600 mb-4">Free</p>
              <p className="text-slate-600 mb-6">Post unlimited commissions at no cost</p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Post unlimited commissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure escrow payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>24/7 support</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-sky-600 to-blue-600 rounded-2xl border-2 border-sky-700 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">For Independent Workers</h3>
              <p className="text-4xl font-bold mb-4">8% fee</p>
              <p className="opacity-90 mb-6">Only charged on paid commissions</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">✓</span>
                  <span>Unlimited proposals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">✓</span>
                  <span>Profile & portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-200">✓</span>
                  <span>Client reviews & ratings</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Post Job Form */}
        <section id="post-job" className="py-16 mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-3xl mx-auto border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Post a Commission</h2>
            <p className="text-slate-600 text-center mb-8">Connect with local talent in minutes</p>
            
            <form onSubmit={handlePostJob} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  What assistance do you need?
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Dining table build assistance"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Scope Details
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Describe the scope and tasks in detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Budget Range
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., $500-$1000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold text-lg hover:bg-sky-700 transition shadow-lg"
              >
                {user ? 'Post Commission for Free' : 'Sign In to Post Commission'}
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold">●</span>
              </div>
              <span className="font-semibold text-slate-900">Nearly</span>
            </div>
            
            <div className="flex gap-8 text-sm text-slate-600">
              <a href="#" className="hover:text-sky-600">About</a>
              <a href="#" className="hover:text-sky-600">Terms</a>
              <a href="#" className="hover:text-sky-600">Privacy</a>
              <a href="#" className="hover:text-sky-600">Contact</a>
            </div>
            
            <p className="text-sm text-slate-500">© 2024 Nearly. All rights reserved.</p>
          </div>
        </footer>

      </div>

      {/* Add fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </main>
  );
}