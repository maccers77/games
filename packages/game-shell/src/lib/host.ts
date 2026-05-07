/**
 * Post a structured event to the parent window so a host prototype can
 * react. Generic over the game's event union; safe to call when not in
 * an iframe.
 */
export function postToHost<E extends { type: string }>(event: E): void {
  if (typeof window === 'undefined') return;
  try {
    window.parent.postMessage(event, '*');
  } catch {
    /* ignore: cross-origin parent or detached frame */
  }
}

export type GameId = 'crash' | 'mines' | string;

/** Unified outcome event posted to the parent at the end of a single round. */
export interface GameResultEvent {
  type: 'game:result';
  game: GameId;
  outcome: 'won' | 'lost';
  /** Stake the round was played with (major units). */
  stake: number;
  /** Multiplier the round resolved on (cashout multiplier on win, crash/0 on loss). */
  multiplier: number;
  /** Payout credited to the player (0 on loss). */
  payout: number;
  currency: string;
}

export function postGameResult(payload: Omit<GameResultEvent, 'type'>): void {
  postToHost<GameResultEvent>({ type: 'game:result', ...payload });
}
