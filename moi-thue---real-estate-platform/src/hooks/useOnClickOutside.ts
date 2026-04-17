import { useEffect, useRef, type RefObject } from 'react';

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const onMouseDown = (event: MouseEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handlerRef.current();
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [ref, enabled]);
}
