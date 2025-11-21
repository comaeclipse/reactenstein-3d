import React, { useEffect, useRef } from 'react';
import { SETTINGS, WORLD_MAP, COLORS, TEXTURE_SIZE } from '../constants';
import { useInput } from '../hooks/useInput';
import { PlayerState } from '../types';

interface GameCanvasProps {
  onPlayerUpdate: (player: PlayerState) => void;
}

interface TexturePack {
  walls: Record<number, HTMLCanvasElement | HTMLCanvasElement[]>;
  floor: Uint32Array;
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
  for (let frame = 0; frame < 3; frame++) {
      const tf = createCanvas();
      const tCtx = tf.getContext('2d')!;
      
      // Base: Grey Stone
      drawStone(tCtx);

      // Torch Holder (Wood & Iron)
      const cx = size / 2;
      const cy = size / 1.8;

      // Bracket
      tCtx.fillStyle = '#222'; // Iron black
      tCtx.fillRect(cx - 4, cy + 10, 8, 8);
      tCtx.beginPath();
      tCtx.moveTo(cx, cy + 14);
      tCtx.lineTo(cx - 6, cy + 20); // Mounting bracket left
      tCtx.stroke();
      
      // Holder Stick
      tCtx.fillStyle = '#8B4513';
      tCtx.fillRect(cx - 3, cy, 6, 12);
      
      // Bowl
      tCtx.fillStyle = '#444'; // Iron bowl
      tCtx.beginPath();
      tCtx.arc(cx, cy, 6, 0, Math.PI, false);
      tCtx.fill();

      // Fire Animation
      // Core
      tCtx.fillStyle = '#FFFF00'; // Yellow
      tCtx.beginPath();
      tCtx.arc(cx, cy - 4, 5, 0, Math.PI * 2);
      tCtx.fill();

      // Flames
      const flameHeight = 15;
      const flameWidth = 10;
      
      for(let i=0; i<30; i++) {
          const partX = cx + (Math.random() - 0.5) * flameWidth;
          const partY = cy - 4 - Math.random() * flameHeight;
          const sizePart = Math.random() * 4;
          
          // Color gradient based on height
          const hRatio = (cy - partY) / flameHeight; // 0 at bottom, 1 at top
          
          if (hRatio < 0.3) tCtx.fillStyle = '#FFFF00'; // Yellow base
          else if (hRatio < 0.7) tCtx.fillStyle = '#FF8C00'; // Orange mid
          else tCtx.fillStyle = '#FF0000'; // Red top

          // Add some flickering randomness based on frame
          if (Math.random() > 0.2) {
              tCtx.fillRect(partX, partY - (Math.random() * 2 * frame), sizePart, sizePart);
          }
      }
      
      torchFrames.push(tf);
  }
  walls[6] = torchFrames;


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

  return { walls, floor: floorPixels };
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

    if (input['ArrowLeft'] || input['KeyQ']) {
      const oldDirX = p.dirX;
      p.dirX = p.dirX * Math.cos(rotSpeed) - p.dirY * Math.sin(rotSpeed);
      p.dirY = oldDirX * Math.sin(rotSpeed) + p.dirY * Math.cos(rotSpeed);
      const oldPlaneX = p.planeX;
      p.planeX = p.planeX * Math.cos(rotSpeed) - p.planeY * Math.sin(rotSpeed);
      p.planeY = oldPlaneX * Math.sin(rotSpeed) + p.planeY * Math.cos(rotSpeed);
    }
    if (input['ArrowRight'] || input['KeyE']) {
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
    
    if (input['KeyA']) {
        const strafeDirX = -p.dirY;
        const strafeDirY = p.dirX;
        if (map[Math.floor(p.x + strafeDirX * moveSpeed * 0.7)][Math.floor(p.y)] === 0) p.x += strafeDirX * moveSpeed * 0.7;
        if (map[Math.floor(p.x)][Math.floor(p.y + strafeDirY * moveSpeed * 0.7)] === 0) p.y += strafeDirY * moveSpeed * 0.7;
    }

    if (input['KeyD']) {
        const strafeDirX = p.dirY;
        const strafeDirY = -p.dirX;
        if (map[Math.floor(p.x + strafeDirX * moveSpeed * 0.7)][Math.floor(p.y)] === 0) p.x += strafeDirX * moveSpeed * 0.7;
        if (map[Math.floor(p.x)][Math.floor(p.y + strafeDirY * moveSpeed * 0.7)] === 0) p.y += strafeDirY * moveSpeed * 0.7;
    }
  };

  const render = (canvas: HTMLCanvasElement, p: PlayerState) => {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx || !texturesRef.current) return;

    const w = SETTINGS.screenWidth;
    const h = SETTINGS.screenHeight;
    const { walls, floor: floorPixels } = texturesRef.current;

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

        // Sample texture
        const color = floorPixels[TEXTURE_SIZE * ty + tx];
        
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