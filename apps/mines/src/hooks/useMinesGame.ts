import { useCallback, useMemo, useState } from 'react';
import { createBoard, reveal, revealAll } from '../lib/mines';
import { multiplier, nextMultiplier, payout } from '../lib/multiplier';
import { loadEmbedConfig, postGameResult } from '@games/shell';
import { TILE_COUNT, type Board, type GamePhase, type Tile } from '../types';

const FIXED_MINES = 6;

export interface RoundResult {
  outcome: 'won' | 'lost';
  bet: number;
  mines: number;
  multiplier: number;
  payout: number;
  delta: number;
}

export interface UseMinesGameApi {
  // Embed config
  stake: number;
  currency: string;
  mines: number;

  // Reactive state
  phase: GamePhase;
  board: Board;
  safeRevealed: number;
  currentMultiplier: number;
  nextMultiplierValue: number;
  potentialPayout: number;
  lastResult: RoundResult | null;

  // Actions
  startRound: () => void;
  revealTile: (index: number) => void;
  cashOut: () => void;
}

function emptyBoard(): Board {
  return Array.from({ length: TILE_COUNT }, (_, index): Tile => ({
    index,
    kind: 'safe',
    state: 'hidden',
  }));
}

export function useMinesGame(): UseMinesGameApi {
  const config = useMemo(() => loadEmbedConfig({ defaultStake: 10 }), []);
  const stake = config.stake;
  const currency = config.currency;
  const mines = FIXED_MINES;

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [safeRevealed, setSafeRevealed] = useState<number>(0);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);

  const currentMultiplier = useMemo(() => {
    if (phase === 'idle') return 1;
    if (phase === 'lost') return 0;
    return multiplier(safeRevealed, mines);
  }, [phase, safeRevealed, mines]);

  const nextMultiplierValue = useMemo(
    () => nextMultiplier(safeRevealed, mines),
    [safeRevealed, mines],
  );

  const potentialPayout = useMemo(() => {
    if (phase !== 'playing' || safeRevealed === 0) return 0;
    return payout(stake, safeRevealed, mines);
  }, [phase, safeRevealed, mines, stake]);

  const startRound = useCallback(() => {
    if (phase !== 'idle') return;
    const newBoard = createBoard(mines);
    setBoard(newBoard);
    setSafeRevealed(0);
    setPhase('playing');
    setLastResult(null);
  }, [phase, mines]);

  const revealTile = useCallback(
    (index: number) => {
      if (phase !== 'playing') return;
      const tile = board[index];
      if (!tile || tile.state === 'revealed') return;

      const { board: nextBoard, outcome } = reveal(board, index);
      if (outcome === 'mine') {
        const finalBoard = revealAll(nextBoard);
        setBoard(finalBoard);
        setPhase('lost');
        const result: RoundResult = {
          outcome: 'lost',
          bet: stake,
          mines,
          multiplier: 0,
          payout: 0,
          delta: -stake,
        };
        setLastResult(result);
        postGameResult({
          game: 'mines',
          outcome: 'lost',
          stake,
          multiplier: 0,
          payout: 0,
          currency,
        });
        return;
      }

      setBoard(nextBoard);
      setSafeRevealed((n) => n + 1);
    },
    [phase, board, stake, mines, currency],
  );

  const cashOut = useCallback(() => {
    if (phase !== 'playing') return;
    if (safeRevealed === 0) return;

    const m = multiplier(safeRevealed, mines);
    const winnings = stake * m;
    const finalBoard = revealAll(board);
    setBoard(finalBoard);
    setPhase('won');
    const result: RoundResult = {
      outcome: 'won',
      bet: stake,
      mines,
      multiplier: m,
      payout: winnings,
      delta: winnings - stake,
    };
    setLastResult(result);
    postGameResult({
      game: 'mines',
      outcome: 'won',
      stake,
      multiplier: m,
      payout: winnings,
      currency,
    });
  }, [phase, safeRevealed, mines, stake, board, currency]);

  return {
    stake,
    currency,
    mines,
    phase,
    board,
    safeRevealed,
    currentMultiplier,
    nextMultiplierValue,
    potentialPayout,
    lastResult,
    startRound,
    revealTile,
    cashOut,
  };
}
