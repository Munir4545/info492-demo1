import { useEffect, useRef } from 'react';
import { AgentMessage } from '../hooks/useAttackUpdates';

interface LiveConsoleProps {
  messages: AgentMessage[];
}

const LiveConsole = ({ messages }: LiveConsoleProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getMessageColor = (agentType: string) => {
    switch (agentType) {
      case 'orchestrator':
        return 'text-purple-400';
      case 'phishing':
        return 'text-yellow-400';
      case 'gps':
        return 'text-blue-400';
      case 'api_flooding':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div
      ref={consoleRef}
      className="h-full bg-black border border-gray-700 rounded p-4 font-mono text-sm overflow-y-auto"
      style={{ fontFamily: 'Courier New, monospace' }}
    >
      {messages.length === 0 ? (
        <div className="text-gray-500">Waiting for agent messages...</div>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="text-gray-500">[{formatTimestamp(msg.timestamp)}]</span>
            <span className={`ml-2 ${getMessageColor(msg.agentType)}`}>
              [{msg.agentType.toUpperCase()}]
            </span>
            <span className="ml-2 text-gray-300">{msg.message}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default LiveConsole;

