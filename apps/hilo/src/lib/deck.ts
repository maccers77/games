import { type Card, type Rank, RANKS, SUITS } from '../types';

/**
 * Build a fresh ordered 52-card deck (4 suits x 13 ranks 2..14).
 */
export function createDeck(): Card[] {
  const out: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      out.push({ rank: rank as Rank, suit });
    }
  }
  return out;
}

/**
 * In-place Fisher-Yates shuffle. Returns a new array; the input is not
 * mutated. Uses Math.random for parity with Crash and Mines (no
 * deterministic seeding hook needed for the prototype).
 */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

export function shuffledDeck(): Card[] {
  return shuffle(createDeck());
}
