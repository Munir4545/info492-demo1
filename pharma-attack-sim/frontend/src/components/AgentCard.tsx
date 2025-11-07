import { motion } from 'framer-motion';

interface AgentCardProps {
  agentType: string;
  name: string;
  status: 'idle' | 'working' | 'completed' | 'failed';
  message: string;
  icon: string;
}

const AgentCard = ({ agentType, name, status, message, icon }: AgentCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'working':
        return 'border-blue-500 bg-blue-500/10';
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'failed':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const isActive = status === 'working';

  return (
    <motion.div
      className={`border-2 rounded-lg p-4 ${getStatusColor()} transition-all`}
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-mono font-bold text-white mb-1">{name}</h3>
          <div className="text-xs uppercase tracking-wider mb-2 text-gray-400">
            {status}
          </div>
          <p className="text-sm text-gray-300 font-mono line-clamp-2">
            {message || 'Waiting for activation...'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;

