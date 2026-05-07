import { formatCurrency } from '@games/shell';
import type { GamePhase } from '../types';

interface BetPanelProps {
  phase: GamePhase;
  multiplier: number;
  stake: number;
  currency: string;
  outcome: 'won' | 'lost' | null;
  cashoutMultiplier: number | null;
  payout: number | null;
  onStart: () => void;
  onCashOut: () => void;
}

export function BetPanel({
  phase,
  multiplier,
  stake,
  currency,
  outcome,
  cashoutMultiplier,
  payout,
  onStart,
  onCashOut,
}: BetPanelProps) {
  if (phase === 'idle') {
    return (
      <button
        type="button"
        onClick={onStart}
        className="rounded-xl bg-accent py-3 text-base font-semibold text-slate-900 shadow-glow transition hover:brightness-110"
      >
        Start round · {formatCurrency(stake, currency)}
      </button>
    );
  }

  if (phase === 'running') {
    if (outcome === 'won') {
      return (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-3 text-center text-sm text-emerald-200">
          Cashed out at{' '}
          <span className="mx-1 font-mono text-emerald-100">
            {cashoutMultiplier?.toFixed(2)}x
          </span>
          <div className="mt-1 font-mono text-base text-emerald-100">
            +{formatCurrency((payout ?? 0) - stake, currency)}
          </div>
        </div>
      );
    }
    const livePayout = stake * multiplier;
    return (
      <button
        type="button"
        onClick={onCashOut}
        className="rounded-xl bg-accent-gold py-3 text-base font-semibold text-slate-900 shadow-glowGold transition hover:brightness-110"
      >
        Cash out {formatCurrency(livePayout, currency)}
      </button>
    );
  }

  // crashed
  if (outcome === 'won') {
    return (
      <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-3 text-center text-sm text-emerald-200">
        Won{' '}
        <span className="font-mono text-emerald-100">
          {formatCurrency(payout ?? 0, currency)}
        </span>{' '}
        at{' '}
        <span className="font-mono text-emerald-100">
          {cashoutMultiplier?.toFixed(2)}x
        </span>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-3 text-center text-sm text-red-200">
      Crashed at <span className="font-mono">{multiplier.toFixed(2)}x</span>
      <div className="mt-1 font-mono text-red-100">
        −{formatCurrency(stake, currency)}
      </div>
    </div>
  );
}
