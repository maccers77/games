import { formatCurrency } from '@games/shell';
import type { GamePhase } from '../types';
import type { RoundResult } from '../hooks/useHiLoGame';
import { HiLoResult } from './HiLoResult';

interface BetPanelProps {
  phase: GamePhase;
  stake: number;
  currency: string;
  picksWon: number;
  currentMultiplier: number;
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
          {isWin ? 'Cashed out' : 'Bust'}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-400">Picks</span>
        <span className="font-mono text-sm text-slate-100">{result.picksWon}</span>
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
            ? `+${formatCurrency(result.payout - result.stake, currency)}`
            : `−${formatCurrency(result.stake, currency)}`}
        </span>
      </div>
    </div>
  );
}

export function BetPanel(props: BetPanelProps) {
  const {
    phase,
    stake,
    currency,
    picksWon,
    currentMultiplier,
    potentialPayout,
    lastResult,
    onStart,
    onCashOut,
  } = props;

  const isPlaying = phase === 'playing';
  const isFinished = phase === 'won' || phase === 'lost';
  const canCashOut = isPlaying && picksWon > 0;

  return (
    <div className="flex w-full flex-col gap-3">
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
                {isPlaying ? 'Cash out' : 'Profit on win'}
              </span>
              <span className="font-mono text-sm text-accent-gold">
                {isPlaying
                  ? formatCurrency(potentialPayout, currency)
                  : formatCurrency(0, currency)}
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
            : 'Pick a side to cash out'}
        </button>
      ) : isFinished && lastResult ? (
        <HiLoResult result={lastResult} currency={currency} inline />
      ) : (
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
