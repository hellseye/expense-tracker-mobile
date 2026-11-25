import { useCallback, useEffect, useState } from 'react';

import * as expenseController from '../controllers/expenseController';

// Loads the user's transactions, newest first, and reloads them whenever
// refreshKey changes (an expense was added or deleted).
export default function useTransactions(userId, refreshKey = 0) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      setTransactions(await expenseController.getExpenses(userId));
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

  return { transactions, loading, error, reload };
}