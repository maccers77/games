import { TILE_COUNT, type Board, type RevealResult, type Tile } from '../types';

export const MIN_MINES = 1;
export const MAX_MINES = TILE_COUNT - 1;

export function clampMines(mines: number): number {
  if (!Number.isFinite(mines)) return MIN_MINES;
  return Math.max(MIN_MINES, Math.min(MAX_MINES, Math.floor(mines)));
}

/**
 * Build an empty board of all hidden, safe tiles.
 */
function blankBoard(): Board {
  return Array.from({ length: TILE_COUNT }, (_, index) => ({
    index,
    kind: 'safe',
    state: 'hidden',
  }));
}

/**
 * Mulberry32 PRNG. Used when a deterministic seed is supplied so we can
 * later swap in a provably-fair RNG (e.g. HMAC-SHA256 stream) without
 * touching call sites.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Place `mines` mines on a fresh 6x6 board using a Fisher-Yates shuffle
 * over tile indices. Pure; takes an optional seed for determinism.
 */
export function createBoard(mines: number, seed?: number): Board {
  const count = clampMines(mines);
  const rand = seed !== undefined ? mulberry32(seed) : Math.random;

  const indices = Array.from({ length: TILE_COUNT }, (_, i) => i);
  for (let i = TILE_COUNT - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = indices[i]!;
    indices[i] = indices[j]!;
    indices[j] = tmp;
  }

  const board = blankBoard();
  for (let i = 0; i < count; i++) {
    const idx = indices[i]!;
    board[idx] = { ...board[idx]!, kind: 'mine' };
  }
  return board;
}

/**
 * Reveal a single tile and return the new board plus the outcome.
 * No-op if the tile is already revealed.
 */
export function reveal(board: Board, index: number): RevealResult {
  const tile = board[index];
  if (!tile) {
    throw new Error(`Invalid tile index ${index}`);
  }
  if (tile.state === 'revealed') {
    return { board, outcome: tile.kind };
  }

  const next = board.slice();
  next[index] = { ...tile, state: 'revealed' };
  return { board: next, outcome: tile.kind };
}

/**
 * Reveal every remaining hidden tile. Used on round end so the player
 * can see where the mines were.
 */
export function revealAll(board: Board): Board {
  return board.map((t): Tile => (t.state === 'revealed' ? t : { ...t, state: 'revealed' }));
}

export function countSafeRevealed(board: Board): number {
  let n = 0;
  for (const t of board) {
    if (t.state === 'revealed' && t.kind === 'safe') n++;
  }
  return n;
}
