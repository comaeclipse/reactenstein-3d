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

export interface Sprite {
  x: number;
  y: number;
  texture: number;
  // Optional per-sprite rendering controls
  // scale: multiplies sprite size relative to default (1 = default)
  scale?: number;
  // yOffset: vertical offset as a fraction of the sprite height
  // negative values move the sprite up (useful to place items on tables)
  yOffset?: number;
}