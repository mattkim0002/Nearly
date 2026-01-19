import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

interface FAQProps {
  user?: any;
  onSignOut?: () => void;
}

export default function FAQ({ user, onSignOut }: FAQProps) {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is Nearly?",
          a: "Nearly is a platform that connects clients with independent local workers for commissions and services. We facilitate discovery, messaging, and secure payment processing. Nearly does not employ workers, guarantee work quality, or control how services are performed."
        },
        {
          q: "How does Nearly work?",
          a: "Clients post commissions describing what they need. Independent workers submit proposals with their budget and timeline. Clients review proposals and choose a worker. Payment is held in secure escrow and released per the terms agreed between client and worker. Nearly facilitates the connection and payment processing only."
        },
        {
          q: "Is Nearly free to use?",
          a: "Browsing and posting commissions is free. Nearly charges a 10% platform fee on successful transactions to facilitate the connection and payment processing."
        },
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top right corner. Choose whether you're a client (hiring workers) or an independent worker (offering services). Fill in your information and agree to our Terms of Service and Privacy Policy."
        }
      ]
    },
    {
      category: "For Clients",
      questions: [
        {
          q: "How do I post a commission?",
          a: "Click 'Post a Commission' from your dashboard. Describe what you need, set your budget, specify your location, and add any relevant details or files. Your commission will be visible to independent workers who can submit proposals."
        },
        {
          q: "How do I choose a worker?",
          a: "Review proposals from independent workers. Check their profiles, portfolios, and any reviews from other users. You are responsible for vetting workers and selecting the best fit for your needs. Nearly does not vet or endorse workers."
        },
        {
          q: "What is escrow and how does it work?",
          a: "When you accept a proposal, payment is deposited into secure escrow. The funds are held safely until you approve the submitted work per your agreed terms with the worker. This protects both parties. Once you approve, payment is released to the worker. Nearly holds the funds but does not determine when work is complete - that's between you and the worker."
        },
        {
          q: "What if I'm not satisfied with the work?",
          a: "You should communicate directly with the worker about any concerns or revisions needed. Work should meet the terms you both agreed upon. If you cannot resolve the issue, contact our support team who can help mediate. Final decisions about work approval rest with you and the worker based on your agreement."
        },
        {
          q: "Can I get a refund?",
          a: "Refunds are handled on a case-by-case basis. If work was not delivered or does not meet the agreed-upon terms, contact support. We will review the situation and work with both parties to reach a fair resolution based on the evidence and agreed terms."
        },
        {
          q: "How do I leave a review?",
          a: "After a commission is completed, you can leave a review rating the worker's communication, quality, and professionalism. Reviews help other users make informed decisions. Please be honest and fair in your reviews."
        }
      ]
    },
    {
      category: "For Independent Workers",
      questions: [
        {
          q: "How do I find commissions?",
          a: "Click 'Browse Commissions' to see available work in your area. Filter by category, budget, or location. When you find a commission you're interested in, submit a proposal explaining why you're the best fit."
        },
        {
          q: "How do I submit a proposal?",
          a: "On a commission detail page, click 'Submit Proposal'. Write a cover letter explaining your approach, set your budget, and specify your timeline. Include relevant portfolio examples if applicable."
        },
        {
          q: "How do I get paid?",
          a: "When a client accepts your proposal, they deposit payment into secure escrow. Complete the work according to your agreed terms and submit it for review. Once the client approves, payment is released to your account. You are responsible for delivering work that meets the terms you agreed to with the client."
        },
        {
          q: "When is payment released?",
          a: "Payment is released per the terms you agreed upon with the client. After you submit your work, the client will review it. If it meets your agreed terms, they will approve and payment will be released. If revisions are needed, work with the client to address their concerns."
        },
        {
          q: "What if a client doesn't approve my work?",
          a: "Communicate with the client to understand their concerns. Make any necessary revisions based on your agreed terms. If you cannot reach an agreement, contact support for mediation. We will review the evidence and the terms you both agreed to."
        },
        {
          q: "How do I build my profile?",
          a: "Add a professional photo, write a compelling bio, showcase your skills, and upload portfolio examples. Complete commissions and receive positive reviews to build your reputation. Remember: reviews and ratings come from other users, not Nearly."
        }
      ]
    },
    {
      category: "Payments & Fees",
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept credit cards, debit cards, and bank account transfers (ACH). All payments are processed securely through our payment processor."
        },
        {
          q: "How much does Nearly charge?",
          a: "Nearly charges a 10% platform fee on the commission amount. This fee covers payment processing, escrow services, and platform maintenance. The fee is added to the commission total at checkout."
        },
        {
          q: "When am I charged?",
          a: "Clients are charged when they accept a proposal. The payment (commission amount + 10% platform fee) is held in escrow. Workers receive the commission amount (minus any processing fees) when the client approves the work."
        },
        {
          q: "How long does it take to receive payment?",
          a: "Once a client approves your work, payment is typically processed within 2-3 business days. Bank transfers may take an additional 3-5 business days to appear in your account."
        },
        {
          q: "Are there any hidden fees?",
          a: "No. The 10% platform fee is clearly displayed at checkout. Standard payment processing fees may apply depending on your payment method and bank."
        }
      ]
    },
    {
      category: "Safety & Trust",
      questions: [
        {
          q: "Does Nearly vet or verify workers?",
          a: "Nearly offers optional identity verification where workers can verify their identity with a government-issued ID. A 'Profile Verified' badge indicates identity verification only - it does NOT mean Nearly has vetted their skills, quality, or reliability. You are responsible for reviewing portfolios, checking reviews from other users, and vetting workers yourself."
        },
        {
          q: "Does Nearly guarantee work quality?",
          a: "No. Nearly facilitates connections and payment processing only. We do not guarantee work quality, outcomes, timelines, or any other aspect of services. Independent workers operate independently. You are responsible for vetting workers, defining clear scope, and determining when work meets your agreed terms."
        },
        {
          q: "What if there's a dispute?",
          a: "First, try to resolve the issue directly with the other party through messaging. If you cannot reach an agreement, contact our support team. We will review the evidence, the agreed terms, and mediate fairly. Final decisions are based on the agreement between you and the other party."
        },
        {
          q: "How do I report inappropriate behavior?",
          a: "If you experience harassment, fraud, or inappropriate behavior, report it immediately using the 'Report' button on the user's profile or contact support@nearly.com. We take user safety seriously and will investigate all reports."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes. All payment information is encrypted and processed through our secure payment processor. Nearly never stores your full credit card or bank account details."
        },
        {
          q: "Can I take payments outside of Nearly?",
          a: "No. All payments must go through Nearly's platform for both parties' protection. Taking payments outside the platform violates our Terms of Service and may result in account termination. Escrow protects both clients and workers."
        }
      ]
    },
    {
      category: "Account & Technical",
      questions: [
        {
          q: "How do I change my account type?",
          a: "Contact support@nearly.com to request an account type change. We'll help you switch between client and independent worker accounts."
        },
        {
          q: "How do I delete my account?",
          a: "Go to Settings > Account > Delete Account. Note: You cannot delete your account if you have active commissions or pending payments. Complete all active work first."
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click 'Forgot Password' on the login page. Enter your email and we'll send you a password reset link. Follow the link to create a new password."
        },
        {
          q: "How do I contact support?",
          a: "Email us at support@nearly.com or use the 'Contact Support' button in your dashboard. We typically respond within 24 hours on business days."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <ProfileDropdown user={user} onSignOut={onSignOut!} />
              ) : (
                <>
                  <button onClick={() => navigate('/auth')} className="px-5 py-2.5 text-slate-700 hover:text-sky-600 transition font-medium">Log In</button>
                  <button onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition shadow-lg">Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition">
          <span>←</span><span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Help Center</h1>
          <p className="text-xl text-slate-600">Find answers to common questions about Nearly</p>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Important: Nearly's Role</h3>
              <p className="text-slate-700 mb-2">
                Nearly is a platform that <strong>facilitates connections and payment processing only</strong>. We do not:
              </p>
              <ul className="space-y-1 text-slate-700 text-sm">
                <li>• Employ or vet workers beyond optional identity verification</li>
                <li>• Guarantee work quality, outcomes, or timelines</li>
                <li>• Control how services are performed</li>
                <li>• Make decisions about work approval</li>
              </ul>
              <p className="text-slate-700 mt-2 text-sm">
                All agreements are between clients and independent workers. You are responsible for vetting workers, 
                defining clear terms, and managing your commissions.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{section.category}</h2>
              
              <div className="space-y-3">
                {section.questions.map((faq, questionIndex) => {
                  const globalIndex = sectionIndex * 100 + questionIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div key={questionIndex} className="border-2 border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
                      >
                        <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                        <span className={`text-2xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          ⌄
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4 pt-2 border-t-2 border-slate-200 bg-slate-50">
                          <p className="text-slate-700 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-sky-50 border-2 border-sky-200 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h3>
          <p className="text-slate-700 mb-6">
            Our support team is here to help. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@nearly.com"
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition inline-block"
            >
              Email Support
            </a>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition border-2 border-slate-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}