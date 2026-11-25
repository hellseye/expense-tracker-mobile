import { getDatabase } from '../database/db';
import { generateId } from '../utils/generate-id';

// SQLite queries for the expense table. A row is a transaction; its type column
// says whether it is money spent (EXPENSE) or money received (INCOME).
// No validation and no UI logic here: the controller passes clean values and
// translates database errors.

export async function getExpenses(userId) {
  return getDatabase().getAllAsync(
    'SELECT * FROM expense WHERE user_id = ? ORDER BY expense_date DESC',
    [userId]
  );
}

export async function getExpenseById(id, userId) {
  return getDatabase().getFirstAsync(
    'SELECT * FROM expense WHERE id = ? AND user_id = ?',
    [id, userId]
  );
}

export async function createExpense({
  userId,
  categoryId,
  title,
  amount,
  type,
  paymentMethod,
  expenseDate,
  notes,
}) {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO expense
       (id, user_id, category_id, title, amount, type, payment_method, expense_date, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, categoryId, title, amount, type, paymentMethod, expenseDate, notes, now, now]
  );

  return db.getFirstAsync('SELECT * FROM expense WHERE id = ?', [id]);
}

export async function updateExpense(id, userId, fields) {
  const db = getDatabase();

  const updates = {};

  if (fields.categoryId !== undefined) updates.category_id = fields.categoryId;
  if (fields.title !== undefined) updates.title = fields.title;
  if (fields.amount !== undefined) updates.amount = fields.amount;
  if (fields.type !== undefined) updates.type = fields.type;
  if (fields.paymentMethod !== undefined) updates.payment_method = fields.paymentMethod;
  if (fields.expenseDate !== undefined) updates.expense_date = fields.expenseDate;
  if (fields.notes !== undefined) updates.notes = fields.notes;

  const columns = Object.keys(updates);
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `UPDATE expense
     SET ${columns.map((column) => `${column} = ?`).join(', ')}, updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [...columns.map((column) => updates[column]), now, id, userId]
  );

  if (result.changes === 0) {
    throw new Error('Expense not found.');
  }

  return db.getFirstAsync('SELECT * FROM expense WHERE id = ?', [id]);
}

export async function deleteExpense(id, userId) {
  const db = getDatabase();

  const result = await db.runAsync(
    'DELETE FROM expense WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  if (result.changes === 0) {
    throw new Error('Expense not found.');
  }
}