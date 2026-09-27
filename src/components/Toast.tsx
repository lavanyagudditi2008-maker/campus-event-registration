import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-indigo-600 shrink-0" />;
    }
  };

  const getBorder = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50/90 text-emerald-900';
      case 'error':
        return 'border-rose-200 bg-rose-50/90 text-rose-900';
      case 'info':
      default:
        return 'border-indigo-200 bg-indigo-50/90 text-indigo-900';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 max-w-sm">
      <div className={`flex items-center gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md text-xs font-semibold ${getBorder()}`}>
        {getIcon()}
        <span className="flex-1">{toast.text}</span>
      </div>
    </div>
  );
};
