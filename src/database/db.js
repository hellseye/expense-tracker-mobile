import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

const DATABASE_NAME = 'ledger.db';

let db = null;

// Opens the local database file, turns on foreign keys and applies migrations.
// Repeated calls return the already-open handle.
export async function initDatabase() {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  } catch (error) {
    throw new Error(`Could not open the database: ${error.message}`);
  }

  await db.execAsync('PRAGMA foreign_keys = ON');
  await runMigrations(db);

  return db;
}

// Returns the open database. Throws when the app forgot to initialise it.
export function getDatabase() {
  if (!db) {
    throw new Error('Database is not initialised. Call initDatabase() first.');
  }

  return db;
}
