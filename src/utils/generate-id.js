// Simple unique id for local rows. The original app used cuid(); this keeps the
// same idea (a unique string) without adding a dependency.
export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
