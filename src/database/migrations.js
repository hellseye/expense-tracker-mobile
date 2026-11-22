import { SCHEMA_VERSION, SCHEMA_STATEMENTS } from './schema';

// Applies the schema and records the version in PRAGMA user_version.
// Safe to run on every launch: the CREATE ... IF NOT EXISTS statements are
// idempotent and the version check skips the work once it has been applied.
export async function runMigrations(db) {
  const result = await db.getFirstAsync('PRAGMA user_version');
  const currentVersion = result ? result.user_version : 0;

  if (currentVersion >= SCHEMA_VERSION) {
    return currentVersion;
  }

  for (const statement of SCHEMA_STATEMENTS) {
    await db.execAsync(statement);
  }

  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);

  return SCHEMA_VERSION;
}
