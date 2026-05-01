class Node {
  constructor(v) {
    this.val = v;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.sz = 0;
  }

  insertHead(v) {
    const n = new Node(v);
    n.next = this.head;
    this.head = n;
    this.sz++;
  }

  insertTail(v) {
    const n = new Node(v);
    if (!this.head) {
      this.head = n;
    } else {
      let c = this.head;
      while (c.next) {
        c = c.next;
        c.next = n;
      }
    }
    this.sz++;
  }

  delete(v) {
    if (!this.head) return false;

    if (this.head.val === v) {
      this.head = this.head.next;
      this.sz--;
      return true;
    }

    let c = this.head;
    while (c.next) {
      if (c.next.val === v) {
        c.next = c.next.next;
        this.sz--;
        return true;
      }
      c = c.next;
    }
    return false;
  }

  search(v) {
    let c = this.head;
    let i = 0;
    while (c) {
      if (c.val === v) return i;
      c = c.next;
      i++;
    }
    return -1;
  }

  toArray() {
    const a = [];
    let c = this.head;
    while (c) {
      a.push(c.val);
      c = c.next;
    }
    return a;
  }

  clear() {
    this.head = null;
    this.sz = 0;
  }
}

const ll = new LinkedList();
const track = document.getElementById('ll-track');
const logEl = document.getElementById('log');

function log(msg, type = 'ok') {
  logEl.innerHTML += `<span class="${type}">→ ${msg}</span><br/>`;
  logEl.scrollTop = logEl.scrollHeight;
}

function renderLL(hlVal = null) {
  track.innerHTML = '';

  const arr = ll.toArray();
  if (!arr.length) {
    track.innerHTML = '<div class="empty-msg">List is empty — insert a node</div>';
    return;
  }

  arr.forEach((v, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'node-wrapper';
    wrapper.style.marginTop = '28px';

    if (i === 0) {
      const lbl = document.createElement('span');
      lbl.className = 'head-lbl';
      lbl.textContent = 'HEAD';
      wrapper.appendChild(lbl);
    }

    if (i === arr.length - 1) {
      const lbl = document.createElement('span');
      lbl.className = 'tail-lbl';
      lbl.textContent = 'TAIL';
      wrapper.appendChild(lbl);
    }

    const node = document.createElement('div');
    node.className = 'll-node';

    const box = document.createElement('div');
    box.className = 'node-box' +
      (i === 0 ? ' head-node' : '') +
      (i === arr.length - 1 ? ' tail-node' : '');

    if (hlVal !== null && v === hlVal) {
      box.style.background = 'rgba(212, 107, 8, 0.12)';
    }

    box.innerHTML = `
      <div class="node-data">
        <span class="node-val">${v}</span>
        <span class="node-lbl">data</span>
      </div>
      <div class="node-next">${i < arr.length - 1 ? '→' : '∅'}</div>
    `;

    node.appendChild(box);
    wrapper.appendChild(node);
    track.appendChild(wrapper);

    if (i < arr.length - 1) {
      const ar = document.createElement('div');
      ar.className = 'll-arrow';
      ar.textContent = '⟶';
      track.appendChild(ar);
    } else {
      const nil = document.createElement('div');
      nil.innerHTML = '<div class="ll-arrow">⟶</div><div class="null-box">NULL</div>';
      nil.style.display = 'flex';
      nil.style.alignItems = 'center';
      track.appendChild(nil);
    }
  });
}

function doInsertHead() {
  const v = document.getElementById('node-val').value.trim();
  if (!v) {
    log('Enter a value', 'err');
    return;
  }
  ll.insertHead(v);
  document.getElementById('node-val').value = '';
  renderLL();
  log(`insertHead(${v}) → new HEAD — size: ${ll.sz}`);
}

function doInsertTail() {
  const v = document.getElementById('node-val').value.trim();
  if (!v) {
    log('Enter a value', 'err');
    return;
  }
  ll.insertTail(v);
  document.getElementById('node-val').value = '';
  renderLL();
  log(`insertTail(${v}) → new TAIL — size: ${ll.sz}`);
}

function doDelete() {
  const v = document.getElementById('search-val').value.trim();
  if (!v) {
    log('Enter value to delete', 'err');
    return;
  }
  const ok = ll.delete(v);
  renderLL();
  if (ok) {
    log(`delete(${v}) → removed — size: ${ll.sz}`);
  } else {
    log(`delete(${v}) → not found`, 'err');
  }
}

function doSearch() {
  const v = document.getElementById('search-val').value.trim();
  if (!v) {
    log('Enter value to search', 'err');
    return;
  }
  const idx = ll.search(v);
  if (idx >= 0) {
    log(`search(${v}) → found at index ${idx}`, 'info');
    renderLL(v);
    setTimeout(() => renderLL(), 1200);
  } else {
    log(`search(${v}) → not found`, 'err');
  }
}

function doClear() {
  ll.clear();
  renderLL();
  log('List cleared', 'info');
}

document.getElementById('node-val').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    doInsertTail();
  }
});

renderLL();