/** DOM elements the hero renderer bends light through. Surfaces register themselves as lenses. */
const lenses = new Set<HTMLElement>();
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((fn) => fn());

export function registerLens(el: HTMLElement): () => void {
  lenses.add(el);
  notify();
  return () => {
    lenses.delete(el);
    notify();
  };
}

export const getLenses = (): HTMLElement[] => [...lenses];

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
