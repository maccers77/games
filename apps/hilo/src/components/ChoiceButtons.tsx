import type { Direction, GamePhase } from '../types';

interface ChoiceButtonsProps {
  phase: GamePhase;
  higherProbability: number;
  lowerProbability: number;
  onPick: (direction: Direction) => void;
}

function pct(p: number): string {
  if (!Number.isFinite(p)) return '—';
  return `${Math.round(p * 100)}%`;
}

export function ChoiceButtons({
  phase,
  higherProbability,
  lowerProbability,
  onPick,
}: ChoiceButtonsProps) {
  const isPlaying = phase === 'playing';
  const higherDisabled = !isPlaying || higherProbability <= 0;
  const lowerDisabled = !isPlaying || lowerProbability <= 0;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => onPick('higherOrSame')}
        disabled={higherDisabled}
        className="group flex flex-col items-stretch gap-0.5 rounded-xl bg-bg-tile/80 px-3 py-2.5 text-left ring-1 ring-white/10 transition hover:bg-bg-tile hover:ring-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-bg-tile/80 disabled:hover:ring-white/10 sm:px-4 sm:py-3"
      >
        <span className="flex items-baseline gap-1.5">
          <span aria-hidden className="text-base text-emerald-300">
            &uarr;
          </span>
          <span className="text-sm font-semibold text-slate-100">Higher or same</span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
          win chance {pct(higherProbability)}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onPick('lowerOrSame')}
        disabled={lowerDisabled}
        className="group flex flex-col items-stretch gap-0.5 rounded-xl bg-bg-tile/80 px-3 py-2.5 text-left ring-1 ring-white/10 transition hover:bg-bg-tile hover:ring-amber-300/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-bg-tile/80 disabled:hover:ring-white/10 sm:px-4 sm:py-3"
      >
        <span className="flex items-baseline gap-1.5">
          <span aria-hidden className="text-base text-amber-300">
            &darr;
          </span>
          <span className="text-sm font-semibold text-slate-100">Lower or same</span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
          win chance {pct(lowerProbability)}
        </span>
      </button>
    </div>
  );
}
