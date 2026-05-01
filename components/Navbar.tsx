import { Wallet } from 'lucide-react';

export function Navbar({ totalCount }: { totalCount: number }) {
  return (
    <nav className="w-full h-16 bg-bg-primary border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Wallet className="w-6 h-6 text-accent" />
        <div className="flex flex-col">
          <span className="text-text-primary font-bold leading-tight text-lg">💸 SpendLens</span>
          <span className="text-text-muted text-xs">Personal Finance Tracker</span>
        </div>
      </div>
      <div className="text-sm font-medium text-text-secondary">
        {totalCount} expense{totalCount !== 1 ? 's' : ''}
      </div>
    </nav>
  );
}
