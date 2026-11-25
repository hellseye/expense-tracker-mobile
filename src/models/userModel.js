import { getDatabase } from '../database/db';
import { generateId } from '../utils/generate-id';

// SQLite queries for the user table. The mobile app is single-user: one local
// profile row, created on first use.

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

  return user;
}

export async function getUserById(id) {
  return getDatabase().getFirstAsync('SELECT * FROM user WHERE id = ?', [id]);
}

export async function updateUser(id, fields) {
  const db = getDatabase();

  const updates = {};

  if (fields.name !== undefined) updates.name = fields.name;
  if (fields.email !== undefined) updates.email = fields.email;
  if (fields.currency !== undefined) updates.currency = fields.currency;
  if (fields.theme !== undefined) updates.theme = fields.theme;

  const columns = Object.keys(updates);
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `UPDATE user
     SET ${columns.map((column) => `${column} = ?`).join(', ')}, updated_at = ?
     WHERE id = ?`,
    [...columns.map((column) => updates[column]), now, id]
  );

  if (result.changes === 0) {
    throw new Error('User not found.');
  }

  return db.getFirstAsync('SELECT * FROM user WHERE id = ?', [id]);
}