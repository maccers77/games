import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CHICKEN_DRIVE_THRESHOLDS,
  CHICKEN_SEQUENCES,
  CHICKEN_SHEET,
  CHICKEN_SRC,
  type ChickenSequence,
} from '../lib/assetLayers';
import type { GamePhase } from '../types';
import kekeSvgRaw from '../assets/keke.svg?raw';

interface KekeWithChickenProps {
  phase: GamePhase;
  multiplier: number;
}

/**
 * The keke arrives as a Svelte-exported SVG that already contains a
 * <g aria-label="Chicken"> wrapper with an inner <svg> whose viewBox
 * crops a 208 × 310 window into the chicken sprite strip. The original
 * <image href="..."> pointed at a CDN that no longer resolves; we patch
 * it once at module-load time to point at our local sprite, and tag the
 * inner SVG with an id so React can mutate its viewBox per frame to
 * drive the animation. Crucially this keeps the chicken sandwiched
 * between the keke's `inside-back` and `inside-front` layers exactly
 * where the artist intended.
 *
 * Each chicken frame in the sheet is 208px wide; viewBox min-x for
 * frame N is (N * 208).
 */

const CHICKEN_FRAME_PX = CHICKEN_SHEET.frameWidthPx; // 208
const CHICKEN_FRAME_HEIGHT = 310; // matches the inner svg's viewBox/height
const CHICKEN_SVG_ID = '__games-crash-chicken-window__';

const PROCESSED_KEKE_SVG: string = (() => {
  let s = kekeSvgRaw;

  // Drop the outer <svg>'s explicit width/height so it scales to its
  // container. The viewBox keeps the aspect ratio.
  s = s.replace(/^(<svg\b[^>]*?)\s+width="[^"]+"/, '$1');
  s = s.replace(/^(<svg\b[^>]*?)\s+height="[^"]+"/, '$1');

  // Repoint the broken CDN sprite href at our locally-served sprite.
  s = s.replace(
    /href="https:\/\/cdn\.originals\.betking-games\.com[^"]*"/,
    `href="${CHICKEN_SRC}"`,
  );

  // Tag the inner <svg> wrapping the chicken sprite so we can find it
  // at runtime and update its viewBox to step through frames.
  s = s.replace(
    /(<g\b[^>]*aria-label="Chicken"[^>]*>\s*<svg)\b/,
    `$1 id="${CHICKEN_SVG_ID}"`,
  );

  return s;
})();

/** Pick the sprite sequence that matches the current round state. */
function selectSequence(phase: GamePhase, multiplier: number): ChickenSequence {
  if (phase === 'crashed') return CHICKEN_SEQUENCES.crash;
  if (phase !== 'running') {
    // idle (and any non-running, non-crashed state): freeze on the
    // first driving frame so the keke + chicken sit still until Start.
    return { ...CHICKEN_SEQUENCES.drive1, frameMs: 0, loop: false };
  }
  if (multiplier >= CHICKEN_DRIVE_THRESHOLDS.level3) return CHICKEN_SEQUENCES.drive3;
  if (multiplier >= CHICKEN_DRIVE_THRESHOLDS.level2) return CHICKEN_SEQUENCES.drive2;
  return CHICKEN_SEQUENCES.drive1;
}

/**
 * Step through a sequence's frames at its configured rate. Loops when
 * `sequence.loop` is true; otherwise plays once and holds endFrame.
 * Restarts whenever the sequence identity changes.
 */
function useSequenceFrame(sequence: ChickenSequence): number {
  const [frame, setFrame] = useState(sequence.startFrame);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setFrame(sequence.startFrame);
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (sequence.frameMs <= 0 || sequence.endFrame === sequence.startFrame) return;

    intervalRef.current = window.setInterval(() => {
      setFrame((current) => {
        const next = current + 1;
        if (next > sequence.endFrame) {
          if (sequence.loop) return sequence.startFrame;
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return sequence.endFrame;
        }
        return next;
      });
    }, sequence.frameMs);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sequence.id, sequence.startFrame, sequence.endFrame, sequence.frameMs, sequence.loop]);

  return frame;
}

export function KekeWithChicken({ phase, multiplier }: KekeWithChickenProps) {
  const sequence = useMemo(() => selectSequence(phase, multiplier), [phase, multiplier]);
  const frame = useSequenceFrame(sequence);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCrashed = phase === 'crashed';
  const isRunning = phase === 'running';

  // Mutate the inner <svg>'s viewBox each time the frame changes. We
  // touch the DOM directly because the SVG body is rendered via
  // dangerouslySetInnerHTML and isn't part of React's own tree.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const chickenSvg = root.querySelector<SVGSVGElement>(`#${CHICKEN_SVG_ID}`);
    if (!chickenSvg) return;
    chickenSvg.setAttribute(
      'viewBox',
      `${frame * CHICKEN_FRAME_PX} 0 ${CHICKEN_FRAME_PX} ${CHICKEN_FRAME_HEIGHT}`,
    );
  }, [frame]);

  return (
    <div
      className={
        'pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 ' +
        (isCrashed ? 'animate-crashShake' : '')
      }
      style={{ bottom: '14%', width: '38%', maxWidth: 360, minWidth: 180 }}
      aria-hidden="true"
    >
      <div
        className={'relative w-full ' + (isRunning ? 'animate-kekeBob' : '')}
        style={{
          transform: isCrashed ? 'rotate(-7deg) translateY(6px)' : undefined,
          transformOrigin: 'bottom center',
          transition: 'transform 220ms ease-out',
        }}
      >
        <div
          ref={containerRef}
          className="keke-inline block w-full select-none"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.45))',
          }}
          dangerouslySetInnerHTML={{ __html: PROCESSED_KEKE_SVG }}
        />
      </div>
    </div>
  );
}
