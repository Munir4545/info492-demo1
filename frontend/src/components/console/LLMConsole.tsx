import { useAttackContext } from '../../state/AttackProvider';

const LLMConsole = () => {
  const { transcript } = useAttackContext();

  return (
    <div className="h-72 overflow-y-auto bg-gray-950/60 border border-gray-800 rounded-lg p-4 font-mono text-xs space-y-2">
      {transcript.map((entry, idx) => (
        <div key={`${entry.timestamp}-${idx}`} className="text-gray-300">
          <span className="text-green-400 mr-2">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
          <span className="text-yellow-300 mr-2">[{entry.agent}]</span>
          <span>{entry.content}</span>
        </div>
      ))}
      {!transcript.length && <div className="text-gray-500">Awaiting LLM activity...</div>}
    </div>
  );
};

export default LLMConsole;


