/** Fewer samples than this say nothing reliable about the device. */
export const MIN_FRAME_SAMPLES = 12;
/** Median frame time above this (about 41 fps) means the shader is too heavy for the device. */
export const SLOW_MEDIAN_MS = 24;

/**
 * Judges the first real renders. The median ignores a single long hitch (a font swap, a GC pause)
 * but still catches a device that is consistently slow.
 */
export function assessFrameTimes(samplesMs: number[]): 'ok' | 'slow' | 'insufficient' {
  if (samplesMs.length < MIN_FRAME_SAMPLES) return 'insufficient';
  const sorted = [...samplesMs].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return median > SLOW_MEDIAN_MS ? 'slow' : 'ok';
}
