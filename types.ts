export interface PlayerState {
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  planeX: number;
  planeY: number;
}

export interface GameSettings {
  screenWidth: number;
  screenHeight: number;
  moveSpeed: number;
  rotSpeed: number;
}

export type WorldMap = number[][];