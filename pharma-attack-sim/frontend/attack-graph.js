// Attack Flow Graph with D3.js

let graphData = {
  nodes: [
    { id: 'START', type: 'initial', label: 'START' },
    { id: 'TARGET_SELECT', type: 'decision', label: 'Target Select' },
    { id: 'TIER2_ATTACK', type: 'action', label: 'Tier 2 Attack' },
    { id: 'PHISHING', type: 'action', label: 'Phishing' },
    { id: 'LLM_TEST', type: 'analysis', label: 'LLM Test' },
    { id: 'SUCCESS', type: 'success', label: 'Success' },
    { id: 'FAILURE', type: 'failure', label: 'Failure' },
    { id: 'GPS_SPOOF', type: 'action', label: 'GPS Spoof' },
    { id: 'API_FLOOD', type: 'action', label: 'API Flood' },
    { id: 'COMPLETE', type: 'complete', label: 'Complete' }
  ],
  links: [
    { source: 'START', target: 'TARGET_SELECT', probability: 100 },
    { source: 'TARGET_SELECT', target: 'TIER2_ATTACK', probability: 75, label: 'Optimal target' },
    { source: 'TIER2_ATTACK', target: 'PHISHING', probability: 100 },
    { source: 'PHISHING', target: 'LLM_TEST', probability: 100 },
    { source: 'LLM_TEST', target: 'SUCCESS', probability: 30, label: 'Driver clicks' },
    { source: 'LLM_TEST', target: 'FAILURE', probability: 70, label: 'Driver ignores' },
    { source: 'SUCCESS', target: 'GPS_SPOOF', probability: 100 },
    { source: 'GPS_SPOOF', target: 'API_FLOOD', probability: 85 },
    { source: 'API_FLOOD', target: 'COMPLETE', probability: 70 }
  ]
};

let currentPath = [];
let activeNode = null;
let simulation = null;

function createAttackGraph(containerId) {
  const container = d3.select(`#${containerId}`);
  container.selectAll("*").remove();
  
  const width = container.node().offsetWidth - 40;
  const height = 350;
  
  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Create force simulation
  simulation = d3.forceSimulation(graphData.nodes)
    .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2));
  
  // Create links
  const link = svg.append('g')
    .selectAll('line')
    .data(graphData.links)
    .enter().append('line')
    .attr('class', 'link')
    .attr('stroke', '#0f0')
    .attr('stroke-width', 2);
  
  // Create link labels
  const linkLabel = svg.append('g')
    .selectAll('text')
    .data(graphData.links)
    .enter().append('text')
    .attr('class', 'link-label')
    .style('font-size', '10px')
    .style('fill', '#0ff')
    .text(d => d.label ? `${d.label} (${d.probability}%)` : `${d.probability}%`);
  
  // Create nodes
  const node = svg.append('g')
    .selectAll('circle')
    .data(graphData.nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', 20)
    .attr('fill', d => getNodeColor(d.type))
    .attr('stroke', '#0f0')
    .attr('stroke-width', 2)
    .call(drag(simulation));
  
  // Create node labels
  const label = svg.append('g')
    .selectAll('text')
    .data(graphData.nodes)
    .enter().append('text')
    .attr('class', 'node-label')
    .style('font-size', '11px')
    .style('fill', '#0f0')
    .style('text-anchor', 'middle')
    .style('pointer-events', 'none')
    .text(d => d.label);
  
  // Update positions on tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    linkLabel
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2);
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y + 35);
  });
  
  // Store references for updates
  window.graphElements = { node, link, label, linkLabel };
}

function getNodeColor(type) {
  const colors = {
    'initial': '#00ffff',
    'decision': '#ffff00',
    'action': '#ff00ff',
    'analysis': '#00ff00',
    'success': '#00ff00',
    'failure': '#ff0000',
    'complete': '#00ffff'
  };
  return colors[type] || '#0f0';
}

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}

function updateGraph(currentNode, path, status) {
  if (!window.graphElements) return;
  
  const { node, link } = window.graphElements;
  
  // Reset all nodes and links
  node.classed('active', false);
  link.classed('active', false);
  
  // Highlight current node
  if (currentNode) {
    node.filter(d => d.id === currentNode)
      .classed('active', true)
      .attr('stroke-width', 3);
    
    // Highlight path
    link.filter(d => {
      const pathIndex = path.indexOf(d.source.id);
      return pathIndex >= 0 && path[pathIndex + 1] === d.target.id;
    }).classed('active', true);
  }
  
  activeNode = currentNode;
  currentPath = path || [];
}

// Initialize graph when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => createAttackGraph('attack-graph'), 500);
  });
} else {
  setTimeout(() => createAttackGraph('attack-graph'), 500);
}

// Export for use in dashboard
window.updateAttackGraph = updateGraph;

