import { memo } from 'react';
import type { Tile as TileType } from '../types';

interface TileProps {
  tile: TileType;
  interactive: boolean;
  dimmed: boolean;
  onReveal: (index: number) => void;
}

function GemIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 drop-shadow-md">
      <defs>
        <linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="55%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#0ea5a4" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5 19.5 9 12 21.5 4.5 9 12 2.5Z"
        fill="url(#gemGrad)"
        stroke="#ecfeff"
        strokeOpacity=".6"
        strokeWidth="0.6"
      />
      <path d="M4.5 9h15" stroke="#ecfeff" strokeOpacity=".5" strokeWidth="0.7" />
      <path d="M12 2.5 8 9l4 12.5L16 9 12 2.5Z" fill="#ffffff" fillOpacity=".15" />
    </svg>
  );
}

function MineIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 drop-shadow-md">
      <defs>
        <radialGradient id="mineGrad" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="60%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12.5" r="6.5" fill="url(#mineGrad)" />
      <g stroke="#fecaca" strokeWidth="1.2" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="6" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="3" y1="12.5" x2="6" y2="12.5" />
        <line x1="18" y1="12.5" x2="21" y2="12.5" />
        <line x1="5.5" y1="6" x2="7.5" y2="8" />
        <line x1="16.5" y1="17" x2="18.5" y2="19" />
        <line x1="5.5" y1="19" x2="7.5" y2="17" />
        <line x1="16.5" y1="8" x2="18.5" y2="6" />
      </g>
      <circle cx="10" cy="10.5" r="1.2" fill="#ffffff" fillOpacity=".7" />
    </svg>
  );
}

function TileImpl({ tile, interactive, dimmed, onReveal }: TileProps) {
  const isRevealed = tile.state === 'revealed';
  const isMine = tile.kind === 'mine';

  const handleClick = () => {
    if (!interactive || isRevealed) return;
    onReveal(tile.index);
  };

  const baseClasses =
    'relative aspect-square w-full select-none rounded-xl tile-flip ' +
    (isRevealed ? 'is-revealed ' : '') +
    (interactive && !isRevealed
      ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-transform '
      : 'cursor-default ');

  const frontClasses =
    'tile-face bg-bg-tile border border-white/5 shadow-inner ' +
    (interactive && !isRevealed ? 'hover:bg-bg-tileHover' : '') +
    (dimmed ? ' opacity-60' : '');

  const backClasses =
    'tile-face tile-back border ' +
    (isMine
      ? 'bg-bg-tileMine border-red-400/30 shadow-glowDanger'
      : 'bg-bg-tileSafe border-emerald-300/30 shadow-glow') +
    (dimmed && !isMine ? ' opacity-50' : '');

  return (
    <button
      type="button"
      className={baseClasses}
      onClick={handleClick}
      aria-label={isRevealed ? (isMine ? 'Mine' : 'Safe tile') : 'Hidden tile'}
      aria-pressed={isRevealed}
      disabled={!interactive || isRevealed}
    >
      <span className={frontClasses}>
        <span className="h-2 w-2 rounded-full bg-white/10" aria-hidden="true" />
      </span>
      <span className={backClasses}>
        <span className="animate-pop">{isMine ? <MineIcon /> : <GemIcon />}</span>
      </span>
    </button>
  );
}

export const Tile = memo(TileImpl);
