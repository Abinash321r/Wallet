import { useRef, useCallback } from 'react';





export function useThrottle<T extends (...args: any[]) => any>(fn: T, delay: number = 200): T {
  
  const lastCalledAt = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCalledAt.current >= delay) {
        lastCalledAt.current = now;
        fn(...args);
      }
    },
    [fn, delay],
  ) as T;
}
