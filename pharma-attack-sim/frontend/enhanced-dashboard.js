// Enhanced Dashboard JavaScript

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
let socket = null;
let currentAttackId = null;
let selectedTier = 'tier2';
let selectedDriver = null;
let impactData = {
    packages: 0,
    patients: 0,
    detectionTime: null,
    financial: 0,
    erVisits: 0
};

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border-2 ${
        type === 'success' ? 'bg-green-900 border-green-500 text-green-200' :
        type === 'error' ? 'bg-red-900 border-red-500 text-red-200' :
        type === 'warning' ? 'bg-yellow-900 border-yellow-500 text-yellow-200' :
        'bg-blue-900 border-blue-500 text-blue-200'
    } font-bold text-sm max-w-md`;
    notification.textContent = message;
    notification.style.animation = 'slideIn 0.3s ease-out';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animations if not present
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Mock Driver Database
const driverDatabase = [
    { id: 1, name: 'Jerry Rodriguez', route: 'Tacoma → Spokane', packages: 12, status: 'active', risk: 'high' },
    { id: 2, name: 'Maria Santos', route: 'Seattle → Yakima', packages: 8, status: 'active', risk: 'medium' },
    { id: 3, name: 'James Wilson', route: 'Tacoma → Pullman', packages: 15, status: 'active', risk: 'high' },
    { id: 4, name: 'Sarah Chen', route: 'Seattle → Wenatchee', packages: 6, status: 'active', risk: 'low' },
    { id: 5, name: 'Michael Brown', route: 'Tacoma → Richland', packages: 10, status: 'active', risk: 'medium' },
    { id: 6, name: 'Emily Davis', route: 'Seattle → Moses Lake', packages: 9, status: 'active', risk: 'low' },
    { id: 7, name: 'David Lee', route: 'Tacoma → Walla Walla', packages: 11, status: 'active', risk: 'high' },
    { id: 8, name: 'Jessica Martinez', route: 'Seattle → Ellensburg', packages: 7, status: 'active', risk: 'medium' },
    { id: 9, name: 'Robert Taylor', route: 'Tacoma → Bellingham', packages: 13, status: 'active', risk: 'high' },
    { id: 10, name: 'Amanda White', route: 'Seattle → Olympia', packages: 5, status: 'active', risk: 'low' }
];

// Initialize Socket.IO with auto-reconnect
function initSocket() {
    if (socket && socket.connected) {
        return; // Already connected
    }
    
    // Create socket with reconnection options
    socket = io('http://localhost:3001', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        timeout: 20000,
        forceNew: false
    });
    
    setupSocketHandlers();
}

function setupSocketHandlers() {
    if (!socket) return;
    
    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
        addReasoning('🔌 Connected to attack server');
        showNotification('✅ Connected to server', 'success');
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        addReasoning('⚠️ Disconnected from server. Reconnecting...');
        showNotification('⚠️ Connection lost. Reconnecting...', 'warning');
    });
    
    socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Reconnected after', attemptNumber, 'attempts');
        addReasoning(`🔄 Reconnected to server (attempt ${attemptNumber})`);
        showNotification('✅ Reconnected to server', 'success');
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('🔄 Reconnection attempt', attemptNumber);
        addReasoning(`🔄 Reconnection attempt ${attemptNumber}...`);
    });
    
    socket.on('reconnect_failed', () => {
        console.error('❌ Reconnection failed');
        addReasoning('❌ Failed to reconnect. Please refresh the page.');
        showNotification('❌ Reconnection failed. Please check if server is running.', 'error');
    });
    
    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        addReasoning('❌ Connection error. Make sure backend server is running on port 3001.');
        showNotification('❌ Connection error. Is the backend server running?', 'error');
    });

    socket.on('ai:reasoning', (data) => {
        addReasoning(`[${data.agent || 'AI'}] ${data.message}`);
        if (data.nodeId) {
            updateGraphNode(data.nodeId);
        }
    });

    socket.on('impact:updated', (data) => {
        updateImpactMetrics(data);
    });

    socket.on('recon:finding', (data) => {
        addVulnerability(data);
    });

    socket.on('step:manual', (data) => {
        updateGraphNode(data.nodeId);
        updateAgentStatus(data.agent, data.status);
    });

    socket.on('agent:message', (data) => {
        addReasoning(`[${data.agent}] ${data.message}`);
    });

    socket.on('attack:started', (data) => {
        currentAttackId = data.attackId;
        document.getElementById('attack-id').textContent = data.attackId;
        addReasoning(`🚀 Attack #${data.attackId} started`);
    });

    socket.on('attack:completed', (data) => {
        addReasoning(`✅ Attack completed. Success: ${data.success}`);
        document.getElementById('export-btn').disabled = false;
    });
    
    socket.on('llm:suggestion', (data) => {
        displaySuggestions(data.suggestions);
    });
    
    socket.on('llm:auto-execute', (data) => {
        const { suggestion } = data;
        showNotification(`🤖 LLM Auto-executing: ${suggestion.title}`, 'info');
        addReasoning(`🤖 LLM Decision: Auto-executing "${suggestion.title}"`);
        addReasoning(`📋 Reason: ${suggestion.reason}`);
        addReasoning(`🎯 Confidence: ${(suggestion.confidence * 100).toFixed(0)}%`);
        
        // Highlight the suggestion being auto-executed
        highlightSuggestion(suggestion.id, 'executing');
    });
}

// CountUp instances
let countUpInstances = {};

// Industry-Standard Attack Flow Graph (MITRE ATT&CK / Cyber Kill Chain)
let graphData = {
    nodes: [
        // Reconnaissance Phase
        { id: 'RECON', type: 'initial', label: 'RECON', x: 80, y: 200 },
        { id: 'OSINT', type: 'action', label: 'OSINT\nGathering', x: 200, y: 200 },
        { id: 'TARGET_ANALYSIS', type: 'decision', label: 'Target\nAnalysis', x: 350, y: 200 },
        
        // Weaponization & Delivery
        { id: 'WEAPONIZE', type: 'action', label: 'Weaponize\nPayload', x: 500, y: 150 },
        { id: 'PHISHING', type: 'action', label: 'Phishing\nCampaign', x: 650, y: 150 },
        { id: 'LLM_VALIDATION', type: 'analysis', label: 'LLM\nValidation', x: 800, y: 100 },
        
        // Exploitation
        { id: 'CRED_HARVEST', type: 'action', label: 'Credential\nHarvest', x: 800, y: 200 },
        { id: 'EXPLOIT_SUCCESS', type: 'success', label: 'Exploit\nSuccess', x: 950, y: 100 },
        { id: 'EXPLOIT_FAIL', type: 'failure', label: 'Exploit\nFailed', x: 950, y: 250 },
        
        // Installation & C2
        { id: 'INSTALL', type: 'action', label: 'Install\nBackdoor', x: 1100, y: 100 },
        { id: 'C2_ESTABLISH', type: 'action', label: 'C2\nChannel', x: 1250, y: 100 },
        
        // Actions on Objectives
        { id: 'LATERAL_MOVE', type: 'action', label: 'Lateral\nMovement', x: 1400, y: 100 },
        { id: 'GPS_MANIP', type: 'action', label: 'GPS\nManipulation', x: 1550, y: 100 },
        { id: 'API_EXPLOIT', type: 'action', label: 'API\nExploitation', x: 1700, y: 100 },
        { id: 'MISSION_COMPLETE', type: 'complete', label: 'Mission\nComplete', x: 1850, y: 100 }
    ],
    links: [
        // Reconnaissance Phase
        { source: 'RECON', target: 'OSINT', probability: 100, label: '100%' },
        { source: 'OSINT', target: 'TARGET_ANALYSIS', probability: 100, label: '100%' },
        { source: 'TARGET_ANALYSIS', target: 'WEAPONIZE', probability: 85, label: '85%' },
        
        // Weaponization & Delivery
        { source: 'WEAPONIZE', target: 'PHISHING', probability: 100, label: '100%' },
        { source: 'PHISHING', target: 'LLM_VALIDATION', probability: 100, label: '100%' },
        { source: 'LLM_VALIDATION', target: 'CRED_HARVEST', probability: 100, label: '100%' },
        
        // Exploitation Decision Point
        { source: 'CRED_HARVEST', target: 'EXPLOIT_SUCCESS', probability: 30, label: '30%' },
        { source: 'CRED_HARVEST', target: 'EXPLOIT_FAIL', probability: 70, label: '70%' },
        
        // Installation & Command & Control
        { source: 'EXPLOIT_SUCCESS', target: 'INSTALL', probability: 95, label: '95%' },
        { source: 'INSTALL', target: 'C2_ESTABLISH', probability: 90, label: '90%' },
        
        // Actions on Objectives (Multi-vector)
        { source: 'C2_ESTABLISH', target: 'LATERAL_MOVE', probability: 85, label: '85%' },
        { source: 'LATERAL_MOVE', target: 'GPS_MANIP', probability: 80, label: '80%' },
        { source: 'GPS_MANIP', target: 'API_EXPLOIT', probability: 75, label: '75%' },
        { source: 'API_EXPLOIT', target: 'MISSION_COMPLETE', probability: 70, label: '70%' }
    ]
};

let activeNode = null;
let graphSimulation = null;

// Initialize Attack Graph
function initAttackGraph() {
    const container = d3.select('#attack-graph-container');
    if (!container.node()) {
        console.warn('Graph container not found');
        return;
    }
    
    container.selectAll('*').remove();
    
    const containerNode = container.node();
    if (!containerNode) {
        console.warn('Graph container not found');
        return;
    }
    
    // Get actual container width, ensure minimum size
    const containerRect = containerNode.getBoundingClientRect();
    const width = Math.max(containerRect.width - 60, 1400);
    const height = 400;
    
    if (width <= 0 || height <= 0) {
        console.warn('Graph container has invalid dimensions');
        return;
    }
    
    // Calculate proper node positions based on actual width
    const nodeCount = graphData.nodes.length;
    const spacing = (width - 100) / (nodeCount - 1);
    const centerY = height / 2;
    
    // Position nodes in a flow with proper spacing
    graphData.nodes.forEach((node, i) => {
        node.x = 50 + (i * spacing);
        // Create wave pattern for visual flow
        const phase = (i / nodeCount) * Math.PI * 2;
        node.y = centerY + Math.sin(phase) * 80;
        
        // Ensure nodes stay within bounds
        node.y = Math.max(60, Math.min(height - 60, node.y));
    });
    
    // Store width for later use in viewBox
    const svgWidth = width;
    
    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${svgWidth} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('overflow', 'visible');
    
    // Create links with arrows
    const defs = svg.append('defs');
    defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#0f0');
    
    // Create links
    const link = svg.append('g')
        .selectAll('line')
        .data(graphData.links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke', '#0f0')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    
    // Create link labels
    const linkLabel = svg.append('g')
        .selectAll('text')
        .data(graphData.links)
        .enter().append('text')
        .attr('class', 'link-label')
        .style('font-size', '10px')
        .style('fill', '#0ff')
        .style('font-weight', 'bold')
        .text(d => d.label || `${d.probability}%`);
    
    // Create nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(graphData.nodes)
        .enter().append('circle')
        .attr('class', 'graph-node')
        .attr('r', 24)
        .attr('fill', d => getNodeColor(d.type))
        .attr('stroke', '#0f0')
        .attr('stroke-width', 2)
        .on('click', function(event, d) {
            triggerStep(d.id);
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Create node labels
    const label = svg.append('g')
        .selectAll('text')
        .data(graphData.nodes)
        .enter().append('text')
        .attr('class', 'node-label')
        .style('font-size', '10px')
        .style('fill', '#0f0')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .style('font-weight', 'bold')
        .text(d => d.label);
    
    // Update positions
    function updatePositions() {
        link
            .attr('x1', d => {
                const source = typeof d.source === 'string' 
                    ? graphData.nodes.find(n => n.id === d.source)
                    : d.source;
                return source.x;
            })
            .attr('y1', d => {
                const source = typeof d.source === 'string' 
                    ? graphData.nodes.find(n => n.id === d.source)
                    : d.source;
                return source.y;
            })
            .attr('x2', d => {
                const target = typeof d.target === 'string' 
                    ? graphData.nodes.find(n => n.id === d.target)
                    : d.target;
                return target.x;
            })
            .attr('y2', d => {
                const target = typeof d.target === 'string' 
                    ? graphData.nodes.find(n => n.id === d.target)
                    : d.target;
                return target.y;
            });
        
        linkLabel
            .attr('x', d => {
                const source = typeof d.source === 'string' 
                    ? graphData.nodes.find(n => n.id === d.source)
                    : d.source;
                const target = typeof d.target === 'string' 
                    ? graphData.nodes.find(n => n.id === d.target)
                    : d.target;
                return (source.x + target.x) / 2;
            })
            .attr('y', d => {
                const source = typeof d.source === 'string' 
                    ? graphData.nodes.find(n => n.id === d.source)
                    : d.source;
                const target = typeof d.target === 'string' 
                    ? graphData.nodes.find(n => n.id === d.target)
                    : d.target;
                return (source.y + target.y) / 2;
            });
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        label
            .attr('x', d => d.x)
            .attr('y', d => d.y + 35);
    }
    
    updatePositions();
    
    function dragstarted(event, d) {
        if (!event.active) return;
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        if (!event.active) return;
        // Constrain to container bounds
        d.x = Math.max(50, Math.min(width - 50, event.x));
        d.y = Math.max(50, Math.min(height - 50, event.y));
        d.fx = d.x;
        d.fy = d.y;
        updatePositions();
    }
    
    function dragended(event, d) {
        if (!event.active) return;
        d.fx = null;
        d.fy = null;
    }
    
    window.graphElements = { node, link, label, linkLabel };
    console.log('Attack graph initialized');
}

function getNodeColor(type) {
    const colors = {
        'initial': '#00ffff',      // Cyan - Start
        'decision': '#ffff00',     // Yellow - Decision points
        'action': '#ff00ff',       // Magenta - Attack actions
        'analysis': '#00ffff',     // Cyan - Analysis/Validation
        'success': '#00ff00',      // Green - Success
        'failure': '#ff0000',      // Red - Failure
        'complete': '#00ffff'      // Cyan - Mission complete
    };
    return colors[type] || '#0f0';
}

function updateGraphNode(nodeId, status) {
    if (!window.graphElements) return;
    
    const { node } = window.graphElements;
    
    // Remove active class from all nodes
    node.classed('active', false);
    
    // Add active class to current node
    if (nodeId) {
        node.filter(d => d.id === nodeId)
            .classed('active', true);
    }
    
    activeNode = nodeId;
}

// Login Form Handler
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simulate login validation
    if (username && password) {
        // Show passkey simulation
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('passkey-authentication').classList.remove('hidden');
        
        // Simulate passkey authentication
        setTimeout(() => {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('driver-selection-screen').classList.remove('hidden');
            loadDrivers();
            initSocket();
        }, 2000);
    }
});

// Passkey Button Handler
document.getElementById('passkey-btn')?.addEventListener('click', async () => {
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('passkey-authentication').classList.remove('hidden');
    
    // Simulate WebAuthn passkey authentication
    setTimeout(() => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('driver-selection-screen').classList.remove('hidden');
        loadDrivers();
        initSocket();
    }, 2000);
});

// Load Drivers
function loadDrivers(drivers = driverDatabase) {
    const driversList = document.getElementById('drivers-list');
    if (!driversList) return;
    
    driversList.innerHTML = '';
    
    drivers.forEach(driver => {
        const driverCard = document.createElement('div');
        driverCard.className = 'driver-card p-4 border-2 border-green-500 cursor-pointer hover:bg-green-500 hover:bg-opacity-10 transition-all';
        driverCard.dataset.driverId = driver.id;
        driverCard.dataset.driverName = driver.name;
        
        const riskColor = {
            'high': '#f00',
            'medium': '#ff0',
            'low': '#0f0'
        }[driver.risk] || '#0f0';
        
        driverCard.innerHTML = `
            <div class="font-bold text-green-400 mb-2">${driver.name}</div>
            <div class="text-xs text-gray-400 mb-1">Route: ${driver.route}</div>
            <div class="text-xs text-gray-400 mb-1">Packages: ${driver.packages}</div>
            <div class="text-xs mb-2">Status: <span class="text-green-400">${driver.status}</span></div>
            <div class="text-xs">Risk: <span style="color: ${riskColor}">${driver.risk.toUpperCase()}</span></div>
        `;
        
        driverCard.addEventListener('click', () => {
            // Remove selection from all cards
            document.querySelectorAll('.driver-card').forEach(card => {
                card.classList.remove('border-cyan-500', 'bg-cyan-500', 'bg-opacity-20', 'selected');
                card.classList.add('border-green-500');
            });
            
            // Select this card
            driverCard.classList.remove('border-green-500');
            driverCard.classList.add('border-cyan-500', 'bg-cyan-500', 'bg-opacity-20', 'selected');
            
            selectedDriver = {
                id: driver.id,
                name: driver.name,
                route: driver.route,
                packages: driver.packages
            };
            
            // Enable initialize button
            const initBtn = document.getElementById('initialize-attack-btn');
            if (initBtn) {
                initBtn.disabled = false;
                initBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
            }
            
            // Show selected driver info
            const selectedInfo = document.getElementById('selected-driver-info');
            const selectedName = document.getElementById('selected-driver-name');
            if (selectedInfo && selectedName) {
                selectedName.textContent = driver.name + ' - ' + driver.route;
                selectedInfo.classList.remove('hidden');
            }
            
            // Scroll to button area
            setTimeout(() => {
                initBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });
        
        driversList.appendChild(driverCard);
    });
}

// Driver Search
document.getElementById('driver-search')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = driverDatabase.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm) ||
        driver.route.toLowerCase().includes(searchTerm)
    );
    loadDrivers(filtered);
});

// Initialize Attack Button
const initAttackBtn = document.getElementById('initialize-attack-btn');
if (initAttackBtn) {
    initAttackBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!selectedDriver) {
            alert('Please select a driver first');
            return;
        }
        
        // Disable button during initialization
        initAttackBtn.disabled = true;
        initAttackBtn.textContent = 'INITIALIZING...';
        
        const successRate = parseFloat(document.getElementById('success-rate').value);
        const attackDay = parseInt(document.getElementById('attack-day').value);
        
        const targetNameEl = document.getElementById('target-name');
        const successRateDisplayEl = document.getElementById('success-rate-display');
        
        if (targetNameEl) targetNameEl.textContent = selectedDriver.name;
        if (successRateDisplayEl) successRateDisplayEl.textContent = (successRate * 100) + '%';
        
        try {
            const createResponse = await fetch('http://localhost:3001/api/attacks/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config: {
                        targetDriver: selectedDriver.name,
                        baseSuccessRate: successRate,
                        day: attackDay,
                        timing: new Date().toLocaleTimeString()
                    }
                })
            });
            
            if (!createResponse.ok) {
                throw new Error(`Server error: ${createResponse.status}`);
            }
            
            const { attackId } = await createResponse.json();
            currentAttackId = attackId;
            
            // Hide driver selection and show dashboard
            const driverScreen = document.getElementById('driver-selection-screen');
            const dashboard = document.getElementById('dashboard');
            
            if (driverScreen) driverScreen.classList.add('hidden');
            if (dashboard) {
                dashboard.classList.remove('hidden');
                // Wait a bit for layout to settle before initializing graph
                setTimeout(() => {
                    initAttackGraph();
                }, 300);
            }
            
            // Initialize attack state
            if (socket && socket.connected) {
                socket.emit('attack:initialized', { attackId });
            }
            
            // Start attack
            await fetch(`http://localhost:3001/api/attacks/${attackId}/start`, {
                method: 'POST'
            });
            
            // Show suggestions panel
            const suggestionsPanel = document.getElementById('suggestions-panel');
            if (suggestionsPanel) {
                suggestionsPanel.style.display = 'block';
            }
            
            // Load initial suggestions
            setTimeout(async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/attacks/${attackId}/suggestions`);
                    const data = await response.json();
                    if (data.suggestions) {
                        displaySuggestions(data.suggestions);
                    }
                } catch (error) {
                    console.error('Error loading suggestions:', error);
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error initializing attack:', error);
            alert(`Error: ${error.message}\n\nMake sure the backend server is running on port 3001.`);
            initAttackBtn.disabled = false;
            initAttackBtn.textContent = 'INITIALIZE ATTACK SEQUENCE';
        }
    });
}

// Logout Button
document.getElementById('logout-btn')?.addEventListener('click', () => {
    document.getElementById('driver-selection-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-form-container').classList.remove('hidden');
    document.getElementById('passkey-authentication').classList.add('hidden');
    selectedDriver = null;
    currentAttackId = null;
    if (socket) {
        socket.disconnect();
        socket = null;
    }
});

// Tier descriptions
const tierDescriptions = {
    'tier2': {
        name: 'Tier 2 (Driver)',
        security: '35%',
        successRate: '30-55%',
        why: 'Highest success rate - mobile devices vulnerable, drivers distracted while driving',
        impact: 'Best target for credential theft and GPS manipulation'
    },
    'tier3': {
        name: 'Tier 3 (Dispatcher)',
        security: '70%',
        successRate: '25-30%',
        why: 'Moderate security - better than drivers but more access to systems',
        impact: 'Good target if driver attacks fail, can access dispatcher dashboard'
    },
    'tier4': {
        name: 'Tier 4 (Admin)',
        security: '95%',
        successRate: '5-8%',
        why: 'Highest security - hardware keys and biometrics make attacks very difficult',
        impact: 'Not recommended - very low success rate despite high access'
    }
};

// Tier Selection with Impact Feedback
function selectTier(tier) {
    selectedTier = tier;
    const tierInfo = tierDescriptions[tier];
    
    // Update visual selection
    document.querySelectorAll('.tier-card').forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = document.querySelector(`[data-tier="${tier}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Show impact of selection
    if (tierInfo) {
        showNotification(`🎯 Targeting ${tierInfo.name}`, 'info');
        addReasoning(`🎯 Changed target to: ${tierInfo.name}`);
        addReasoning(`📊 Security Level: ${tierInfo.security} | Expected Success Rate: ${tierInfo.successRate}`);
        addReasoning(`💡 Why this tier: ${tierInfo.why}`);
        addReasoning(`💥 Impact: ${tierInfo.impact}`);
    }
    
    // Emit tier selection
    if (socket && socket.connected && currentAttackId) {
        socket.emit('tier:selected', { attackId: currentAttackId, tier });
    } else {
        addReasoning('⚠️ Not connected to server - selection saved locally');
    }
}

// Agent descriptions for impact feedback
const agentDescriptions = {
    'orchestrator': {
        name: 'Orchestrator Agent',
        description: 'AI agent that uses LLMs to analyze the target and plan attack strategy',
        expectedImpact: 'Analyzes target vulnerability, calculates success probability, coordinates other agents',
        impactType: 'Planning and Coordination'
    },
    'phishing': {
        name: 'Phishing Agent',
        description: 'Tests phishing messages across 4 LLM models (GPT-4, Claude, Gemini, LLaMA) and runs Monte Carlo simulation',
        expectedImpact: 'Harvests credentials, increases packages/patients affected by 1-2',
        impactType: 'Credential Theft'
    },
    'gps': {
        name: 'GPS Spoofing Agent',
        description: 'Injects fake GPS coordinates to divert driver from route',
        expectedImpact: 'Diverts driver, increases packages affected by 2-3, may cause delivery delays',
        impactType: 'Location Manipulation'
    },
    'api': {
        name: 'API Flooding Agent',
        description: 'Generates fake alerts to overwhelm dispatcher and bury real anomalies',
        expectedImpact: 'Overwhelms system, increases detection time, affects multiple packages',
        impactType: 'Denial of Service'
    }
};

// Trigger Agent Manually with Impact Feedback
async function triggerAgent(agentName) {
    if (!currentAttackId) {
        addReasoning('❌ No active attack. Please initialize first.');
        showNotification('❌ No active attack. Please initialize an attack first.', 'error');
        return;
    }
    
    if (!socket || !socket.connected) {
        showNotification('❌ Not connected to server. Please refresh and try again.', 'error');
        return;
    }
    
    const agentInfo = agentDescriptions[agentName];
    if (agentInfo) {
        showNotification(`🚀 Starting ${agentInfo.name}...`, 'info');
        addReasoning(`▶️ Triggering ${agentInfo.name}: ${agentInfo.description}`);
        addReasoning(`📊 Expected Impact: ${agentInfo.expectedImpact}`);
    }
    
    updateAgentStatus(agentName, 'running');
    
    // Show immediate visual feedback
    const button = document.getElementById(`btn-${agentName}`);
    if (button) {
        button.classList.add('opacity-50', 'cursor-not-allowed');
        button.disabled = true;
    }
    
    try {
        const response = await fetch(`http://localhost:3001/api/agents/${agentName}/trigger`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attackId: currentAttackId, tier: selectedTier })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Show what happened
        if (agentInfo) {
            addReasoning(`✅ ${agentInfo.name} executed successfully`);
            addReasoning(`💥 Impact: ${agentInfo.impactType} - Watch impact metrics update above`);
        }
        
        // Update status after a delay to allow agent to complete
        setTimeout(() => {
            if (data.success !== false) {
                updateAgentStatus(agentName, 'completed');
                showNotification(`✅ ${agentInfo?.name || agentName} completed successfully!`, 'success');
            }
            if (button) {
                button.classList.remove('opacity-50', 'cursor-not-allowed');
                button.disabled = false;
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error triggering agent:', error);
        addReasoning(`❌ Error triggering ${agentName}: ${error.message}`);
        updateAgentStatus(agentName, 'failed');
        showNotification(`❌ Error: ${error.message}`, 'error');
        if (button) {
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            button.disabled = false;
        }
    }
}

// Trigger Step from Graph
async function triggerStep(stepId) {
    if (!currentAttackId) {
        addReasoning('❌ No active attack. Please initialize first.');
        alert('No active attack. Please initialize an attack first.');
        return;
    }
    
    if (!socket || !socket.connected) {
        alert('Not connected to server. Please refresh and try again.');
        return;
    }
    
    addReasoning(`📊 Clicked graph node: ${stepId}`);
    updateGraphNode(stepId);
    
    // Map step IDs to agents (industry-standard attack stages)
    const stepToAgent = {
        'RECON': null,
        'OSINT': 'orchestrator',
        'TARGET_ANALYSIS': 'orchestrator',
        'WEAPONIZE': 'orchestrator',
        'PHISHING': 'phishing',
        'LLM_VALIDATION': 'phishing',
        'CRED_HARVEST': 'phishing',
        'EXPLOIT_SUCCESS': null,
        'EXPLOIT_FAIL': null,
        'INSTALL': 'orchestrator',
        'C2_ESTABLISH': 'orchestrator',
        'LATERAL_MOVE': 'orchestrator',
        'GPS_MANIP': 'gps',
        'API_EXPLOIT': 'api',
        'MISSION_COMPLETE': null
    };
    
    const agent = stepToAgent[stepId];
    if (agent) {
        await triggerAgent(agent);
        if (socket && socket.connected) {
            socket.emit('step:manual', { attackId: currentAttackId, stepId, agent });
        }
    } else {
        addReasoning(`ℹ️ Step ${stepId} cannot be triggered manually (automatic step)`);
    }
}

// Exploit Vulnerability
// Vulnerability descriptions
const vulnDescriptions = {
    'driver-app': {
        name: 'Driver Mobile App',
        description: 'Weak authentication allows SMS 2FA bypass',
        impact: 'Gains access to driver account, can view routes and packages',
        metrics: { packages: 2, patients: 1, financial: 500 }
    },
    'dispatcher-dash': {
        name: 'Dispatcher Dashboard',
        description: 'Alert fatigue from high volume processing',
        impact: 'Buries real alerts, delays response time significantly',
        metrics: { packages: 3, patients: 2, financial: 1000, detectionTime: 30 }
    },
    'gps-service': {
        name: 'GPS Tracking Service',
        description: 'Coordinate spoofing with weak validation',
        impact: 'Diverts driver from route, causes delivery delays',
        metrics: { packages: 2, patients: 1, financial: 800 }
    }
};

function exploitVuln(vulnId) {
    const vulnInfo = vulnDescriptions[vulnId];
    if (!vulnInfo) return;
    
    // Show what we're doing
    showNotification(`💥 Exploiting ${vulnInfo.name}...`, 'warning');
    addReasoning(`🎯 Exploiting: ${vulnInfo.name}`);
    addReasoning(`📋 Description: ${vulnInfo.description}`);
    addReasoning(`💥 Expected Impact: ${vulnInfo.impact}`);
    
    // Emit exploit event
    if (socket && socket.connected && currentAttackId) {
        socket.emit('vuln:exploit', {
            attackId: currentAttackId,
            vulnerability: vulnInfo.name
        });
    }
    
    // Update impact metrics immediately
    const metrics = vulnInfo.metrics;
    if (metrics.packages) impactData.packages += metrics.packages;
    if (metrics.patients) impactData.patients += metrics.patients;
    if (metrics.financial) impactData.financial += metrics.financial;
    if (metrics.detectionTime) impactData.detectionTime = metrics.detectionTime;
    
    updateImpactMetrics(impactData);
    
    // Mark vulnerability as exploited
    const vulnItems = document.querySelectorAll('.vuln-item');
    vulnItems.forEach(item => {
        if (item.textContent.includes(vulnInfo.name)) {
            item.classList.add('exploited');
            const button = item.querySelector('button');
            if (button) {
                button.textContent = '✓ EXPLOITED';
                button.disabled = true;
                button.classList.add('bg-green-500', 'text-black');
                button.classList.remove('hover:bg-green-500', 'hover:text-black');
            }
        }
    });
    
    // Show success notification
    setTimeout(() => {
        showNotification(`✅ ${vulnInfo.name} exploited! Impact: +${metrics.packages} packages, +$${metrics.financial} loss`, 'success');
        addReasoning(`✅ Exploitation successful! Impact metrics updated.`);
    }, 500);
}

// Display LLM Suggestions
function displaySuggestions(suggestions) {
    const suggestionsPanel = document.getElementById('suggestions-panel');
    const suggestionsList = document.getElementById('suggestions-list');
    
    if (!suggestionsPanel || !suggestionsList) return;
    
    // Show panel if we have suggestions
    if (suggestions && suggestions.length > 0) {
        suggestionsPanel.style.display = 'block';
        
        suggestionsList.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const suggestionCard = document.createElement('div');
            suggestionCard.className = `suggestion-card p-3 rounded border-2 ${
                suggestion.priority === 'critical' ? 'border-red-500 bg-red-900 bg-opacity-20' :
                suggestion.priority === 'high' ? 'border-yellow-500 bg-yellow-900 bg-opacity-20' :
                'border-green-500 bg-green-900 bg-opacity-20'
            }`;
            suggestionCard.id = `suggestion-${suggestion.id}`;
            
            const autoExecuteBadge = suggestion.autoExecute 
                ? '<span class="ml-2 px-2 py-1 text-xs bg-cyan-500 text-black font-bold rounded">🤖 AUTO-EXECUTE</span>' 
                : '';
            
            suggestionCard.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div class="font-bold text-sm">${suggestion.title} ${autoExecuteBadge}</div>
                    <div class="text-xs text-gray-400">${(suggestion.confidence * 100).toFixed(0)}% confidence</div>
                </div>
                <div class="text-xs text-gray-300 mb-2">${suggestion.description}</div>
                <div class="text-xs text-cyan-400 mb-2">💡 ${suggestion.reason}</div>
                ${!suggestion.autoExecute ? `
                    <button onclick="executeSuggestion('${suggestion.id}')" 
                            class="w-full mt-2 px-3 py-1 text-xs border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold">
                        EXECUTE THIS
                    </button>
                ` : `
                    <div class="text-xs text-cyan-400 mt-2">⚡ Will execute automatically if conditions are met</div>
                `}
            `;
            
            suggestionsList.appendChild(suggestionCard);
        });
    } else {
        suggestionsPanel.style.display = 'none';
    }
}

// Highlight suggestion being executed
function highlightSuggestion(suggestionId, status) {
    const card = document.getElementById(`suggestion-${suggestionId}`);
    if (!card) return;
    
    if (status === 'executing') {
        card.classList.add('animate-pulse');
        card.classList.add('border-cyan-500');
    }
}

// Execute suggestion manually
async function executeSuggestion(suggestionId) {
    if (!socket || !socket.connected) {
        showNotification('❌ Not connected to server', 'error');
        return;
    }
    
    if (!currentAttackId) {
        showNotification('❌ No active attack', 'error');
        return;
    }
    
    showNotification(`🚀 Executing suggestion...`, 'info');
    
    socket.emit('suggestion:execute', {
        suggestionId,
        attackId: currentAttackId
    });
}

// Add Vulnerability Finding
function addVulnerability(data) {
    const vulnList = document.getElementById('vuln-list');
    const vulnItem = document.createElement('div');
    vulnItem.className = 'vuln-item';
    vulnItem.innerHTML = `
        <div class="font-bold">${data.name || 'New Vulnerability'}</div>
        <div class="text-xs text-yellow-400">${data.description || 'Discovered'}</div>
        <button class="mt-2 px-2 py-1 text-xs border border-green-500 text-green-500 hover:bg-green-500 hover:text-black" onclick="exploitVuln('${data.id || 'new-vuln'}')">
            EXPLOIT THIS
        </button>
    `;
    vulnList.appendChild(vulnItem);
}

// Update Agent Status
function updateAgentStatus(agentName, status) {
    const button = document.getElementById(`btn-${agentName}`);
    const indicator = document.getElementById(`status-${agentName}`);
    
    if (!button || !indicator) return;
    
    // Remove all status classes
    button.classList.remove('running', 'completed', 'failed');
    indicator.classList.remove('status-running', 'status-success', 'status-failed', 'status-idle');
    
    // Add new status
    if (status === 'running') {
        button.classList.add('running');
        indicator.classList.add('status-running');
    } else if (status === 'success' || status === 'completed') {
        button.classList.add('completed');
        indicator.classList.add('status-success');
    } else if (status === 'failed') {
        button.classList.add('failed');
        indicator.classList.add('status-failed');
    } else {
        indicator.classList.add('status-idle');
    }
}

// Update Impact Metrics
function updateImpactMetrics(data) {
    // Accumulate values (don't replace, add to existing)
    if (data.packages !== undefined) impactData.packages = data.packages;
    if (data.patients !== undefined) impactData.patients = data.patients;
    if (data.financial !== undefined) impactData.financial = data.financial;
    if (data.erVisits !== undefined) impactData.erVisits = data.erVisits;
    if (data.detectionTime !== undefined && data.detectionTime !== null) {
        impactData.detectionTime = data.detectionTime;
    }
    
    // Animate counters using CountUp
    const metrics = {
        'metric-packages': { value: impactData.packages, max: 7 },
        'metric-patients': { value: impactData.patients, max: 7 },
        'metric-financial': { value: impactData.financial, max: 4500, prefix: '$', suffix: '' },
        'metric-er': { value: impactData.erVisits, max: 2 }
    };
    
    for (const [id, config] of Object.entries(metrics)) {
        const element = document.getElementById(id);
        if (!element) continue;
        
        // Update with animation
        const targetValue = config.value;
        const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        
        if (countUpInstances[id]) {
            // Update existing instance
            try {
                countUpInstances[id].update(targetValue);
            } catch (e) {
                // If update fails, create new instance
                countUpInstances[id] = null;
            }
        }
        
        if (!countUpInstances[id] && typeof countUp !== 'undefined') {
            // Create new CountUp instance
            try {
                countUpInstances[id] = new countUp.CountUp(id.replace('metric-', ''), targetValue, {
                    duration: 1,
                    prefix: config.prefix || '',
                    suffix: config.suffix || '',
                    useEasing: true
                });
                if (!countUpInstances[id].error) {
                    countUpInstances[id].start();
                }
            } catch (e) {
                console.warn('CountUp error:', e);
            }
        }
        
        // Fallback: direct update with animation effect
        if (!countUpInstances[id] || countUpInstances[id].error) {
            animateValue(element, currentValue, targetValue, 500, config);
        }
        
        // Update bar
        const barId = id.replace('metric-', 'bar-');
        const bar = document.getElementById(barId);
        if (bar) {
            const percentage = (config.value / config.max) * 100;
            bar.style.width = Math.min(percentage, 100) + '%';
        }
        
        // Update color based on value
        element.classList.remove('warning', 'danger');
        if (config.value > config.max * 0.7) {
            element.classList.add('danger');
        } else if (config.value > config.max * 0.4) {
            element.classList.add('warning');
        }
    }
    
    // Update detection time
    if (impactData.detectionTime !== null && impactData.detectionTime !== undefined) {
        document.getElementById('metric-detection').textContent = impactData.detectionTime + 'min';
    }
}

// Add Reasoning Line
function addReasoning(message) {
    const reasoningContent = document.getElementById('reasoning-content');
    if (!reasoningContent) {
        console.log('Reasoning:', message);
        return;
    }
    
    const line = document.createElement('div');
    line.className = 'reasoning-line';
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    reasoningContent.appendChild(line);
    reasoningContent.scrollTop = reasoningContent.scrollHeight;
    
    // Highlight panel
    const panel = document.getElementById('reasoning-panel');
    if (panel) {
        panel.classList.add('active');
        setTimeout(() => panel.classList.remove('active'), 1000);
    }
}

// View Full Reasoning
const viewReasoningBtn = document.getElementById('view-reasoning-btn');
if (viewReasoningBtn) {
    viewReasoningBtn.addEventListener('click', () => {
        const content = document.getElementById('reasoning-content');
        if (!content) return;
        
        const fullText = Array.from(content.children).map(el => el.textContent).join('\n');
        
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; padding: 50px; overflow-y: auto;';
        modal.innerHTML = `
            <div style="background: #000; border: 2px solid #0f0; padding: 30px; max-width: 900px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center;">
                    <h2 style="color: #0f0; font-size: 24px;">🧠 Full AI Reasoning Log</h2>
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="background: #000; border: 2px solid #f00; color: #f00; padding: 10px 20px; cursor: pointer; font-weight: bold;">CLOSE</button>
                </div>
                <div style="color: #0ff; margin-bottom: 15px; font-size: 12px;">
                    Complete LLM decision-making process and agent coordination logs
                </div>
                <pre style="color: #0f0; font-family: 'Courier New', monospace; white-space: pre-wrap; font-size: 11px; line-height: 1.6; max-height: 70vh; overflow-y: auto; padding: 15px; background: rgba(0, 255, 0, 0.05); border: 1px solid #0f0;">${fullText || 'No reasoning logs yet. Start an attack to see LLM coordination.'}</pre>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close on escape key
        const closeModal = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeModal);
            }
        };
        document.addEventListener('keydown', closeModal);
    });
}

// Export Button
document.getElementById('export-btn')?.addEventListener('click', async () => {
    if (!currentAttackId) {
        alert('No attack data to export. Please run an attack first.');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3001/api/attacks/${currentAttackId}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attack-${currentAttackId}-export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addReasoning('📥 Attack data exported');
    } catch (error) {
        console.error('Export error:', error);
        addReasoning(`❌ Export error: ${error.message}`);
        alert(`Export failed: ${error.message}. Make sure the backend server is running.`);
    }
});

// Reset Button
document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Reset current attack and return to driver selection?')) {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('driver-selection-screen').classList.remove('hidden');
        document.getElementById('reasoning-content').innerHTML = '<div class="reasoning-line">Waiting for attack initialization...</div>';
        document.getElementById('export-btn').disabled = true;
        currentAttackId = null;
        selectedDriver = null;
        impactData = { packages: 0, patients: 0, detectionTime: null, financial: 0, erVisits: 0 };
        updateImpactMetrics(impactData);
        
        // Reset agent statuses
        ['orchestrator', 'phishing', 'gps', 'api'].forEach(agent => {
            updateAgentStatus(agent, 'idle');
        });
        
        if (window.graphElements) {
            window.graphElements.node.classed('active', false);
        }
        
        // Reload drivers
        loadDrivers();
    }
});

// Animate value fallback function
function animateValue(element, start, end, duration, config) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        let displayValue = current;
        if (config.prefix && current >= 1000) {
            displayValue = (current / 1000).toFixed(1) + 'K';
        }
        
        element.textContent = (config.prefix || '') + displayValue + (config.suffix || '');
    }, stepTime);
}

// Show Experiments Modal
function showExperiments() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; padding: 50px; overflow-y: auto;';
    modal.innerHTML = `
        <div style="background: #000; border: 2px solid #0f0; padding: 30px; max-width: 900px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center;">
                <h2 style="color: #0f0; font-size: 24px;">🧪 Dr. Chen's Experimental Frameworks</h2>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #000; border: 2px solid #f00; color: #f00; padding: 10px 20px; cursor: pointer; font-weight: bold;">CLOSE</button>
            </div>
            <div style="color: #0ff; margin-bottom: 20px; line-height: 1.6;">
                <p>These experiments validate AI-orchestrated attack effectiveness and LLM coordination:</p>
            </div>
            <div style="color: #0f0; line-height: 1.8; font-size: 13px;">
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #0f0;">
                    <div style="font-weight: bold; color: #0ff; margin-bottom: 10px;">1. Panic Window Experiment</div>
                    <div>Tests dispatcher accuracy degradation during alert storms (20/hr → 65/hr). Measures how LM assistance maintains accuracy during high-stress scenarios.</div>
                </div>
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #0f0;">
                    <div style="font-weight: bold; color: #0ff; margin-bottom: 10px;">2. DDoS Overlap Experiment</div>
                    <div>Tests detection stacks (rules-based, LM-based, hybrid) under combined DDoS and social engineering attacks. Validates that hybrid systems perform best but have latency trade-offs.</div>
                </div>
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #0f0;">
                    <div style="font-weight: bold; color: #0ff; margin-bottom: 10px;">3. Human-AI Ratio Experiment</div>
                    <div>Finds optimal automation balance (0-100%) for Time-to-Recognition (TTR) vs Expected Loss. Demonstrates sweet spot around 50-75% automation.</div>
                </div>
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #0f0;">
                    <div style="font-weight: bold; color: #0ff; margin-bottom: 10px;">4. Game Theory Experiment</div>
                    <div>Models defense investment Nash equilibrium for competing firms (USPS vs FedEx). Shows both firms converge to medium defense strategy.</div>
                </div>
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #0f0;">
                    <div style="font-weight: bold; color: #0ff; margin-bottom: 10px;">5. Driver Distraction Experiment</div>
                    <div>Measures phishing click rates under different conditions (baseline: 30%, while driving: 45%, under stress: 55%, combined: 65%). Tests UI mitigations like lock screens.</div>
                </div>
            </div>
            <div style="margin-top: 30px; padding: 15px; background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0;">
                <div style="color: #0ff; font-weight: bold; margin-bottom: 10px;">How This Dashboard Validates Research:</div>
                <div style="color: #0f0; line-height: 1.6;">
                    • <strong>LLM Coordination:</strong> AI Reasoning panel shows real-time LLM decision-making<br>
                    • <strong>Multi-Vector Attacks:</strong> Multiple agents work together (Phishing + GPS + API)<br>
                    • <strong>Tier Targeting:</strong> Demonstrates why Tier 2 (Driver) has highest success rate<br>
                    • <strong>Impact Measurement:</strong> Live metrics validate attack effectiveness<br>
                    • <strong>Non-Linear Flow:</strong> Attack graph shows multiple possible paths<br>
                    • <strong>Agent Autonomy:</strong> Agents make independent decisions using LLMs
                </div>
            </div>
            <button onclick="runDrChenExperiments()" style="margin-top: 20px; width: 100%; padding: 15px; background: rgba(0, 255, 255, 0.2); border: 2px solid #0ff; color: #0ff; font-weight: bold; cursor: pointer;">
                🚀 RUN ALL EXPERIMENTS
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Run Dr. Chen's Experiments
async function runDrChenExperiments() {
    if (!currentAttackId) {
        alert('Please initialize an attack first to run experiments.');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3001/api/experiments/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attackId: currentAttackId })
        });
        
        if (response.ok) {
            addReasoning('🧪 Starting Dr. Chen\'s Experimental Frameworks...');
            addReasoning('📊 Experiments will run and results will appear in the reasoning panel.');
        }
    } catch (error) {
        console.error('Error running experiments:', error);
        alert(`Error: ${error.message}. Make sure backend server is running.`);
    }
}

// Make functions globally accessible
window.showExperiments = showExperiments;
window.runDrChenExperiments = runDrChenExperiments;

// Initialize impact metrics on load
window.addEventListener('load', () => {
    updateImpactMetrics(impactData);
});

