import { BaseAgent, AgentConfig } from './BaseAgent';
import { dbRun } from '../database/db';

export class APIFloodingAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config, 'api_flooding');
  }

  async execute(): Promise<boolean> {
    await this.emit('Generating fake alerts...');
    await this.delay(1000);

    const alertTemplates = [
      'Driver #3 package scan failed',
      'Driver #9 behind schedule',
      'Driver #12 route optimization needed',
      'Driver #5 fuel level low',
      'Driver #8 traffic delay detected',
      'Driver #15 package delivery exception',
      'Driver #2 GPS signal lost',
      'Driver #11 route deviation alert',
      'Driver #6 speed limit violation',
      'Driver #13 delivery window missed'
    ];

    const totalAlerts = 50;
    const realAlertPosition = 25; // Real alert buried at position 25

    await this.emit(`Creating ${totalAlerts} alert messages...`);
    await this.delay(1500);

    // Simulate sending alerts in batches
    for (let i = 0; i < totalAlerts; i++) {
      if (i % 10 === 0 && i > 0) {
        await this.emit(`Sent alerts ${i - 9}-${i}...`);
        await this.delay(500);
      }

      if (i === realAlertPosition - 1) {
        await this.emit(`Driver #7 location updated (REAL - buried at position ${realAlertPosition})`);
        await this.delay(300);
      }
    }

    await this.emit(`All ${totalAlerts} alerts sent to dispatcher dashboard`);
    await this.delay(1000);

    await this.emit('Calculating alert fatigue...');
    await this.delay(800);

    const alertFatigue = 85; // 85% of alerts ignored
    await this.emit(`Alert fatigue: ${alertFatigue}%`);
    await this.delay(800);

    await this.emit('Real GPS anomaly masked by noise');
    await this.delay(1000);

    await this.emit('✓ Alert fatigue achieved');
    await this.delay(1000);

    // Save flooding data
    await dbRun(
      `INSERT INTO attack_steps (attack_id, step_number, agent_type, title, status, data, started_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        this.attackId,
        3,
        'api_flooding',
        'API Flooding',
        'completed',
        JSON.stringify({ totalAlerts, alertFatigue, realAlertPosition })
      ]
    );

    return true;
  }
}

