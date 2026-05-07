import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadEmbedConfig, postGameResult } from '@games/shell';
import { multiplierAt, elapsedForMultiplier } from '../lib/multiplier';
import { nextCrashPoint, HARD_CAP } from '../lib/crashPoint';
import type { GamePhase } from '../types';

const RENDER_THROTTLE_MS = 33; // ~30fps React updates; RAF still fires every frame

export interface UseCrashGameApi {
  // Embed config
  stake: number;
  currency: string;

  // Round state
  phase: GamePhase;
  multiplier: number;
  outcome: 'won' | 'lost' | null;
  cashoutMultiplier: number | null;
  payout: number | null;

  // Round control
  startRound: () => void;
  cashOut: () => void;
}

export function useCrashGame(): UseCrashGameApi {
  const config = useMemo(() => loadEmbedConfig({ defaultStake: 10 }), []);

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [multiplier, setMultiplier] = useState(1);
  const [outcome, setOutcome] = useState<'won' | 'lost' | null>(null);
  const [cashoutMultiplier, setCashoutMultiplier] = useState<number | null>(null);
  const [payout, setPayout] = useState<number | null>(null);

  // Mutable refs the RAF loop reads/writes without triggering re-renders.
  const rafIdRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const lastRenderAtRef = useRef<number>(0);
  const crashPointRef = useRef<number>(1);
  const phaseRef = useRef<GamePhase>(phase);
  const outcomeRef = useRef<'won' | 'lost' | null>(outcome);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    outcomeRef.current = outcome;
  }, [outcome]);

  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      if (phaseRef.current !== 'running') return;

      const elapsedMs = now - startedAtRef.current;
      const m = Math.min(HARD_CAP, multiplierAt(elapsedMs));

      if (m >= crashPointRef.current) {
        const finalM = crashPointRef.current;
        setMultiplier(finalM);
        setPhase('crashed');
        // Only emit a 'lost' result if the player hadn't already cashed out.
        if (outcomeRef.current === null) {
          setOutcome('lost');
          postGameResult({
            game: 'crash',
            outcome: 'lost',
            stake: config.stake,
            multiplier: finalM,
            payout: 0,
            currency: config.currency,
          });
        }
        stopLoop();
        return;
      }

      if (now - lastRenderAtRef.current >= RENDER_THROTTLE_MS) {
        setMultiplier(m);
        lastRenderAtRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    },
    [config.stake, config.currency, stopLoop],
  );

  const startRound = useCallback(() => {
    if (phaseRef.current !== 'idle') return;
    crashPointRef.current = nextCrashPoint();
    startedAtRef.current = performance.now();
    lastRenderAtRef.current = startedAtRef.current;
    setMultiplier(1);
    setOutcome(null);
    setCashoutMultiplier(null);
    setPayout(null);
    setPhase('running');
    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const cashOut = useCallback(() => {
    if (phaseRef.current !== 'running') return;
    if (outcomeRef.current !== null) return;

    const now = performance.now();
    const liveM = Math.min(
      crashPointRef.current,
      multiplierAt(now - startedAtRef.current),
    );
    const winnings = config.stake * liveM;

    setCashoutMultiplier(liveM);
    setPayout(winnings);
    setOutcome('won');
    postGameResult({
      game: 'crash',
      outcome: 'won',
      stake: config.stake,
      multiplier: liveM,
      payout: winnings,
      currency: config.currency,
    });
  }, [config.stake, config.currency]);

  // Cleanup on unmount.
  useEffect(() => () => stopLoop(), [stopLoop]);

  return {
    stake: config.stake,
    currency: config.currency,
    phase,
    multiplier,
    outcome,
    cashoutMultiplier,
    payout,
    startRound,
    cashOut,
  };
}

// Re-exported so UI can compute helper values without importing lib directly.
export { elapsedForMultiplier };
