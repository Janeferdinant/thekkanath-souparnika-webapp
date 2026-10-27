const RELOADED_KEY = 'ts-chunk-reload';

/**
 * After a redeploy, a visitor's open tab may ask for a chunk file that no longer exists. Vite reports
 * that as `vite:preloadError`; reloading fetches the new build. It reloads at most once per session
 * so a file that is genuinely missing cannot cause a reload loop, and not at all if the guard cannot
 * be stored (blocked storage), because then a loop could not be ruled out.
 */
export function installChunkRecovery(win: Window): void {
  win.addEventListener('vite:preloadError', (event) => {
    try {
      if (win.sessionStorage.getItem(RELOADED_KEY)) return;
      win.sessionStorage.setItem(RELOADED_KEY, '1');
    } catch {
      return;
    }
    event.preventDefault();
    win.location.reload();
  });
}
