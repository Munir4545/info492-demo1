import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const dbPath = path.join(__dirname, '../../data/database.sqlite');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Promisify database methods with proper typing
export const dbRun = (sql: string, params?: any[]): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params || [], function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = promisify(db.get.bind(db));
export const dbAll = promisify(db.all.bind(db));

export const initDatabase = async () => {
  // Create users table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create attacks table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS attacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      target_network TEXT NOT NULL,
      scenario TEXT NOT NULL,
      day INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      success_rate REAL,
      started_at DATETIME,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create attack_steps table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS attack_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attack_id INTEGER NOT NULL,
      step_number INTEGER NOT NULL,
      agent_type TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      started_at DATETIME,
      completed_at DATETIME,
      data TEXT,
      FOREIGN KEY (attack_id) REFERENCES attacks(id)
    )
  `);

  // Create agent_messages table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS agent_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attack_id INTEGER NOT NULL,
      agent_type TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (attack_id) REFERENCES attacks(id)
    )
  `);

  // Create demo user if it doesn't exist
  const bcrypt = require('bcrypt');
  const demoPasswordHash = await bcrypt.hash('demo123', 10);
  
  try {
    await dbRun(
      `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      ['demo', demoPasswordHash, 'user']
    );
  } catch (error: any) {
    // User might already exist, ignore
    if (!error.message.includes('UNIQUE constraint')) {
      throw error;
    }
  }

  console.log('Database initialized successfully');
};

export default db;

