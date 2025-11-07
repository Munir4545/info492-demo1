// Master Dashboard JavaScript

// Matrix Rain Animation
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];
  
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }
  
  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      
      ctx.fillText(text, x, y);
      
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  setInterval(drawMatrix, 35);
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Socket.IO Connection
const socket = io('http://localhost:3001');
let currentAttackId = null;
let startTime = null;
let packetCount = 0;
let activeAgentCount = 0;

socket.on('connect', () => {
  addMessage('ai-reasoning', '🔌 Connected to attack server');
});

socket.on('disconnect', () => {
  addMessage('ai-reasoning', '❌ Disconnected from server');
});

// Socket.IO Event Handlers
socket.on('ai:reasoning', (data) => {
  addMessage('ai-reasoning', `[${data.agent}] ${data.message}`);
});

socket.on('recon:finding', (data) => {
  updateReconPanel(data);
});

socket.on('tier:analysis', (data) => {
  updateTierAnalysis(data);
});

socket.on('graph:update', (data) => {
  if (window.updateAttackGraph) {
    window.updateAttackGraph(data.currentNode, data.path, data.status);
  }
});

socket.on('agent:message', (data) => {
  addMessage('ai-reasoning', `[${data.agent}] ${data.message}`);
  packetCount++;
  updateTelemetry();
});

socket.on('step:started', (data) => {
  activeAgentCount++;
  updateTelemetry();
});

socket.on('step:completed', (data) => {
  activeAgentCount = Math.max(0, activeAgentCount - 1);
  updateTelemetry();
});

socket.on('attack:started', (data) => {
  currentAttackId = data.attackId;
  startTime = Date.now();
  addMessage('ai-reasoning', `🚀 Attack #${data.attackId} started`);
});

socket.on('attack:completed', (data) => {
  addMessage('ai-reasoning', `✅ Attack completed. Success: ${data.success}`);
  document.getElementById('export-btn').disabled = false;
  updateTelemetry();
});

socket.on('experiment:started', (data) => {
  addMessage('experiment-results', `🧪 Starting: ${data.name}`);
});

socket.on('experiment:completed', (data) => {
  addMessage('experiment-results', `✅ Completed: ${data.experiment}`);
  if (data.result && data.result.conclusion) {
    addMessage('experiment-results', `   ${data.result.conclusion}`);
  }
});

socket.on('experiments:completed', (data) => {
  addMessage('experiment-results', '🎉 All experiments completed!');
});

// Form Submission
const attackForm = document.getElementById('attack-form');
if (attackForm) {
  attackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const targetDriver = document.getElementById('target-driver').value;
    const successRate = parseFloat(document.getElementById('success-rate').value);
    const attackDay = parseInt(document.getElementById('attack-day').value);
    
    try {
      const createResponse = await fetch('http://localhost:3001/api/attacks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            targetDriver,
            baseSuccessRate: successRate,
            day: attackDay,
            timing: new Date().toLocaleTimeString()
          }
        })
      });
      
      const { attackId } = await createResponse.json();
      currentAttackId = attackId;
      
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
      
      await fetch(`http://localhost:3001/api/attacks/${attackId}/start`, {
        method: 'POST'
      });
      
    } catch (error) {
      addMessage('ai-reasoning', `❌ Error: ${error.message}`);
    }
  });
}

// Tab Switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
  });
});

// Tier Box Click Handlers
document.querySelectorAll('.tier-box').forEach(box => {
  box.addEventListener('click', async () => {
    const tier = box.dataset.tier;
    try {
      const response = await fetch(`http://localhost:3001/api/tiers/${tier}`);
      const data = await response.json();
      displayTierDetails(data);
    } catch (error) {
      console.error('Error fetching tier data:', error);
    }
  });
});

// Experiments
document.getElementById('run-experiments-btn')?.addEventListener('click', async () => {
  try {
    await fetch('http://localhost:3001/api/experiments/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attackId: currentAttackId })
    });
    addMessage('experiment-results', '🚀 Experiments started...');
  } catch (error) {
    addMessage('experiment-results', `❌ Error: ${error.message}`);
  }
});

// Export Button
document.getElementById('export-btn')?.addEventListener('click', async () => {
  if (!currentAttackId) return;
  
  try {
    const response = await fetch(`http://localhost:3001/api/attacks/${currentAttackId}`);
    const data = await response.json();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attack-${currentAttackId}-export.json`;
    a.click();
    
    addMessage('ai-reasoning', '📥 Attack data exported');
  } catch (error) {
    addMessage('ai-reasoning', `❌ Export error: ${error.message}`);
  }
});

// Reset Button
document.getElementById('reset-btn')?.addEventListener('click', () => {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('ai-reasoning').innerHTML = '';
  document.getElementById('export-btn').disabled = true;
  currentAttackId = null;
  startTime = null;
  packetCount = 0;
  activeAgentCount = 0;
  updateTelemetry();
  
  if (window.updateAttackGraph) {
    window.updateAttackGraph(null, [], null);
  }
});

// Helper Functions
function addMessage(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const line = document.createElement('div');
  line.className = 'console-line';
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

function updateReconPanel(data) {
  // Update reconnaissance findings
}

function updateTierAnalysis(data) {
  const panel = document.getElementById('tier-map');
  if (panel && data.targetTier) {
    const tierBox = panel.querySelector(`[data-tier="${data.targetTier}"]`);
    if (tierBox) {
      tierBox.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
      setTimeout(() => {
        tierBox.style.boxShadow = '';
      }, 2000);
    }
  }
}

function displayTierDetails(tierData) {
  const detailsDiv = document.getElementById('tier-details');
  if (!detailsDiv) return;
  
  detailsDiv.innerHTML = `
    <div class="font-bold mb-2">${tierData.name}</div>
    <div class="text-sm mb-2">Security Score: ${tierData.security_score}%</div>
    <div class="text-sm mb-2">Methods:</div>
    <ul class="text-xs mb-2 ml-4">
      ${tierData.methods.map(m => `<li>• ${m}</li>`).join('')}
    </ul>
    <div class="text-sm mb-2">Attack Vectors:</div>
    <ul class="text-xs ml-4">
      ${tierData.attack_vectors.map(v => `<li>• ${v.name}: ${(v.success_rate * 100).toFixed(0)}%</li>`).join('')}
    </ul>
  `;
}

function updateTelemetry() {
  // Update success rate meter
  const successRate = currentAttackId ? 30 : 0; // This would come from actual attack data
  document.getElementById('success-meter').style.width = successRate + '%';
  document.getElementById('success-text').textContent = successRate + '%';
  
  // Update detection risk (increases with time)
  const detectionRisk = startTime ? Math.min(100, ((Date.now() - startTime) / 1000) * 2) : 0;
  document.getElementById('detection-meter').style.width = detectionRisk + '%';
  document.getElementById('detection-text').textContent = detectionRisk.toFixed(0) + '%';
  
  // Update time elapsed
  if (startTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('time-elapsed').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Update packets and agents
  document.getElementById('packets-sent').textContent = packetCount;
  document.getElementById('active-agents').textContent = activeAgentCount;
}

// Update telemetry every second
setInterval(updateTelemetry, 1000);

// Initialize tier data on load
window.addEventListener('load', async () => {
  try {
    const response = await fetch('http://localhost:3001/api/tiers');
    const tiers = await response.json();
    // Tier data is already in the HTML, but we could update it here if needed
  } catch (error) {
    console.error('Error loading tier data:', error);
  }
});

