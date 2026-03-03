export type GameState = 'playing' | 'won' | 'lost';

export interface Star {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export interface SeagullState {
  x: number;
  y: number;
  mode: 'patrol' | 'swoop';
  nextActionTime: number;
}
