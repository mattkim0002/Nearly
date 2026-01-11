import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ReportUserModalProps {
  reportedUserId: string;
  reportedUserName: string;
  onClose: () => void;
}

export default function ReportUserModal({ reportedUserId, reportedUserName, onClose }: ReportUserModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const REPORT_REASONS = [
    'Inappropriate behavior',
    'Scam or fraud',
    'Harassment',
    'Fake profile',
    'Poor quality work',
    'Non-payment',
    'Other'
  ];

  const handleSubmit = async () => {
    if (!reason) {
      alert('Please select a reason');
      return;
    }

    try {
      setSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reports')
        .insert([{
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          reason: reason,
          description: description.trim() || null
        }]);

      if (error) throw error;

      alert('Report submitted. Our team will review it shortly.');
      onClose();
    } catch (error: any) {
      console.error('Error submitting report:', error);
      alert('Error submitting report: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Report User</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-slate-600 mb-4">
            You are reporting <strong>{reportedUserName}</strong>
          </p>
          <p className="text-sm text-slate-500">
            Please provide details about why you're reporting this user. Our team will review your report.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Reason for Report *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
            >
              <option value="">Select a reason...</option>
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional context..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            ⚠️ False reports may result in action on your account. Please only report genuine concerns.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:bg-slate-400"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
