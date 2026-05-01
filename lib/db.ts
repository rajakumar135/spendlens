import Database from 'better-sqlite3';
import path from 'path';

const isVercel = process.env.VERCEL === '1';
const DB_PATH = isVercel ? '/tmp/expenses.db' : path.join(process.cwd(), 'data', 'expenses.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        idempotency_key TEXT UNIQUE NOT NULL,
        amount_paise INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        expense_date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }
  return db;
}
