class BSTNode {
  constructor(v) {
    this.val = v;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(v) {
    this.root = this._ins(this.root, v);
  }

  _ins(n, v) {
    if (!n) return new BSTNode(v);
    if (v < n.val) {
      n.left = this._ins(n.left, v);
    } else if (v > n.val) {
      n.right = this._ins(n.right, v);
    }
    return n;
  }

  search(v) {
    let c = this.root;
    while (c) {
      if (v === c.val) return true;
      c = v < c.val ? c.left : c.right;
    }
    return false;
  }

  delete(v) {
    this.root = this._del(this.root, v);
  }

  _del(n, v) {
    if (!n) return null;

    if (v < n.val) {
      n.left = this._del(n.left, v);
    } else if (v > n.val) {
      n.right = this._del(n.right, v);
    } else {
      if (!n.left) return n.right;
      if (!n.right) return n.left;

      let min = n.right;
      while (min.left) {
        min = min.left;
      }
      n.val = min.val;
      n.right = this._del(n.right, min.val);
    }
    return n;
  }

  inorder() {
    const r = [];
    const d = (n) => {
      if (!n) return;
      d(n.left);
      r.push(n.val);
      d(n.right);
    };
    d(this.root);
    return r;
  }

  preorder() {
    const r = [];
    const d = (n) => {
      if (!n) return;
      r.push(n.val);
      d(n.left);
      d(n.right);
    };
    d(this.root);
    return r;
  }

  postorder() {
    const r = [];
    const d = (n) => {
      if (!n) return;
      d(n.left);
      d(n.right);
      r.push(n.val);
    };
    d(this.root);
    return r;
  }

  clear() {
    this.root = null;
  }
}

const bst = new BST();
const canvas = document.getElementById('tree-canvas');
const ctx = canvas.getContext('2d');
const logEl = document.getElementById('log');
let hlVal = null;

function log(msg, type = 'ok') {
  logEl.innerHTML += `<span class="${type}">→ ${msg}</span><br/>`;
  logEl.scrollTop = logEl.scrollHeight;
}

function drawTree() {
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ede8dc';
  ctx.fillRect(0, 0, W, H);

  if (!bst.root) {
    ctx.fillStyle = '#7a7060';
    ctx.font = '12px Space Mono';
    ctx.textAlign = 'center';
    ctx.fillText('Tree is empty', W / 2, H / 2);
    return;
  }

  // Calculate positions
  function pos(node, depth, left, right) {
    if (!node) return;
    const x = (left + right) / 2;
    const y = 40 + depth * 65;
    node._x = x;
    node._y = y;
    pos(node.left, depth + 1, left, (left + right) / 2);
    pos(node.right, depth + 1, (left + right) / 2, right);
  }

  pos(bst.root, 0, 0, W);

  // Draw edges
  function edges(node) {
    if (!node) return;

    if (node.left) {
      ctx.beginPath();
      ctx.moveTo(node._x, node._y);
      ctx.lineTo(node.left._x, node.left._y);
      ctx.strokeStyle = '#d4cdc0';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      edges(node.left);
    }

    if (node.right) {
      ctx.beginPath();
      ctx.moveTo(node._x, node._y);
      ctx.lineTo(node.right._x, node.right._y);
      ctx.strokeStyle = '#d4cdc0';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      edges(node.right);
    }
  }

  edges(bst.root);

  // Draw nodes
  function nodes(node) {
    if (!node) return;

    const isHL = hlVal !== null && node.val === hlVal;
    const isRoot = node === bst.root;

    ctx.beginPath();
    ctx.arc(node._x, node._y, 20, 0, Math.PI * 2);

    // Fill style
    if (isHL) {
      ctx.fillStyle = 'rgba(212, 107, 8, 0.18)';
    } else if (isRoot) {
      ctx.fillStyle = 'rgba(212, 107, 8, 0.08)';
    } else {
      ctx.fillStyle = 'rgba(212, 107, 8, 0.04)';
    }
    ctx.fill();

    // Stroke style
    ctx.strokeStyle = isHL || isRoot ? '#d46b08' : 'rgba(212, 107, 8, 0.5)';
    ctx.lineWidth = (isHL || isRoot) ? 2 : 1;
    ctx.stroke();

    // Text style
    ctx.fillStyle = isHL ? '#d46b08' : '#1a1612';
    ctx.font = 'bold 12px Space Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.val, node._x, node._y);

    nodes(node.left);
    nodes(node.right);
  }

  nodes(bst.root);
}

function doInsert() {
  const v = parseInt(document.getElementById('op-val').value);

  if (isNaN(v)) {
    log('Enter a number', 'err');
    return;
  }

  bst.insert(v);
  document.getElementById('op-val').value = '';
  hlVal = v;
  drawTree();

  setTimeout(() => {
    hlVal = null;
    drawTree();
  }, 1000);

  log(`insert(${v}) complete`);
}

function doSearch() {
  const v = parseInt(document.getElementById('op-val').value);

  if (isNaN(v)) {
    log('Enter a number', 'err');
    return;
  }

  const found = bst.search(v);

  if (found) {
    hlVal = v;
    drawTree();
    setTimeout(() => {
      hlVal = null;
      drawTree();
    }, 1200);
  }

  log(found ? `search(${v}) → FOUND` : `search(${v}) → NOT FOUND`, found ? 'info' : 'err');
}

function doDelete() {
  const v = parseInt(document.getElementById('op-val').value);

  if (isNaN(v)) {
    log('Enter a number', 'err');
    return;
  }

  const found = bst.search(v);
  bst.delete(v);
  drawTree();
  log(found ? `delete(${v}) → removed` : `delete(${v}) → not found`, found ? 'ok' : 'err');
}

function doInorder() {
  const r = bst.inorder();
  document.getElementById('traversal-out').textContent = r.length ? r.join(' → ') : 'empty';
  log(`inorder: [${r.join(', ')}]`, 'info');
}

function doPreorder() {
  const r = bst.preorder();
  document.getElementById('traversal-out').textContent = r.length ? r.join(' → ') : 'empty';
  log(`preorder: [${r.join(', ')}]`, 'info');
}

function doPostorder() {
  const r = bst.postorder();
  document.getElementById('traversal-out').textContent = r.length ? r.join(' → ') : 'empty';
  log(`postorder: [${r.join(', ')}]`, 'info');
}

function doClear() {
  bst.clear();
  drawTree();
  document.getElementById('traversal-out').textContent = '—';
  log('Tree cleared', 'info');
}

document.getElementById('op-val').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    doInsert();
  }
});

// Seed the tree with initial values
[50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));
drawTree();
log('Tree seeded with: 50, 30, 70, 20, 40, 60, 80', 'info');