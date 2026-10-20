/**
 * HBTU Campus & City Route Visualizer
 * Interactive SVG/Canvas map showing HBTU East & West campuses,
 * Kanpur Central, Lucknow Airport, and popular student transit hubs.
 */

class HBTUMapVisualizer {
  constructor(containerId, onSelectRouteCallback) {
    this.container = document.getElementById(containerId);
    this.onSelectRoute = onSelectRouteCallback;
    this.nodes = {
      west_campus: { id: 'west_campus', name: 'West Campus (Awadhpuri)', short: 'West Campus', x: 28, y: 52, type: 'campus', color: '#10b981', tag: 'Hostels & Tech Complex' },
      east_campus: { id: 'east_campus', name: 'East Campus (Nawabganj)', short: 'East Campus', x: 42, y: 38, type: 'campus', color: '#06b6d4', tag: 'Main Admin & Library' },
      rawatpur: { id: 'rawatpur', name: 'Rawatpur Station', short: 'Rawatpur', x: 26, y: 40, type: 'transit', color: '#8b5cf6', tag: 'Local Trains' },
      z_square: { id: 'z_square', name: 'Z-Square Mall (Civil Lines)', short: 'Z-Square', x: 55, y: 50, type: 'hangout', color: '#f59e0b', tag: 'Mall & Cinema' },
      kanpur_central: { id: 'kanpur_central', name: 'Kanpur Central (CNB)', short: 'Kanpur Central', x: 65, y: 65, type: 'transit', color: '#ef4444', tag: 'Major Rail Junction' },
      jhakarkati: { id: 'jhakarkati', name: 'Jhakarkati Bus Terminal', short: 'Jhakarkati', x: 58, y: 74, type: 'transit', color: '#ec4899', tag: 'Inter-State Buses' },
      kanpur_airport: { id: 'kanpur_airport', name: 'Kanpur Airport (Chakeri)', short: 'Chakeri Airport', x: 82, y: 78, type: 'airport', color: '#3b82f6', tag: 'Domestic Flights' },
      lucknow_airport: { id: 'lucknow_airport', name: 'Lucknow Airport (CCS / LKO)', short: 'Lucknow Airport', x: 88, y: 15, type: 'airport', color: '#eab308', tag: 'International & Major Flights' }
    };

    this.routes = [
      { from: 'west_campus', to: 'east_campus', distance: '4.8 km', time: '12-15 min', avgCab: '₹100-140', pooledFare: '₹25-35' },
      { from: 'west_campus', to: 'kanpur_central', distance: '11.2 km', time: '25-35 min', avgCab: '₹260-320', pooledFare: '₹65-80' },
      { from: 'east_campus', to: 'kanpur_central', distance: '8.5 km', time: '20-30 min', avgCab: '₹220-280', pooledFare: '₹55-70' },
      { from: 'west_campus', to: 'lucknow_airport', distance: '82 km', time: '1h 35m', avgCab: '₹1700-2100', pooledFare: '₹425-520' },
      { from: 'east_campus', to: 'lucknow_airport', distance: '78 km', time: '1h 30m', avgCab: '₹1600-2000', pooledFare: '₹400-500' },
      { from: 'west_campus', to: 'kanpur_airport', distance: '22 km', time: '40-50 min', avgCab: '₹550-700', pooledFare: '₹140-175' },
      { from: 'west_campus', to: 'z_square', distance: '8.0 km', time: '20-25 min', avgCab: '₹200-260', pooledFare: '₹50-65' }
    ];

    this.activeRoute = null;
    this.render();
  }

  render() {
    if (!this.container) return;

    let svgLines = '';
    this.routes.forEach((route, idx) => {
      const fromNode = this.nodes[route.from];
      const toNode = this.nodes[route.to];
      if (fromNode && toNode) {
        svgLines += `
          <g class="map-route-group" data-route-id="${route.from}-${route.to}">
            <line x1="${fromNode.x}%" y1="${fromNode.y}%" x2="${toNode.x}%" y2="${toNode.y}%" class="route-line-bg" />
            <line x1="${fromNode.x}%" y1="${fromNode.y}%" x2="${toNode.x}%" y2="${toNode.y}%" class="route-line-fg" id="line-${route.from}-${route.to}" />
          </g>
        `;
      }
    });

    let nodeElements = '';
    Object.values(this.nodes).forEach(node => {
      const isAirport = node.type === 'airport';
      const isCampus = node.type === 'campus';
      const icon = isAirport ? '✈️' : (isCampus ? '🏛️' : (node.type === 'hangout' ? '🛍️' : '🚆'));

      nodeElements += `
        <div class="map-node ${node.type} ${isCampus ? 'campus-highlight' : ''}" 
             style="left: ${node.x}%; top: ${node.y}%; border-color: ${node.color};"
             data-node-id="${node.id}"
             title="${node.name} (${node.tag})">
          <div class="node-pulse" style="background-color: ${node.color};"></div>
          <div class="node-icon" style="background: radial-gradient(circle, ${node.color}33, #0f172a);">
            ${icon}
          </div>
          <div class="node-label">
            <span class="node-title">${node.short}</span>
            <span class="node-sub">${node.tag}</span>
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="hbtu-map-wrapper">
        <div class="map-header-bar">
          <div class="map-title-wrap">
            <span class="pulse-indicator"></span>
            <h4>HBTU Campus & Kanpur Hubs Transit Radar</h4>
          </div>
          <div class="map-metrics-pill">
            <span>⚡ Direct Cab Pooling Routes</span>
          </div>
        </div>
        <div class="map-canvas-area" id="mapCanvasArea">
          <svg class="map-svg-overlay" width="100%" height="100%">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="50%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#3b82f6" />
              </linearGradient>
            </defs>
            ${svgLines}
          </svg>
          ${nodeElements}
        </div>
        <div class="map-route-info-bar" id="mapRouteInfoBar">
          <div class="route-info-empty">
            <span>💡 Click any campus hub or airport node above to explore active cab pools and typical split savings!</span>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const nodes = this.container.querySelectorAll('.map-node');
    nodes.forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        const nodeId = nodeEl.getAttribute('data-node-id');
        this.selectNode(nodeId);
      });
    });
  }

  selectNode(nodeId) {
    const selected = this.nodes[nodeId];
    if (!selected) return;

    // Highlight active node
    this.container.querySelectorAll('.map-node').forEach(n => n.classList.remove('active'));
    const activeEl = this.container.querySelector(`.map-node[data-node-id="${nodeId}"]`);
    if (activeEl) activeEl.classList.add('active');

    // Find routes connected to this node
    const connectedRoutes = this.routes.filter(r => r.from === nodeId || r.to === nodeId);

    // Highlight lines
    this.container.querySelectorAll('.route-line-fg').forEach(l => l.classList.remove('highlighted'));
    connectedRoutes.forEach(r => {
      const line = this.container.querySelector(`#line-${r.from}-${r.to}`);
      if (line) line.classList.add('highlighted');
    });

    const infoBar = document.getElementById('mapRouteInfoBar');
    if (infoBar) {
      if (connectedRoutes.length > 0) {
        const topRoute = connectedRoutes[0];
        const otherNodeId = topRoute.from === nodeId ? topRoute.to : topRoute.from;
        const otherNode = this.nodes[otherNodeId];

        infoBar.innerHTML = `
          <div class="route-info-active">
            <div class="route-details-primary">
              <span class="route-tag-pill">SELECTED HUB</span>
              <h5>${selected.name}</h5>
              <div class="route-stat-chips">
                <span class="chip">📍 Connected to <strong>${connectedRoutes.length} key routes</strong></span>
                <span class="chip">🚕 Typical Solo Cab: <strong>${topRoute.avgCab}</strong></span>
                <span class="chip highlight">👥 Shared 4-Split: <strong>${topRoute.pooledFare}/person</strong></span>
              </div>
            </div>
            <div class="route-action-cta">
              <button class="btn btn-sm btn-primary" id="btnFilterByNode">
                Filter Rides with ${selected.short}
              </button>
            </div>
          </div>
        `;

        document.getElementById('btnFilterByNode')?.addEventListener('click', () => {
          if (this.onSelectRoute) {
            this.onSelectRoute(selected.name);
          }
        });
      }
    }
  }

  highlightRoute(fromName, toName) {
    // Attempt matching nodes by name string
    let fromKey = null, toKey = null;
    for (const [key, node] of Object.entries(this.nodes)) {
      if (fromName && fromName.toLowerCase().includes(node.short.toLowerCase())) fromKey = key;
      if (toName && toName.toLowerCase().includes(node.short.toLowerCase())) toKey = key;
    }

    if (fromKey && toKey) {
      this.container.querySelectorAll('.route-line-fg').forEach(l => l.classList.remove('highlighted'));
      const line = this.container.querySelector(`#line-${fromKey}-${toKey}`) || this.container.querySelector(`#line-${toKey}-${fromKey}`);
      if (line) {
        line.classList.add('highlighted');
      }
    }
  }
}

window.HBTUMapVisualizer = HBTUMapVisualizer;
