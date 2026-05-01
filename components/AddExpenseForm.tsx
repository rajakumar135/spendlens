'use client';

import { useState, FormEvent, useEffect } from 'react';
import { CATEGORIES } from './CategoryBadge';
import { Loader2 } from 'lucide-react';
import { expenseSchema } from '@/lib/validation';

interface AddExpenseFormProps {
  onSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function AddExpenseForm({ onSuccess, showToast }: AddExpenseFormProps) {
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Generate on mount
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  const resetForm = () => {
    setAmount('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    setGlobalError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setIsLoading(true);

    const formData = {
      idempotencyKey,
      amount: parseFloat(amount),
      category,
      description,
      date
    };

    // Client-side validation
    const parseResult = expenseSchema.safeParse(formData);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGlobalError(data.error || 'Failed to add expense.');
        }
        return;
      }

      // Success
      setIdempotencyKey(crypto.randomUUID());
      resetForm();
      showToast('Expense recorded ✓', 'success');
      onSuccess();
    } catch {
      setGlobalError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold text-text-primary">Record Expense</h2>
        <p className="text-text-muted text-[13px] mt-1">Every rupee tracked is a decision informed.</p>
      </div>

      {globalError && (
        <div className="mb-4 p-3 bg-accent-red/10 border border-accent-red text-accent-red rounded-lg text-sm font-medium">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary block">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 transition-shadow"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-accent-red text-xs mt-1">{errors.amount}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
              className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 transition-shadow"
            />
            {errors.date && <p className="text-accent-red text-xs mt-1">{errors.date}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 transition-shadow"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-accent-red text-xs mt-1">{errors.category}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary block">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 transition-shadow"
            placeholder="What was this for?"
          />
          {errors.description && <p className="text-accent-red text-xs mt-1">{errors.description}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || !idempotencyKey}
          className="w-full h-12 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Recording...
            </>
          ) : (
            'Record Expense'
          )}
        </button>
      </form>
    </div>
  );
}
