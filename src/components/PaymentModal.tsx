import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './Loading';

interface PaymentModalProps {
  job: any;
  proposal: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ job, proposal, onClose, onSuccess }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [success, setSuccess] = useState(false);

  const amount = parseFloat(proposal.budget.replace(/[^0-9.]/g, ''));
  const platformFee = amount * 0.10; // 10% platform fee
  const proEarnings = amount - platformFee;

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create payment record in database
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([{
          job_id: job.id,
          proposal_id: proposal.id,
          customer_id: job.user_id,
          pro_id: proposal.proId,
          amount: amount,
          platform_fee: platformFee,
          pro_payout: proEarnings,
          status: 'held', // Money held in escrow
          paid_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update job with payment_id
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ payment_id: payment.id })
        .eq('id', job.id);

      if (jobError) throw jobError;

      // Show success animation
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-12 text-center animate-slideUp">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <span className="text-5xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Payment Successful!</h2>
          <p className="text-slate-600 mb-2">
            ${amount.toFixed(2)} is now held in escrow.
          </p>
          <p className="text-sm text-slate-500">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Complete Payment</h2>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-slate-400 hover:text-slate-600 text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-slate-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-slate-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Job Budget</span>
              <span className="font-bold text-slate-900">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Platform Fee (10%)</span>
              <span className="font-bold text-slate-900">${platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200">
              <span className="text-slate-600">Pro Earnings</span>
              <span className="font-bold text-emerald-600">${proEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-300">
              <span className="font-bold text-slate-900">Total Payment</span>
              <span className="font-bold text-sky-600 text-xl">${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Escrow Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <span className="text-2xl flex-shrink-0">🔒</span>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Secure Escrow Protection</p>
              <p className="text-sm text-blue-700">
                Funds are held safely until the job is completed and approved. The pro will receive payment after you confirm the work.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">Payment Method</label>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod('card')}
              disabled={processing}
              className={`w-full p-4 rounded-xl border-2 transition flex items-center gap-3 disabled:opacity-50 ${
                paymentMethod === 'card'
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl">💳</span>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Credit/Debit Card</p>
                <p className="text-sm text-slate-600">Visa, Mastercard, Amex</p>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod('bank')}
              disabled={processing}
              className={`w-full p-4 rounded-xl border-2 transition flex items-center gap-3 disabled:opacity-50 ${
                paymentMethod === 'bank'
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl">🏦</span>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Bank Transfer</p>
                <p className="text-sm text-slate-600">Direct from your bank</p>
              </div>
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Demo Mode:</strong> This is a simulated payment for testing. In production, this would process through Stripe.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Processing...</span>
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-slate-500 text-center mt-4">
          By proceeding, you agree to hold funds in escrow until job completion
        </p>
      </div>
    </div>
  );
}