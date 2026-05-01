import { formatRupees } from '@/lib/money';

interface StatsBarProps {
  totalAmount: number;
  thisMonthAmount: number;
  categoryCount: number;
}

export function StatsBar({ totalAmount, thisMonthAmount, categoryCount }: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
        <div className="text-[13px] text-text-muted uppercase tracking-wide mb-2">Total Expenses</div>
        <div className="text-[32px] font-bold text-accent-green leading-none">
          {formatRupees(totalAmount)}
        </div>
      </div>
      <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
        <div className="text-[13px] text-text-muted uppercase tracking-wide mb-2">This Month</div>
        <div className="text-[32px] font-bold text-text-primary leading-none">
          {formatRupees(thisMonthAmount)}
        </div>
      </div>
      <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
        <div className="text-[13px] text-text-muted uppercase tracking-wide mb-2">Number of Categories</div>
        <div className="text-[32px] font-bold text-text-primary leading-none">
          {categoryCount} <span className="text-lg font-medium text-text-muted">active</span>
        </div>
      </div>
    </div>
  );
}
