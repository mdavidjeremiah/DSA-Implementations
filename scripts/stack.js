class Stack {
  constructor() {
    this.items = [];
  }

  push(el) {
    this.items.push(el);
  }

  pop() {
    if (this.isEmpty()) throw new Error("Underflow");
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) throw new Error("Empty");
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

const stack = new Stack();
const container = document.getElementById('stack-container');
const logEl = document.getElementById('log');

function log(msg, type = 'ok') {
  logEl.innerHTML += `<span class="${type}">→ ${msg}</span><br/>`;
  logEl.scrollTop = logEl.scrollHeight;
}

function renderStack() {
  container.innerHTML = '';
  const base = document.getElementById('stack-base');

  if (stack.isEmpty()) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'empty-msg';
    emptyMsg.textContent = 'Stack is empty';
    container.appendChild(emptyMsg);
    base.style.display = 'none';
    return;
  }

  base.style.display = 'block';

  for (let i = 0; i < stack.items.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'stack-slot' + (i === stack.items.length - 1 ? ' top' : '');

    const val = document.createElement('span');
    val.className = 'val';
    val.textContent = stack.items[i];

    const idx = document.createElement('span');
    idx.className = 'idx';
    idx.textContent = `[${i}]`;

    slot.appendChild(idx);
    slot.appendChild(val);

    if (i === stack.items.length - 1) {
      const lbl = document.createElement('span');
      lbl.className = 'top-label';
      lbl.textContent = '← TOP';
      slot.appendChild(lbl);
    }

    container.insertBefore(slot, container.firstChild);
  }
}

function doPush() {
  const v = document.getElementById('push-val').value.trim();

  if (!v) {
    log('Enter a value', 'err');
    return;
  }

  stack.push(v);
  document.getElementById('push-val').value = '';
  renderStack();

  const slots = container.querySelectorAll('.stack-slot');
  if (slots[0]) {
    slots[0].classList.add('new-anim');
    setTimeout(() => slots[0].classList.remove('new-anim'), 400);
  }

  log(`push(${v}) — size: ${stack.size()}`);
}

function doPop() {
  if (stack.isEmpty()) {
    log('Stack underflow', 'err');
    return;
  }

  const val = stack.peek();
  const slots = container.querySelectorAll('.stack-slot');

  if (slots[0]) {
    slots[0].classList.add('pop-anim');
    setTimeout(() => {
      stack.pop();
      renderStack();
      log(`pop() → "${val}" — size: ${stack.size()}`);
    }, 280);
  } else {
    stack.pop();
    renderStack();
  }
}

function doPeek() {
  if (stack.isEmpty()) {
    log('Stack is empty', 'err');
    return;
  }

  const val = stack.peek();
  log(`peek() → "${val}" (not removed)`, 'info');

  const slots = container.querySelectorAll('.stack-slot');
  if (slots[0]) {
    slots[0].style.background = 'rgba(212, 107, 8, 0.12)';
    setTimeout(() => {
      slots[0].style.background = '';
    }, 800);
  }
}

function doClear() {
  stack.items = [];
  renderStack();
  log('Stack cleared', 'info');
}

document.getElementById('push-val').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    doPush();
  }
});

renderStack();