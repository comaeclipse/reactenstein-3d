import React, { useEffect, useRef } from 'react';
import { SETTINGS, WORLD_MAP, FLOOR_MAP, SPRITES, COLORS, TEXTURE_SIZE } from '../constants';
import { useInput } from '../hooks/useInput';
import { PlayerState } from '../types';

interface GameCanvasProps {
  onPlayerUpdate: (player: PlayerState) => void;
}

interface TexturePack {
  walls: Record<number, HTMLCanvasElement | HTMLCanvasElement[]>;
  floor: Uint32Array;
  carpet: Uint32Array;
  sprites: Record<number, HTMLCanvasElement>;
}

const generateTextures = (): TexturePack => {
  const walls: Record<number, HTMLCanvasElement | HTMLCanvasElement[]> = {};
  const size = TEXTURE_SIZE;
  
  const createCanvas = () => {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    return c;
  };

  // 1: Blue Wall (Brick)
  const t1 = createCanvas();
  const ctx1 = t1.getContext('2d')!;
  ctx1.fillStyle = '#2a2a5a'; 
  ctx1.fillRect(0, 0, size, size);
  ctx1.fillStyle = '#4a4a8a'; 
  for(let y = 0; y < size; y += 16) {
     for(let x = 0; x < size; x += 32) {
         const offset = (y / 16) % 2 === 0 ? 0 : 16;
         ctx1.fillRect(x + offset + 1, y + 1, 30, 14);
     }
  }
  walls[1] = t1;

  // 2: Green Wall (Mossy Stone)
  const t2 = createCanvas();
  const ctx2 = t2.getContext('2d')!;
  ctx2.fillStyle = '#2a4a2a';
  ctx2.fillRect(0, 0, size, size);
  for(let i = 0; i < 300; i++) {
    ctx2.fillStyle = Math.random() > 0.5 ? '#3a5a3a' : '#1a3a1a';
    const rx = Math.floor(Math.random() * size);
    const ry = Math.floor(Math.random() * size);
    ctx2.fillRect(rx, ry, 2, 2);
  }
  ctx2.fillStyle = '#1a3a1a';
  for(let i = 0; i < 5; i++) {
     ctx2.fillRect(Math.random() * size, Math.random() * size, 8, 8);
  }
  walls[2] = t2;

  // 3: Red Wall (Brick)
  const t3 = createCanvas();
  const ctx3 = t3.getContext('2d')!;
  ctx3.fillStyle = '#5a2a2a';
  ctx3.fillRect(0, 0, size, size);
  ctx3.fillStyle = '#8a4a4a';
  for(let y = 0; y < size; y += 16) {
     for(let x = 0; x < size; x += 32) {
         const offset = (y / 16) % 2 === 0 ? 0 : 16;
         ctx3.fillRect(x + offset + 1, y + 1, 30, 14);
     }
  }
  walls[3] = t3;

  // 4: Stone (Grey)
  const drawStone = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#555555';
    for(let i=0; i<16; i++) {
      for(let j=0; j<16; j++) {
         if((i+j)%2 === 0) ctx.fillRect(i*4, j*4, 4, 4);
      }
    }
    for(let i=0; i<200; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#666666' : '#333333';
      ctx.fillRect(Math.random()*size, Math.random()*size, 2, 2);
    }
  }

  const t4 = createCanvas();
  drawStone(t4.getContext('2d')!);
  walls[4] = t4;

  // 5: Wood
  const t5 = createCanvas();
  const ctx5 = t5.getContext('2d')!;
  ctx5.fillStyle = '#5C4033';
  ctx5.fillRect(0, 0, size, size);
  ctx5.fillStyle = '#4A332A';
  for(let x = 0; x < size; x += 8) {
      ctx5.fillRect(x, 0, 2, size);
  }
  ctx5.fillStyle = '#3E2b23';
  ctx5.beginPath();
  ctx5.arc(20, 30, 3, 0, Math.PI*2);
  ctx5.fill();
  ctx5.beginPath();
  ctx5.arc(50, 50, 2, 0, Math.PI*2);
  ctx5.fill();
  walls[5] = t5;

  // 6: Torch Wall (Animated)
  const torchFrames: HTMLCanvasElement[] = [];

  // Generate stone background ONCE (outside the loop) so it doesn't flicker
  const torchStoneBase = createCanvas();
  drawStone(torchStoneBase.getContext('2d')!);

  for (let frame = 0; frame < 4; frame++) {
      const tf = createCanvas();
      const tCtx = tf.getContext('2d')!;

      // Copy the same stone background for all frames
      tCtx.drawImage(torchStoneBase, 0, 0);

      // Torch Holder (Wood & Iron) - positioned higher and larger
      const cx = size / 2;
      const cy = size / 2.2;

      // Wall mount bracket with 3D effect
      // Back mounting plate
      tCtx.fillStyle = '#1a1a1a';
      tCtx.fillRect(cx - 8, cy + 8, 16, 14);

      // Bracket shadows for depth
      tCtx.fillStyle = '#0a0a0a';
      tCtx.fillRect(cx - 7, cy + 9, 2, 12);
      tCtx.fillRect(cx - 8, cy + 20, 16, 2);

      // Bracket highlights
      tCtx.fillStyle = '#3a3a3a';
      tCtx.fillRect(cx - 8, cy + 8, 16, 2);
      tCtx.fillRect(cx - 8, cy + 8, 2, 14);

      // Side brackets
      tCtx.fillStyle = '#222';
      tCtx.fillRect(cx - 6, cy + 10, 3, 10);
      tCtx.fillRect(cx + 3, cy + 10, 3, 10);

      // Torch stick with 3D shading
      const stickWidth = 7;
      const stickHeight = 16;

      // Stick shadow
      tCtx.fillStyle = '#5a3520';
      tCtx.fillRect(cx - stickWidth/2 + 1, cy - 2, stickWidth, stickHeight);

      // Stick main
      tCtx.fillStyle = '#8B4513';
      tCtx.fillRect(cx - stickWidth/2, cy - 3, stickWidth, stickHeight);

      // Stick highlight (left side for 3D)
      tCtx.fillStyle = '#a66329';
      tCtx.fillRect(cx - stickWidth/2, cy - 3, 2, stickHeight);

      // Stick dark side (right)
      tCtx.fillStyle = '#6a3510';
      tCtx.fillRect(cx + stickWidth/2 - 2, cy - 3, 2, stickHeight);

      // Iron bowl/holder at top with metallic shading
      const bowlY = cy - 4;

      // Bowl shadow
      tCtx.fillStyle = '#1a1a1a';
      tCtx.beginPath();
      tCtx.ellipse(cx, bowlY, 9, 5, 0, 0, Math.PI * 2);
      tCtx.fill();

      // Bowl main
      tCtx.fillStyle = '#333';
      tCtx.beginPath();
      tCtx.ellipse(cx, bowlY - 1, 8, 4, 0, 0, Math.PI * 2);
      tCtx.fill();

      // Bowl rim highlight
      tCtx.fillStyle = '#555';
      tCtx.beginPath();
      tCtx.ellipse(cx, bowlY - 2, 8, 3, 0, 0, Math.PI);
      tCtx.fill();

      // Bowl inner shadow
      tCtx.fillStyle = '#1a1a1a';
      tCtx.beginPath();
      tCtx.ellipse(cx, bowlY - 1, 6, 2, 0, 0, Math.PI * 2);
      tCtx.fill();

      // Fire Animation with better 3D effect
      const flameBaseY = bowlY - 6;
      const flameHeight = 20;
      const flameWidth = 14;
      const flicker = frame * 0.5;

      // Glow effect behind flame
      const glowGradient = tCtx.createRadialGradient(cx, flameBaseY - 8, 0, cx, flameBaseY - 8, 20);
      glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.4)');
      glowGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
      glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      tCtx.fillStyle = glowGradient;
      tCtx.beginPath();
      tCtx.arc(cx, flameBaseY - 8, 22, 0, Math.PI * 2);
      tCtx.fill();

      // Draw flame in layers for depth
      // Back layer (red/orange)
      for(let i = 0; i < 25; i++) {
          const angle = (Math.random() - 0.5) * Math.PI / 2;
          const dist = Math.random() * flameWidth * 0.8;
          const partX = cx + Math.sin(angle) * dist;
          const heightFactor = Math.random();
          const partY = flameBaseY - heightFactor * (flameHeight + flicker);
          const sizePart = 2 + Math.random() * 3;

          if (heightFactor < 0.4) tCtx.fillStyle = '#FF4500';
          else if (heightFactor < 0.7) tCtx.fillStyle = '#FF6347';
          else tCtx.fillStyle = '#FF0000';

          tCtx.globalAlpha = 0.6 + Math.random() * 0.4;
          tCtx.fillRect(partX, partY, sizePart, sizePart);
      }

      // Middle layer (orange/yellow)
      for(let i = 0; i < 20; i++) {
          const angle = (Math.random() - 0.5) * Math.PI / 3;
          const dist = Math.random() * flameWidth * 0.6;
          const partX = cx + Math.sin(angle) * dist;
          const heightFactor = Math.random();
          const partY = flameBaseY - heightFactor * (flameHeight * 0.9 + flicker);
          const sizePart = 2 + Math.random() * 3;

          if (heightFactor < 0.5) tCtx.fillStyle = '#FFA500';
          else tCtx.fillStyle = '#FF8C00';

          tCtx.globalAlpha = 0.7 + Math.random() * 0.3;
          tCtx.fillRect(partX, partY, sizePart, sizePart);
      }

      // Front/core layer (bright yellow)
      for(let i = 0; i < 15; i++) {
          const angle = (Math.random() - 0.5) * Math.PI / 4;
          const dist = Math.random() * flameWidth * 0.4;
          const partX = cx + Math.sin(angle) * dist;
          const heightFactor = Math.random();
          const partY = flameBaseY - heightFactor * (flameHeight * 0.7 + flicker * 0.7);
          const sizePart = 1 + Math.random() * 3;

          if (heightFactor < 0.6) tCtx.fillStyle = '#FFFF00';
          else tCtx.fillStyle = '#FFD700';

          tCtx.globalAlpha = 0.8 + Math.random() * 0.2;
          tCtx.fillRect(partX, partY, sizePart, sizePart);
      }

      // Bright core
      tCtx.globalAlpha = 1;
      const coreGradient = tCtx.createRadialGradient(cx, flameBaseY - 3, 0, cx, flameBaseY - 3, 5);
      coreGradient.addColorStop(0, '#FFFFFF');
      coreGradient.addColorStop(0.4, '#FFFF99');
      coreGradient.addColorStop(1, '#FFFF00');
      tCtx.fillStyle = coreGradient;
      tCtx.beginPath();
      tCtx.arc(cx, flameBaseY - 3, 4, 0, Math.PI * 2);
      tCtx.fill();

      tCtx.globalAlpha = 1;
      torchFrames.push(tf);
  }
  walls[6] = torchFrames;

  // 7: Propaganda Poster Wall 1 - Eagle Emblem
  const t7 = createCanvas();
  const ctx7 = t7.getContext('2d')!;

  // Stone background
  drawStone(ctx7);

  // Poster frame (dark wood)
  ctx7.fillStyle = '#2a1810';
  ctx7.fillRect(size/4, size/6, size/2, size*2/3);

  // Poster background (aged paper)
  ctx7.fillStyle = '#e8d5b7';
  ctx7.fillRect(size/4 + 2, size/6 + 2, size/2 - 4, size*2/3 - 4);

  // Red banner top
  ctx7.fillStyle = '#b71c1c';
  ctx7.fillRect(size/4 + 4, size/6 + 4, size/2 - 8, 8);

  // Black eagle silhouette
  ctx7.fillStyle = '#000';
  const eagleX = size/2;
  const eagleY = size/2.5;
  ctx7.beginPath();
  ctx7.moveTo(eagleX, eagleY);
  ctx7.lineTo(eagleX - 8, eagleY + 6);
  ctx7.lineTo(eagleX - 12, eagleY + 4);
  ctx7.lineTo(eagleX - 8, eagleY + 8);
  ctx7.lineTo(eagleX, eagleY + 12);
  ctx7.lineTo(eagleX + 8, eagleY + 8);
  ctx7.lineTo(eagleX + 12, eagleY + 4);
  ctx7.lineTo(eagleX + 8, eagleY + 6);
  ctx7.closePath();
  ctx7.fill();

  // Eagle head
  ctx7.beginPath();
  ctx7.arc(eagleX, eagleY - 2, 4, 0, Math.PI * 2);
  ctx7.fill();

  // Bold text stripes
  ctx7.fillStyle = '#000';
  ctx7.fillRect(size/4 + 8, size/2 + 8, size/2 - 16, 2);
  ctx7.fillRect(size/4 + 8, size/2 + 12, size/2 - 16, 2);
  ctx7.fillRect(size/4 + 8, size/2 + 16, size/2 - 16, 2);

  walls[7] = t7;

  // 8: Propaganda Poster Wall 2 - "ACHTUNG!" Warning
  const t8 = createCanvas();
  const ctx8 = t8.getContext('2d')!;

  // Stone background
  drawStone(ctx8);

  // Poster frame
  ctx8.fillStyle = '#2a1810';
  ctx8.fillRect(size/4, size/6, size/2, size*2/3);

  // Poster background (yellow warning)
  ctx8.fillStyle = '#ffd600';
  ctx8.fillRect(size/4 + 2, size/6 + 2, size/2 - 4, size*2/3 - 4);

  // Black border
  ctx8.strokeStyle = '#000';
  ctx8.lineWidth = 3;
  ctx8.strokeRect(size/4 + 4, size/6 + 4, size/2 - 8, size*2/3 - 8);

  // Warning symbol (triangle with exclamation)
  ctx8.fillStyle = '#000';
  ctx8.beginPath();
  const triX = size/2;
  const triY = size/3.5;
  ctx8.moveTo(triX, triY);
  ctx8.lineTo(triX - 10, triY + 16);
  ctx8.lineTo(triX + 10, triY + 16);
  ctx8.closePath();
  ctx8.stroke();
  ctx8.fillStyle = '#ffd600';
  ctx8.fill();

  // Exclamation mark
  ctx8.fillStyle = '#000';
  ctx8.fillRect(triX - 1.5, triY + 4, 3, 8);
  ctx8.fillRect(triX - 1.5, triY + 13, 3, 2);

  // Text lines (simulated "ACHTUNG")
  ctx8.fillStyle = '#000';
  for (let i = 0; i < 4; i++) {
    ctx8.fillRect(size/4 + 10, size/2 + i * 4, size/2 - 20, 2);
  }

  walls[8] = t8;

  // 9: Propaganda Poster Wall 3 - Red/Black Geometric
  const t9 = createCanvas();
  const ctx9 = t9.getContext('2d')!;

  // Stone background
  drawStone(ctx9);

  // Poster frame
  ctx9.fillStyle = '#2a1810';
  ctx9.fillRect(size/4, size/6, size/2, size*2/3);

  // Poster background (red)
  ctx9.fillStyle = '#d32f2f';
  ctx9.fillRect(size/4 + 2, size/6 + 2, size/2 - 4, size*2/3 - 4);

  // Black diagonal stripes
  ctx9.fillStyle = '#000';
  for (let i = 0; i < 5; i++) {
    ctx9.save();
    ctx9.translate(size/2, size/2);
    ctx9.rotate((Math.PI / 4) + (i * Math.PI / 8));
    ctx9.fillRect(-size/3, -2, size*2/3, 4);
    ctx9.restore();
  }

  // White circle center
  ctx9.fillStyle = '#fff';
  ctx9.beginPath();
  ctx9.arc(size/2, size/2, 8, 0, Math.PI * 2);
  ctx9.fill();

  // Black center star/cross
  ctx9.fillStyle = '#000';
  ctx9.fillRect(size/2 - 6, size/2 - 1, 12, 2);
  ctx9.fillRect(size/2 - 1, size/2 - 6, 2, 12);

  walls[9] = t9;


  // FLOOR: Cobblestone
  const tFloor = createCanvas();
  const ctxF = tFloor.getContext('2d')!;
  
  // Dark Grout
  ctxF.fillStyle = '#1a1a1a';
  ctxF.fillRect(0, 0, size, size);
  
  // Cobblestones
  for (let y = 0; y < size; y += 8) {
      for (let x = 0; x < size; x += 8) {
          // Offset rows for brick-like pattern
          const xOff = (y / 8) % 2 === 0 ? 0 : 4;
          const stoneX = (x + xOff) % size;
          
          // Randomize grey/brown tones
          const tone = 100 + Math.random() * 50;
          const r = tone + 10; 
          const g = tone + 5;
          const b = tone;
          
          ctxF.fillStyle = `rgb(${r},${g},${b})`;
          
          // Draw stone with 1px spacing
          ctxF.fillRect(stoneX + 1, y + 1, 6, 6);
          
          // Top-left highlight
          ctxF.fillStyle = 'rgba(255,255,255,0.1)';
          ctxF.fillRect(stoneX + 1, y + 1, 6, 2);
      }
  }
  
  // Moss patches
  for(let i=0; i<12; i++) {
      const mx = Math.floor(Math.random() * size);
      const my = Math.floor(Math.random() * size);
      ctxF.fillStyle = 'rgba(50, 80, 40, 0.5)';
      ctxF.fillRect(mx, my, 4, 4);
  }

  // Get raw pixel data for the floor casting loop
  const floorImgData = ctxF.getImageData(0, 0, size, size);
  const floorPixels = new Uint32Array(floorImgData.data.buffer);

  // RED CARPET: Luxurious texture
  const tCarpet = createCanvas();
  const ctxC = tCarpet.getContext('2d')!;

  // Base red color
  ctxC.fillStyle = '#8B0000';
  ctxC.fillRect(0, 0, size, size);

  // Add fabric weave pattern
  for (let y = 0; y < size; y += 2) {
      for (let x = 0; x < size; x += 2) {
          const shade = Math.random() * 30 - 15;
          const r = Math.max(0, Math.min(255, 139 + shade));
          const g = Math.max(0, Math.min(255, 0 + shade * 0.3));
          const b = Math.max(0, Math.min(255, 0 + shade * 0.3));
          ctxC.fillStyle = `rgb(${r},${g},${b})`;
          ctxC.fillRect(x, y, 2, 2);
      }
  }

  // Horizontal lines for carpet runner effect
  ctxC.strokeStyle = '#A00000';
  ctxC.lineWidth = 1;
  for (let y = 0; y < size; y += 8) {
      ctxC.beginPath();
      ctxC.moveTo(0, y);
      ctxC.lineTo(size, y);
      ctxC.stroke();
  }

  // Darker lines for depth
  ctxC.strokeStyle = '#600000';
  for (let y = 4; y < size; y += 8) {
      ctxC.beginPath();
      ctxC.moveTo(0, y);
      ctxC.lineTo(size, y);
      ctxC.stroke();
  }

  // Gold trim pattern on edges
  ctxC.fillStyle = '#DAA520';
  for (let i = 0; i < size; i += 4) {
      ctxC.fillRect(i, 0, 2, 2);
      ctxC.fillRect(i, size - 2, 2, 2);
  }

  // Ornate pattern in center
  ctxC.fillStyle = '#B8860B';
  const centerY = size / 2;
  for (let x = 0; x < size; x += 8) {
      ctxC.fillRect(x + 2, centerY - 1, 4, 2);
  }

  const carpetImgData = ctxC.getImageData(0, 0, size, size);
  const carpetPixels = new Uint32Array(carpetImgData.data.buffer);

  // SPRITES
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

  // 1: Grenades (stick grenades)
  const sGrenades = createCanvas();
  const ctxG = sGrenades.getContext('2d')!;
  ctxG.clearRect(0, 0, size, size);

  // Draw 2 stick grenades overlapping
  const drawGrenade = (x: number, y: number, angle: number) => {
    ctxG.save();
    ctxG.translate(x, y);
    ctxG.rotate(angle);

    // Handle (stick)
    ctxG.fillStyle = '#5C3D0D';
    ctxG.fillRect(-2, 0, 4, 20);

    // Highlight on handle
    ctxG.fillStyle = '#7A5210';
    ctxG.fillRect(-2, 0, 1, 20);

    // Head (explosive)
    ctxG.fillStyle = '#2F4F2F';
    ctxG.fillRect(-5, -8, 10, 8);

    // Metal cap
    ctxG.fillStyle = '#555';
    ctxG.fillRect(-5, -9, 10, 1);

    // Fuse
    ctxG.strokeStyle = '#8B4513';
    ctxG.lineWidth = 1;
    ctxG.beginPath();
    ctxG.moveTo(0, -9);
    ctxG.lineTo(-3, -12);
    ctxG.stroke();

    ctxG.restore();
  };

  drawGrenade(size/2 - 8, size/2, -0.3);
  drawGrenade(size/2 + 8, size/2, 0.2);

  sprites[1] = sGrenades;

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

  return { walls, floor: floorPixels, carpet: carpetPixels, sprites };
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ onPlayerUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const texturesRef = useRef<TexturePack | null>(null);
  const floorBufferRef = useRef<ImageData | null>(null);
  const input = useInput();
  
  const playerRef = useRef<PlayerState>({
    x: 22,
    y: 12,
    dirX: -1,
    dirY: 0,
    planeX: 0,
    planeY: 0.66,
  });

  useEffect(() => {
    texturesRef.current = generateTextures();
  }, []);

  const loop = () => {
    const player = playerRef.current;
    const canvas = canvasRef.current;
    
    if (canvas) {
      update(player);
      render(canvas, player);
      onPlayerUpdate({ ...player }); 
    }

    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const update = (p: PlayerState) => {
    const { moveSpeed, rotSpeed } = SETTINGS;
    const map = WORLD_MAP;

    // Rotation controls: A, D, Left Arrow, Right Arrow, Q, E
    if (input['ArrowLeft'] || input['KeyA'] || input['KeyQ']) {
      const oldDirX = p.dirX;
      p.dirX = p.dirX * Math.cos(rotSpeed) - p.dirY * Math.sin(rotSpeed);
      p.dirY = oldDirX * Math.sin(rotSpeed) + p.dirY * Math.cos(rotSpeed);
      const oldPlaneX = p.planeX;
      p.planeX = p.planeX * Math.cos(rotSpeed) - p.planeY * Math.sin(rotSpeed);
      p.planeY = oldPlaneX * Math.sin(rotSpeed) + p.planeY * Math.cos(rotSpeed);
    }
    if (input['ArrowRight'] || input['KeyD'] || input['KeyE']) {
      const oldDirX = p.dirX;
      p.dirX = p.dirX * Math.cos(-rotSpeed) - p.dirY * Math.sin(-rotSpeed);
      p.dirY = oldDirX * Math.sin(-rotSpeed) + p.dirY * Math.cos(-rotSpeed);
      const oldPlaneX = p.planeX;
      p.planeX = p.planeX * Math.cos(-rotSpeed) - p.planeY * Math.sin(-rotSpeed);
      p.planeY = oldPlaneX * Math.sin(-rotSpeed) + p.planeY * Math.cos(-rotSpeed);
    }

    const newX = p.x + p.dirX * moveSpeed;
    const newY = p.y + p.dirY * moveSpeed;

    if (input['ArrowUp'] || input['KeyW']) {
      if (map[Math.floor(newX)][Math.floor(p.y)] === 0) p.x = newX;
      if (map[Math.floor(p.x)][Math.floor(newY)] === 0) p.y = newY;
    }
    if (input['ArrowDown'] || input['KeyS']) {
       if (map[Math.floor(p.x - p.dirX * moveSpeed)][Math.floor(p.y)] === 0) p.x -= p.dirX * moveSpeed;
       if (map[Math.floor(p.x)][Math.floor(p.y - p.dirY * moveSpeed)] === 0) p.y -= p.dirY * moveSpeed;
    }
  };

  const render = (canvas: HTMLCanvasElement, p: PlayerState) => {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx || !texturesRef.current) return;

    const w = SETTINGS.screenWidth;
    const h = SETTINGS.screenHeight;
    const { walls, floor: floorPixels, carpet: carpetPixels, sprites: spriteTextures } = texturesRef.current;

    // 1. Draw Ceiling
    ctx.fillStyle = COLORS.CEILING;
    ctx.fillRect(0, 0, w, h / 2);

    // 2. Draw Textured Floor (Raycasting)
    // Initialize buffer if needed
    if (!floorBufferRef.current) {
      floorBufferRef.current = ctx.createImageData(w, h / 2);
    }
    const floorImageData = floorBufferRef.current;
    const buffer = new Uint32Array(floorImageData.data.buffer);

    // Floor casting constants
    const rayDirX0 = p.dirX - p.planeX;
    const rayDirY0 = p.dirY - p.planeY;
    const rayDirX1 = p.dirX + p.planeX;
    const rayDirY1 = p.dirY + p.planeY;
    const posZ = 0.5 * h;

    // Loop through screen rows from middle to bottom
    for (let y = 0; y < h / 2; y++) {
      // pY is distance from the center of the screen
      // Map screen y to distance
      const rowDistance = posZ / (y + 1); // +1 avoids div by zero

      // Calculate step vector for floor texture coordinates
      const floorStepX = rowDistance * (rayDirX1 - rayDirX0) / w;
      const floorStepY = rowDistance * (rayDirY1 - rayDirY0) / w;

      // Initial world coordinates for the start of this scanline
      let floorX = p.x + rowDistance * rayDirX0;
      let floorY = p.y + rowDistance * rayDirY0;

      for (let x = 0; x < w; x++) {
        // Get texture coordinates from fractional part of global coordinates
        const cellX = Math.floor(floorX);
        const cellY = Math.floor(floorY);

        // Mask with TEXTURE_SIZE - 1 (must be power of 2)
        const tx = Math.floor(TEXTURE_SIZE * (floorX - cellX)) & (TEXTURE_SIZE - 1);
        const ty = Math.floor(TEXTURE_SIZE * (floorY - cellY)) & (TEXTURE_SIZE - 1);

        floorX += floorStepX;
        floorY += floorStepY;

        // Check floor map to determine texture
        const floorType = (cellX >= 0 && cellX < FLOOR_MAP.length && cellY >= 0 && cellY < FLOOR_MAP[0].length)
          ? FLOOR_MAP[cellX][cellY]
          : 0;

        // Sample appropriate texture based on floor type
        const color = floorType === 1
          ? carpetPixels[TEXTURE_SIZE * ty + tx]
          : floorPixels[TEXTURE_SIZE * ty + tx];

        // Write to buffer (y is local to floor buffer [0..h/2])
        buffer[y * w + x] = color;
      }
    }
    
    // Paint the floor
    ctx.putImageData(floorImageData, 0, h / 2);

    // 3. Draw Walls
    for (let x = 0; x < w; x++) {
      const cameraX = 2 * x / w - 1;
      const rayDirX = p.dirX + p.planeX * cameraX;
      const rayDirY = p.dirY + p.planeY * cameraX;

      let mapX = Math.floor(p.x);
      let mapY = Math.floor(p.y);

      const deltaDistX = Math.abs(1 / rayDirX);
      const deltaDistY = Math.abs(1 / rayDirY);

      let sideDistX;
      let sideDistY;
      let perpWallDist;
      let stepX;
      let stepY;
      let hit = 0;
      let side = 0;

      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (p.x - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - p.x) * deltaDistX;
      }
      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (p.y - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - p.y) * deltaDistY;
      }

      while (hit === 0) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        if (WORLD_MAP[mapX][mapY] > 0) hit = 1;
      }

      if (side === 0) perpWallDist = (mapX - p.x + (1 - stepX) / 2) / rayDirX;
      else           perpWallDist = (mapY - p.y + (1 - stepY) / 2) / rayDirY;

      const lineHeight = Math.floor(h / perpWallDist);
      let drawStart = -lineHeight / 2 + h / 2;
      if (drawStart < 0) drawStart = 0;
      let drawEnd = lineHeight / 2 + h / 2;
      if (drawEnd >= h) drawEnd = h - 1;

      // Texture mapping
      const texNum = WORLD_MAP[mapX][mapY];
      let wallX;
      if (side === 0) wallX = p.y + perpWallDist * rayDirY;
      else           wallX = p.x + perpWallDist * rayDirX;
      wallX -= Math.floor(wallX);

      let texX = Math.floor(wallX * TEXTURE_SIZE);
      if(side === 0 && rayDirX > 0) texX = TEXTURE_SIZE - texX - 1;
      if(side === 1 && rayDirY < 0) texX = TEXTURE_SIZE - texX - 1;

      let texture = walls[texNum];
      
      // Handle Animated Textures
      if (Array.isArray(texture)) {
          const frameIndex = Math.floor(Date.now() / 150) % texture.length;
          texture = texture[frameIndex];
      }
      
      if (texture) {
        ctx.drawImage(
            texture, 
            texX, 0, 1, TEXTURE_SIZE, 
            x, drawStart, 1, drawEnd - drawStart
        );
        
        if (side === 1) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }
      } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
      }
    }

    // 4. Draw Sprites
    // Calculate sprite distances and prepare for rendering
    const spriteData = SPRITES.map(sprite => {
      const spriteX = sprite.x - p.x;
      const spriteY = sprite.y - p.y;
      const invDet = 1.0 / (p.planeX * p.dirY - p.dirX * p.planeY);
      const transformX = invDet * (p.dirY * spriteX - p.dirX * spriteY);
      const transformY = invDet * (-p.planeY * spriteX + p.planeX * spriteY);

      return {
        ...sprite,
        transformX,
        transformY,
        distance: transformY
      };
    }).filter(s => s.transformY > 0) // Only render sprites in front of player
      .sort((a, b) => b.distance - a.distance); // Sort back to front

    // Render each sprite
    for (const sprite of spriteData) {
      const spriteScreenX = Math.floor((w / 2) * (1 + sprite.transformX / sprite.transformY));
      const spriteHeight = Math.abs(Math.floor(h / sprite.transformY));
      const spriteWidth = Math.abs(Math.floor(h / sprite.transformY));

      let drawStartY = -spriteHeight / 2 + h / 2;
      if (drawStartY < 0) drawStartY = 0;
      let drawEndY = spriteHeight / 2 + h / 2;
      if (drawEndY >= h) drawEndY = h - 1;

      let drawStartX = -spriteWidth / 2 + spriteScreenX;
      if (drawStartX < 0) drawStartX = 0;
      let drawEndX = spriteWidth / 2 + spriteScreenX;
      if (drawEndX >= w) drawEndX = w - 1;

      const spriteTexture = spriteTextures[sprite.texture];
      if (!spriteTexture) continue;

      // Draw sprite column by column
      for (let stripe = drawStartX; stripe < drawEndX; stripe++) {
        const texX = Math.floor((stripe - (-spriteWidth / 2 + spriteScreenX)) * TEXTURE_SIZE / spriteWidth);

        if (sprite.transformY > 0 && stripe > 0 && stripe < w) {
          ctx.drawImage(
            spriteTexture,
            texX, 0, 1, TEXTURE_SIZE,
            stripe, drawStartY, 1, drawEndY - drawStartY
          );
        }
      }
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={SETTINGS.screenWidth} 
      height={SETTINGS.screenHeight}
      className="bg-black w-full h-auto max-w-4xl shadow-2xl border-4 border-gray-800 rounded-sm"
    />
  );
};