'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsBar } from '@/components/StatsBar';
import { AddExpenseForm } from '@/components/AddExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { Toast } from '@/components/Toast';
import { Expense } from '@/lib/types';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterCategory, setFilterCategory] = useState('All Categories');
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = filterCategory !== 'All Categories' ? `?category=${encodeURIComponent(filterCategory)}` : '';
      const res = await fetch(`/api/expenses${query}`);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      
      const data = await res.json();
      setExpenses(data.expenses);
      setTotalAmount(data.total);
    } catch {
      setError('Could not load expenses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    // Optimistic UI update
    const previousExpenses = [...expenses];
    const previousTotal = totalAmount;
    
    const expenseToDelete = expenses.find(e => e.id === id);
    if (expenseToDelete) {
      setExpenses(expenses.filter(e => e.id !== id));
      setTotalAmount(totalAmount - (expenseToDelete.amount || 0));
    }

    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setToast({ message: 'Expense deleted ✓', type: 'success' });
    } catch {
      // Revert optimistic update
      setExpenses(previousExpenses);
      setTotalAmount(previousTotal);
      setToast({ message: 'Failed to delete expense', type: 'error' });
    }
  };

  // Calculate this month's amount
  const currentMonthAmount = expenses.reduce((acc, curr) => {
    const d = new Date(curr.date);
    const today = new Date();
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      return acc + (curr.amount || 0);
    }
    return acc;
  }, 0);

  // Calculate unique active categories
  const categoryCount = new Set(expenses.map(e => e.category)).size;

  return (
    <div className="min-h-screen pb-20">
      <Navbar totalCount={expenses.length} />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <StatsBar 
          totalAmount={totalAmount} 
          thisMonthAmount={currentMonthAmount} 
          categoryCount={categoryCount} 
        />
        
        <div className="mb-12">
          <AddExpenseForm 
            onSuccess={fetchExpenses} 
            showToast={(msg, type) => setToast({ message: msg, type })}
          />
        </div>
        
        <ExpenseList 
          expenses={expenses}
          total={totalAmount}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <footer className="text-center py-8 text-text-muted text-sm border-t border-border-subtle mt-16">
        SpendLens &mdash; The first step towards intelligent financial operations. 🚀
      </footer>
    </div>
  );
}
