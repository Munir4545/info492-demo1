import React from 'react';
import { SimulationStats } from '../types';

interface ControlPanelProps {
  stats: SimulationStats;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  stats,
  onStart,
  onStop,
  onPause,
  onResume
}) => {
  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };
  
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Control Panel</h2>
      
      {/* Status Display */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-medium">Status:</span>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              stats.running ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
            }`} />
            <span className="text-white font-bold">
              {stats.running ? 'RUNNING' : 'STOPPED'}
            </span>
          </div>
        </div>
        
        {stats.running && (
          <>
            <div className="text-gray-400 text-sm mt-3">
              <div className="mb-1">
                <span className="font-medium">Elapsed:</span> {formatElapsedTime(stats.elapsedTime)}
              </div>
              <div className="mb-1">
                <span className="font-medium">Start Time:</span> {formatDateTime(stats.startTime)}
              </div>
              <div>
                <span className="font-medium">End Time:</span> {formatDateTime(stats.endTime)}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {!stats.running ? (
          <button
            onClick={onStart}
            className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start 24-Hour Simulation
          </button>
        ) : (
          <>
            <button
              onClick={onPause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ⏸ Pause
            </button>
            <button
              onClick={onStop}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ⏹ Stop
            </button>
          </>
        )}
      </div>
      
      {/* Info Box */}
      <div className="mt-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-3">
        <p className="text-blue-300 text-sm">
          <span className="font-bold">ℹ️ Info:</span> The simulation runs autonomously for 24 hours, 
          generating deliveries based on realistic time-of-day patterns. Events are streamed in real-time.
        </p>
      </div>
    </div>
  );
};
