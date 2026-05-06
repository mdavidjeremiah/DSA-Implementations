let fibRunning = false;
let factRunning = false;
const fibMemo = {};
const factMemo = {};

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function rlog(id, msg, cls = 'call') {
  const el = document.getElementById(id);
  el.innerHTML += `<span class="${cls}">${msg}</span><br/>`;
  el.scrollTop = el.scrollHeight;
}

function buildFibTree(n, depth = 0, x = 0, spread = 200) {
  const nodes = [], edges = [];
  const id = `f_${Math.random().toString(36).slice(2)}`;
  const node = { id, n, depth, x, y: depth * 60 + 40 };
  nodes.push(node);
  if (n <= 1) return { nodes, edges, root: node };

  const left = buildFibTree(n - 1, depth + 1, x - spread / 2, spread / 2);
  const right = buildFibTree(n - 2, depth + 1, x + spread / 2, spread / 2);

  edges.push({ from: node, to: left.nodes[0] });
  edges.push({ from: node, to: right.nodes[0] });

  return { nodes: [...nodes, ...left.nodes, ...right.nodes], edges: [...edges, ...left.edges, ...right.edges], root: node };
}

function buildFactTree(n, depth = 0) {
  const nodes = [], edges = [];
  const id = `ft_${Math.random().toString(36).slice(2)}`;
  const x = 0;
  const node = { id, n, depth, x, y: depth * 60 + 40 };
  nodes.push(node);
  if (n <= 0) return { nodes, edges, root: node };
  const child = buildFactTree(n - 1, depth + 1);
  edges.push({ from: node, to: child.nodes[0] });
  return { nodes: [...nodes, ...child.nodes], edges: [...edges, ...child.edges], root: node };
}

function renderTreeSVG(containerId, nodes, edges, activeId, cachedIds = [], resolvedMap = {}) {
  if (!nodes.length) return;
  const minX = Math.min(...nodes.map(n => n.x));
  const maxX = Math.max(...nodes.map(n => n.x));
  const maxY = Math.max(...nodes.map(n => n.y));
  const pad = 60;
  const width = Math.max(400, maxX - minX + pad * 2);
  const height = maxY + pad;
  const cx = x => x - minX + pad;

  let svg = `<svg class="tree-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;

  edges.forEach(e => {
    const cls = e.from.id === activeId || e.to.id === activeId ? 'edge-line active' : 'edge-line';
    svg += `<line class="${cls}" x1="${cx(e.from.x)}" y1="${e.from.y}" x2="${cx(e.to.x)}" y2="${e.to.y}"/>`;
  });

  nodes.forEach(node => {
    let cls = 'node-circle';
    if (cachedIds.includes(node.id)) cls += ' cached';
    else if (node.id === activeId) cls += ' active';
    else if (resolvedMap[node.id] !== undefined) cls += ' resolving';

    const val = resolvedMap[node.id];
    const label = node.n <= 1 && node.n !== undefined ? `fib(${node.n})` : `fib(${node.n})`;
    const factLabel = `${node.n}!`;

    svg += `<circle class="${cls}" cx="${cx(node.x)}" cy="${node.y}" r="22"/>`;
    svg += `<text class="node-text" x="${cx(node.x)}" y="${node.y - 4}">${containerId.includes('fact') ? factLabel : `fib(${node.n})`}</text>`;
    if (val !== undefined) {
      svg += `<text class="node-text ${cachedIds.includes(node.id) ? 'node-cached-val' : 'node-val'}" x="${cx(node.x)}" y="${node.y + 10}">${val}</text>`;
    }
  });

  svg += `</svg>`;
  document.getElementById(containerId).innerHTML = svg;
}

async function runFib() {
  if (fibRunning) return;
  const n = parseInt(document.getElementById('fib-n').value);
  if (isNaN(n) || n < 0 || n > 10) {
    document.getElementById('fib-status').textContent = 'Enter n between 0 and 10';
    return;
  }
  fibRunning = true;
  document.getElementById('fib-log').innerHTML = '';
  document.getElementById('fib-seq').innerHTML = '';
  document.getElementById('fib-stats-calls').textContent = '0';
  document.getElementById('fib-stats-result').textContent = '—';

  const tree = buildFibTree(n, 0, 0, Math.max(60, n * 30));
  const { nodes, edges } = tree;
  const resolvedMap = {};
  let totalCalls = 0;

  renderTreeSVG('fib-tree', nodes, edges, null, [], resolvedMap);

  async function fib(node) {
    totalCalls++;
    document.getElementById('fib-stats-calls').textContent = totalCalls;
    renderTreeSVG('fib-tree', nodes, edges, node.id, [], resolvedMap);
    rlog('fib-log', `→ fib(${node.n}) called`);
    document.getElementById('fib-status').innerHTML = `Computing <span>fib(${node.n})</span>...`;
    await delay(300);

    let result;
    if (node.n <= 1) {
      result = node.n;
    } else {
      const leftEdge = edges.find(e => e.from.id === node.id);
      const rightEdge = edges.filter(e => e.from.id === node.id)[1];
      const leftNode = nodes.find(nd => nd.id === leftEdge?.to.id);
      const rightNode = nodes.find(nd => nd.id === rightEdge?.to.id);
      const a = await fib(leftNode);
      const b = await fib(rightNode);
      result = a + b;
    }

    resolvedMap[node.id] = result;
    renderTreeSVG('fib-tree', nodes, edges, null, [], resolvedMap);
    rlog('fib-log', `← fib(${node.n}) = ${result}`, 'ret');
    await delay(150);
    return result;
  }

  const root = nodes[0];
  const result = await fib(root);

  document.getElementById('fib-stats-result').textContent = result;
  document.getElementById('fib-status').innerHTML = `fib(${n}) = <span>${result}</span> — ${totalCalls} calls made`;

  const seqEl = document.getElementById('fib-seq');
  for (let i = 0; i <= n; i++) {
    const cell = document.createElement('div');
    cell.className = 'seq-cell';
    cell.style.animationDelay = `${i * 60}ms`;
    cell.innerHTML = `<span class="sc-i">${i}</span><span class="sc-v">${fibPlain(i)}</span>`;
    seqEl.appendChild(cell);
  }

  fibRunning = false;
}

function fibPlain(n) { return n <= 1 ? n : fibPlain(n - 1) + fibPlain(n - 2); }

async function runFibMemo() {
  if (fibRunning) return;
  const n = parseInt(document.getElementById('fib-memo-n').value);
  if (isNaN(n) || n < 0 || n > 30) {
    document.getElementById('fib-memo-status').textContent = 'Enter n between 0 and 30';
    return;
  }
  fibRunning = true;
  document.getElementById('fib-memo-log').innerHTML = '';
  document.getElementById('fib-memo-stats-calls').textContent = '0';
  document.getElementById('fib-memo-stats-hits').textContent = '0';
  document.getElementById('fib-memo-stats-result').textContent = '—';

  const memo = {};
  let calls = 0, hits = 0;
  const maxDisplay = Math.min(n, 12);
  const tree = buildFibTree(maxDisplay, 0, 0, Math.max(60, maxDisplay * 30));
  const { nodes, edges } = tree;
  const resolvedMap = {};
  const cachedIds = [];

  renderTreeSVG('fib-memo-tree', nodes, edges, null, [], resolvedMap);
  renderMemoGrid(memo, n, 'fib-memo-grid');

  async function fibMemoized(nd) {
    calls++;
    document.getElementById('fib-memo-stats-calls').textContent = calls;

    if (memo[nd.n] !== undefined) {
      hits++;
      document.getElementById('fib-memo-stats-hits').textContent = hits;
      cachedIds.push(nd.id);
      resolvedMap[nd.id] = memo[nd.n];
      renderTreeSVG('fib-memo-tree', nodes, edges, nd.id, [...cachedIds], resolvedMap);
      rlog('fib-memo-log', `CACHE HIT fib(${nd.n}) = ${memo[nd.n]}`, 'cache');
      renderMemoGrid(memo, n, 'fib-memo-grid', nd.n);
      document.getElementById('fib-memo-status').innerHTML = `Cache hit! <span>fib(${nd.n}) = ${memo[nd.n]}</span> (skipped subtree)`;
      await delay(200);
      return memo[nd.n];
    }

    renderTreeSVG('fib-memo-tree', nodes, edges, nd.id, [...cachedIds], resolvedMap);
    rlog('fib-memo-log', `→ fib(${nd.n}) called`);
    document.getElementById('fib-memo-status').innerHTML = `Computing <span>fib(${nd.n})</span>...`;
    await delay(250);

    let result;
    if (nd.n <= 1) {
      result = nd.n;
    } else {
      const leftEdge = edges.find(e => e.from.id === nd.id);
      const rightEdges = edges.filter(e => e.from.id === nd.id);
      const leftNode = nodes.find(node => node.id === leftEdge?.to.id);
      const rightNode = rightEdges[1] ? nodes.find(node => node.id === rightEdges[1].to.id) : null;
      const a = await fibMemoized(leftNode);
      const b = rightNode ? await fibMemoized(rightNode) : 0;
      result = a + b;
    }

    memo[nd.n] = result;
    resolvedMap[nd.id] = result;
    renderTreeSVG('fib-memo-tree', nodes, edges, null, [...cachedIds], resolvedMap);
    renderMemoGrid(memo, n, 'fib-memo-grid');
    rlog('fib-memo-log', `← fib(${nd.n}) = ${result} → stored`, 'ret');
    await delay(150);
    return result;
  }

  let result;
  if (n > maxDisplay) {
    const m = {};
    let c2 = 0, h2 = 0;
    function fmFull(k) {
      c2++;
      if (m[k] !== undefined) { h2++; return m[k]; }
      if (k <= 1) { m[k] = k; return k; }
      m[k] = fmFull(k - 1) + fmFull(k - 2);
      return m[k];
    }
    result = fmFull(n);
    calls = c2; hits = h2;
    document.getElementById('fib-memo-stats-calls').textContent = calls;
    document.getElementById('fib-memo-stats-hits').textContent = hits;
    Object.assign(memo, m);
    renderMemoGrid(memo, n, 'fib-memo-grid');
    rlog('fib-memo-log', `Computed fib(${n}) directly (n > display limit)`, 'call');
    rlog('fib-memo-log', `fib(${n}) = ${result}`, 'ret');
  } else {
    result = await fibMemoized(nodes[0]);
  }

  document.getElementById('fib-memo-stats-result').textContent = result;
  document.getElementById('fib-memo-status').innerHTML = `fib(${n}) = <span>${result}</span> — ${calls} calls, ${hits} cache hits`;
  fibRunning = false;
}

function renderMemoGrid(memo, n, id, highlight = -1) {
  const el = document.getElementById(id);
  const keys = Object.keys(memo).map(Number).sort((a, b) => a - b);
  el.innerHTML = keys.map(k => {
    let cls = 'memo-cell filled';
    if (k === highlight) cls += ' hit';
    return `<div class="${cls}"><div class="mc-k">fib(${k})</div><div class="mc-v">${memo[k]}</div></div>`;
  }).join('');
}

async function runFact() {
  if (factRunning) return;
  const n = parseInt(document.getElementById('fact-n').value);
  if (isNaN(n) || n < 0 || n > 10) {
    document.getElementById('fact-status').textContent = 'Enter n between 0 and 10';
    return;
  }
  factRunning = true;
  document.getElementById('fact-log').innerHTML = '';
  document.getElementById('fact-stats-calls').textContent = '0';
  document.getElementById('fact-stats-result').textContent = '—';

  const tree = buildFactTree(n);
  const { nodes, edges } = tree;
  const resolvedMap = {};
  let totalCalls = 0;

  renderTreeSVG('fact-tree', nodes, edges, null, [], resolvedMap);

  async function fact(node) {
    totalCalls++;
    document.getElementById('fact-stats-calls').textContent = totalCalls;
    renderTreeSVG('fact-tree', nodes, edges, node.id, [], resolvedMap);
    rlog('fact-log', `→ fact(${node.n}) called`);
    document.getElementById('fact-status').innerHTML = `Computing <span>${node.n}!</span>...`;
    await delay(350);

    let result;
    if (node.n <= 0) {
      result = 1;
    } else {
      const childEdge = edges.find(e => e.from.id === node.id);
      const childNode = nodes.find(nd => nd.id === childEdge?.to.id);
      const sub = await fact(childNode);
      result = node.n * sub;
    }

    resolvedMap[node.id] = result;
    renderTreeSVG('fact-tree', nodes, edges, null, [], resolvedMap);
    rlog('fact-log', `← ${node.n}! = ${result}`, 'ret');
    await delay(150);
    return result;
  }

  const result = await fact(nodes[0]);
  document.getElementById('fact-stats-result').textContent = result;
  document.getElementById('fact-status').innerHTML = `${n}! = <span>${result}</span> — ${totalCalls} calls`;
  factRunning = false;
}

async function runFactMemo() {
  if (factRunning) return;
  const n = parseInt(document.getElementById('fact-memo-n').value);
  if (isNaN(n) || n < 0 || n > 20) {
    document.getElementById('fact-memo-status').textContent = 'Enter n between 0 and 20';
    return;
  }
  factRunning = true;
  document.getElementById('fact-memo-log').innerHTML = '';
  document.getElementById('fact-memo-stats-calls').textContent = '0';
  document.getElementById('fact-memo-stats-hits').textContent = '0';
  document.getElementById('fact-memo-stats-result').textContent = '—';

  const memo = {};
  let calls = 0, hits = 0;
  const maxDisplay = Math.min(n, 10);
  const tree = buildFactTree(maxDisplay);
  const { nodes, edges } = tree;
  const resolvedMap = {};
  const cachedIds = [];

  renderTreeSVG('fact-memo-tree', nodes, edges, null, [], resolvedMap);
  renderFactMemoGrid(memo, id => document.getElementById('fact-memo-grid').innerHTML = id);

  async function factMemoized(nd) {
    calls++;
    document.getElementById('fact-memo-stats-calls').textContent = calls;

    if (memo[nd.n] !== undefined) {
      hits++;
      document.getElementById('fact-memo-stats-hits').textContent = hits;
      cachedIds.push(nd.id);
      resolvedMap[nd.id] = memo[nd.n];
      renderTreeSVG('fact-memo-tree', nodes, edges, nd.id, [...cachedIds], resolvedMap);
      rlog('fact-memo-log', `CACHE HIT ${nd.n}! = ${memo[nd.n]}`, 'cache');
      document.getElementById('fact-memo-status').innerHTML = `Cache hit! <span>${nd.n}! = ${memo[nd.n]}</span>`;
      await delay(200);
      return memo[nd.n];
    }

    renderTreeSVG('fact-memo-tree', nodes, edges, nd.id, [...cachedIds], resolvedMap);
    rlog('fact-memo-log', `→ ${nd.n}! called`);
    document.getElementById('fact-memo-status').innerHTML = `Computing <span>${nd.n}!</span>...`;
    await delay(300);

    let result;
    if (nd.n <= 0) {
      result = 1;
    } else {
      const childEdge = edges.find(e => e.from.id === nd.id);
      const childNode = nodes.find(node => node.id === childEdge?.to.id);
      const sub = await factMemoized(childNode);
      result = nd.n * sub;
    }

    memo[nd.n] = result;
    resolvedMap[nd.id] = result;
    renderTreeSVG('fact-memo-tree', nodes, edges, null, [...cachedIds], resolvedMap);
    renderFactMemoGridEl(memo, 'fact-memo-grid', nd.n);
    rlog('fact-memo-log', `← ${nd.n}! = ${result} → stored`, 'ret');
    await delay(150);
    return result;
  }

  let result;
  if (n > maxDisplay) {
    const m = {};
    let c2 = 0, h2 = 0;
    function fmFull(k) {
      c2++;
      if (m[k] !== undefined) { h2++; return m[k]; }
      m[k] = k <= 0 ? 1 : k * fmFull(k - 1);
      return m[k];
    }
    result = fmFull(n);
    calls = c2; hits = h2;
    document.getElementById('fact-memo-stats-calls').textContent = calls;
    document.getElementById('fact-memo-stats-hits').textContent = hits;
    Object.assign(memo, m);
    renderFactMemoGridEl(memo, 'fact-memo-grid', -1);
    rlog('fact-memo-log', `Computed ${n}! directly (n > display limit)`, 'call');
    rlog('fact-memo-log', `${n}! = ${result}`, 'ret');
  } else {
    result = await factMemoized(nodes[0]);
  }

  document.getElementById('fact-memo-stats-result').textContent = result;
  document.getElementById('fact-memo-status').innerHTML = `${n}! = <span>${result}</span> — ${calls} calls, ${hits} cache hits`;
  factRunning = false;
}

function renderFactMemoGridEl(memo, id, highlight) {
  const el = document.getElementById(id);
  const keys = Object.keys(memo).map(Number).sort((a, b) => a - b);
  el.innerHTML = keys.map(k => {
    let cls = 'memo-cell filled';
    if (k === highlight) cls += ' hit';
    return `<div class="${cls}"><div class="mc-k">${k}!</div><div class="mc-v">${memo[k]}</div></div>`;
  }).join('');
}

function renderFactMemoGrid(memo, cb) { cb(''); }

document.getElementById('fib-tree').innerHTML = '<p style="font-family:var(--mono);font-size:0.65rem;color:var(--muted);padding:1rem;">Enter n and press Visualize to build the call tree</p>';
document.getElementById('fact-tree').innerHTML = '<p style="font-family:var(--mono);font-size:0.65rem;color:var(--muted);padding:1rem;">Enter n and press Visualize to build the call tree</p>';
document.getElementById('fib-memo-tree').innerHTML = '<p style="font-family:var(--mono);font-size:0.65rem;color:var(--muted);padding:1rem;">Enter n and press Visualize to see memoization in action</p>';
document.getElementById('fact-memo-tree').innerHTML = '<p style="font-family:var(--mono);font-size:0.65rem;color:var(--muted);padding:1rem;">Enter n and press Visualize to see memoization in action</p>';
