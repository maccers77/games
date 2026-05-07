import type { Card, Direction, Rank } from '../types';

/**
 * True if the drawn card matches the player's prediction relative to the
 * current card. Ties count as a win for whichever side was picked.
 */
export function isWinningPick(
  direction: Direction,
  currentRank: Rank,
  drawnRank: Rank,
): boolean {
  return direction === 'higherOrSame'
    ? drawnRank >= currentRank
    : drawnRank <= currentRank;
}

/**
 * Probability of winning for the given direction, computed against the
 * remaining deck (without replacement). Returns 0 if the deck is empty.
 */
export function probabilityFor(
  direction: Direction,
  currentRank: Rank,
  remaining: readonly Card[],
): number {
  if (remaining.length === 0) return 0;
  let matches = 0;
  for (const c of remaining) {
    if (isWinningPick(direction, currentRank, c.rank)) matches++;
  }
  return matches / remaining.length;
}
