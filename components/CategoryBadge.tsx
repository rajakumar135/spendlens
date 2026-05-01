import { cn } from './Toast';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': 'bg-green-500/10 text-green-700 border-green-500/20',
  'Transportation': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  'Shopping': 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  'Entertainment': 'bg-pink-500/10 text-pink-700 border-pink-500/20',
  'Health & Medical': 'bg-red-500/10 text-red-700 border-red-500/20',
  'Utilities & Bills': 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  'Housing': 'bg-teal-500/10 text-teal-700 border-teal-500/20',
  'Education': 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
  'Travel': 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
  'Personal Care': 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  'Investment': 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  'Other': 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export function CategoryBadge({ category }: { category: string }) {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
  
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap",
      colorClass
    )}>
      {category}
    </span>
  );
}

export const CATEGORIES = Object.keys(CATEGORY_COLORS);
