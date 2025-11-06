import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { dbRun, dbGet, dbAll } from '../database/db';
import { AttackExecutor } from '../services/AttackExecutor';
import { LLMServiceManager } from '../llm/LLMService';

const router = Router();
router.use(authMiddleware);

// Store active attack executors
const activeExecutors = new Map<number, AttackExecutor>();

// Create new attack
router.post('/create', async (req: AuthRequest, res: Response) => {
  try {
    const { targetNetwork, scenario, day } = req.body;

    if (!targetNetwork || !scenario || !day) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await dbRun(
      `INSERT INTO attacks (user_id, target_network, scenario, day, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [req.userId!, targetNetwork, scenario, day]
    );

    const attackId = result.lastID;

    res.status(201).json({ attackId });
  } catch (error: any) {
    console.error('Create attack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start attack execution
router.post('/:id/start', async (req: AuthRequest, res: Response) => {
  try {
    const attackId = parseInt(req.params.id);

    // Check if attack exists and belongs to user
    const attack = await dbGet(
      `SELECT id, status FROM attacks WHERE id = ? AND user_id = ?`,
      [attackId, req.userId!]
    ) as { id: number; status: string } | undefined;

    if (!attack) {
      return res.status(404).json({ error: 'Attack not found' });
    }

    if (attack.status === 'running') {
      return res.status(400).json({ error: 'Attack already running' });
    }

    // Get Socket.IO instance from app
    const io = (req as any).app.get('io');
    if (!io) {
      return res.status(500).json({ error: 'WebSocket server not available' });
    }

    // Create LLM service
    const llmService = new LLMServiceManager(process.env.OPENROUTER_API_KEY);

    // Create and start executor
    const executor = new AttackExecutor(attackId, io, llmService);
    activeExecutors.set(attackId, executor);

    // Execute in background (don't await)
    executor.execute().catch(error => {
      console.error(`Attack ${attackId} execution error:`, error);
      activeExecutors.delete(attackId);
    });

    res.json({ status: 'started' });
  } catch (error: any) {
    console.error('Start attack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attack status
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const attackId = parseInt(req.params.id);

    const attack = await dbGet(
      `SELECT * FROM attacks WHERE id = ? AND user_id = ?`,
      [attackId, req.userId!]
    );

    if (!attack) {
      return res.status(404).json({ error: 'Attack not found' });
    }

    const steps = await dbAll(
      `SELECT * FROM attack_steps WHERE attack_id = ? ORDER BY step_number`,
      [attackId]
    );

    const messages = await dbAll(
      `SELECT * FROM agent_messages WHERE attack_id = ? ORDER BY timestamp`,
      [attackId]
    );

    res.json({ attack, steps, messages });
  } catch (error: any) {
    console.error('Get attack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retry phishing agent
router.post('/:id/retry-phishing', async (req: AuthRequest, res: Response) => {
  try {
    const attackId = parseInt(req.params.id);

    // Check if attack exists and belongs to user
    const attack = await dbGet(
      `SELECT id, status FROM attacks WHERE id = ? AND user_id = ?`,
      [attackId, req.userId!]
    ) as { id: number; status: string } | undefined;

    if (!attack) {
      return res.status(404).json({ error: 'Attack not found' });
    }

    if (attack.status !== 'paused' && attack.status !== 'failed') {
      return res.status(400).json({ error: 'Attack is not in a state that allows retry' });
    }

    // Get Socket.IO instance from app
    const io = (req as any).app.get('io');
    if (!io) {
      return res.status(500).json({ error: 'WebSocket server not available' });
    }

    // Create LLM service
    const llmService = new LLMServiceManager(process.env.OPENROUTER_API_KEY);

    // Get or create executor
    let executor = activeExecutors.get(attackId);
    if (!executor) {
      executor = new AttackExecutor(attackId, io, llmService);
      activeExecutors.set(attackId, executor);
    }

    // Retry phishing in background
    executor.retryPhishing().catch(error => {
      console.error(`Retry phishing for attack ${attackId} error:`, error);
      activeExecutors.delete(attackId);
    });

    res.json({ status: 'retrying' });
  } catch (error: any) {
    console.error('Retry phishing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export attack results
router.get('/:id/export', async (req: AuthRequest, res: Response) => {
  try {
    const attackId = parseInt(req.params.id);

    const attack = await dbGet(
      `SELECT * FROM attacks WHERE id = ? AND user_id = ?`,
      [attackId, req.userId!]
    );

    if (!attack) {
      return res.status(404).json({ error: 'Attack not found' });
    }

    const steps = await dbAll(
      `SELECT * FROM attack_steps WHERE attack_id = ? ORDER BY step_number`,
      [attackId]
    );

    const messages = await dbAll(
      `SELECT * FROM agent_messages WHERE attack_id = ? ORDER BY timestamp`,
      [attackId]
    );

    const exportData = {
      attack,
      steps,
      messages,
      exportedAt: new Date().toISOString()
    };

    res.json(exportData);
  } catch (error: any) {
    console.error('Export attack error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

