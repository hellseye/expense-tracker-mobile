import * as categoryModel from '../models/categoryModel';
import { requireHexColor, requireText } from '../utils/validators';

// Category operations: validate the input, call the model, and turn database
// constraint errors into messages the UI can show.

export async function getCategories(userId) {
  return categoryModel.getCategories(userId);
}

export async function getCategoryById(id, userId) {
  return categoryModel.getCategoryById(id, userId);
}

export async function createCategory({ userId, name, color, icon }) {
  const cleanName = requireText(name, 'Category name', { min: 2, max: 50 });
  const cleanColor = color === undefined ? '#8B5CF6' : requireHexColor(color);
  const cleanIcon =
    icon === undefined
      ? 'tag'
      : requireText(icon, 'Icon name', { emptyMessage: 'Icon name is required.' });

  try {
    return await categoryModel.createCategory({
      userId,
      name: cleanName,
      color: cleanColor,
      icon: cleanIcon,
    });
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      throw new Error(`A category named "${cleanName}" already exists.`);
    }
    throw error;
  }
}

export async function updateCategory(id, userId, fields) {
  const updates = {};

  if (fields.name !== undefined) {
    updates.name = requireText(fields.name, 'Category name', { min: 2, max: 50 });
  }
  if (fields.color !== undefined) updates.color = requireHexColor(fields.color);
  if (fields.icon !== undefined) {
    updates.icon = requireText(fields.icon, 'Icon name', {
      emptyMessage: 'Icon name is required.',
    });
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No category fields to update.');
  }

  try {
    return await categoryModel.updateCategory(id, userId, updates);
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      throw new Error('A category with that name already exists.');
    }
    throw error;
  }
}

export async function deleteCategory(id, userId) {
  try {
    return await categoryModel.deleteCategory(id, userId);
  } catch (error) {
    if (String(error.message).includes('FOREIGN KEY')) {
      throw new Error('Category is in use by expenses and cannot be deleted.');
    }
    throw error;
  }
}