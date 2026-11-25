// Reusable input validation for the controllers. Each helper returns the
// cleaned value, or throws an Error with a message the UI can show.

export function requireText(value, label, { min = 1, max, emptyMessage } = {}) {
  const clean = typeof value === 'string' ? value.trim() : '';

  if (clean.length === 0 && emptyMessage !== undefined) {
    throw new Error(emptyMessage);
  }

  if (clean.length < min) {
    throw new Error(`${label} must be at least ${min} characters long.`);
  }

  if (max !== undefined && clean.length > max) {
    throw new Error(`${label} must be under ${max} characters.`);
  }

  return clean;
}

export function requireHexColor(value) {
  if (typeof value !== 'string' || !/^#[0-9A-F]{6}$/i.test(value)) {
    throw new Error('Color must be a valid hex color code, for example #8B5CF6.');
  }

  return value;
}

export function requirePositiveNumber(value, label = 'Amount') {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }

  return value;
}

export function requireEnum(value, allowed, label) {
  if (!allowed.includes(value)) {
    throw new Error(`${label} must be one of: ${allowed.join(', ')}.`);
  }

  return value;
}

export function requireDate(value, label = 'Expense date') {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} is required.`);
  }

  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be a valid date.`);
  }

  return value;
}

// Optional text: undefined and null become null, anything else must be a string.
export function optionalText(value, label, { max } = {}) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error(`${label} must be text.`);
  }

  if (max !== undefined && value.length > max) {
    throw new Error(`${label} must be under ${max} characters.`);
  }

  return value;
}