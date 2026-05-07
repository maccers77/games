export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type GamePhase = 'idle' | 'playing' | 'won' | 'lost';

export type Direction = 'higherOrSame' | 'lowerOrSame';

export const DECK_SIZE = 52;

export const RANKS: readonly Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const SUITS: readonly Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

/** Short rank label used for card corners ("2".."10", "J", "Q", "K", "A"). */
export function rankLabel(rank: Rank): string {
  if (rank === 11) return 'J';
  if (rank === 12) return 'Q';
  if (rank === 13) return 'K';
  if (rank === 14) return 'A';
  return String(rank);
}

/** Unicode glyph for each suit. */
export function suitGlyph(suit: Suit): string {
  switch (suit) {
    case 'spades':
      return '\u2660';
    case 'hearts':
      return '\u2665';
    case 'diamonds':
      return '\u2666';
    case 'clubs':
      return '\u2663';
  }
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}
