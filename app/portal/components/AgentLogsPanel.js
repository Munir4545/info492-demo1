'use client';

import { useEffect, useRef } from 'react';

export default function AgentLogsPanel({ agents, orchestratorLogs, agentLogs }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentLogs]);

  const getAgentColor = (agentId) => {
    const colors = {
      'AGENT-PHI-001': 'text-red-600 dark:text-red-400',
      'AGENT-GPS-002': 'text-orange-600 dark:text-orange-400',
      'AGENT-API-003': 'text-yellow-600 dark:text-yellow-400',
      'AGENT-CRD-004': 'text-purple-600 dark:text-purple-400',
      'AGENT-SCL-005': 'text-pink-600 dark:text-pink-400',
      'ORCHESTRATOR': 'text-blue-600 dark:text-blue-400'
    };
    return colors[agentId] || 'text-slate-600 dark:text-slate-400';
  };

  const getAgentIcon = (agentId) => {
    const icons = {
      'AGENT-PHI-001': '📧',
      'AGENT-GPS-002': '📍',
      'AGENT-API-003': '⚡',
      'AGENT-CRD-004': '🔑',
      'AGENT-SCL-005': '📊',
      'ORCHESTRATOR': '🧠'
    };
    return icons[agentId] || '⚙️';
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-bold text-white">Agent Activity Logs</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {agentLogs.length} events
          </span>
        </div>
      </div>

      {/* Agent Status Bar */}
      <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700">
        <div className="flex flex-wrap gap-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                agent.status === 'active'
                  ? 'bg-green-900/30 text-green-400 border border-green-700'
                  : agent.status === 'executing'
                  ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                  : 'bg-slate-700 text-slate-400 border border-slate-600'
              }`}
            >
              <span>{getAgentIcon(agent.id)}</span>
              <span className="font-mono">{agent.id}</span>
              <span className="w-1 h-1 rounded-full bg-current"></span>
            </div>
          ))}
        </div>
      </div>

      {/* Logs Container */}
      <div className="h-96 overflow-y-auto bg-slate-950 p-4 font-mono text-xs">
        {agentLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <div className="text-2xl mb-2">🔍</div>
              <p>Waiting for agent activity...</p>
              <p className="text-xs mt-1">Logs will appear here when agents start executing</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {agentLogs.map((log, index) => (
              <div
                key={log.id}
                className={`flex gap-2 py-1 px-2 rounded ${
                  log.level === 'success'
                    ? 'bg-green-950/30 hover:bg-green-950/50'
                    : log.level === 'error'
                    ? 'bg-red-950/30 hover:bg-red-950/50'
                    : log.level === 'warning'
                    ? 'bg-yellow-950/30 hover:bg-yellow-950/50'
                    : 'hover:bg-slate-900/50'
                } transition-colors`}
              >
                {/* Timestamp */}
                <span className="text-slate-500 flex-shrink-0">
                  [{log.timestamp}]
                </span>

                {/* Agent ID with icon */}
                <span className={`${getAgentColor(log.agentId)} flex-shrink-0 font-bold`}>
                  {getAgentIcon(log.agentId)} {log.agentId}:
                </span>

                {/* Message */}
                <span className={`flex-1 ${
                  log.level === 'success'
                    ? 'text-green-400'
                    : log.level === 'error'
                    ? 'text-red-400'
                    : log.level === 'warning'
                    ? 'text-yellow-400'
                    : 'text-slate-300'
                }`}>
                  {log.message}
                </span>

                {/* Metrics badge if present */}
                {log.metrics && (
                  <span className="flex-shrink-0 px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                    {log.metrics}
                  </span>
                )}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-slate-800 px-4 py-2 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <span className="text-green-400">
              ✓ {agentLogs.filter(l => l.level === 'success').length} success
            </span>
            <span className="text-yellow-400">
              ⚠ {agentLogs.filter(l => l.level === 'warning').length} warnings
            </span>
            <span className="text-red-400">
              ✗ {agentLogs.filter(l => l.level === 'error').length} errors
            </span>
          </div>
          <span className="text-slate-400 font-mono">
            Live monitoring
          </span>
        </div>
      </div>
    </div>
  );
}

