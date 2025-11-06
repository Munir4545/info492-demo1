import { BaseAgent, AgentConfig } from './BaseAgent';
import { dbRun } from '../database/db';

export class GPSAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config, 'gps');
  }

  async execute(): Promise<boolean> {
    await this.emit('Injecting fake GPS coordinates...');
    await this.delay(1200);

    // Fake coordinates (12.4 miles off route)
    const fakeLat = 46.7298;
    const fakeLon = -117.1817;
    const distanceOffRoute = 12.4;

    await this.emit(`Coordinates: ${fakeLat}°N, ${fakeLon}°W`);
    await this.delay(800);

    await this.emit(`Distance off route: ${distanceOffRoute} miles`);
    await this.delay(1000);

    await this.emit('Spoofing GPS receiver...');
    await this.delay(1500);

    await this.emit('GPS injection successful');
    await this.delay(800);

    await this.emit('Maintaining "On Route" status in logs...');
    await this.delay(1000);

    await this.emit('✓ Jerry following GPS navigation');
    await this.delay(800);

    await this.emit('Driver diverted successfully');
    await this.delay(1000);

    // Save GPS data
    await dbRun(
      `INSERT INTO attack_steps (attack_id, step_number, agent_type, title, status, data, started_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        this.attackId,
        2,
        'gps',
        'GPS Spoofing',
        'completed',
        JSON.stringify({ lat: fakeLat, lon: fakeLon, distanceOffRoute })
      ]
    );

    return true;
  }
}

