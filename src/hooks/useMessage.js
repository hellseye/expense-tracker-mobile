import { useCallback, useEffect, useRef, useState } from 'react';

// Temporary success/error message. showMessage(text, type) sets it and it
// clears itself after `timeout` milliseconds.
export default function useMessage(timeout = 3500) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const showMessage = useCallback((text, type = 'error') => {
    setMessage({ text, type });
  }, []);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    timer.current = setTimeout(() => setMessage(null), timeout);

    return () => clearTimeout(timer.current);
  }, [message, timeout]);

  return [message, showMessage];
}