import { Server as SocketIOServer } from 'socket.io';
import { dbRun, dbGet } from '../database/db';

export interface AgentConfig {
  attackId: number;
  io: SocketIOServer;
}

export abstract class BaseAgent {
  protected attackId: number;
  protected io: SocketIOServer;
  protected agentType: string;

  constructor(config: AgentConfig, agentType: string) {
    this.attackId = config.attackId;
    this.io = config.io;
    this.agentType = agentType;
  }

  protected async emit(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    
    // Save to database
    await dbRun(
      `INSERT INTO agent_messages (attack_id, agent_type, message, timestamp) VALUES (?, ?, ?, ?)`,
      [this.attackId, this.agentType, message, timestamp]
    );

    // Emit via Socket.IO
    this.io.emit('agent:message', {
      attackId: this.attackId,
      agentType: this.agentType,
      message,
      timestamp
    });
  }

  protected async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  abstract execute(): Promise<boolean>;
}

