import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-stone-900 text-white rounded-lg shadow-xl border border-stone-800 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
      <span className="font-medium text-stone-100">{message}</span>
      <button
        onClick={onDismiss}
        className="p-1 text-stone-400 hover:text-stone-200 rounded cursor-pointer ml-2"
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </div>
  );
};
