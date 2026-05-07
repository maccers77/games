/**
 * Sample the next crash multiplier from a heavy-tailed distribution
 * with a configurable house edge.
 *
 * Modeled on the standard "instant-bust + 1/(1-r)" provably-fair shape
 * used by public crash games. Returns a value >= 1.00.
 *
 * The function takes an injected `rand` so we can swap in a deterministic
 * or HMAC-stream RNG later (for a real provably-fair UI) without touching
 * call sites.
 */
export const DEFAULT_HOUSE_EDGE = 0.01;
export const HARD_CAP = 1000;

export function nextCrashPoint(
  houseEdge: number = DEFAULT_HOUSE_EDGE,
  rand: () => number = Math.random,
): number {
  const r = rand();
  if (r < houseEdge) return 1.0;
  const fair = 100 / (1 - r) / 100;
  const withEdge = fair * (1 - houseEdge);
  const m = Math.max(1.0, Math.floor(withEdge * 100) / 100);
  return Math.min(HARD_CAP, m);
}
