'use client';

export default function OrchestratorPanel({ orchestratorState, sharedState, agentStates }) {
  const getRiskColor = (risk) => {
    if (risk === 'low') return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (risk === 'medium') return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'initializing': return 'bg-blue-500';
      case 'active': return 'bg-orange-500';
      case 'escalating': return 'bg-red-500';
      case 'peak': return 'bg-red-700';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Orchestrator Brain */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg border-2 border-purple-300 dark:border-purple-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Orchestrator</h2>
            <p className="text-sm text-purple-600 dark:text-purple-400">Strategic Command Center</p>
          </div>
        </div>

        {/* Orchestrator Thinking */}
        {orchestratorState.thinking && (
          <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="flex-1">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase mb-1">Orchestrator Analysis</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{orchestratorState.thinking}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Decision */}
        {orchestratorState.decision && (
          <div className="mb-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-300 dark:border-purple-700">
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase mb-2">Current Decision</p>
            <p className="text-sm text-slate-800 dark:text-white font-medium mb-2">{orchestratorState.decision}</p>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Target Agent</p>
                <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full uppercase">
                  {orchestratorState.agent}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Risk Level</p>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full uppercase ${getRiskColor(orchestratorState.riskAssessment)}`}>
                  {orchestratorState.riskAssessment}
                </span>
              </div>
            </div>

            {orchestratorState.action && (
              <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Action</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{orchestratorState.action}</p>
              </div>
            )}

            {orchestratorState.expectedOutcome && (
              <div className="mt-2">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Expected Outcome</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{orchestratorState.expectedOutcome}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shared State */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          Shared State
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Attack Phase</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getPhaseColor(sharedState.phase)}`}></div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white capitalize">{sharedState.phase}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Compromised Accounts</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{sharedState.compromisedAccounts}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Detection Risk</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    sharedState.detectionRisk < 40 ? 'bg-green-500' : 
                    sharedState.detectionRisk < 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${sharedState.detectionRisk}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">{sharedState.detectionRisk}%</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Disruptions</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{sharedState.totalDisruptions}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">System Memory</p>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <p>├─ Phishing Emails: {sharedState.phishingEmailsSent}</p>
            <p>├─ GPS Spoofs: {sharedState.gpsLocationsSpoofed}</p>
            <p>├─ Fake Orders: {sharedState.fakeOrdersInjected}</p>
            <p>└─ Active Since: {Math.floor(sharedState.elapsedTime / 60)}m {sharedState.elapsedTime % 60}s</p>
          </div>
        </div>
      </div>

      {/* Agent States */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Agent Status
        </h3>

        <div className="space-y-3">
          {agentStates.map((agent) => (
            <div key={agent.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500 animate-pulse' : 
                    agent.status === 'executing' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-400'
                  }`}></div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{agent.name}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  agent.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  agent.status === 'executing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <p className="mb-1">Target: {agent.target}</p>
                <p>Actions Executed: <span className="font-semibold text-slate-800 dark:text-white">{agent.actions}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

