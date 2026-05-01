class Graph {
  constructor() {
    this.adjList = new Map();
  }

  addVertex(v) {
    if (!this.adjList.has(v)) {
      this.adjList.set(v, []);
    }
  }

  removeVertex(v) {
    this.adjList.delete(v);
    for (const [k, arr] of this.adjList) {
      this.adjList.set(k, arr.filter(n => n !== v));
    }
  }

  addEdge(u, v) {
    this.addVertex(u);
    this.addVertex(v);
    if (!this.adjList.get(u).includes(v)) {
      this.adjList.get(u).push(v);
    }
    if (!this.adjList.get(v).includes(u)) {
      this.adjList.get(v).push(u);
    }
  }

  removeEdge(u, v) {
    if (this.adjList.has(u)) {
      this.adjList.set(u, this.adjList.get(u).filter(n => n !== v));
    }
    if (this.adjList.has(v)) {
      this.adjList.set(v, this.adjList.get(v).filter(n => n !== u));
    }
  }

  BFS(s) {
    const vis = new Set();
    const q = [s];
    const o = [];
    vis.add(s);

    while (q.length) {
      const n = q.shift();
      o.push(n);

      for (const nb of this.adjList.get(n) ?? []) {
        if (!vis.has(nb)) {
          vis.add(nb);
          q.push(nb);
        }
      }
    }

    return o;
  }

  DFS(s) {
    const vis = new Set();
    const o = [];

    const d = (v) => {
      vis.add(v);
      o.push(v);
      for (const nb of this.adjList.get(v) ?? []) {
        if (!vis.has(nb)) {
          d(nb);
        }
      }
    };

    d(s);
    return o;
  }

  clear() {
    this.adjList.clear();
  }
}

const graph = new Graph();
const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const logEl = document.getElementById('log');
let positions = {};
let hlNodes = [];
let hlEdges = [];
let selectedForEdge = null;

function log(msg, type = 'ok') {
  logEl.innerHTML += `<span class="${type}">→ ${msg}</span><br/>`;
  logEl.scrollTop = logEl.scrollHeight;
}

function drawGraph() {
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ede8dc';
  ctx.fillRect(0, 0, W, H);

  // Draw edges
  for (const [v, nb] of graph.adjList) {
    if (!positions[v]) continue;

    for (const n of nb) {
      if (!positions[n] || v > n) continue;

      const isHL = hlEdges.some(([a, b]) =>
        (a === v && b === n) || (a === n && b === v)
      );

      ctx.beginPath();
      ctx.moveTo(positions[v].x, positions[v].y);
      ctx.lineTo(positions[n].x, positions[n].y);
      ctx.strokeStyle = isHL ? '#c41d7f' : '#d4cdc0';
      ctx.lineWidth = isHL ? 2.5 : 1.5;
      ctx.stroke();
    }
  }

  // Draw vertices
  for (const [v] of graph.adjList) {
    if (!positions[v]) continue;

    const { x, y } = positions[v];
    const idx = hlNodes.indexOf(v);
    const isSel = selectedForEdge === v;

    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);

    // Fill style
    if (idx >= 0) {
      ctx.fillStyle = idx < 5
        ? 'rgba(196, 29, 127, 0.15)'
        : 'rgba(9, 88, 217, 0.15)';
    } else if (isSel) {
      ctx.fillStyle = 'rgba(212, 107, 8, 0.15)';
    } else {
      ctx.fillStyle = 'rgba(196, 29, 127, 0.05)';
    }
    ctx.fill();

    // Stroke style
    ctx.strokeStyle = idx >= 0
      ? (idx < 5 ? '#c41d7f' : '#0958d9')
      : (isSel ? '#d46b08' : 'rgba(196, 29, 127, 0.4)');
    ctx.lineWidth = (idx >= 0 || isSel) ? 2 : 1.5;
    ctx.stroke();

    // Vertex label
    ctx.fillStyle = idx >= 0 ? '#1a1612' : '#1a1612';
    ctx.font = 'bold 12px Space Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(v, x, y);

    // Index label for highlighted nodes
    if (idx >= 0) {
      ctx.fillStyle = '#c41d7f';
      ctx.font = '10px Space Mono';
      ctx.fillText(idx, x + 16, y - 16);
    }
  }

  updateAdjList();
}

canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  const cx = (e.clientX - rect.left) * sx;
  const cy = (e.clientY - rect.top) * sy;

  for (const [v] of graph.adjList) {
    if (!positions[v]) continue;

    const dx = positions[v].x - cx;
    const dy = positions[v].y - cy;
    if (Math.sqrt(dx * dx + dy * dy) < 22) {
      if (selectedForEdge === null) {
        selectedForEdge = v;
        log(`Selected "${v}" — click another to add edge`, 'info');
      } else if (selectedForEdge === v) {
        selectedForEdge = null;
      } else {
        graph.addEdge(selectedForEdge, v);
        log(`addEdge(${selectedForEdge}, ${v})`);
        selectedForEdge = null;
      }
      drawGraph();
      return;
    }
  }

  selectedForEdge = null;
  const name = String.fromCharCode(65 + graph.adjList.size);
  positions[name] = { x: cx, y: cy };
  graph.addVertex(name);
  log(`addVertex(${name})`);
  drawGraph();
});

function updateAdjList() {
  const adj = document.getElementById('adj-list');
  if (graph.adjList.size === 0) {
    adj.textContent = '—';
    return;
  }

  let html = '';
  for (const [v, nb] of graph.adjList) {
    html += `<span style="color:var(--accent)">${v}</span> <span style="color:var(--muted)">→</span> [${nb.join(', ')}]<br/>`;
  }
  adj.innerHTML = html;
}

function doAddVertex() {
  const v = document.getElementById('v-name').value.trim().toUpperCase();
  if (!v) {
    log('Enter vertex name', 'err');
    return;
  }

  if (!positions[v]) {
    const a = Math.random() * Math.PI * 2;
    const r = 80 + Math.random() * 100;
    positions[v] = {
      x: canvas.width / 2 + r * Math.cos(a),
      y: canvas.height / 2 + r * Math.sin(a)
    };
  }

  graph.addVertex(v);
  document.getElementById('v-name').value = '';
  drawGraph();
  log(`addVertex(${v})`);
}

function doRemoveVertex() {
  const v = document.getElementById('v-name').value.trim().toUpperCase();
  if (!v) return;

  graph.removeVertex(v);
  delete positions[v];
  document.getElementById('v-name').value = '';
  drawGraph();
  log(`removeVertex(${v})`);
}

function doAddEdge() {
  const u = document.getElementById('e-from').value.trim().toUpperCase();
  const v = document.getElementById('e-to').value.trim().toUpperCase();
  if (!u || !v) return;

  if (!positions[u]) {
    positions[u] = {
      x: 100 + Math.random() * 440,
      y: 80 + Math.random() * 200
    };
  }
  if (!positions[v]) {
    positions[v] = {
      x: 100 + Math.random() * 440,
      y: 80 + Math.random() * 200
    };
  }

  graph.addEdge(u, v);
  document.getElementById('e-from').value = '';
  document.getElementById('e-to').value = '';
  drawGraph();
  log(`addEdge(${u}, ${v})`);
}

function doRemoveEdge() {
  const u = document.getElementById('e-from').value.trim().toUpperCase();
  const v = document.getElementById('e-to').value.trim().toUpperCase();
  if (!u || !v) return;

  graph.removeEdge(u, v);
  drawGraph();
  log(`removeEdge(${u}, ${v})`);
}

async function animateTraversal(order, type) {
  hlNodes = [];
  hlEdges = [];

  for (let i = 0; i < order.length; i++) {
    hlNodes.push(order[i]);
    if (i > 0) {
      hlEdges.push([order[i - 1], order[i]]);
    }
    drawGraph();
    await new Promise(r => setTimeout(r, 600));
  }

  log(`${type}: ${order.join(' → ')}`, type === 'BFS' ? 'bfs' : 'dfs');

  setTimeout(() => {
    hlNodes = [];
    hlEdges = [];
    drawGraph();
  }, 2000);
}

function doBFS() {
  const s = document.getElementById('start-v').value.trim().toUpperCase() ||
    [...graph.adjList.keys()][0];

  if (!s || !graph.adjList.has(s)) {
    log('Vertex not found', 'err');
    return;
  }

  animateTraversal(graph.BFS(s), 'BFS');
}

function doDFS() {
  const s = document.getElementById('start-v').value.trim().toUpperCase() ||
    [...graph.adjList.keys()][0];

  if (!s || !graph.adjList.has(s)) {
    log('Vertex not found', 'err');
    return;
  }

  animateTraversal(graph.DFS(s), 'DFS');
}

function doClear() {
  graph.clear();
  positions = {};
  selectedForEdge = null;
  hlNodes = [];
  hlEdges = [];
  drawGraph();
  log('Graph cleared', 'info');
}

function loadSample() {
  doClear();
  const verts = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 120;

  verts.forEach((v, i) => {
    const a = (i / verts.length) * Math.PI * 2 - Math.PI / 2;
    positions[v] = {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a)
    };
    graph.addVertex(v);
  });

  const edges = [
    ['A', 'B'], ['A', 'C'], ['B', 'D'],
    ['C', 'D'], ['D', 'E'], ['E', 'F'], ['B', 'F']
  ];
  edges.forEach(([u, v]) => graph.addEdge(u, v));

  drawGraph();
  log('Sample graph loaded — 6 vertices, 7 edges', 'info');
}

loadSample();