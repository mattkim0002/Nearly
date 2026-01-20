import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

interface ProProfileProps {
  user: any;
  onSignOut: () => void;
}

// Enhanced provider data
const ALL_PROVIDERS: any[] = [
  {
    id: 1,
    name: "Michael Chen",
    title: "Award-Winning Furniture Maker",
    service: "Woodworking",
    location: "North Park, San Diego",
    zipCode: "92104",
    distance: 2.1,
    rating: 4.9,
    totalReviews: 45,
    jobs: 32,
    startingAt: "$450",
    verified: true,
    topRated: true,
    description: "Award-winning custom furniture maker specializing in sustainable hardwoods",
    bio: "I'm a passionate woodworker with over 12 years of experience creating custom furniture and cabinetry for residential and commercial clients throughout San Diego. My work has been featured in San Diego Home & Garden Magazine and I've won multiple awards at local craft shows.\n\nI specialize in working with sustainable hardwoods and creating pieces that will last generations. Every commission begins with a consultation to understand your vision, followed by detailed design sketches and material selection. I take pride in my attention to detail and commitment to excellence.\n\nWhat sets me apart is my combination of traditional craftsmanship techniques with modern design sensibilities. Whether you're looking for a statement dining table, custom built-ins, or a complete home office, I'll work closely with you to bring your vision to life.",
    skills: ["Custom Furniture Design", "Fine Cabinetry", "Wood Carving", "Furniture Restoration", "Live Edge Work", "Sustainable Materials"],
    certifications: ["Master Craftsman - 2020", "EPA Lead-Safe Certified - 2019", "OSHA Safety Certified - 2018"],
    languages: ["English", "Mandarin"],
    available: true,
    responseTime: "Within 2 hours",
    averageDelivery: "3-4 weeks",
    responseRate: "100%",
    repeatClientRate: "85%",
    onTimeDelivery: "98%",
    memberSince: "2018",
    totalEarnings: "$145,000+",
    packages: [
      {
        name: "Basic",
        price: "$450",
        delivery: "3 weeks",
        features: ["Simple furniture piece", "1 design revision", "Basic finish", "Sanding & assembly"],
        description: "Perfect for small tasks like side tables or shelves"
      },
      {
        name: "Standard",
        price: "$1,200",
        delivery: "4 weeks",
        features: ["Medium complexity commission", "3 design revisions", "Premium finish", "Delivery & setup", "1 month support"],
        popular: true,
        description: "Ideal for dining tables, desks, or bedroom sets"
      },
      {
        name: "Premium",
        price: "$3,500+",
        delivery: "6-8 weeks",
        features: ["Complex custom commission", "Unlimited revisions", "Exhibition-quality finish", "White glove delivery", "1 year warranty", "Maintenance kit"],
        description: "For statement pieces and full room installations"
      },
    ],
    portfolio: [
      { id: 1, title: "Live Edge Dining Table", image: "🪑", description: "8-foot walnut dining table with custom steel base", price: "$2,800", year: "2024" },
      { id: 2, title: "Kitchen Renovation", image: "🏠", description: "Complete kitchen cabinetry in cherry wood", price: "$15,000", year: "2024" },
      { id: 3, title: "Custom Bookshelf", image: "📚", description: "Floor-to-ceiling built-in library", price: "$4,500", year: "2023" },
      { id: 4, title: "Office Desk", image: "💼", description: "Standing desk with integrated storage", price: "$1,800", year: "2023" },
      { id: 5, title: "Bedroom Set", image: "🛏️", description: "Bed frame, nightstands, and dresser", price: "$5,200", year: "2023" },
      { id: 6, title: "Coffee Table", image: "☕", description: "Mid-century modern coffee table", price: "$950", year: "2022" },
    ],
    reviews: [
      {
        id: 1,
        author: "Sarah Johnson",
        avatar: "SJ",
        rating: 5,
        date: "2 weeks ago",
        project: "Custom Dining Table - $2,800",
        comment: "Michael created a beautiful custom dining table for our home. The craftsmanship is exceptional and he was very professional throughout the process. He listened to our needs and the table is the centerpiece of our home!",
        helpful: 12
      },
      {
        id: 2,
        author: "David Lee",
        avatar: "DL",
        rating: 5,
        date: "1 month ago",
        project: "Kitchen Cabinets - $15,000",
        comment: "Highly recommend! Great communication. The cabinets are stunning and the attention to detail is impressive. Worth every penny.",
        helpful: 8
      },
      {
        id: 3,
        author: "Jennifer Kim",
        avatar: "JK",
        rating: 4,
        date: "2 months ago",
        project: "Built-in Bookshelf - $4,500",
        comment: "Very skilled woodworker. Commission took a bit longer than expected but the quality was worth the wait. The built-in bookshelf is beautiful and perfectly fits our space.",
        helpful: 5
      },
      {
        id: 4,
        author: "Robert Martinez",
        avatar: "RM",
        rating: 5,
        date: "3 months ago",
        project: "Standing Desk - $1,800",
        comment: "Michael is a true craftsman. He helped me design the perfect standing desk for my home office. The quality is outstanding and it's incredibly functional. Couldn't be happier!",
        helpful: 15
      },
    ],
    faqs: [
      {
        question: "Do you offer design consultations?",
        answer: "Yes! Every commission begins with a free 30-minute consultation where we discuss your vision, space, and budget. I'll provide design sketches and material recommendations."
      },
      {
        question: "What types of wood do you work with?",
        answer: "I work with a variety of domestic and exotic hardwoods including walnut, cherry, oak, maple, and mahogany. I prioritize sustainably sourced materials and can help you choose the best wood for your commission."
      },
      {
        question: "How long does a typical commission take?",
        answer: "Timeline depends on complexity. Simple pieces take 2-3 weeks, while complex furniture or built-ins can take 6-8 weeks. I'll provide a detailed timeline during our consultation."
      },
      {
        question: "Do you provide delivery and installation?",
        answer: "Yes, delivery and installation are included for all Standard and Premium packages within San Diego County. White glove service is available for Premium commissions."
      },
      {
        question: "What's your refund policy?",
        answer: "I stand behind my work 100%. If you're not satisfied with the final product, we'll work together to make it right. Full refunds are available if work hasn't begun."
      },
    ],
  },
  {
    id: 6,
    name: "Jessica Liu",
    service: "Logo Design",
    location: "Mission Valley, San Diego",
    title: "Brand Identity Specialist",
    zipCode: "92108",
    distance: 5.3,
    rating: 4.8,
    totalReviews: 27,
    jobs: 27,
    startingAt: "$280",
    verified: true,
    topRated: false,
    description: "Brand identity and logo design",
    bio: "I help businesses create memorable brand identities that stand out. With 8 years of experience in graphic design, I specialize in creating logos and brand systems that tell your story and connect with your audience.",
    skills: ["Logo Design", "Brand Identity", "Visual Design", "Typography"],
    certifications: [],
    languages: ["English"],
    available: true,
    responseTime: "Within 4 hours",
    averageDelivery: "1 week",
    responseRate: "95%",
    repeatClientRate: "70%",
    onTimeDelivery: "92%",
    memberSince: "2020",
    totalEarnings: "$45,000+",
    packages: [
      {
        name: "Basic",
        price: "$280",
        delivery: "5 days",
        features: ["Logo design", "2 revisions", "Vector files"],
        description: "Simple logo design"
      },
    ],
    portfolio: [],
    reviews: [],
    faqs: [],
  },
];

export default function ProProfile({ user, onSignOut }: ProProfileProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const provider = ALL_PROVIDERS.find(p => p.id === parseInt(id || '0'));

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Worker Not Found</h1>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleContact = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowContactForm(true);
  };

  const handleSendMessage = () => {
    alert('Message sent! (This is a demo)');
    setShowContactForm(false);
    setMessage('');
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const newFavorited = !isFavorited;
    setIsFavorited(newFavorited);
    
    // Save to localStorage
    const favorites = JSON.parse(localStorage.getItem('nearly_favorites') || '[]');
    
    if (newFavorited) {
      // Add to favorites as a "seller"
      const newFavorite = {
        id: provider.id,
        name: provider.name,
        type: 'seller',
        data: {
          name: provider.name,
          title: provider.title,
          location: provider.location,
          rating: provider.rating,
          jobs: provider.jobs,
          startingAt: provider.startingAt,
          image: provider.name.split(' ').map((n: string) => n[0]).join(''),
        },
        addedAt: new Date().toISOString()
      };
      favorites.push(newFavorite);
      localStorage.setItem('nearly_favorites', JSON.stringify(favorites));
      console.log('Added to favorites:', newFavorite);
      alert('Added to your favorites list!');
    } else {
      // Remove from favorites
      const updated = favorites.filter((f: any) => f.id !== provider.id);
      localStorage.setItem('nearly_favorites', JSON.stringify(updated));
      console.log('Removed from favorites');
      alert('Removed from favorites');
    }
  };

  // Check if already favorited on load
  useEffect(() => {
    if (user && provider) {
      const favorites = JSON.parse(localStorage.getItem('nearly_favorites') || '[]');
      const isFav = favorites.some((f: any) => f.id === provider.id);
      setIsFavorited(isFav);
      console.log('Checking if favorited:', provider.name, isFav);
    }
  }, [user, provider]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <ProfileDropdown user={user} onSignOut={onSignOut} />
              ) : (
                <>
                  <button onClick={() => navigate('/auth')} className="px-5 py-2.5 text-slate-700 hover:text-red-500 transition font-medium">Log In</button>
                  <button onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-lg">Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition">
          <span>←</span><span>Back</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8 mb-8 relative">
          {/* Favorite Heart Button - More Prominent */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg z-50 ${
              isFavorited 
                ? 'bg-red-500 border-2 border-red-600' 
                : 'bg-white hover:bg-sky-50 border-2 border-slate-300 hover:border-red-600'
            }`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg 
              className={`w-7 h-7 transition ${isFavorited ? 'fill-white text-white' : 'fill-none text-slate-700'}`}
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-4xl">
                {provider.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{provider.name}</h1>
                <p className="text-xl text-slate-600 mb-3">{provider.title}</p>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  {provider.topRated && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold flex items-center gap-1">
                      ⭐ Highly Rated
                    </span>
                  )}
                  {provider.verified && (
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold flex items-center gap-1">
                      ✓ Profile Verified
                    </span>
                  )}
                  {provider.available && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-1">
                      🟢 Available
                    </span>
                  )}
                </div>
                
                {/* Rating - Separated from heart */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-slate-900">{provider.rating}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(provider.rating) ? 'text-yellow-500 text-xl' : 'text-slate-300 text-xl'}>⭐</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">({provider.totalReviews} reviews)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-600">Response Time</p>
                  <p className="font-bold text-slate-900">{provider.responseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Response Rate</p>
                  <p className="font-bold text-emerald-600">{provider.responseRate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Repeat Clients</p>
                  <p className="font-bold text-slate-900">{provider.repeatClientRate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Member Since</p>
                  <p className="font-bold text-slate-900">{provider.memberSince}</p>
                </div>
              </div>

              <button onClick={handleContact} className="w-full md:w-auto px-8 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-lg">
                Contact {provider.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 border-2 border-slate-200 w-fit">
          <button onClick={() => setSelectedTab('overview')} className={`px-6 py-2 rounded-lg font-medium transition ${selectedTab === 'overview' ? 'bg-red-500 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            Overview
          </button>
          <button onClick={() => setSelectedTab('portfolio')} className={`px-6 py-2 rounded-lg font-medium transition ${selectedTab === 'portfolio' ? 'bg-red-500 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            Portfolio ({provider.portfolio?.length || 0})
          </button>
          <button onClick={() => setSelectedTab('reviews')} className={`px-6 py-2 rounded-lg font-medium transition ${selectedTab === 'reviews' ? 'bg-red-500 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            Reviews ({provider.reviews?.length || 0})
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <>
                {/* About */}
                <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">About {provider.name.split(' ')[0]}</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">{provider.bio}</p>
                  
                  <h3 className="font-bold text-slate-900 mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {provider.skills?.map((skill: string, index: number) => (
                      <span key={index} className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">{skill}</span>
                    ))}
                  </div>

                  {provider.certifications && provider.certifications.length > 0 && (
                    <>
                      <h3 className="font-bold text-slate-900 mb-3">Certifications</h3>
                      <ul className="space-y-2">
                        {provider.certifications.map((cert: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-slate-600">
                            <span className="text-emerald-600">🏅</span>
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Packages */}
                {provider.packages && provider.packages.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Pricing Packages</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      {provider.packages?.map((pkg: any, index: number) => (
                        <div key={index} className={`relative rounded-2xl border-2 p-6 cursor-pointer transition ${pkg.popular ? 'border-red-600 bg-sky-50' : 'border-slate-200 hover:border-red-400'}`}>
                          {pkg.popular && (
                            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              MOST POPULAR
                            </span>
                          )}
                          <h3 className="font-bold text-xl text-slate-900 mb-2">{pkg.name}</h3>
                          <p className="text-3xl font-bold text-red-500 mb-1">{pkg.price}</p>
                          <p className="text-sm text-slate-600 mb-4">⏱️ {pkg.delivery}</p>
                          <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>
                          <ul className="space-y-2 mb-6">
                            {pkg.features.map((feature: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-emerald-600 mt-0.5">✓</span>
                                <span className="text-slate-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <button onClick={handleContact} className={`w-full py-2 rounded-lg font-semibold transition ${pkg.popular ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            Select Package
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ */}
                {provider.faqs && provider.faqs.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                      {provider.faqs.map((faq: any, index: number) => (
                        <div key={index}>
                          <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                          <p className="text-slate-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Portfolio Tab */}
            {selectedTab === 'portfolio' && (
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Portfolio</h2>
                {provider.portfolio && provider.portfolio.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {provider.portfolio?.map((item: any) => (
                      <div key={item.id} className="group border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-red-300 transition cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <span className="text-8xl">{item.image}</span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                            <span className="text-sm font-semibold text-red-500">{item.price}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                          <p className="text-xs text-slate-500">{item.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">No portfolio items yet</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {selectedTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Reviews ({provider.reviews?.length || 0})</h2>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-slate-900">{provider.rating}</span>
                      <div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(provider.rating) ? 'text-yellow-500 text-lg' : 'text-slate-300 text-lg'}>⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {provider.reviews && provider.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {provider.reviews?.map((review: any) => (
                      <div key={review.id} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-bold text-slate-900">{review.author}</p>
                                <p className="text-sm text-slate-500">{review.date}</p>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-slate-300'}>⭐</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-red-500 mb-2">{review.project}</p>
                            <p className="text-slate-600 leading-relaxed mb-3">{review.comment}</p>
                            <button className="text-sm text-slate-500 hover:text-slate-700 transition">
                              👍 Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">No reviews yet</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-600">📍 Location</span>
                  <span className="font-semibold text-slate-900 text-right text-sm">{provider.location}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-600">💼 Commissions</span>
                  <span className="font-semibold text-slate-900">{provider.jobs}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-600">⏱️ Avg. Delivery</span>
                  <span className="font-semibold text-slate-900">{provider.averageDelivery}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-600">✅ On-Time Rate</span>
                  <span className="font-semibold text-emerald-600">{provider.onTimeDelivery}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-600">🗣️ Languages</span>
                  <span className="font-semibold text-slate-900 text-right text-sm">{provider.languages?.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">💰 Total Earned</span>
                  <span className="font-semibold text-slate-900">{provider.totalEarnings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Contact {provider.name.split(' ')[0]}</h2>
              <button onClick={() => setShowContactForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Your Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hi! I'm interested in your services..." rows={6} className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:outline-none resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowContactForm(false)} className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition">Cancel</button>
              <button onClick={handleSendMessage} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition">Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}