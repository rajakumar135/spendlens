'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      "fixed top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all animate-in slide-in-from-top-2 z-50",
      type === 'success' ? "bg-accent-green/10 border border-accent-green text-accent-green" : "bg-accent-red/10 border border-accent-red text-accent-red"
    )}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
}
