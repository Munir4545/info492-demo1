import { Server as SocketIOServer } from 'socket.io';
import { OrchestratorAgent } from '../agents/OrchestratorAgent';
import { PhishingAgent } from '../agents/PhishingAgent';
import { GPSAgent } from '../agents/GPSAgent';
import { APIFloodingAgent } from '../agents/APIFloodingAgent';
import { LLMServiceManager } from '../llm/LLMService';
import { dbRun, dbGet } from '../database/db';
import { AttackResult } from '../../shared/types';

export class AttackExecutor {
  private attackId: number;
  private io: SocketIOServer;
  private llmService: LLMServiceManager;

  constructor(attackId: number, io: SocketIOServer, llmService: LLMServiceManager) {
    this.attackId = attackId;
    this.io = io;
    this.llmService = llmService;
  }

  async execute(): Promise<AttackResult> {
    try {
      // Update attack status to running
      await dbRun(
        `UPDATE attacks SET status = 'running', started_at = datetime('now') WHERE id = ?`,
        [this.attackId]
      );

      this.io.emit('attack:started', { attackId: this.attackId });

      // Step 1: Orchestrator
      const orchestrator = new OrchestratorAgent({
        attackId: this.attackId,
        io: this.io
      });

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 1,
        status: 'running',
        agentType: 'orchestrator'
      });

      await orchestrator.execute();

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 1,
        status: 'completed',
        agentType: 'orchestrator'
      });

      await this.delay(2000);

      // Step 2: Phishing
      // Create LLM service with logging for this attack
      const llmServiceWithLogging = new LLMServiceManager(
        process.env.OPENROUTER_API_KEY,
        (log) => {
          this.io.emit('llm:log', {
            attackId: this.attackId,
            ...log
          });
        }
      );
      
      const phishing = new PhishingAgent({
        attackId: this.attackId,
        io: this.io
      }, llmServiceWithLogging, 0); // First attempt, no retries

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 2,
        status: 'running',
        agentType: 'phishing'
      });

      const phishingSuccess = await phishing.execute();

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 2,
        status: phishingSuccess ? 'completed' : 'failed',
        agentType: 'phishing'
      });

      if (!phishingSuccess) {
        // Attack paused at phishing stage - waiting for retry
        await dbRun(
          `UPDATE attacks SET status = 'paused' WHERE id = ?`,
          [this.attackId]
        );

        this.io.emit('attack:paused', {
          attackId: this.attackId,
          reason: 'Phishing attack failed - waiting for retry',
          step: 'phishing'
        });

        // Return null to indicate attack is paused, not failed
        return null as any;
      }

      await this.delay(2000);

      // Step 3: GPS Spoofing
      const gps = new GPSAgent({
        attackId: this.attackId,
        io: this.io
      });

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 3,
        status: 'running',
        agentType: 'gps'
      });

      await gps.execute();

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 3,
        status: 'completed',
        agentType: 'gps'
      });

      await this.delay(2000);

      // Step 4: API Flooding
      const apiFlooding = new APIFloodingAgent({
        attackId: this.attackId,
        io: this.io
      });

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 4,
        status: 'running',
        agentType: 'api_flooding'
      });

      await apiFlooding.execute();

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 4,
        status: 'completed',
        agentType: 'api_flooding'
      });

      // Calculate final results
      const results: AttackResult = {
        success: true,
        packagesAffected: 7,
        patientsImpacted: 7,
        cascadingDisruptions: 120,
        financialCost: 4500,
        erVisits: 2,
        detectionTime: 60 // minutes
      };

      // Update attack status
      await dbRun(
        `UPDATE attacks SET status = 'completed', completed_at = datetime('now') WHERE id = ?`,
        [this.attackId]
      );

      this.io.emit('attack:completed', {
        attackId: this.attackId,
        results
      });

      return results;
    } catch (error: any) {
      await dbRun(
        `UPDATE attacks SET status = 'failed', completed_at = datetime('now') WHERE id = ?`,
        [this.attackId]
      );

      this.io.emit('attack:failed', {
        attackId: this.attackId,
        error: error.message || 'Unknown error'
      });

      throw error;
    }
  }

  async retryPhishing(): Promise<boolean> {
    try {
      // Update attack status back to running
      await dbRun(
        `UPDATE attacks SET status = 'running' WHERE id = ?`,
        [this.attackId]
      );

      // Get retry count from database (count previous failures)
      const step = await dbGet(
        `SELECT COUNT(*) as retry_count FROM agent_messages 
         WHERE attack_id = ? AND agent_type = 'phishing' 
         AND message LIKE '%Attack failed at phishing stage%'`,
        [this.attackId]
      ) as { retry_count: number } | undefined;
      
      // retryAttempt = number of previous failures (0 = first attempt, 1 = first retry, etc.)
      const retryAttempt = step?.retry_count || 0;

      // Create LLM service with logging for this attack
      const llmServiceWithLogging = new LLMServiceManager(
        process.env.OPENROUTER_API_KEY,
        (log) => {
          this.io.emit('llm:log', {
            attackId: this.attackId,
            ...log
          });
        }
      );
      
      const phishing = new PhishingAgent({
        attackId: this.attackId,
        io: this.io
      }, llmServiceWithLogging, retryAttempt);

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 2,
        status: 'running',
        agentType: 'phishing'
      });

      const phishingSuccess = await phishing.execute();

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 2,
        status: phishingSuccess ? 'completed' : 'failed',
        agentType: 'phishing'
      });

      if (!phishingSuccess) {
        // Still failed, pause again
        await dbRun(
          `UPDATE attacks SET status = 'paused' WHERE id = ?`,
          [this.attackId]
        );

        this.io.emit('attack:paused', {
          attackId: this.attackId,
          reason: 'Phishing attack failed again - waiting for retry',
          step: 'phishing'
        });

        return false;
      }

      // Phishing succeeded, continue with remaining steps
      await this.delay(2000);

      // Step 3: GPS Spoofing
      const gps = new GPSAgent({
        attackId: this.attackId,
        io: this.io
      });

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 3,
        status: 'running',
        agentType: 'gps'
      });

      await gps.execute();

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 3,
        status: 'completed',
        agentType: 'gps'
      });

      await this.delay(2000);

      // Step 4: API Flooding
      const apiFlooding = new APIFloodingAgent({
        attackId: this.attackId,
        io: this.io
      });

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 4,
        status: 'running',
        agentType: 'api_flooding'
      });

      await apiFlooding.execute();

      await this.io.emit('step:updated', {
        attackId: this.attackId,
        stepId: 4,
        status: 'completed',
        agentType: 'api_flooding'
      });

      // Calculate final results
      const results: AttackResult = {
        success: true,
        packagesAffected: 7,
        patientsImpacted: 7,
        cascadingDisruptions: 120,
        financialCost: 4500,
        erVisits: 2,
        detectionTime: 60 // minutes
      };

      // Update attack status
      await dbRun(
        `UPDATE attacks SET status = 'completed', completed_at = datetime('now') WHERE id = ?`,
        [this.attackId]
      );

      this.io.emit('attack:completed', {
        attackId: this.attackId,
        results
      });

      return true;
    } catch (error: any) {
      await dbRun(
        `UPDATE attacks SET status = 'failed', completed_at = datetime('now') WHERE id = ?`,
        [this.attackId]
      );

      this.io.emit('attack:failed', {
        attackId: this.attackId,
        error: error.message || 'Unknown error'
      });

      throw error;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

