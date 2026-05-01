'use client';

import { formatRupees } from '@/lib/money';
import { Expense } from '@/lib/types';
import { CategoryBadge, CATEGORIES } from './CategoryBadge';
import { Inbox, Trash2, AlertCircle } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  total: number;
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  filterCategory: string;
  setFilterCategory: (c: string) => void;
}

export function ExpenseList({
  expenses,
  total,
  isLoading,
  error,
  onDelete,
  filterCategory,
  setFilterCategory
}: ExpenseListProps) {
  
  // Compute category breakdown summary
  const categorySummary = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { count: 0, amount: 0 };
    }
    acc[curr.category].count += 1;
    acc[curr.category].amount += (curr.amount || 0);
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Expense History</h2>
          <div className="flex items-center gap-4 mt-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="All Categories">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-sm font-medium text-text-secondary bg-bg-elevated px-3 py-1.5 rounded-lg border border-border-subtle">
              {expenses.length} expenses
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-muted uppercase tracking-wide">Total</div>
          <div className="text-2xl font-bold text-accent-green leading-tight">
            {formatRupees(total)}
          </div>
        </div>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        {error ? (
          <div className="p-8 flex flex-col items-center justify-center text-accent-red">
            <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-medium">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="divide-y divide-border-subtle">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-4 bg-border rounded"></div>
                  <div className="w-48 h-5 bg-border rounded"></div>
                  <div className="w-20 h-6 bg-border rounded-full"></div>
                </div>
                <div className="w-24 h-6 bg-border rounded"></div>
              </div>
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-text-muted">
            <Inbox className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium text-text-primary">No expenses yet</p>
            <p className="text-sm mt-1">Add your first expense above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-elevated text-text-muted text-xs uppercase tracking-wider border-b border-border-subtle">
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {expenses.map((expense) => {
                  const dateObj = new Date(expense.date);
                  const formattedDate = dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }); // e.g. "01 May 2025"

                  return (
                    <tr key={expense.id} className="hover:bg-bg-elevated transition-colors group">
                      <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-text-primary">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={expense.category} />
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-accent-green text-right whitespace-nowrap">
                        {formatRupees(expense.amount || 0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="p-2 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {expenses.length > 0 && !isLoading && (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Category Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categorySummary).sort((a, b) => b[1].amount - a[1].amount).map(([cat, stats]) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg border border-border-subtle">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">{cat}</span>
                  <span className="text-xs text-text-muted">{stats.count} expense{stats.count !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  {formatRupees(stats.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
