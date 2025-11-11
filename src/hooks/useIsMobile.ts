import { useEffect, useState } from 'react';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const coarse = matchMedia('(pointer: coarse)');
    setIsMobile(coarse.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    coarse.addEventListener?.('change', handler);
    return () => coarse.removeEventListener?.('change', handler);
  }, []);
  return isMobile;
}
