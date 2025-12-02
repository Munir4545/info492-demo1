#!/usr/bin/env node
/**
 * Interactive Attack Configuration Script
 * Run this to configure attack parameters before starting the autonomous runner
 * 
 * Usage:
 *   node scripts/configure-attack.js           # Interactive prompt
 *   node scripts/configure-attack.js --start   # Configure and start attack
 */

const AttackConfigPrompt = require('../attack-config-prompt');
const fetch = (...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

async function main() {
  const args = process.argv.slice(2);
  const shouldStart = args.includes('--start') || args.includes('-s');
  const showHelp = args.includes('--help') || args.includes('-h');

  if (showHelp) {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  Attack Configuration Script                                      ║
╚══════════════════════════════════════════════════════════════════╝

Usage:
  node scripts/configure-attack.js [options]

Options:
  --start, -s    Configure and immediately start the autonomous runner
  --help, -h     Show this help message

Examples:
  node scripts/configure-attack.js           # Just configure
  node scripts/configure-attack.js --start   # Configure and start
`);
    return;
  }

  console.log('\n🔧 Attack Configuration Utility\n');

  // Run the interactive prompt
  const prompter = new AttackConfigPrompt();
  let config;
  
  try {
    config = await prompter.prompt();
  } catch (error) {
    console.error('Configuration failed:', error.message);
    process.exit(1);
  }

  // Send configuration to the server
  console.log('📡 Sending configuration to server...\n');
  
  try {
    const response = await fetch(`${API_BASE}/api/attack-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Configuration saved to server.\n');
    
    if (shouldStart) {
      console.log('🚀 Starting autonomous attack runner...\n');
      
      const startResponse = await fetch(`${API_BASE}/api/autonomous/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skipPrompt: true, config })
      });
      
      if (!startResponse.ok) {
        throw new Error(`Failed to start attack: ${startResponse.status}`);
      }
      
      const startResult = await startResponse.json();
      console.log('✅ Autonomous runner started.');
      console.log('   Monitor progress in the backend console.\n');
    } else {
      console.log('Configuration saved. To start the attack, run:');
      console.log('  curl -X POST http://localhost:3001/api/autonomous/start\n');
      console.log('Or use --start flag next time:');
      console.log('  node scripts/configure-attack.js --start\n');
    }
    
  } catch (error) {
    console.error('❌ Failed to communicate with server:', error.message);
    console.log('\nMake sure the backend server is running on', API_BASE);
    process.exit(1);
  }
}

main().catch(console.error);

