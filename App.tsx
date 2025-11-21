import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Minimap } from './components/Minimap';
import { PlayerState } from './types';

function App() {
  // State for the UI overlay, synced from the GameCanvas via callback
  const [playerState, setPlayerState] = useState<PlayerState>({
    x: 0, y: 0, dirX: 0, dirY: 0, planeX: 0, planeY: 0
  });

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 font-mono text-white">
      
      <div className="max-w-5xl w-full flex flex-col gap-4">
        
        {/* Header / Title Bar */}
        <header className="flex justify-between items-center border-b-2 border-stone-600 pb-4 mb-2">
          <h1 className="text-4xl font-bold tracking-widest text-red-600 drop-shadow-md uppercase">
            Reactenstein 3D
          </h1>
          <div className="text-right text-stone-400 text-sm">
            <p>ENGINE: RAYCASTER v1.0</p>
            <p>LATENCY: 0ms</p>
          </div>
        </header>

        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Viewport Container */}
          <div className="flex-1 relative group">
            {/* CRT Scanline Effect Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] bg-repeat"></div>
            
            <GameCanvas onPlayerUpdate={setPlayerState} />
            
            {/* Controls Hint */}
            <div className="mt-2 flex justify-between text-stone-500 text-xs uppercase tracking-wider">
              <span>Move: WASD / Arrows</span>
              <span>Strafe: Q / E</span>
            </div>
          </div>

          {/* Sidebar / HUD */}
          <aside className="w-full lg:w-64 flex flex-col gap-4">
            
            {/* Minimap Panel */}
            <div className="bg-stone-800 p-2 border border-stone-600 rounded-sm">
              <h3 className="text-yellow-500 mb-2 text-sm font-bold uppercase tracking-wider">Radar</h3>
              <div className="flex justify-center">
                <Minimap player={playerState} />
              </div>
            </div>

            {/* Status Panel */}
            <div className="bg-stone-800 p-4 border border-stone-600 rounded-sm font-mono space-y-4">
              <div>
                <h3 className="text-blue-400 text-xs uppercase mb-1">Position</h3>
                <p className="text-xl text-white">
                  X: {playerState.x.toFixed(2)}
                </p>
                <p className="text-xl text-white">
                  Y: {playerState.y.toFixed(2)}
                </p>
              </div>

              <div>
                 <h3 className="text-blue-400 text-xs uppercase mb-1">Direction</h3>
                 <div className="flex items-center gap-2">
                   <div 
                      className="w-8 h-8 rounded-full border border-stone-500 flex items-center justify-center bg-black"
                      style={{ transform: `rotate(${Math.atan2(playerState.dirY, playerState.dirX)}rad)` }}
                   >
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white transform rotate-90 origin-center -mt-1"></div>
                   </div>
                   <span className="text-lg text-stone-300">
                     {(Math.atan2(playerState.dirY, playerState.dirX) * (180/Math.PI)).toFixed(0)}°
                   </span>
                 </div>
              </div>

              <div className="pt-4 border-t border-stone-700">
                 <div className="flex justify-between items-end">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-500">FLOOR</span>
                        <span className="text-2xl font-bold text-yellow-500">1</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-500">SCORE</span>
                        <span className="text-2xl font-bold text-white">0</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-500">LIVES</span>
                        <span className="text-2xl font-bold text-white">3</span>
                    </div>
                 </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;