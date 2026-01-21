import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface PaymentModalProps {
  commission: {
    id: string;
    title: string;
    budget: number;
    workerName: string;
    workerId: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ commission, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'review' | 'payment' | 'processing'>('review');
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  
  const platformFee = commission.budget * 0.10; // 10% platform fee
  const totalAmount = commission.budget + platformFee;

  const handleProceedToPayment = () => {
    if (!agreed) {
      alert('Please agree to the payment terms to continue');
      return;
    }
    setStep('payment');
  };

  const handleSubmitPayment = async () => {
    setStep('processing');
    
    // Simulate payment processing
    // In production, integrate with Stripe or your payment processor
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {step === 'review' && 'Review Payment'}
                {step === 'payment' && 'Payment Details'}
                {step === 'processing' && 'Processing...'}
              </h2>
              <p className="text-slate-600 text-sm mt-1">Commission: {commission.title}</p>
            </div>
            {step !== 'processing' && (
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: Review */}
          {step === 'review' && (
            <>
              {/* Commission Summary */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Commission Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Worker:</span>
                    <span className="font-semibold text-slate-900">{commission.workerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Commission:</span>
                    <span className="font-semibold text-slate-900">{commission.title}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="text-slate-600">Commission Amount:</span>
                    <span className="font-semibold text-slate-900">${commission.budget.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Platform Fee (10%):</span>
                    <span className="font-semibold text-slate-900">${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-slate-300">
                    <span className="text-lg font-bold text-slate-900">Total:</span>
                    <span className="text-lg font-bold text-orange-500">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Escrow Explanation */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-6">
                <div className="flex gap-3 mb-3">
                  <span className="text-2xl">🔒</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-2">Secure Escrow Payment</h4>
                    <p className="text-sm text-slate-700 mb-3">
                      Your payment will be held securely in escrow until you approve the submitted work 
                      per the agreed terms between you and the independent worker.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>Payment is held securely until you approve the work</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>Worker receives payment after your approval</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>Funds released per the terms you and the worker agreed upon</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Important Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <div className="flex gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-2">Important Notice</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      <strong>Nearly facilitates payment processing only.</strong> We do not:
                    </p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li>• Employ or vet workers beyond optional identity verification</li>
                      <li>• Guarantee work quality, outcomes, or timelines</li>
                      <li>• Control how services are performed</li>
                    </ul>
                    <p className="text-sm text-slate-700 mt-2">
                      You are responsible for defining scope, managing expectations, and approving work 
                      based on your agreement with the independent worker.
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
                  the independent worker. I am responsible for vetting the worker and approving 
                  the submitted work.
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={!agreed}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Select Payment Method</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 transition ${
                      paymentMethod === 'card'
                        ? 'border-orange-600 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-semibold text-slate-900">Credit/Debit Card</div>
                    <div className="text-xs text-slate-600 mt-1">Visa, Mastercard, Amex</div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 rounded-xl border-2 transition ${
                      paymentMethod === 'bank'
                        ? 'border-orange-600 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏦</div>
                    <div className="font-semibold text-slate-900">Bank Account</div>
                    <div className="text-xs text-slate-600 mt-1">ACH Transfer</div>
                  </button>
                </div>
              </div>

              {/* Payment Form Placeholder */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-slate-600 text-center mb-4">
                  🔒 Your payment information is processed securely through our payment processor
                </p>
                
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
                  </div>
                )}
              </div>

              {/* Amount Summary */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-orange-500">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitPayment}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                >
                  Pay ${totalAmount.toFixed(2)}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment...</h3>
              <p className="text-slate-600">Please wait while we securely process your payment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}