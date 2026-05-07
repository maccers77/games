import { Tile } from './Tile';
import { GRID_SIZE, type Board, type GamePhase } from '../types';

interface GridProps {
  board: Board;
  phase: GamePhase;
  onReveal: (index: number) => void;
}

export function Grid({ board, phase, onReveal }: GridProps) {
  const interactive = phase === 'playing';
  // After cashout, dim revealed mines so the gems the player avoided still pop.
  const dimRevealedMines = phase === 'won';

  return (
    <div
      className="grid gap-2 sm:gap-3"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Mines board"
    >
      {board.map((tile) => (
        <Tile
          key={tile.index}
          tile={tile}
          interactive={interactive}
          dimmed={dimRevealedMines && tile.kind === 'mine'}
          onReveal={onReveal}
        />
      ))}
    </div>
  );
}
