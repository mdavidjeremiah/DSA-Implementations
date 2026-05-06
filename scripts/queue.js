class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(el) {
    this.items.push(el);
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Underflow");
    } 
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      throw new Error("Empty");
    }
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

const queue = new Queue();
const track = document.getElementById('queue-track');
const logEl = document.getElementById('log');

function log(msg, type = 'ok') {
  logEl.innerHTML += `<span class="${type}">→ ${msg}</span><br/>`;
  logEl.scrollTop = logEl.scrollHeight;
}

function renderQueue() {
  track.innerHTML = '';

  if (queue.isEmpty()) {
    track.innerHTML = '<div class="empty-msg">Queue is empty</div>';
    return;
  }

  queue.items.forEach((val, i) => {
    const slot = document.createElement('div');
    let cls = 'queue-slot';

    if (i === 0) cls += ' front-slot';
    if (i === queue.items.length - 1) cls += ' rear-slot';

    slot.className = cls;
    slot.innerHTML = `
      <span class="val">${val}</span>
      <span class="idx">[${i}]</span>
    `;

    if (i === 0) {
      slot.innerHTML += `<span class="ptr">FRONT</span>`;
    }
    if (i === queue.items.length - 1) {
      slot.innerHTML += `<span class="ptr">REAR</span>`;
    }

    track.appendChild(slot);

    if (i < queue.items.length - 1) {
      const arr = document.createElement('div');
      arr.style.cssText = 'display:flex;align-items:center;padding:0 4px;color:#d4cdc0;font-size:1rem;';
      arr.textContent = '›';
      track.appendChild(arr);
    }
  });
}

function doEnqueue() {
  const v = document.getElementById('enq-val').value.trim();

  if (!v) {
    log('Enter a value', 'err');
    return;
  }

  queue.enqueue(v);
  document.getElementById('enq-val').value = '';
  renderQueue();

  const slots = track.querySelectorAll('.queue-slot');
  const last = slots[slots.length - 1];

  if (last) {
    last.classList.add('enq-anim');
    setTimeout(() => last.classList.remove('enq-anim'), 350);
  }

  log(`enqueue(${v}) → rear — size: ${queue.size()}`);
}

function doDequeue() {
  if (queue.isEmpty()) {
    log('Queue underflow', 'err');
    return;
  }

  const val = queue.front();
  const slots = track.querySelectorAll('.queue-slot');

  if (slots[0]) {
    slots[0].classList.add('deq-anim');
    setTimeout(() => {
      queue.dequeue();
      renderQueue();
      log(`dequeue() → "${val}" — size: ${queue.size()}`);
    }, 280);
  } else {
    queue.dequeue();
    renderQueue();
  }
}

function doFront() {
  if (queue.isEmpty()) {
    log('Queue is empty', 'err');
    return;
  }

  const val = queue.front();
  log(`front() → "${val}" (not removed)`, 'info');

  const slots = track.querySelectorAll('.queue-slot');
  if (slots[0]) {
    slots[0].style.background = 'rgba(212, 107, 8, 0.12)';
    setTimeout(() => {
      slots[0].style.background = '';
    }, 800);
  }
}

function doClear() {
  queue.items = [];
  renderQueue();
  log('Queue cleared', 'info');
}

document.getElementById('enq-val').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    doEnqueue();
  }
});

renderQueue();