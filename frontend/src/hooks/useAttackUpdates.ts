import { useEffect, useState } from 'react';
import { createSocket } from '../lib/socket';
import { Socket } from 'socket.io-client';

export interface AgentMessage {
  attackId: number;
  agentType: string;
  message: string;
  timestamp: string;
}

export interface StepUpdate {
  attackId: number;
  stepId: number;
  status: string;
  agentType?: string;
}

export interface AttackCompleted {
  attackId: number;
  results: {
    success: boolean;
    packagesAffected: number;
    patientsImpacted: number;
    cascadingDisruptions: number;
    financialCost: number;
    erVisits: number;
    detectionTime: number;
  };
}

export interface AttackPaused {
  attackId: number;
  reason: string;
  step: string;
}

export interface LLMLog {
  attackId: number;
  type: 'request' | 'response' | 'error';
  model: string;
  timestamp: string;
  data: any;
}

export const useAttackUpdates = (attackId: number | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [stepUpdates, setStepUpdates] = useState<StepUpdate[]>([]);
  const [attackCompleted, setAttackCompleted] = useState<AttackCompleted | null>(null);
  const [attackPaused, setAttackPaused] = useState<AttackPaused | null>(null);
  const [llmLogs, setLlmLogs] = useState<LLMLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!attackId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = createSocket(token);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('agent:message', (data: AgentMessage) => {
      if (data.attackId === attackId) {
        setMessages(prev => [...prev, data]);
      }
    });

    newSocket.on('step:updated', (data: StepUpdate) => {
      if (data.attackId === attackId) {
        setStepUpdates(prev => {
          const existing = prev.findIndex(s => s.stepId === data.stepId);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data;
            return updated;
          }
          return [...prev, data];
        });
        
        // Clear paused state when phishing step becomes running again
        if (data.agentType === 'phishing' && data.status === 'running') {
          setAttackPaused(null);
        }
      }
    });

    newSocket.on('attack:completed', (data: AttackCompleted) => {
      if (data.attackId === attackId) {
        setAttackCompleted(data);
      }
    });

    newSocket.on('attack:failed', (data: { attackId: number; error: string }) => {
      if (data.attackId === attackId) {
        console.error('Attack failed:', data.error);
        setAttackPaused(null);
      }
    });

    newSocket.on('attack:paused', (data: AttackPaused) => {
      if (data.attackId === attackId) {
        setAttackPaused(data);
      }
    });

    newSocket.on('llm:log', (data: LLMLog) => {
      if (data.attackId === attackId) {
        setLlmLogs(prev => [...prev, data]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [attackId]);

  return {
    socket,
    messages,
    stepUpdates,
    attackCompleted,
    attackPaused,
    llmLogs,
    isConnected
  };
};

