import React, { useEffect, useRef } from 'react';
import { PlayerState } from '../types';
import { WORLD_MAP } from '../constants';

interface MinimapProps {
  player: PlayerState;
}

export const Minimap: React.FC<MinimapProps> = ({ player }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CELL_SIZE = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mapWidth = WORLD_MAP[0].length;
    const mapHeight = WORLD_MAP.length;
    
    canvas.width = mapWidth * CELL_SIZE;
    canvas.height = mapHeight * CELL_SIZE;

    // Draw Map
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        if (WORLD_MAP[x][y] > 0) {
          ctx.fillStyle = '#888';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }

    // Draw Player
    const px = player.y * CELL_SIZE; // Note: In world map, x/y access is reversed usually in array access [row][col] -> [y][x], but our raycaster uses [x][y].
    // Let's conform to standard coordinate system: x is horizontal, y is vertical.
    // WORLD_MAP[x][y] implies accessing column then row.
    
    const screenX = player.x * CELL_SIZE;
    const screenY = player.y * CELL_SIZE;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw Direction Vector
    ctx.strokeStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX + player.dirX * 10, screenY + player.dirY * 10);
    ctx.stroke();

  }, [player]);

  return (
    <div className="border-2 border-gray-600 bg-black shadow-lg">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};