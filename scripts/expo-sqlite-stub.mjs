// A small stand-in for expo-sqlite that runs on Node's built-in SQLite, so the
// app's real database modules can be exercised outside a phone or emulator.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const directory =
  process.env.SQLITE_STUB_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-sqlite-'));

fs.mkdirSync(directory, { recursive: true });

function toArray(params) {
  if (params === undefined || params === null) {
    return [];
  }

  return Array.isArray(params) ? params : [params];
}

export async function openDatabaseAsync(databaseName) {
  const database = new DatabaseSync(path.join(directory, databaseName));

  return {
    databasePath: path.join(directory, databaseName),

    execAsync(source) {
      database.exec(source);
    },

    async runAsync(source, params) {
      const result = database.prepare(source).run(...toArray(params));

      return { changes: Number(result.changes), lastInsertRowid: Number(result.lastInsertRowid) };
    },

    async getFirstAsync(source, params) {
      return database.prepare(source).get(...toArray(params)) ?? null;
    },

    async getAllAsync(source, params) {
      return database.prepare(source).all(...toArray(params));
    },

    closeAsync() {
      database.close();
    },
  };
}
