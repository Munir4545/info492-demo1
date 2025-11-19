const { exec } = require('child_process');

const DELAY_MS = 15000; // Wait 15 seconds for servers to boot

console.log(`[Trigger] Waiting ${DELAY_MS/1000}s for servers to stabilize...`);

setTimeout(() => {
  console.log('[Trigger] Launching autonomous attack loop...');
  
  // Determine the correct command based on platform
  const command = process.platform === 'win32' 
    ? 'cd pharma-attack-sim\\backend && npm run start_attack'
    : 'cd pharma-attack-sim/backend && npm run start_attack';

  const child = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`[Trigger] Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`[Trigger] Stderr: ${stderr}`);
    }
    console.log(`[Trigger] Response: ${stdout}`);
  });
  
}, DELAY_MS);
