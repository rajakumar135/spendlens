import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { expenseSchema } from '@/lib/validation';
import { toPane, fromPane } from '@/lib/money';
import crypto from 'crypto';

interface ExpenseRow {
  id: string;
  idempotency_key: string;
  amount_paise: number;
  category: string;
  description: string;
  expense_date: string;
  created_at: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request
    const parseResult = expenseSchema.safeParse(body);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { idempotencyKey, amount, category, description, date } = parseResult.data;
    const db = getDb();

    // Check idempotency key
    const existing = db.prepare('SELECT * FROM expenses WHERE idempotency_key = ?').get(idempotencyKey) as ExpenseRow | undefined;
    
    if (existing) {
      return NextResponse.json({
        id: existing.id,
        idempotency_key: existing.idempotency_key,
        amount_paise: existing.amount_paise,
        amount: fromPane(existing.amount_paise),
        category: existing.category,
        description: existing.description,
        date: existing.expense_date,
        created_at: existing.created_at,
      }, { status: 200 }); // Return existing with 200
    }

    // Insert new
    const newId = crypto.randomUUID();
    const amountPaise = toPane(amount);
    
    db.prepare(`
      INSERT INTO expenses (id, idempotency_key, amount_paise, category, description, expense_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(newId, idempotencyKey, amountPaise, category, description, date);

    const inserted = db.prepare('SELECT * FROM expenses WHERE id = ?').get(newId) as ExpenseRow;

    return NextResponse.json({
      id: inserted.id,
      idempotency_key: inserted.idempotency_key,
      amount_paise: inserted.amount_paise,
      amount: fromPane(inserted.amount_paise),
      category: inserted.category,
      description: inserted.description,
      date: inserted.expense_date,
      created_at: inserted.created_at,
    }, { status: 201 }); // Created
    
  } catch (error) {
    console.error('Failed to process POST /api/expenses', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    // sort=date_desc is default per spec

    const db = getDb();
    let query = 'SELECT * FROM expenses';
    const params: string[] = [];

    if (category && category.toLowerCase() !== 'all categories') {
      query += ' WHERE LOWER(category) = LOWER(?)';
      params.push(category);
    }

    query += ' ORDER BY expense_date DESC, created_at DESC';

    const rows = db.prepare(query).all(...params) as ExpenseRow[];

    let totalRupees = 0;
    const expenses = rows.map(row => {
      const rupees = fromPane(row.amount_paise);
      totalRupees += rupees;
      return {
        id: row.id,
        idempotency_key: row.idempotency_key,
        amount: rupees,
        category: row.category,
        description: row.description,
        date: row.expense_date,
        created_at: row.created_at,
      };
    });

    return NextResponse.json({ expenses, total: totalRupees }, { status: 200 });
  } catch (error) {
    console.error('Failed to process GET /api/expenses', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
