import { z } from 'zod';

export const expenseSchema = z.object({
  idempotencyKey: z.string().uuid("Invalid idempotency key"),
  amount: z.number()
    .positive("Amount must be greater than 0")
    .refine((val) => {
      const str = val.toString();
      if (!str.includes('.')) return true;
      return str.split('.')[1].length <= 2;
    }, "Amount can have at most 2 decimal places"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required").max(500, "Description must be under 500 characters"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format").refine((val) => {
    const d = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return d <= today;
  }, "Date cannot be in the future")
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
