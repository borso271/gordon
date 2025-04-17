import { useEffect, useRef, useState } from 'react';

type Size = { width: number; height: number };

export function useChartSizeObserver(
  targetRef: React.RefObject<HTMLElement>,
  delay = 50
): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const el = targetRef.current;

    if (!el) {
      console.log('❌ No element to observe yet, ref is null');
      return;
    }

    console.log('✅ Observing element:', el);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      console.log('📐 ResizeObserver fired =>', width, height);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
       
        if (width !== size.width || height !== size.height) {
          setSize({ width, height });
        }

        
      }, delay);
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [targetRef.current, delay]); // 👈 this is the fix!

  return size;
}
