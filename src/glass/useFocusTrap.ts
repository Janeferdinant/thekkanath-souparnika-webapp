import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ReturnTarget = HTMLElement | null | undefined | (() => HTMLElement | null | undefined);

/**
 * While `active`: moves focus into the container, keeps Tab and Shift+Tab inside it, and on
 * deactivation puts focus back on `returnFocusTo` (an element or a function that returns one,
 * read at that moment). If no target is given, focus returns to whatever had it before.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  active: boolean,
  returnFocusTo?: ReturnTarget,
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () => [...container.querySelectorAll<HTMLElement>(FOCUSABLE)];

    const first = focusables()[0];
    if (first) {
      first.focus();
    } else {
      container.tabIndex = -1;
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === firstItem || !container.contains(current))) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && (current === lastItem || !container.contains(current))) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
      const target = (typeof returnFocusTo === 'function' ? returnFocusTo() : returnFocusTo) ?? previouslyFocused;
      if (target && document.contains(target)) target.focus();
    };
    // returnFocusTo is read lazily at cleanup; re-running on its identity would steal focus mid-session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, active]);
}
