// src/components/ConfirmDialog.tsx
// Reusable confirmation dialog

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info'
}: ConfirmDialogProps) {
  const typeStyles = {
    danger: {
      button: 'bg-orange-600 hover:bg-orange-700',
      icon: '⚠️'
    },
    warning: {
      button: 'bg-amber-600 hover:bg-amber-700',
      icon: '⚡'
    },
    info: {
      button: 'bg-orange-500 hover:bg-orange-600',
      icon: 'ℹ️'
    }
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-slideUp">
        <div className="text-center mb-6">
          <span className="text-6xl mb-4 block">{style.icon}</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>
          <p className="text-slate-600">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white font-semibold transition ${style.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
