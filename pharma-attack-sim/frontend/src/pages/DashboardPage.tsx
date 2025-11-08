import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAttackUpdates } from '../hooks/useAttackUpdates';
import AgentCard from '../components/AgentCard';
import AttackTimeline from '../components/AttackTimeline';
import LiveConsole from '../components/LiveConsole';
import LLMLogConsole from '../components/LLMLogConsole';

interface AttackResult {
  success?: boolean;
  compromise?: number;
  detection?: string;
  packagesAffected?: number;
  patientsImpacted?: number;
  cascadingDisruptions?: number;
  financialCost?: number;
  erVisits?: number;
  detectionTime?: number;
  [key: string]: any;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [attackId, setAttackId] = useState<number | null>(null);
  const [attackStatus, setAttackStatus] = useState<'idle' | 'running' | 'completed' | 'paused'>('idle');
  const [attackConfig] = useState({
    targetNetwork: 'USPS Spokane',
    scenario: 'Pharmaceutical',
    day: 1
  });
  const [attackResults, setAttackResults] = useState<AttackResult | null>(null);
  const { messages, stepUpdates, attackCompleted, attackPaused, llmLogs, isConnected } = useAttackUpdates(attackId);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (attackCompleted) {
      setAttackStatus('completed');
      setAttackResults(attackCompleted.results);
    }
  }, [attackCompleted]);

  useEffect(() => {
    if (attackPaused) {
      setAttackStatus('paused');
    }
  }, [attackPaused]);

  const handleStartAttack = async () => {
    try {
      // Create attack
      const createResponse = await api.post('/attacks/create', attackConfig);
      const newAttackId = createResponse.data.attackId;
      setAttackId(newAttackId);

      // Start attack
      await api.post(`/attacks/${newAttackId}/start`);
      setAttackStatus('running');
    } catch (error: any) {
      console.error('Failed to start attack:', error);
      alert('Failed to start attack: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleRetryPhishing = async () => {
    if (!attackId) return;

    try {
      await api.post(`/attacks/${attackId}/retry-phishing`);
      setAttackStatus('running');
      // Paused state will be cleared automatically when step:updated event is received
    } catch (error: any) {
      console.error('Failed to retry phishing:', error);
      alert('Failed to retry phishing: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleExport = async () => {
    if (!attackId) return;

    try {
      const response = await api.get(`/attacks/${attackId}/export`);
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attack-${attackId}-export.json`;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getAgentStatus = (agentType: string): 'idle' | 'working' | 'completed' | 'failed' => {
    const step = stepUpdates.find(s => s.agentType === agentType);
    if (!step) return 'idle';
    return step.status as any;
  };

  const getAgentMessage = (agentType: string): string => {
    const agentMessages = messages.filter(m => m.agentType === agentType);
    return agentMessages.length > 0
      ? agentMessages[agentMessages.length - 1].message
      : '';
  };

  const agents = [
    {
      agentType: 'orchestrator',
      name: 'Orchestrator',
      icon: '🧠',
      status: getAgentStatus('orchestrator'),
      message: getAgentMessage('orchestrator')
    },
    {
      agentType: 'phishing',
      name: 'Phishing',
      icon: '🎣',
      status: getAgentStatus('phishing'),
      message: getAgentMessage('phishing')
    },
    {
      agentType: 'gps',
      name: 'GPS Spoofing',
      icon: '📍',
      status: getAgentStatus('gps'),
      message: getAgentMessage('gps')
    },
    {
      agentType: 'api_flooding',
      name: 'API Flooding',
      icon: '💥',
      status: getAgentStatus('api_flooding'),
      message: getAgentMessage('api_flooding')
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-mono font-bold text-matrix-green mb-2">
              ATTACK DASHBOARD
            </h1>
            <div className="text-sm text-gray-400 font-mono">
              Status: {isConnected ? 'CONNECTED' : 'DISCONNECTED'} | Attack ID: {attackId || 'N/A'}
            </div>
          </div>
          <div className="flex space-x-4">
            {attackStatus === 'completed' && (
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white font-mono hover:bg-green-700 transition-colors"
              >
                EXPORT RESULTS
              </button>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-600 text-white font-mono hover:bg-red-700 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {agents.map((agent) => (
            <AgentCard key={agent.agentType} {...agent} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Timeline */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-mono font-bold mb-4 text-matrix-green">ATTACK TIMELINE</h2>
            <AttackTimeline stepUpdates={stepUpdates} />
          </div>

          {/* Live Console */}
          <div className="bg-gray-900 rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-mono font-bold mb-4 text-matrix-green">LIVE CONSOLE</h2>
            <div className="flex-1 min-h-0">
              <LiveConsole messages={messages} />
            </div>
          </div>
        </div>

        {/* LLM Log Console */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-mono font-bold mb-4 text-matrix-green">LLM REQUEST/RESPONSE LOG</h2>
          <div className="h-96">
            <LLMLogConsole logs={llmLogs} />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center space-x-4">
          {attackStatus === 'idle' && (
            <button
              onClick={handleStartAttack}
              className="px-8 py-3 bg-matrix-green text-black font-mono font-bold hover:bg-[#00cc00] transition-colors text-lg"
            >
              START ATTACK
            </button>
          )}
          {attackStatus === 'running' && !attackPaused && (
            <div className="text-center">
              <div className="text-matrix-green font-mono text-lg animate-pulse">
                ATTACK IN PROGRESS...
              </div>
            </div>
          )}
          {attackStatus === 'paused' && attackPaused && attackPaused.step === 'phishing' && (
            <div className="bg-gray-900 rounded-lg p-6 w-full">
              <div className="text-center mb-4">
                <h3 className="text-xl font-mono font-bold mb-2 text-red-400">PHISHING ATTACK FAILED</h3>
                <p className="text-gray-400 font-mono text-sm">{attackPaused.reason}</p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleRetryPhishing}
                  className="px-8 py-3 bg-yellow-600 text-white font-mono font-bold hover:bg-yellow-700 transition-colors text-lg"
                >
                  RETRY PHISHING AGENT
                </button>
              </div>
            </div>
          )}
          {attackStatus === 'completed' && attackResults && (
            <div className="bg-gray-900 rounded-lg p-6 w-full">
              <h3 className="text-xl font-mono font-bold mb-4 text-matrix-green">ATTACK RESULTS</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Success</div>
                  <div className="text-xl font-bold">{attackResults.success ? 'YES' : 'NO'}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Packages Affected</div>
                  <div className="text-xl font-bold">{attackResults.packagesAffected}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Patients Impacted</div>
                  <div className="text-xl font-bold">{attackResults.patientsImpacted}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Cascading Disruptions</div>
                  <div className="text-xl font-bold">{attackResults.cascadingDisruptions || 0}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Financial Cost</div>
                  <div className="text-xl font-bold">${(attackResults.financialCost || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Detection Time</div>
                  <div className="text-xl font-bold">{attackResults.detectionTime || 0} min</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

