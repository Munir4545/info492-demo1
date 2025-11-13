import React from 'react';
import { SimulationStats } from '../types';

interface LiveStatisticsProps {
  stats: SimulationStats;
  streamConnected: boolean;
}

export const LiveStatistics: React.FC<LiveStatisticsProps> = ({ stats, streamConnected }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Live Statistics</h2>
      
      {!stats.hasRoute ? (
        <div className="text-gray-400 text-center py-8">
          No active route. Start simulation to generate a route.
        </div>
      ) : (
        <>
          {/* Driver Info */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-4 mb-4">
            <div className="text-blue-200 text-sm mb-1">Current Driver</div>
            <div className="text-2xl font-bold text-white mb-2">{stats.driver?.displayName}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-blue-300">Persona:</span>
                <div className="text-white font-medium">{stats.driver?.persona?.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <span className="text-blue-300">Route:</span>
                <div className="text-white font-medium truncate">{stats.routeName}</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 font-medium">Route Progress</span>
              <span className="text-white font-bold">{stats.progress}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="text-gray-400 text-xs mt-2">
              {stats.completedDeliveries} of {stats.totalDeliveries} deliveries completed
            </div>
          </div>
          
          {/* Current Delivery */}
          {stats.currentDelivery && (
            <div className="bg-gray-700 rounded-lg p-4 mb-4 border-l-4 border-yellow-500">
              <div className="text-yellow-400 text-sm font-medium mb-2">
                🚗 Currently Delivering ({stats.currentDelivery.sequenceNumber}/{stats.totalDeliveries})
              </div>
              <div className="text-white font-bold mb-1">{stats.currentDelivery.medication}</div>
              <div className="text-gray-300 text-sm mb-2">
                Patient: {stats.currentDelivery.patient}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  stats.currentDelivery.criticality === 'critical' ? 'bg-red-600 text-white' :
                  stats.currentDelivery.criticality === 'high' ? 'bg-yellow-600 text-white' :
                  stats.currentDelivery.criticality === 'medium' ? 'bg-blue-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {stats.currentDelivery.criticality.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  stats.currentDelivery.status === 'delivered' ? 'bg-green-700 text-green-200' :
                  stats.currentDelivery.status === 'at_location' ? 'bg-purple-700 text-purple-200' :
                  stats.currentDelivery.status === 'en_route' ? 'bg-blue-700 text-blue-200' :
                  'bg-gray-700 text-gray-200'
                }`}>
                  {stats.currentDelivery.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>
          )}
          
          {/* Delivery Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Active</div>
              <div className="text-3xl font-bold text-blue-400">{stats.activeDeliveries}</div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-400">{stats.completedDeliveries}</div>
            </div>
          </div>
          
          {/* Criticality Breakdown */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="text-gray-300 font-medium mb-3">Cargo Breakdown</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2" />
                  <span className="text-gray-300 text-sm">Critical</span>
                </div>
                <span className="text-white font-bold">{stats.criticalityBreakdown.critical}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2" />
                  <span className="text-gray-300 text-sm">High</span>
                </div>
                <span className="text-white font-bold">{stats.criticalityBreakdown.high}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                  <span className="text-gray-300 text-sm">Medium</span>
                </div>
                <span className="text-white font-bold">{stats.criticalityBreakdown.medium}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded mr-2" />
                  <span className="text-gray-300 text-sm">Standard</span>
                </div>
                <span className="text-white font-bold">{stats.criticalityBreakdown.standard}</span>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Stream Status */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-medium">Stream Status:</span>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              streamConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-white font-bold">
              {streamConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm">
          Events Received: <span className="text-white font-bold">{stats.eventCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
