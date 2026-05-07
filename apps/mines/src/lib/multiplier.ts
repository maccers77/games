import { TILE_COUNT } from '../types';

export const DEFAULT_HOUSE_EDGE = 0.01;

/**
 * Classic Mines fair multiplier with a configurable house edge.
 *
 *   multiplier(k) = (1 - houseEdge) * Π_{i=0}^{k-1} (N - i) / (N - M - i)
 *
 * where N = total tiles, M = mines, k = safe tiles revealed so far.
 *
 * For k = 0 the multiplier is `1 - houseEdge`. We display `1.00x` in the
 * UI when the round hasn't started so we don't surface the house edge to
 * the player while the bet is idle.
 */
export function multiplier(
  safeRevealed: number,
  mines: number,
  houseEdge = DEFAULT_HOUSE_EDGE,
): number {
  const N = TILE_COUNT;
  const M = mines;
  const k = Math.max(0, Math.min(N - M, Math.floor(safeRevealed)));

  let m = 1 - houseEdge;
  for (let i = 0; i < k; i++) {
    m *= (N - i) / (N - M - i);
  }
  return m;
}

export function payout(bet: number, safeRevealed: number, mines: number): number {
  if (safeRevealed <= 0) return 0;
  return bet * multiplier(safeRevealed, mines);
}

/**
 * Multiplier preview for the next safe reveal. Useful for the
 * "next click" indicator in the bet panel.
 */
export function nextMultiplier(safeRevealed: number, mines: number): number {
  return multiplier(safeRevealed + 1, mines);
}
