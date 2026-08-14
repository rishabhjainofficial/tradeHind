'use client';

import { useState, useEffect } from 'react';

/**
 * Custom React hook that delays updating the state value until after
 * the specified delay (in milliseconds) has passed since the last change.
 * Prevents heavy UI re-computations and network floods on rapid user keystrokes.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
