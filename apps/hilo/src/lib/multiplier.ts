export const DEFAULT_HOUSE_EDGE = 0.01;

/**
 * Per-pick payout multiplier given the win probability for the chosen
 * direction:
 *
 *   m = (1 - houseEdge) / probability
 *
 * Returns 0 for non-positive probabilities (e.g. impossible picks; the
 * UI disables those buttons before this is reached).
 */
export function perPickMultiplier(
  probability: number,
  houseEdge = DEFAULT_HOUSE_EDGE,
): number {
  if (!Number.isFinite(probability) || probability <= 0 || probability > 1) {
    return 0;
  }
  return (1 - houseEdge) / probability;
}
