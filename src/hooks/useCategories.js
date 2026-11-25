import { useCallback, useEffect, useState } from 'react';

import * as categoryController from '../controllers/categoryController';

// Loads the user's categories and reloads them whenever refreshKey changes
// (a category was added or deleted).
export default function useCategories(userId, refreshKey = 0) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      setCategories(await categoryController.getCategories(userId));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload, refreshKey]);

  return { categories, loading, error, reload };
}