import { useNavigate } from 'react-router-dom';

interface PricingPageProps {
  user: any;
  onSignOut: () => void;
}

export default function PricingPage({ user, onSignOut }: PricingPageProps) {
  const navigate = useNavigate();

  const handleGetStarted = (planType: string) => {
    if (!user) {
      navigate('/auth');
    } else {
      alert(`You've selected the ${planType} plan! (This is a demo)`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-xl bg-white shadow-md border border-sky-200 flex items-center justify-center">
            <span className="text-orange-500 font-bold text-xl">●</span>
          </div>
          <span className="font-bold text-slate-900 text-xl">Nearly</span>
        </div>
        
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="text-slate-700 hover:text-orange-500 transition font-medium"
              >
                Hi, {user.user_metadata?.name}!
              </button>
              <button
                onClick={onSignOut}
                className="px-5 py-2.5 rounded-full bg-slate-200 text-slate-900 hover:bg-slate-300 transition font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition shadow-lg"
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
            Customers post for free,<br />
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Pros only pay after hiring
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that works for your business. No upfront costs, just success-based fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          
          {/* Starter Plan */}
          <div className="bg-white rounded-3xl shadow-lg border-2 border-slate-200 p-8 hover:shadow-2xl transition">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-600">Perfect for new pros</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-extrabold text-slate-900 mb-2">8%</div>
              <p className="text-slate-600">Service fee per completed job</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Unlimited job applications</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Basic profile & portfolio</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Client reviews & ratings</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Secure payment processing</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Email support</span>
              </div>
            </div>

            <button
              onClick={() => handleGetStarted('Starter')}
              className="w-full py-4 rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition border-2 border-slate-300"
            >
              Get started for free
            </button>
          </div>

          {/* Pro Plan - Popular */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl border-2 border-orange-600 p-8 relative transform lg:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-400 text-emerald-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                MOST POPULAR
              </span>
            </div>

            <div className="mb-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-orange-50">For growing businesses</p>
            </div>

            <div className="mb-8 text-white">
              <div className="text-5xl font-extrabold mb-2">6%</div>
              <p className="text-orange-50">Service fee per completed job</p>
            </div>

            <div className="space-y-4 mb-8 text-white">
              <div className="flex items-start gap-3">
                <span className="text-sky-200 text-xl mt-0.5">✓</span>
                <span>Everything in Starter, plus:</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-200 text-xl mt-0.5">✓</span>
                <span className="font-semibold">Featured profile placement</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-200 text-xl mt-0.5">✓</span>
                <span className="font-semibold">Priority in search results</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-200 text-xl mt-0.5">✓</span>
                <span>Advanced portfolio showcase</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-200 text-xl mt-0.5">✓</span>
                <span>Performance analytics</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-200 text-xl mt-0.5">✓</span>
                <span>Priority customer support</span>
              </div>
            </div>

            <button
              onClick={() => handleGetStarted('Pro')}
              className="w-full py-4 rounded-xl bg-white text-orange-500 font-semibold hover:bg-sky-50 transition shadow-lg"
            >
              Get started for free
            </button>
          </div>

          {/* Elite Plan */}
          <div className="bg-white rounded-3xl shadow-lg border-2 border-slate-200 p-8 hover:shadow-2xl transition">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Elite</h3>
              <p className="text-slate-600">For established professionals</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-extrabold text-slate-900 mb-2">4%</div>
              <p className="text-slate-600">Service fee per completed job</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Everything in Pro, plus:</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700 font-semibold">Top tier search placement</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700 font-semibold">Verified badge</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Unlimited portfolio items</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Custom branding options</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">Dedicated account manager</span>
              </div>
            </div>

            <button
              onClick={() => handleGetStarted('Elite')}
              className="w-full py-4 rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition border-2 border-slate-300"
            >
              Get started for free
            </button>
          </div>
        </div>

        {/* For Customers Banner */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">For Customers: Always Free</h2>
            <p className="text-xl text-emerald-50 mb-6">
              Post unlimited jobs, compare quotes, and hire the perfect pro - all at no cost to you.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition shadow-lg"
            >
              Post a Job for Free
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Common Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2">When do I get charged?</h3>
              <p className="text-slate-600">
                Only after you successfully complete a job and receive payment from the customer. No upfront costs, no monthly fees.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Can I switch plans?</h3>
              <p className="text-slate-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next completed job.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-600">
                We accept all major credit cards, debit cards, and bank transfers. Payments are processed securely through our escrow system.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Is there a long-term commitment?</h3>
              <p className="text-slate-600">
                No contracts, no commitments. You can stop using Nearly at any time, and you'll only pay for the jobs you've completed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:text-orange-600 font-semibold text-lg"
          >
            ← Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}