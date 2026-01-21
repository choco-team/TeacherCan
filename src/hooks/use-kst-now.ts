import { useEffect, useRef, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';

/**
 * Provides current time converted to KST (Asia/Seoul).
 * - Uses requestAnimationFrame loop with throttling by updateMs.
 */
export function useKstNow(updateMs = 1000) {
  const [now, setNow] = useState<Date>(() =>
    toZonedTime(new Date(), 'Asia/Seoul'),
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();

    const loop = () => {
      const t = performance.now();
      if (t - last >= updateMs) {
        last = t;
        setNow(toZonedTime(new Date(), 'Asia/Seoul'));
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateMs]);

  return now;
}
