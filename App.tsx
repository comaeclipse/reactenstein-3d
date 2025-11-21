import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Minimap } from './components/Minimap';
import { PlayerState } from './types';

function App() {
  // State for the UI overlay, synced from the GameCanvas via callback
  const [playerState, setPlayerState] = useState<PlayerState>({
    x: 0, y: 0, dirX: 0, dirY: 0, planeX: 0, planeY: 0
  });

  const health = 100;
  const ammo = 99;
  const score = 0;
  const lives = 3;
  const floor = 1;

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-2 font-mono">

      <div className="w-full max-w-6xl flex flex-col gap-0">

        {/* Top Status Bar - Classic Wolfenstein Style */}
        <div className="bg-gradient-to-b from-blue-900 to-blue-800 border-4 border-gray-600 p-3 shadow-xl">
          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-yellow-400 text-xs font-bold mb-1">FLOOR</div>
              <div className="text-white text-3xl font-bold">{floor}</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xs font-bold mb-1">SCORE</div>
              <div className="text-white text-3xl font-bold">{score.toString().padStart(6, '0')}</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xs font-bold mb-1">LIVES</div>
              <div className="text-white text-3xl font-bold">{lives}</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xs font-bold mb-1">HEALTH</div>
              <div className="text-red-400 text-3xl font-bold">{health}%</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xs font-bold mb-1">AMMO</div>
              <div className="text-white text-3xl font-bold">{ammo}</div>
            </div>
          </div>
        </div>

        {/* Main Game Viewport */}
        <div className="relative bg-black border-4 border-gray-700">
          {/* CRT Scanline Effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] bg-repeat"></div>

          {/* Minimap Overlay - Top Right Corner */}
          <div className="absolute top-4 right-4 z-20 opacity-80 hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 p-2 border-2 border-yellow-600 shadow-xl">
              <div className="text-yellow-400 text-xs font-bold mb-1 text-center">MAP</div>
              <Minimap player={playerState} />
            </div>
          </div>

          <GameCanvas onPlayerUpdate={setPlayerState} />
        </div>

        {/* Bottom HUD - Classic Wolfenstein Face/Weapon Bar */}
        <div className="bg-gradient-to-b from-gray-700 to-gray-800 border-4 border-gray-600 p-4 shadow-xl">
          <div className="grid grid-cols-3 gap-4 items-center">

            {/* Left Side - Weapon/Keys */}
            <div className="flex gap-4 items-center justify-start">
              <div className="bg-gray-900 border-2 border-gray-600 p-2 w-20 h-20 flex items-center justify-center">
                <div className="text-5xl">🔫</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray-400">KEYS:</div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-gray-800 border border-gray-600"></div>
                  <div className="w-6 h-6 bg-gray-800 border border-gray-600"></div>
                  <div className="w-6 h-6 bg-gray-800 border border-gray-600"></div>
                </div>
              </div>
            </div>

            {/* Center - Player Face */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-900 border-4 border-yellow-700 p-3 w-28 h-28 flex items-center justify-center shadow-2xl">
                <div className="text-7xl">
                  {health > 80 ? '😎' : health > 60 ? '😐' : health > 40 ? '😰' : health > 20 ? '🤕' : '💀'}
                </div>
              </div>
              <div className="text-yellow-400 text-xs font-bold mt-2 tracking-wider">B.J. BLAZKOWICZ</div>
            </div>

            {/* Right Side - Stats */}
            <div className="flex flex-col gap-2 items-end justify-center text-right">
              <div className="bg-gray-900 border-2 border-blue-700 px-3 py-1">
                <span className="text-blue-400 text-xs">POS:</span>
                <span className="text-white text-sm ml-2">{playerState.x.toFixed(1)}, {playerState.y.toFixed(1)}</span>
              </div>
              <div className="bg-gray-900 border-2 border-blue-700 px-3 py-1">
                <span className="text-blue-400 text-xs">DIR:</span>
                <span className="text-white text-sm ml-2">{(Math.atan2(playerState.dirY, playerState.dirX) * (180/Math.PI)).toFixed(0)}°</span>
              </div>
              <div className="text-gray-500 text-xs mt-1">
                W/S: MOVE | A/D: TURN
              </div>
            </div>
          </div>
        </div>

        {/* Title at very bottom */}
        <div className="text-center py-3">
          <h1 className="text-4xl font-bold tracking-widest text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] uppercase" style={{ textShadow: '2px 2px 0px #000, 4px 4px 0px rgba(0,0,0,0.3)' }}>
            REACTENSTEIN 3D
          </h1>
        </div>
      </div>
    </div>
  );
}

export default App;