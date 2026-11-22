import { getDatabase } from './db';
import { generateId } from '../utils/generate-id';
import { seedDefaultCategories } from './seed';

// ---------- User ----------

// The mobile app is single-user: one local profile row, created on first use.
export async function getOrCreateDefaultUser() {
  const db = getDatabase();

  let user = await db.getFirstAsync('SELECT * FROM user LIMIT 1');

  if (!user) {
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO user (id, name, email, currency, theme, created_at, updated_at)
       VALUES (?, ?, NULL, 'INR', 'dark', ?, ?)`,
      [id, 'Local User', now, now]
    );

    user = await db.getFirstAsync('SELECT * FROM user WHERE id = ?', [id]);
  }

  await seedDefaultCategories(user.id);

  return user;
}

// ---------- Categories ----------

export async function getCategories(userId) {
  return getDatabase().getAllAsync(
    'SELECT * FROM category WHERE user_id = ? ORDER BY name COLLATE NOCASE',
    [userId]
  );
}

export async function getCategoryById(id, userId) {
  return getDatabase().getFirstAsync(
    'SELECT * FROM category WHERE id = ? AND user_id = ?',
    [id, userId]
  );
}

export async function createCategory({ userId, name, color, icon }) {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO category (id, user_id, name, color, icon, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, name, color ?? '#8B5CF6', icon ?? 'tag', now, now]
  );

  return db.getFirstAsync('SELECT * FROM category WHERE id = ?', [id]);
}

export async function updateCategory(id, userId, { name, color, icon }) {
  const db = getDatabase();
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `UPDATE category
     SET name = ?, color = ?, icon = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [name, color, icon, now, id, userId]
  );

  if (result.changes === 0) {
    throw new Error('Category not found.');
  }

  return db.getFirstAsync('SELECT * FROM category WHERE id = ?', [id]);
}

export async function deleteCategory(id, userId) {
  const db = getDatabase();

  try {
    const result = await db.runAsync(
      'DELETE FROM category WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.changes === 0) {
      throw new Error('Category not found.');
    }
  } catch (error) {
    if (String(error.message).includes('FOREIGN KEY')) {
      throw new Error('Category is in use by expenses and cannot be deleted.');
    }
    throw error;
  }
}

// ---------- Expenses ----------

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
    [
      id,
      userId,
      categoryId,
      title,
      amount,
      type ?? 'EXPENSE',
      paymentMethod ?? 'CREDIT_CARD',
      expenseDate,
      notes ?? null,
      now,
      now,
    ]
  );

  return db.getFirstAsync('SELECT * FROM expense WHERE id = ?', [id]);
}

export async function updateExpense(id, userId, fields) {
  const db = getDatabase();
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `UPDATE expense
     SET category_id = ?, title = ?, amount = ?, type = ?, payment_method = ?,
         expense_date = ?, notes = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [
      fields.categoryId,
      fields.title,
      fields.amount,
      fields.type,
      fields.paymentMethod,
      fields.expenseDate,
      fields.notes,
      now,
      id,
      userId,
    ]
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

// ---------- Settings ----------

export async function getSetting(userId, key) {
  const row = await getDatabase().getFirstAsync(
    'SELECT value FROM app_setting WHERE user_id = ? AND key = ?',
    [userId, key]
  );

  return row ? row.value : null;
}

export async function setSetting(userId, key, value) {
  await getDatabase().runAsync(
    `INSERT INTO app_setting (user_id, key, value) VALUES (?, ?, ?)
     ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value`,
    [userId, key, value]
  );
}
