export const GRID_SIZE = 6;
export const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export type GamePhase = 'idle' | 'playing' | 'won' | 'lost';

export type TileKind = 'mine' | 'safe';

export type TileState = 'hidden' | 'revealed';

export interface Tile {
  index: number;
  kind: TileKind;
  state: TileState;
}

export type Board = Tile[];

export interface RevealResult {
  board: Board;
  outcome: TileKind;
}
