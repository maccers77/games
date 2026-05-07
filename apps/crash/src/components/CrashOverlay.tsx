import {
  CRASHED_TEXT_SRC,
  CRASH_SMOKE_LARGE_SRC,
  CRASH_SMOKE_SMALL_SRC,
} from '../lib/assetLayers';

interface CrashOverlayProps {
  multiplier: number;
}

/**
 * Full-stage crash treatment: a darkening wash, a couple of smoke
 * puffs erupting around the keke, and the big "CRASHED!" graphic
 * with the final multiplier.
 */
export function CrashOverlay({ multiplier }: CrashOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute inset-0 bg-red-950/25" />

      {/* Smoke puffs around the keke (z-stacked under the text) */}
      <img
        src={CRASH_SMOKE_LARGE_SRC}
        alt=""
        aria-hidden
        className="absolute select-none"
        style={{
          left: '34%',
          bottom: '8%',
          width: '38%',
          maxWidth: 420,
          transformOrigin: 'center bottom',
          animation: 'smokePuff 1500ms ease-out forwards',
          opacity: 0,
        }}
      />
      <img
        src={CRASH_SMOKE_SMALL_SRC}
        alt=""
        aria-hidden
        className="absolute select-none"
        style={{
          left: '28%',
          bottom: '28%',
          width: '22%',
          maxWidth: 260,
          transformOrigin: 'center bottom',
          animation: 'smokePuff 1200ms ease-out 120ms forwards',
          opacity: 0,
        }}
      />

      {/* CRASHED! text — moved up so the keke + dazed chicken stay visible */}
      <div className="absolute inset-x-0 top-3 grid place-items-center text-center">
        <img
          src={CRASHED_TEXT_SRC}
          alt="Crashed"
          className="select-none drop-shadow-[0_8px_18px_rgba(180,20,20,0.55)]"
          style={{
            width: '44%',
            maxWidth: 360,
            animation:
              'crashTextIn 360ms cubic-bezier(0.2, 0.9, 0.3, 1.4) forwards',
            transformOrigin: 'center center',
          }}
        />
        <div
          className="mt-1 font-mono text-4xl font-bold text-accent-danger drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)] sm:text-5xl"
          style={{
            animation:
              'crashTextIn 480ms cubic-bezier(0.2, 0.9, 0.3, 1.4) 80ms both',
            textShadow:
              '0 2px 4px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.85)',
            WebkitTextStroke: '1px rgba(0,0,0,0.35)',
          }}
        >
          {multiplier.toFixed(2)}x
        </div>
      </div>
    </div>
  );
}
