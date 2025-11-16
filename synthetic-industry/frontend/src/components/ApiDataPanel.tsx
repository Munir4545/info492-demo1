import React, { useMemo } from 'react';
import { Coordinates, RouteManifest, SimulationStats, StreamEvent } from '../types';

interface ApiDataPanelProps {
  stats: SimulationStats;
  manifest: RouteManifest | null;
  driverLocation: Coordinates | null;
  latestEvent?: StreamEvent | null;
}

const prettyPrint = (value: unknown) => JSON.stringify(value ?? null, null, 2);

export const ApiDataPanel: React.FC<ApiDataPanelProps> = ({
  stats,
  manifest,
  driverLocation,
  latestEvent
}) => {
  const latestEventSummary = useMemo(() => {
    if (!latestEvent) return null;
    return {
      type: latestEvent.type,
      timestamp: latestEvent.timestamp,
      eventId: latestEvent.eventId,
      data: latestEvent.data
    };
  }, [latestEvent]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">API Data Inspector</h2>
        <span className="text-xs uppercase tracking-wide text-gray-400">
          `/api/synthetic/stats` &amp; `/api/synthetic/manifest`
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <section>
          <header className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-cyan-300">Latest Stats</h3>
            <span className="text-gray-500 text-xs">
              Updated {new Date().toLocaleTimeString()}
            </span>
          </header>
          <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto max-h-48 text-gray-200">
{prettyPrint(stats)}
          </pre>
        </section>

        <section>
          <header className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-emerald-300">Current Manifest</h3>
            <span className="text-gray-500 text-xs">
              {manifest ? `Route ${manifest.routeId}` : 'No active route'}
            </span>
          </header>
          <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto max-h-48 text-gray-200">
{prettyPrint(manifest)}
          </pre>
        </section>

        <section>
          <header className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-indigo-300">Driver Location</h3>
            <span className="text-gray-500 text-xs">
              {driverLocation ? 'Live' : 'Unavailable'}
            </span>
          </header>
          <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto text-gray-200">
{prettyPrint(driverLocation)}
          </pre>
        </section>

        {latestEventSummary && (
          <section>
            <header className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-yellow-300">Latest Event Payload</h3>
              <span className="text-gray-500 text-xs">
                {latestEventSummary.type}
              </span>
            </header>
            <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto max-h-48 text-gray-200">
{prettyPrint(latestEventSummary)}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
};

