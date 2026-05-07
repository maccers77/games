import { formatCurrency } from '@games/shell';
import type { GamePhase } from '../types';
import type { RoundResult } from '../hooks/useMinesGame';

interface BetPanelProps {
  phase: GamePhase;
  stake: number;
  mines: number;
  currency: string;
  safeRevealed: number;
  currentMultiplier: number;
  nextMultiplierValue: number;
  potentialPayout: number;
  lastResult: RoundResult | null;
  onStart: () => void;
  onCashOut: () => void;
}

function formatMultiplier(m: number): string {
  if (!Number.isFinite(m)) return '—';
  return `${m.toFixed(2)}x`;
}

function FinishedSummary({
  result,
  currency,
}: {
  result: RoundResult;
  currency: string;
}) {
  const isWin = result.outcome === 'won';
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-400">Result</span>
        <span
          className={
            'font-mono text-sm ' + (isWin ? 'text-emerald-300' : 'text-red-300')
          }
        >
          {isWin ? 'Cashed out' : 'Hit a mine'}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-400">Multiplier</span>
        <span className="font-mono text-lg text-accent">
          {isWin ? formatMultiplier(result.multiplier) : '—'}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-400">
          {isWin ? 'Profit' : 'Loss'}
        </span>
        <span
          className={
            'font-mono text-sm ' + (isWin ? 'text-accent-gold' : 'text-red-300')
          }
        >
          {isWin
            ? `+${formatCurrency(result.delta, currency)}`
            : `−${formatCurrency(result.bet, currency)}`}
        </span>
      </div>
    </div>
  );
}

export function BetPanel(props: BetPanelProps) {
  const {
    phase,
    stake,
    mines,
    currency,
    safeRevealed,
    currentMultiplier,
    nextMultiplierValue,
    potentialPayout,
    lastResult,
    onStart,
    onCashOut,
  } = props;

  const isPlaying = phase === 'playing';
  const isFinished = phase === 'won' || phase === 'lost';
  const canCashOut = isPlaying && safeRevealed > 0;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="rounded-xl bg-bg-tile/60 p-3 ring-1 ring-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-slate-400">Stake</span>
          <span className="font-mono text-sm text-slate-100">
            {formatCurrency(stake, currency)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-slate-400">Mines</span>
          <span className="font-mono text-sm text-slate-100">{mines}</span>
        </div>
      </div>

      <div className="rounded-xl bg-bg-tile/60 p-3 ring-1 ring-white/5">
        {isFinished && lastResult ? (
          <FinishedSummary result={lastResult} currency={currency} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400">Multiplier</span>
              <span className="font-mono text-lg text-accent">
                {formatMultiplier(currentMultiplier)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                {isPlaying ? 'Next reveal' : 'Next reveal preview'}
              </span>
              <span className="font-mono text-sm text-slate-200">
                {formatMultiplier(nextMultiplierValue)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                {isPlaying ? 'Cash out' : 'Profit on win'}
              </span>
              <span className="font-mono text-sm text-accent-gold">
                {isPlaying
                  ? formatCurrency(potentialPayout, currency)
                  : formatCurrency(stake * nextMultiplierValue - stake, currency)}
              </span>
            </div>
          </>
        )}
      </div>

      {isPlaying ? (
        <button
          type="button"
          onClick={onCashOut}
          disabled={!canCashOut}
          className="rounded-xl bg-accent-gold py-3 text-base font-semibold text-slate-900 shadow-glowGold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {canCashOut
            ? `Cash out ${formatCurrency(potentialPayout, currency)}`
            : 'Reveal a tile to cash out'}
        </button>
      ) : isFinished ? null : (
        <button
          type="button"
          onClick={onStart}
          className="rounded-xl bg-accent py-3 text-base font-semibold text-slate-900 shadow-glow transition hover:brightness-110"
        >
          Start round · {formatCurrency(stake, currency)}
        </button>
      )}
    </div>
  );
}
