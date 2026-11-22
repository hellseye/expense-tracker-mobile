import { getDatabase } from './db';
import { generateId } from '../utils/generate-id';

// Default categories from the reference app's seed script. The reference only
// defines expense categories, so there is nothing else to seed.
export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', color: '#10B981', icon: 'utensils' },
  { name: 'Housing & Rent', color: '#8B5CF6', icon: 'home' },
  { name: 'Shopping & Tech', color: '#3B82F6', icon: 'shopping-bag' },
  { name: 'Subscriptions', color: '#A855F7', icon: 'tv' },
  { name: 'Transportation', color: '#F59E0B', icon: 'car' },
  { name: 'Utilities & Bills', color: '#06B6D4', icon: 'zap' },
];

// Adds the default categories to a user's list, but only while that list is
// still empty. Categories the user created or edited are never touched, so
// calling this on every launch is safe.
export async function seedDefaultCategories(userId) {
  const db = getDatabase();

  const { count } = await db.getFirstAsync(
    'SELECT COUNT(*) AS count FROM category WHERE user_id = ?',
    [userId]
  );

  if (count > 0) {
    return 0;
  }

  const now = new Date().toISOString();

  for (const category of DEFAULT_CATEGORIES) {
    await db.runAsync(
      `INSERT INTO category (id, user_id, name, color, icon, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [generateId(), userId, category.name, category.color, category.icon, now, now]
    );
  }

  return DEFAULT_CATEGORIES.length;
}
