/**
 * Background parallax layer manifest + hero / FX asset references.
 *
 * Each parallax layer has a `src` (path under /assets/...), a
 * `speedPxPerSec` at baseline (multiplier === 1), and a
 * `multiplierBoost` factor that scales the speed as the round
 * multiplier grows. Set `src: null` to use a procedural placeholder
 * gradient — handy until real assets are dropped into
 * apps/crash/public/assets/.
 *
 * Z-order is array order: index 0 is furthest back.
 */

/** Resolved base for runtime asset URLs. Equals '/' in dev and '/crash/' in
 *  production builds, so paths emitted into the bundle (e.g. background-image
 *  URLs set on DOM nodes) resolve correctly when deployed under a sub-path. */
const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`;
export interface ParallaxLayer {
  id: string;
  src: string | null;
  /** Pixels per second at multiplier 1.00 (baseline). */
  speedPxPerSec: number;
  /** Linear scaling: speed = base * (1 + boost * (multiplier - 1)). */
  multiplierBoost: number;
  /** Vertical alignment of the image inside the layer band. */
  align?: 'top' | 'center' | 'bottom';
  /** How the image is sized inside the band. Defaults to 'cover'. */
  fit?: 'cover' | 'contain' | 'auto';
  /** Height % (of the stage) the layer occupies. Default 100. */
  bandPct?: number;
  /** Distance from the bottom of the stage (in stage %). Defaults to 0. */
  bottomPct?: number;
  /** Optional placeholder gradient if `src` is null or fails to load. */
  placeholderGradient?: string;
}

export const layers: ParallaxLayer[] = [
  
  // 0 — Sky wash. Solid colour fills the whole stage; clouds drift over it.
  {
    id: 'sky-wash',
    src: null,
    speedPxPerSec: 0,
    multiplierBoost: 0,
    bandPct: 100,
    placeholderGradient:
      'linear-gradient(180deg, #c9e7ff 0%, #e6f3ff 55%, #f7e7c8 100%)',
  },
  // 5 — Road (asphalt with dashes). Fastest layer.
  {
    id: 'road',
    src: `${ASSET_BASE}background-road.png`,
    speedPxPerSec: 240,
    multiplierBoost: 0.5,
    align: 'bottom',
    fit: 'auto',
    bandPct: 100,
    bottomPct: 0,
  },
  // 1 — Clouds. Gentle drift across the upper half.
  {
    id: 'clouds',
    src: `${ASSET_BASE}background-clouds.png`,
    speedPxPerSec: 8,
    multiplierBoost: 0.04,
    align: 'top',
    fit: 'auto',
    bandPct: 15,
    bottomPct: 80,
  },
  
  // 2 — Distant cityscape silhouette.
  {
    id: 'distant',
    src: `${ASSET_BASE}background-distant-cityscape.png`,
    speedPxPerSec: 22,
    multiplierBoost: 0.08,
    align: 'bottom',
    fit: 'auto',
    bandPct: 32,
    bottomPct: 50,
  },
  // 3 — Mid cityscape (painted houses + telephone wires).
  {
    id: 'mid',
    src: `${ASSET_BASE}background-mid-cityscape.png`,
    speedPxPerSec: 55,
    multiplierBoost: 0.18,
    align: 'bottom',
    fit: 'auto',
    bandPct: 42,
    bottomPct: 38,
  },
  // 4 — Near cityscape (BetKing storefront row).
  {
    id: 'near',
    src: `${ASSET_BASE}background-near-cityscape.png`,
    speedPxPerSec: 110,
    multiplierBoost: 0.32,
    align: 'bottom',
    fit: 'auto',
    bandPct: 38,
    bottomPct: 30,
  },
  
];

// ----- Hero & FX assets -----

/**
 * Chicken sprite sheet — single horizontal strip of 18 frames, each
 * 208px wide (native sheet width = 3744px). Layout:
 *
 *   Frames  1– 4 (idx  0– 3): default driving cycle (multiplier <  L2)
 *   Frames  5– 8 (idx  4– 7): faster driving cycle  (L2 ≤ m < L3)
 *   Frames  9–12 (idx  8–11): fastest driving cycle (m ≥ L3)
 *   Frames 13–18 (idx 12–17): crash / dazed sequence (one-shot, holds last)
 *
 * Frame height is auto-detected from the image's natural dimensions at
 * runtime, so updating the source artwork doesn't require re-measuring.
 */
export const CHICKEN_SRC = `${ASSET_BASE}chicken.png`;

export const CHICKEN_SHEET = {
  framesTotal: 18,
  /** Native frame width in px. Used only as a fallback aspect hint
   *  before the image's natural size is known. */
  frameWidthPx: 208,
  /** Fallback aspect (W / H) used until the real sheet has loaded.
   *  208 wide × ~310 tall is roughly the published sprite footprint. */
  fallbackFrameAspect: 208 / 310,
};

export interface ChickenSequence {
  id: string;
  /** First frame index (0-based, inclusive). */
  startFrame: number;
  /** Last frame index (0-based, inclusive). */
  endFrame: number;
  /** Milliseconds per frame while playing. 0 = freeze on startFrame. */
  frameMs: number;
  /** Loop indefinitely (true) or play once and hold endFrame (false). */
  loop: boolean;
}

export const CHICKEN_SEQUENCES = {
  /** Default cruise — relaxed pedalling. */
  drive1: { id: 'drive1', startFrame: 0, endFrame: 3, frameMs: 90, loop: true },
  /** Mid-tier cruise — faster pedalling, kicks in at threshold L2. */
  drive2: { id: 'drive2', startFrame: 4, endFrame: 7, frameMs: 70, loop: true },
  /** Top-tier cruise — frantic pedalling, kicks in at threshold L3. */
  drive3: { id: 'drive3', startFrame: 8, endFrame: 11, frameMs: 50, loop: true },
  /** Crash sequence — six frames, plays once and holds the final pose. */
  crash: { id: 'crash', startFrame: 12, endFrame: 17, frameMs: 90, loop: false },
} satisfies Record<string, ChickenSequence>;

/** Multiplier thresholds at which the driving cycle escalates. */
export const CHICKEN_DRIVE_THRESHOLDS = {
  /** Switch from drive1 → drive2 at this multiplier (inclusive). */
  level2: 5.0,
  /** Switch from drive2 → drive3 at this multiplier (inclusive). */
  level3: 10.0,
};

export const CRASHED_TEXT_SRC = `${ASSET_BASE}crashed-text.png`;
export const CRASH_SMOKE_LARGE_SRC = `${ASSET_BASE}crash-smoke-large.png`;
export const CRASH_SMOKE_SMALL_SRC = `${ASSET_BASE}crash-smoke-small.png`;
