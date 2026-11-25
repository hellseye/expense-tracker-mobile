import { getDatabase } from '../database/db';

// SQLite queries for the app_setting table (per-user key/value preferences).

export async function getSetting(userId, key) {
  const row = await getDatabase().getFirstAsync(
    'SELECT value FROM app_setting WHERE user_id = ? AND key = ?',
    [userId, key]
  );

  return row ? row.value : null;
}

export async function getSettings(userId) {
  return getDatabase().getAllAsync(
    'SELECT key, value FROM app_setting WHERE user_id = ? ORDER BY key',
    [userId]
  );
}

export async function setSetting(userId, key, value) {
  const db = getDatabase();

  await db.runAsync(
    `INSERT INTO app_setting (user_id, key, value) VALUES (?, ?, ?)
     ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value`,
    [userId, key, value]
  );

  return getSetting(userId, key);
}

export async function deleteSetting(userId, key) {
  const db = getDatabase();

  const result = await db.runAsync(
    'DELETE FROM app_setting WHERE user_id = ? AND key = ?',
    [userId, key]
  );

  if (result.changes === 0) {
    throw new Error('Setting not found.');
  }
}