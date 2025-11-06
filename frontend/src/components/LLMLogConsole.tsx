import { useEffect, useRef } from 'react';

export interface LLMLog {
  attackId: number;
  type: 'request' | 'response' | 'error';
  model: string;
  timestamp: string;
  data: any;
}

interface LLMLogConsoleProps {
  logs: LLMLog[];
}

const LLMLogConsole = ({ logs }: LLMLogConsoleProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatLog = (log: LLMLog) => {
    switch (log.type) {
      case 'request':
        return (
          <div className="mb-4 border-l-2 border-blue-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-xs">[{formatTimestamp(log.timestamp)}]</span>
              <span className="text-blue-400 font-bold">REQUEST</span>
              <span className="text-yellow-400 text-sm">→ {log.model}</span>
            </div>
            <div className="bg-gray-800 rounded p-2 mb-2">
              <div className="text-xs text-gray-400 mb-1">URL:</div>
              <div className="text-xs text-gray-300 font-mono">{log.data.url}</div>
            </div>
            <div className="bg-gray-800 rounded p-2 mb-2">
              <div className="text-xs text-gray-400 mb-1">Body:</div>
              <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                {JSON.stringify(log.data.body, null, 2)}
              </pre>
            </div>
          </div>
        );
      case 'response':
        return (
          <div className="mb-4 border-l-2 border-green-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-xs">[{formatTimestamp(log.timestamp)}]</span>
              <span className="text-green-400 font-bold">RESPONSE</span>
              <span className="text-yellow-400 text-sm">← {log.model}</span>
            </div>
            <div className="bg-gray-800 rounded p-2 mb-2">
              <div className="text-xs text-gray-400 mb-1">Status: {log.data.status}</div>
              {log.data.usage && (
                <div className="text-xs text-gray-400">
                  Tokens: {log.data.usage.prompt_tokens} + {log.data.usage.completion_tokens} = {log.data.usage.total_tokens}
                </div>
              )}
            </div>
            <div className="bg-gray-800 rounded p-2 mb-2">
              <div className="text-xs text-gray-400 mb-1">Content:</div>
              <div className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                {log.data.content}
              </div>
            </div>
            {log.data.fullResponse && (
              <details className="bg-gray-800 rounded p-2">
                <summary className="text-xs text-gray-400 cursor-pointer">Full Response (click to expand)</summary>
                <pre className="text-xs text-gray-300 font-mono overflow-x-auto mt-2">
                  {JSON.stringify(log.data.fullResponse, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
      case 'error':
        return (
          <div className="mb-4 border-l-2 border-red-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-xs">[{formatTimestamp(log.timestamp)}]</span>
              <span className="text-red-400 font-bold">ERROR</span>
              <span className="text-yellow-400 text-sm">✗ {log.model}</span>
            </div>
            <div className="bg-gray-800 rounded p-2">
              <div className="text-xs text-red-400 font-mono">
                {log.data.error || log.data.message || 'Unknown error'}
              </div>
              {log.data.status && (
                <div className="text-xs text-gray-400 mt-1">
                  Status: {log.data.status} {log.data.statusText || ''}
                </div>
              )}
              {log.data.simulated && (
                <div className="text-xs text-yellow-400 mt-1">
                  (Simulated response - no API key)
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={consoleRef}
      className="h-full bg-black border border-gray-700 rounded p-4 font-mono text-sm overflow-y-auto"
      style={{ fontFamily: 'Courier New, monospace' }}
    >
      {logs.length === 0 ? (
        <div className="text-gray-500">Waiting for LLM requests...</div>
      ) : (
        logs.map((log, index) => (
          <div key={index}>
            {formatLog(log)}
          </div>
        ))
      )}
    </div>
  );
};

export default LLMLogConsole;

