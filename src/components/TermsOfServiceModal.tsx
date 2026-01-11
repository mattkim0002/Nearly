import { useState } from 'react';

interface TermsOfServiceModalProps {
  onAccept: () => void;
}

export default function TermsOfServiceModal({ onAccept }: TermsOfServiceModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h2>
          <p className="text-slate-600">Please read and accept our terms to continue</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Welcome to Bluedot</h3>
            
            <p className="text-slate-600 mb-4">
              By using Bluedot, you agree to the following terms:
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">1. User Conduct</h4>
            <p className="text-slate-600 mb-4">
              You agree to use Bluedot professionally and respectfully. Harassment, fraud, or misrepresentation 
              will result in account termination.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">2. Payments & Escrow</h4>
            <p className="text-slate-600 mb-4">
              All payments are held in escrow until job completion. Customers must approve work before payment 
              is released to pros. Bluedot charges a 10% platform fee on all transactions.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">3. Job Quality</h4>
            <p className="text-slate-600 mb-4">
              Pros agree to deliver work as described in accepted proposals. Customers agree to provide clear 
              requirements and timely feedback.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">4. Disputes</h4>
            <p className="text-slate-600 mb-4">
              In case of disputes, contact our support team. We will mediate fairly based on the agreed terms 
              and evidence provided by both parties.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">5. Account Security</h4>
            <p className="text-slate-600 mb-4">
              You are responsible for maintaining the security of your account. Do not share your login 
              credentials with others.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">6. Content Ownership</h4>
            <p className="text-slate-600 mb-4">
              Pros retain ownership of their work until payment is complete. Upon payment, rights transfer 
              to the customer as agreed in the job terms.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">7. Prohibited Activities</h4>
            <p className="text-slate-600 mb-4">
              The following are strictly prohibited:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-4">
              <li>Taking payments outside of Bluedot</li>
              <li>Sharing contact information to bypass fees</li>
              <li>Posting fake reviews or ratings</li>
              <li>Harassing or threatening other users</li>
              <li>Posting illegal or inappropriate content</li>
            </ul>

            <h4 className="text-lg font-bold text-slate-900 mb-2">8. Privacy</h4>
            <p className="text-slate-600 mb-4">
              We collect and use your data as described in our Privacy Policy. We never sell your personal 
              information to third parties.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">9. Termination</h4>
            <p className="text-slate-600 mb-4">
              Bluedot reserves the right to suspend or terminate accounts that violate these terms.
            </p>

            <h4 className="text-lg font-bold text-slate-900 mb-2">10. Changes to Terms</h4>
            <p className="text-slate-600 mb-4">
              We may update these terms occasionally. Continued use of Bluedot constitutes acceptance of 
              updated terms.
            </p>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mt-6">
              <p className="text-sm text-sky-900">
                <strong>Questions?</strong> Contact us at support@bluedot.com
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-200">
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-slate-700">
              I have read and agree to the Terms of Service
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Accept and Continue
          </button>
        </div>
      </div>
    </div>
  );
}