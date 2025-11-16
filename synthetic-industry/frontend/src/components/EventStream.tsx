import React, { useEffect, useRef } from 'react';
import { StreamEvent } from '../types';

interface EventStreamProps {
  events: StreamEvent[];
  autoScroll?: boolean;
}

export const EventStream: React.FC<EventStreamProps> = ({ events, autoScroll = true }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, autoScroll]);
  
  const formatTime = (timestamp?: string) => {
    if (!timestamp) {
      return '--:--';
    }
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '--:--';
    }
    return date.toLocaleTimeString();
  };
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'simulation_started':
      case 'route_manifest':
        return 'text-cyan-400 font-bold';
      case 'dispatcher_message':
        return 'text-purple-400';
      case 'delivery_en_route':
        return 'text-yellow-400';
      case 'arrived_at_location':
        return 'text-orange-400';
      case 'delivery_completed':
        return 'text-green-400';
      case 'next_delivery':
        return 'text-blue-400';
      case 'location_update':
        return 'text-gray-400';
      case 'route_completed':
      case 'simulation_stopped':
        return 'text-red-400 font-bold';
      default:
        return 'text-gray-300';
    }
  };
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'simulation_started':
        return '▶️';
      case 'route_manifest':
        return '📋';
      case 'dispatcher_message':
        return '💬';
      case 'delivery_en_route':
        return '🚚';
      case 'arrived_at_location':
        return '📍';
      case 'delivery_completed':
        return '✅';
      case 'next_delivery':
        return '➡️';
      case 'location_update':
        return '📌';
      case 'route_completed':
        return '🎉';
      case 'simulation_stopped':
        return '⏹️';
      default:
        return '•';
    }
  };
  
  const formatEventMessage = (event: StreamEvent) => {
    switch (event.type) {
      case 'simulation_started':
        return `Route started: ${event.data?.driver} with ${event.data?.totalDeliveries} deliveries (${event.data?.criticalityBreakdown?.critical} critical)`;
      case 'route_manifest':
        return `Manifest: ${event.data?.deliveries?.length} stops for ${event.data?.driver?.displayName}`;
      case 'dispatcher_message':
        return `📢 ${event.data?.dispatcher || 'Dispatcher'}: ${event.data?.message}`;
      case 'delivery_en_route':
        return `🚚 En route to stop #${event.data?.sequenceNumber}: ${event.data?.medication} for ${event.data?.patient}`;
      case 'arrived_at_location':
        return `📍 Arrived at stop #${event.data?.sequenceNumber}: ${event.data?.patient}`;
      case 'delivery_completed':
        return `✅ Completed #${event.data?.sequenceNumber}/${event.data?.totalDeliveries}: ${event.data?.medication} delivered to ${event.data?.patient}`;
      case 'next_delivery':
        return `➡️ Moving to next stop #${event.data?.sequenceNumber}: ${event.data?.medication} for ${event.data?.patient}`;
      case 'location_update':
        return `📌 Location: [${event.data?.location?.lat.toFixed(4)}, ${event.data?.location?.lng.toFixed(4)}] - ${Math.round(event.data?.progress * 100)}% to ${event.data?.nextStop}`;
      case 'route_completed':
        return `🎉 Route completed! ${event.data?.completedDeliveries}/${event.data?.totalDeliveries} deliveries in ${event.data?.duration} minutes`;
      case 'simulation_stopped':
        return `Simulation stopped - ${event.data?.completedDeliveries}/${event.data?.totalDeliveries} completed`;
      case 'connected': {
        const clientId = event.data?.clientId ?? event.clientId ?? 'N/A';
        return `Connected to stream (Client: ${clientId})`;
      }
      default:
        return event.message || `Event: ${event.type}`;
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4">Live Event Stream</h2>
      
      <div 
        ref={scrollRef}
        className="bg-gray-900 rounded-lg p-4 overflow-y-auto custom-scrollbar font-mono text-sm"
        style={{ height: '500px', minHeight: '500px', maxHeight: '500px' }}
      >
        {events.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No events yet. Start the simulation to see live events.
          </div>
        ) : (
          <div className="space-y-1">
            {events.map((event, index) => (
              <div key={index} className="hover:bg-gray-800 p-1 rounded">
                <span className="text-gray-500">{formatTime(event.timestamp)}</span>
                <span className="mx-2">{getEventIcon(event.type)}</span>
                <span className={getEventColor(event.type)}>
                  {formatEventMessage(event)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-400 text-xs">
        Showing {events.length} events {autoScroll && '• Auto-scrolling'}
      </div>
    </div>
  );
};
