import { initDatabase } from '../database/db';
import { seedDefaultCategories } from '../database/seed';
import * as userModel from '../models/userModel';

// Application-level database operations that span more than one model.

// Opens the database, applies migrations and makes sure the local profile and
// its default categories exist. Call this once when the app starts.
export async function initialize() {
  await initDatabase();

  return getOrCreateDefaultUser();
}

// Creates the local profile on first use and fills in the default categories.
// Seeding lives in the database layer; this is the operation that ties the
// profile and its categories together.
export async function getOrCreateDefaultUser() {
  const user = await userModel.getOrCreateDefaultUser();

  await seedDefaultCategories(user.id);

  return user;
}