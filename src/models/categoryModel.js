import { getDatabase } from '../database/db';
import { generateId } from '../utils/generate-id';

// SQLite queries for the category table. No validation and no UI logic here:
// the controller passes clean values and translates database errors.

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
    [id, userId, name, color, icon, now, now]
  );

  return db.getFirstAsync('SELECT * FROM category WHERE id = ?', [id]);
}

export async function updateCategory(id, userId, fields) {
  const db = getDatabase();

  const updates = {};

  if (fields.name !== undefined) updates.name = fields.name;
  if (fields.color !== undefined) updates.color = fields.color;
  if (fields.icon !== undefined) updates.icon = fields.icon;

  const columns = Object.keys(updates);
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `UPDATE category
     SET ${columns.map((column) => `${column} = ?`).join(', ')}, updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [...columns.map((column) => updates[column]), now, id, userId]
  );

  if (result.changes === 0) {
    throw new Error('Category not found.');
  }

  return db.getFirstAsync('SELECT * FROM category WHERE id = ?', [id]);
}

export async function deleteCategory(id, userId) {
  const db = getDatabase();

  const result = await db.runAsync(
    'DELETE FROM category WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  if (result.changes === 0) {
    throw new Error('Category not found.');
  }
}