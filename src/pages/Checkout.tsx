import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';

interface CheckoutProps {
  user: any;
  onSignOut: () => void;
}

export default function Checkout({ user, onSignOut }: CheckoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get commission data from navigation state
  const commission = location.state?.commission || {
    id: '1',
    title: 'Custom Dining Table',
    budget: 1200,
    workerName: 'Michael Chen',
    workerId: 'worker123',
    description: 'Build a custom walnut dining table (8ft x 3.5ft)',
  };

  const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Confirmation
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [processing, setProcessing] = useState(false);

  const platformFee = commission.budget * 0.10;
  const totalAmount = commission.budget + platformFee;

  const handleProceedToPayment = () => {
    if (!agreed) {
      alert('Please agree to the payment terms to continue');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmitPayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
      window.scrollTo(0, 0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-slate-900 text-xl">Nearly</span>
            </div>
            <div className="flex items-center gap-4">
              {user && <ProfileDropdown user={user} onSignOut={onSignOut} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className={`font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                Review
              </span>
            </div>

            <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-slate-200'}`}></div>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className={`font-semibold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                Payment
              </span>
            </div>

            <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-500' : 'bg-slate-200'}`}></div>

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step > 3 ? '✓' : '3'}
              </div>
              <span className={`font-semibold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                Complete
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            
            {/* STEP 1: Review */}
            {step === 1 && (
              <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Review Commission</h2>

                {/* Commission Details */}
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{commission.title}</h3>
                      <p className="text-slate-600">{commission.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                        {commission.workerName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{commission.workerName}</p>
                        <p className="text-sm text-slate-600">Independent Worker</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Escrow Explanation */}
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-6">
                  <div className="flex gap-3">
                    <span className="text-2xl">🔒</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-2">How Escrow Works</h4>
                      <p className="text-sm text-slate-700 mb-3">
                        Your payment will be held securely in escrow until you approve the submitted work 
                        per the agreed terms between you and the independent worker.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">1.</span>
                          <span className="text-sm text-slate-700">Payment is deposited into secure escrow</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">2.</span>
                          <span className="text-sm text-slate-700">Worker completes and submits the work</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">3.</span>
                          <span className="text-sm text-slate-700">You review and approve the submitted work</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">4.</span>
                          <span className="text-sm text-slate-700">Payment is released per your agreed terms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                  <div className="flex gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-2">Platform Boundary Notice</h4>
                      <p className="text-sm text-slate-700 mb-2">
                        <strong>Nearly facilitates connections and payment processing only.</strong> We do not:
                      </p>
                      <ul className="space-y-1 text-sm text-slate-700 mb-3">
                        <li>• Employ or vet workers beyond optional identity verification</li>
                        <li>• Guarantee work quality, outcomes, or timelines</li>
                        <li>• Control how services are performed</li>
                        <li>• Make decisions about work approval</li>
                      </ul>
                      <p className="text-sm text-slate-700">
                        You are responsible for defining scope with the worker, managing expectations, 
                        and determining when submitted work meets your agreed-upon terms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-orange-400 transition mb-6">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-600"
                  />
                  <span className="text-sm text-slate-700">
                    I understand that Nearly facilitates connections and payment processing only. 
                    Payment will be held in escrow and released per the terms I've agreed upon with 
                    the independent worker. I am responsible for vetting the worker, managing the 
                    commission, and approving the submitted work.
                  </span>
                </label>

                {/* Button */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={!agreed}
                  className="w-full py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed text-lg"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Payment Details</h2>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="font-bold text-slate-900 mb-4">Select Payment Method</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-6 rounded-xl border-2 transition ${
                        paymentMethod === 'card'
                          ? 'border-orange-600 bg-sky-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">💳</div>
                      <div className="font-semibold text-slate-900">Credit/Debit Card</div>
                      <div className="text-xs text-slate-600 mt-1">Visa, Mastercard, Amex</div>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-6 rounded-xl border-2 transition ${
                        paymentMethod === 'bank'
                          ? 'border-orange-600 bg-sky-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🏦</div>
                      <div className="font-semibold text-slate-900">Bank Account</div>
                      <div className="text-xs text-slate-600 mt-1">ACH Transfer</div>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-emerald-600">🔒</span>
                    <p className="text-sm text-slate-600">
                      Your payment information is processed securely
                    </p>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">CVC</label>
                          <input 
                            type="text" 
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Account Number</label>
                        <input 
                          type="text" 
                          placeholder="Enter your account number"
                          className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Routing Number</label>
                        <input 
                          type="text" 
                          placeholder="Enter your routing number"
                          className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Account Holder Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-orange-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    disabled={processing}
                    className="flex-1 py-4 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    disabled={processing}
                    className="flex-1 py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50 text-lg"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      `Pay $${totalAmount.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✓</span>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Payment Successful!</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Your payment of ${totalAmount.toFixed(2)} has been securely deposited into escrow
                </p>

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-8 text-left">
                  <h3 className="font-bold text-slate-900 mb-3">What's Next?</h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">1.</span>
                      <span>{commission.workerName} will be notified and can begin work</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">2.</span>
                      <span>You'll receive updates as the work progresses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">3.</span>
                      <span>When work is submitted, you'll review and approve it</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">4.</span>
                      <span>Upon approval, payment will be released per your agreed terms</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/my-jobs')}
                    className="flex-1 py-4 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                  >
                    View My Commissions
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Commission Amount:</span>
                  <span className="font-semibold text-slate-900">${commission.budget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Platform Fee (10%):</span>
                  <span className="font-semibold text-slate-900">${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-slate-300">
                  <span className="text-lg font-bold text-slate-900">Total:</span>
                  <span className="text-lg font-bold text-orange-500">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700">
                <p className="font-semibold mb-2">🔒 Secure Escrow</p>
                <p className="text-xs leading-relaxed">
                  Payment held securely until you approve the submitted work per your agreed terms with the worker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}