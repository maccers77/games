import type { GamePhase } from '../types';

interface MultiplierDisplayProps {
  phase: GamePhase;
  multiplier: number;
}

function colorFor(phase: GamePhase, m: number): string {
  if (phase === 'crashed') return 'text-accent-danger';
  if (m >= 5) return 'text-accent-danger';
  if (m >= 2) return 'text-accent-gold';
  return 'text-slate-100';
}

export function MultiplierDisplay({ phase, multiplier }: MultiplierDisplayProps) {
  const color = colorFor(phase, multiplier);
  const label =
    phase === 'idle' ? 'Ready' : phase === 'crashed' ? 'Crashed' : 'Multiplier';

  return (
    <div className="pointer-events-none absolute inset-x-0 top-5 z-10 grid place-items-center text-center">
      <div
        className="rounded-full bg-slate-900/45 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-100 backdrop-blur-sm"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {label}
      </div>
      <div
        className={
          'mt-1 font-mono text-6xl font-bold leading-none sm:text-7xl ' + color
        }
        style={{
          transition: 'color 200ms ease-out',
          textShadow:
            '0 2px 4px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.45), 0 0 1px rgba(0,0,0,0.85)',
          WebkitTextStroke: '1px rgba(0,0,0,0.35)',
        }}
      >
        {multiplier.toFixed(2)}x
      </div>
    </div>
  );
}
