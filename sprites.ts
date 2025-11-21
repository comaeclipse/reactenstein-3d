import { TEXTURE_SIZE } from './constants';
import grenadeVox from './assets/grenade.json';
import wallItemVox from './assets/wall_item.json';

type Voxel = { id: number; x: number; y: number; z: number; c: string };

const generateVoxelSprite = (voxels: Voxel[], options?: { unit?: number }): HTMLCanvasElement => {
  const size = TEXTURE_SIZE;
  const unit = options?.unit ?? 4; // pixels per voxel unit
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = false;

  const centerX = Math.floor(size / 2);
  const baseY = size - 8; // leave a small bottom margin

  // Draw back-to-front by z to approximate depth
  const sorted = [...voxels].sort((a, b) => (a.z - b.z));
  for (const v of sorted) {
    const color = v.c?.toLowerCase?.() ?? '#000000';
    // Treat pure black as transparent/empty
    if (color === '#000000') continue;
    ctx.fillStyle = color;
    const px = centerX + v.x * unit;
    const py = baseY - v.y * unit;
    ctx.fillRect(px, py - unit + 1, unit, unit); // slight +1 to tighten seams
  }

  return c;
};

export const generateSpriteTextures = (): Record<number, HTMLCanvasElement> => {
  const size = TEXTURE_SIZE;
  const createCanvas = () => {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    return c;
  };

  const sprites: Record<number, HTMLCanvasElement> = {};

  // 0: Wooden Table
  const sTable = createCanvas();
  const ctxTable = sTable.getContext('2d')!;
  ctxTable.clearRect(0, 0, size, size);

  // Table top (perspective view)
  const tableTop = 20;
  const tableBottom = 50;
  ctxTable.fillStyle = '#8B6914';
  ctxTable.beginPath();
  ctxTable.moveTo(10, tableTop);
  ctxTable.lineTo(size - 10, tableTop);
  ctxTable.lineTo(size - 5, tableTop + 5);
  ctxTable.lineTo(5, tableTop + 5);
  ctxTable.closePath();
  ctxTable.fill();

  // Table top highlights
  ctxTable.fillStyle = '#A0791A';
  ctxTable.fillRect(10, tableTop, size - 20, 2);

  // Table legs (4 legs)
  ctxTable.fillStyle = '#5C3D0D';
  const legWidth = 4;
  const legHeight = tableBottom - tableTop - 5;

  // Front left leg
  ctxTable.fillRect(12, tableTop + 5, legWidth, legHeight);
  // Front right leg
  ctxTable.fillRect(size - 16, tableTop + 5, legWidth, legHeight);
  // Back left leg (smaller, perspective)
  ctxTable.fillRect(15, tableTop + 5, 3, legHeight - 5);
  // Back right leg (smaller, perspective)
  ctxTable.fillRect(size - 18, tableTop + 5, 3, legHeight - 5);

  // Leg highlights
  ctxTable.fillStyle = '#6E4A10';
  ctxTable.fillRect(12, tableTop + 5, 1, legHeight);
  ctxTable.fillRect(size - 16, tableTop + 5, 1, legHeight);

  sprites[0] = sTable;

  // 1: Grenade from voxel model
  sprites[1] = generateVoxelSprite(grenadeVox as Voxel[], { unit: 4 });

  // 2: Machine Gun (MP40-style)
  const sGun = createCanvas();
  const ctxGun = sGun.getContext('2d')!;
  ctxGun.clearRect(0, 0, size, size);

  const gunX = size / 2;
  const gunY = size / 2;

  // Gun body (main receiver)
  ctxGun.fillStyle = '#1a1a1a';
  ctxGun.fillRect(gunX - 20, gunY - 4, 30, 8);

  // Gun barrel
  ctxGun.fillStyle = '#0a0a0a';
  ctxGun.fillRect(gunX + 10, gunY - 2, 15, 4);

  // Barrel highlight
  ctxGun.fillStyle = '#333';
  ctxGun.fillRect(gunX + 10, gunY - 2, 15, 1);

  // Magazine
  ctxGun.fillStyle = '#2a2a2a';
  ctxGun.fillRect(gunX - 5, gunY + 4, 8, 12);

  // Magazine highlight
  ctxGun.fillStyle = '#3a3a3a';
  ctxGun.fillRect(gunX - 5, gunY + 4, 1, 12);

  // Stock
  ctxGun.fillStyle = '#5C3D0D';
  ctxGun.fillRect(gunX - 25, gunY - 3, 8, 6);

  // Stock highlight
  ctxGun.fillStyle = '#7A5210';
  ctxGun.fillRect(gunX - 25, gunY - 3, 8, 2);

  // Grip
  ctxGun.fillStyle = '#3a2a1a';
  ctxGun.fillRect(gunX - 8, gunY + 2, 4, 8);

  // Metal details
  ctxGun.fillStyle = '#444';
  ctxGun.fillRect(gunX - 2, gunY - 1, 2, 2);
  ctxGun.fillRect(gunX + 5, gunY - 1, 2, 2);

  sprites[2] = sGun;

  // 3: Wall Item from voxel model
  sprites[3] = generateVoxelSprite(wallItemVox as Voxel[], { unit: 4 });

  return sprites;
};
