/**
 * The shared card renderer lives in a lazily loaded chunk, but overlays need to hear when it gives
 * up (over its performance budget) without loading that chunk first. This tiny hub is that channel.
 */
const listeners = new Set<() => void>();

/** Calls `cb` once if the shared card renderer disables itself. Returns an unsubscribe function. */
export function onCardRendererDisabled(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function emitCardRendererDisabled(): void {
  listeners.forEach((cb) => cb());
}

export function resetCardRendererListeners(): void {
  listeners.clear();
}
