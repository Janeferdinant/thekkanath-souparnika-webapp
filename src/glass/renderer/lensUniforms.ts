export const MAX_LENSES = 4;
/** Floats per lens: x, y, width, height (device pixels, bottom-left origin) and corner radius. */
export const FLOATS_PER_LENS = 5;

/** A DOMRect that may also carry the element's corner radius in CSS px. */
export type LensRect = DOMRect & { radius?: number };

/**
 * Converts lens elements' viewport rectangles into the shader's uniform data.
 * Each lens is clipped to the frame (the canvas only covers the frame) and lenses that fall
 * entirely outside it are dropped. Only the first `max` visible lenses are kept.
 */
export function toLensUniforms(lensRects: LensRect[], frame: DOMRect, dpr: number, max = MAX_LENSES): Float32Array {
  const out: number[] = [];
  let kept = 0;

  for (const lens of lensRects) {
    if (kept >= max) break;

    const left = Math.max(lens.left - frame.left, 0);
    const top = Math.max(lens.top - frame.top, 0);
    const right = Math.min(lens.right - frame.left, frame.width);
    const bottom = Math.min(lens.bottom - frame.top, frame.height);
    const width = right - left;
    const height = bottom - top;
    if (width <= 0 || height <= 0) continue;

    out.push(left * dpr, (frame.height - top - height) * dpr, width * dpr, height * dpr, (lens.radius ?? 0) * dpr);
    kept += 1;
  }

  return Float32Array.from(out);
}
