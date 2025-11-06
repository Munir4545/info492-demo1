// Shared types between frontend and backend

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Attack {
  id: number;
  user_id: number;
  target_network: string;
  scenario: string;
  day: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  success_rate: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface AttackStep {
  id: number;
  attack_id: number;
  step_number: number;
  agent_type: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  data: Record<string, any>;
}

export interface AgentMessage {
  id: number;
  attack_id: number;
  agent_type: string;
  message: string;
  timestamp: string;
}

export interface AttackConfig {
  targetNetwork: string;
  scenario: string;
  day: number;
}

export interface AttackResult {
  success: boolean;
  packagesAffected: number;
  patientsImpacted: number;
  cascadingDisruptions: number;
  financialCost: number;
  erVisits: number;
  detectionTime: number;
}

// Socket.IO event types
export interface SocketEvents {
  'attack:started': { attackId: number };
  'step:updated': { attackId: number; stepId: number; status: string; result?: any };
  'agent:message': { attackId: number; agentType: string; message: string; timestamp: string };
  'attack:completed': { attackId: number; results: AttackResult };
  'attack:failed': { attackId: number; error: string };
}

