import { ParallaxBackground } from './ParallaxBackground';
import { KekeWithChicken } from './KekeWithChicken';
import { MultiplierDisplay } from './MultiplierDisplay';
import { CrashOverlay } from './CrashOverlay';
import type { GamePhase } from '../types';

interface CrashStageProps {
  phase: GamePhase;
  multiplier: number;
}

export function CrashStage({ phase, multiplier }: CrashStageProps) {
  const isCrashed = phase === 'crashed';
  return (
    <div className="stage-canvas relative w-full overflow-hidden rounded-2xl bg-bg-tile/60 ring-1 ring-white/5">
      <ParallaxBackground phase={phase} multiplier={multiplier} />
      <KekeWithChicken phase={phase} multiplier={multiplier} />
      {!isCrashed && <MultiplierDisplay phase={phase} multiplier={multiplier} />}
      {isCrashed && <CrashOverlay multiplier={multiplier} />}

      {phase === 'idle' && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 text-center">
          <span
            className="inline-block rounded-full bg-slate-900/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur-sm"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Tap start to play
          </span>
        </div>
      )}
    </div>
  );
}
