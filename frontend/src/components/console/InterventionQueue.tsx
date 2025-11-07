import { useAttackContext } from '../../state/AttackProvider';

const badgeClasses: Record<string, string> = {
  info: 'bg-sky-500/10 text-sky-300 border-sky-500/40',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
  critical: 'bg-red-500/10 text-red-300 border-red-500/40'
};

const InterventionQueue = () => {
  const { interventions, handleInterventionAction } = useAttackContext();

  if (!interventions.length) {
    return <div className="text-sm text-gray-500">No pending interventions.</div>;
  }

  return (
    <div className="space-y-4">
      {interventions.map((item) => (
        <div key={item.id} className="border border-gray-800 rounded-lg p-4 bg-gray-950/60">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase border ${badgeClasses[item.severity]}`}>
              {item.severity}
            </span>
            <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleTimeString()}</span>
          </div>
          <p className="mt-3 text-sm text-gray-300 leading-6">{item.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleInterventionAction(item.id, action.id)}
                className="px-3 py-1 border border-gray-700 text-xs uppercase tracking-[0.2em] rounded hover:border-green-400 hover:text-green-300 transition"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterventionQueue;


