// SQLite schema for Ledger Mobile.
//
// Mirrors the original expense tracker's Prisma models (User, Category, Expense)
// so the mobile data stays compatible with the desktop app. SQLite has no
// datetime type, so timestamps are stored as ISO-8601 text.

export const SCHEMA_VERSION = 1;

export const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS user (
    id         TEXT PRIMARY KEY,
    name       TEXT,
    email      TEXT UNIQUE,
    image      TEXT,
    currency   TEXT NOT NULL DEFAULT 'INR',
    theme      TEXT NOT NULL DEFAULT 'dark',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS category (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    color      TEXT NOT NULL DEFAULT '#8B5CF6',
    icon       TEXT DEFAULT 'tag',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE (user_id, name)
  );`,

  `CREATE TABLE IF NOT EXISTS expense (
    id             TEXT PRIMARY KEY,
    user_id        TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    category_id    TEXT NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
    title          TEXT NOT NULL,
    amount         REAL NOT NULL,
    type           TEXT NOT NULL DEFAULT 'EXPENSE',
    payment_method TEXT NOT NULL DEFAULT 'CREDIT_CARD',
    expense_date   TEXT NOT NULL,
    notes          TEXT,
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS app_setting (
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    key     TEXT NOT NULL,
    value   TEXT,
    PRIMARY KEY (user_id, key)
  );`,

  `CREATE INDEX IF NOT EXISTS idx_expense_user_date ON expense (user_id, expense_date);`,
  `CREATE INDEX IF NOT EXISTS idx_expense_user_category ON expense (user_id, category_id);`,
];
