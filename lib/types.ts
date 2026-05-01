export interface Expense {
  id: string;
  idempotency_key: string;
  amount_paise: number;
  amount?: number; // Populated in API responses
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface ApiError {
  errors: Record<string, string>;
}
