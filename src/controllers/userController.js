import * as userModel from '../models/userModel';
import * as databaseService from '../services/databaseService';
import { requireEnum, requireText } from '../utils/validators';

const THEMES = ['light', 'dark', 'system', 'oled'];

// Local profile operations. Creating the profile also fills in the default
// categories, so that one is coordinated by the database service.

export async function getOrCreateDefaultUser() {
  return databaseService.getOrCreateDefaultUser();
}

export async function getUserById(id) {
  return userModel.getUserById(id);
}

export async function updateUser(id, fields) {
  const updates = {};

  if (fields.name !== undefined) {
    updates.name = requireText(fields.name, 'Name', {
      max: 50,
      emptyMessage: 'Name is required.',
    });
  }
  if (fields.email !== undefined) {
    updates.email =
      fields.email === null
        ? null
        : requireText(fields.email, 'Email', { emptyMessage: 'Email cannot be empty.' });
  }
  if (fields.currency !== undefined) {
    updates.currency = requireText(fields.currency, 'Currency', {
      emptyMessage: 'Currency is required.',
    });
  }
  if (fields.theme !== undefined) updates.theme = requireEnum(fields.theme, THEMES, 'Theme');

  if (Object.keys(updates).length === 0) {
    throw new Error('No user fields to update.');
  }

  return userModel.updateUser(id, updates);
}