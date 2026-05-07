/**
 * Exponential growth tuned to feel like Aviator / classic crash:
 *   m(t) = exp(GROWTH_RATE * t_seconds)
 *
 *   t=0s   -> 1.00x
 *   t=10s  -> 1.82x
 *   t=15s  -> 2.46x
 *   t=20s  -> 3.32x
 *   t=30s  -> 6.05x
 *   t=45s  -> 14.88x
 */
export const GROWTH_RATE = 0.06;

export function multiplierAt(elapsedMs: number): number {
  if (elapsedMs <= 0) return 1.0;
  return Math.exp(GROWTH_RATE * (elapsedMs / 1000));
}

/** Inverse: how many ms after start does the multiplier reach `m`? */
export function elapsedForMultiplier(m: number): number {
  if (m <= 1) return 0;
  return (Math.log(m) / GROWTH_RATE) * 1000;
}
