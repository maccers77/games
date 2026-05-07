import { useEffect, useState, type CSSProperties } from 'react';
import { layers, type ParallaxLayer } from '../lib/assetLayers';
import type { GamePhase } from '../types';

interface ParallaxBackgroundProps {
  phase: GamePhase;
  multiplier: number;
}

/**
 * Probe whether each layer's image is reachable. We swap to the
 * placeholder gradient if the asset isn't there yet.
 */
function useImageProbe(srcs: ReadonlyArray<string | null>): Map<string, boolean> {
  const [present, setPresent] = useState<Map<string, boolean>>(() => new Map());
  useEffect(() => {
    let cancelled = false;
    const next = new Map<string, boolean>();
    const checks = srcs
      .filter((s): s is string => typeof s === 'string')
      .map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              next.set(src, true);
              resolve();
            };
            img.onerror = () => {
              next.set(src, false);
              resolve();
            };
            img.src = src;
          }),
      );
    Promise.all(checks).then(() => {
      if (!cancelled) setPresent(next);
    });
    return () => {
      cancelled = true;
    };
  }, [srcs]);
  return present;
}

export function ParallaxBackground({ phase, multiplier }: ParallaxBackgroundProps) {
  const probed = useImageProbe(layers.map((l) => l.src));
  const isPaused = phase !== 'running';

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-2xl"
      aria-hidden="true"
    >
      {layers.map((layer, i) => (
        <Layer
          key={layer.id}
          layer={layer}
          imageReady={layer.src ? probed.get(layer.src) === true : false}
          paused={isPaused}
          zIndex={i}
          multiplier={multiplier}
        />
      ))}
    </div>
  );
}

interface LayerProps {
  layer: ParallaxLayer;
  imageReady: boolean;
  paused: boolean;
  zIndex: number;
  multiplier: number;
}

function Layer({ layer, imageReady, paused, zIndex, multiplier }: LayerProps) {
  const speed =
    layer.speedPxPerSec * (1 + layer.multiplierBoost * Math.max(0, multiplier - 1));
  // Each tile is 100% wide; full cycle (left -100%) covers one tile width.
  const VIEWPORT_PX = 960;
  const cycleSec = speed > 0 ? VIEWPORT_PX / speed : 0;

  const useImage = imageReady && !!layer.src;
  const fit = layer.fit ?? 'cover';

  const verticalAlign =
    layer.align === 'top'
      ? 'top'
      : layer.align === 'center'
        ? 'center'
        : 'bottom';

  // Layer band (height + vertical position within the stage).
  const bandPct = layer.bandPct ?? 100;
  const bottomPct = layer.bottomPct ?? 0;
  const bandStyle: CSSProperties = {
    bottom: `${bottomPct}%`,
    height: `${bandPct}%`,
  };

  // Background style for each tile. Use longhand background-* props to
  // avoid React's shorthand-vs-longhand "conflicting property" warning.
  // 'auto' fit preserves the native aspect ratio: scale by band height
  // only and tile horizontally so the strip has no gap at any width.
  const tileStyle: CSSProperties = useImage
    ? {
        backgroundImage: `url(${layer.src})`,
        backgroundSize:
          fit === 'cover' ? 'cover' : fit === 'contain' ? 'contain' : 'auto 100%',
        backgroundRepeat:
          fit === 'cover' || fit === 'contain' ? 'no-repeat' : 'repeat-x',
        backgroundPosition: `center ${verticalAlign}`,
      }
    : {
        backgroundImage: layer.placeholderGradient ?? 'none',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `center ${verticalAlign}`,
      };

  // Static layers (no scroll) render a single full-width tile.
  if (cycleSec === 0) {
    return (
      <div
        className="absolute inset-x-0"
        style={{ ...bandStyle, zIndex, ...tileStyle }}
      />
    );
  }

  return (
    <div
      className="parallax-track absolute inset-x-0"
      style={{
        ...bandStyle,
        zIndex,
        animationName: 'parallaxScroll',
        animationDuration: `${cycleSec}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      <div
        className="absolute inset-y-0"
        style={{ left: 0, width: '100%', ...tileStyle }}
      />
      <div
        className="absolute inset-y-0"
        style={{ left: '100%', width: '100%', ...tileStyle }}
      />
    </div>
  );
}
