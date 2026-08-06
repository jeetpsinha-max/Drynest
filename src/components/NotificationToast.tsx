/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function NotificationToast({ toasts, removeToast }: NotificationToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full" id="toast-container">
      {toasts.map(toast => {
        const bgClass = {
          success: 'bg-emerald-950 border-emerald-500/30 text-emerald-300',
          info: 'bg-slate-900 border-teal-500/30 text-teal-300',
          warning: 'bg-rose-950 border-rose-500/30 text-rose-300'
        }[toast.type];

        const Icon = {
          success: CheckCircle,
          info: Info,
          warning: AlertTriangle
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl animate-slide-in ${bgClass}`}
            role="alert"
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 hover:bg-white/10 rounded transition-colors shrink-0 text-current/60"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
