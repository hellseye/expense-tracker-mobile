import * as settingModel from '../models/settingModel';
import { optionalText, requireText } from '../utils/validators';

// Key/value preference operations.

export async function getSetting(userId, key) {
  return settingModel.getSetting(userId, key);
}

export async function getSettings(userId) {
  return settingModel.getSettings(userId);
}

export async function setSetting(userId, key, value) {
  const cleanKey = requireText(key, 'Setting key', {
    emptyMessage: 'Setting key is required.',
  });
  const cleanValue = optionalText(value, 'Setting value');

  return settingModel.setSetting(userId, cleanKey, cleanValue);
}

export async function deleteSetting(userId, key) {
  const cleanKey = requireText(key, 'Setting key', {
    emptyMessage: 'Setting key is required.',
  });

  return settingModel.deleteSetting(userId, cleanKey);
}