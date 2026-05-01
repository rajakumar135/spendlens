# 💸 SpendLens — Personal Expense Tracker

> A production-quality full-stack expense tracker built for the Fenmo SDE Assessment.

## 🚀 Live Demo
[https://spendlens-amber.vercel.app/](https://spendlens-amber.vercel.app/)

## ✨ Features
- Record expenses with amount, category, description, and date
- View all expenses sorted by date (newest first)
- Filter by category with live total recalculation
- Category breakdown summary (total per category)
- Idempotent API — safe retries and double-submits
- Full validation on both frontend and backend
- Production error and loading states throughout

## 🛠️ Tech Stack
| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack in one repo, API routes + SSR |
| Language | TypeScript | Type safety for money handling is critical |
| Database | SQLite (better-sqlite3) | Zero-config, file-based, ACID-compliant, WAL mode for concurrency |
| Styling | Tailwind CSS | Rapid utility-first styling |
| Deployment | Vercel | Zero-config Next.js deployment |

## 💡 Key Design Decisions

**Money as integers**: All amounts are stored as paise (integer × 100). This eliminates floating-point drift entirely. `0.1 + 0.2 === 0.30000000000000004` in JS — unacceptable for a finance app.

**Idempotency via client-generated UUID**: The client generates a UUID when the form first loads. On every POST, this key is sent. The DB has a UNIQUE constraint on `idempotency_key`. If the same key arrives twice (retry, double-click, network timeout), the server returns the existing record. The key is only rotated after a confirmed success response.

**SQLite over in-memory**: An in-memory store resets on every server restart (common on Vercel cold starts). SQLite persists to disk, survives restarts, and is appropriate for this scale. WAL mode is enabled for safe concurrent reads alongside writes.

**Validation in two layers**: Frontend validates before submission to give instant feedback. Backend re-validates independently — never trust the client. Both use the same validation schema from `lib/validation.ts`.

## ⚖️ Trade-offs (due to timebox)
- No authentication — in production, expenses would be scoped per user
- SQLite won't scale to multi-instance deployments — would migrate to PostgreSQL
- No pagination — acceptable for personal use, would add cursor-based pagination for scale
- Tests cover only pure utility functions — integration tests for API routes would be next

## 🔧 Local Setup
```bash
git clone https://github.com/rajakumar135/spendlens.git
cd spendlens
npm install
mkdir -p data
npm run dev
```
No environment variables required for local development.

## 📁 Project Structure
- `/app` — Next.js 14 App Router layout, pages, and API routes.
- `/components` — React UI components for the application.
- `/lib` — Utilities including database init, validation, and money handling.
- `/data` — Holds the local SQLite DB file `expenses.db`.
- `/__tests__` — Jest test suite for the utility functions.
