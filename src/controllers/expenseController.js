import * as expenseModel from '../models/expenseModel';
import { PAYMENT_METHODS } from '../constants/paymentMethods';
import {
  optionalText,
  requireDate,
  requireEnum,
  requirePositiveNumber,
  requireText,
} from '../utils/validators';

const TYPES = ['EXPENSE', 'INCOME'];

// Transaction operations: validate the input, call the model, and turn database
// constraint errors into messages the UI can show.

export async function getExpenses(userId) {
  return expenseModel.getExpenses(userId);
}

export async function getExpenseById(id, userId) {
  return expenseModel.getExpenseById(id, userId);
}

export async function createExpense({
  userId,
  categoryId,
  title,
  amount,
  type,
  paymentMethod,
  expenseDate,
  notes,
}) {
  const cleanCategoryId = requireText(categoryId, 'Category', {
    emptyMessage: 'Category is required.',
  });
  const cleanTitle = requireText(title, 'Title', { min: 2, max: 100 });
  const cleanAmount = requirePositiveNumber(amount);
  const cleanType = type === undefined ? 'EXPENSE' : requireEnum(type, TYPES, 'Type');
  const cleanMethod =
    paymentMethod === undefined
      ? 'CREDIT_CARD'
      : requireEnum(paymentMethod, PAYMENT_METHODS, 'Payment method');
  const cleanDate = requireDate(expenseDate);
  const cleanNotes = optionalText(notes, 'Notes', { max: 500 });

  try {
    return await expenseModel.createExpense({
      userId,
      categoryId: cleanCategoryId,
      title: cleanTitle,
      amount: cleanAmount,
      type: cleanType,
      paymentMethod: cleanMethod,
      expenseDate: cleanDate,
      notes: cleanNotes,
    });
  } catch (error) {
    if (String(error.message).includes('FOREIGN KEY')) {
      throw new Error('Category not found.');
    }
    throw error;
  }
}

export async function updateExpense(id, userId, fields) {
  const updates = {};

  if (fields.categoryId !== undefined) {
    updates.categoryId = requireText(fields.categoryId, 'Category', {
      emptyMessage: 'Category is required.',
    });
  }
  if (fields.title !== undefined) {
    updates.title = requireText(fields.title, 'Title', { min: 2, max: 100 });
  }
  if (fields.amount !== undefined) updates.amount = requirePositiveNumber(fields.amount);
  if (fields.type !== undefined) updates.type = requireEnum(fields.type, TYPES, 'Type');
  if (fields.paymentMethod !== undefined) {
    updates.paymentMethod = requireEnum(fields.paymentMethod, PAYMENT_METHODS, 'Payment method');
  }
  if (fields.expenseDate !== undefined) updates.expenseDate = requireDate(fields.expenseDate);
  if (fields.notes !== undefined) {
    updates.notes = optionalText(fields.notes, 'Notes', { max: 500 });
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No expense fields to update.');
  }

  try {
    return await expenseModel.updateExpense(id, userId, updates);
  } catch (error) {
    if (String(error.message).includes('FOREIGN KEY')) {
      throw new Error('Category not found.');
    }
    throw error;
  }
}

export async function deleteExpense(id, userId) {
  return expenseModel.deleteExpense(id, userId);
}