let lsArr = [];
let bsArr = [];
let lsRunning = false;
let bsRunning = false;

function randArr(n, max, sorted) {
  const a = Array.from({ length: n }, () => Math.floor(Math.random() * max) + 1);
  return sorted ? [...new Set(a)].sort((x, y) => x - y).slice(0, n) : a;
}

function renderArr(id, arr, hl = {}) {
  const el = document.getElementById(id);
  el.innerHTML = '';

  arr.forEach((v, i) => {
    const cell = document.createElement('div');
    let className = 'arr-cell';

    if (hl.current === i) className += ' current';
    if (hl.found === i) className += ' found';
    if (hl.eliminated && hl.eliminated.includes(i)) className += ' eliminated';
    if (hl.low === i) className += ' low';
    if (hl.high === i) className += ' high';
    if (hl.mid === i) className += ' mid';

    cell.className = className;

    let ptrs = '';
    if (hl.low === i) {
      ptrs += `<span class="ptr-label" style="color:#0958d9">LOW</span>`;
    }
    if (hl.high === i) {
      ptrs += `<span class="ptr-label" style="color:#cf1322;top:auto;bottom:-20px">HIGH</span>`;
    }
    if (hl.mid === i) {
      ptrs += `<span class="ptr-label">MID</span>`;
    }

    cell.innerHTML = `${ptrs}<span class="cv">${v}</span><span class="ci">${i}</span>`;
    el.appendChild(cell);
  });
}

function slog(id, msg, cls = 'step') {
  const el = document.getElementById(id);
  el.innerHTML += `<span class="${cls}">${msg}</span><br/>`;
  el.scrollTop = el.scrollHeight;
}

function generateLinear() {
  lsArr = randArr(14, 99, false);
  renderArr('ls-array', lsArr);
  document.getElementById('ls-status').innerHTML = 'Array ready';
  document.getElementById('ls-log').innerHTML = '';
}

function generateBinary() {
  bsArr = randArr(14, 99, true);
  renderArr('bs-array', bsArr);
  document.getElementById('bs-status').innerHTML = 'Sorted array ready';
  document.getElementById('bs-log').innerHTML = '';
}

function resetLinear() {
  renderArr('ls-array', lsArr);
  document.getElementById('ls-status').innerHTML = 'Cleared';
  document.getElementById('ls-log').innerHTML = '';
}

function resetBinary() {
  renderArr('bs-array', bsArr);
  document.getElementById('bs-status').innerHTML = 'Cleared';
  document.getElementById('bs-log').innerHTML = '';
}

async function startLinear() {
  if (lsRunning || !lsArr.length) return;

  const target = parseInt(document.getElementById('ls-target').value);
  if (isNaN(target)) {
    document.getElementById('ls-status').textContent = 'Enter a target value';
    return;
  }

  lsRunning = true;
  document.getElementById('ls-log').innerHTML = '';

  for (let i = 0; i < lsArr.length; i++) {
    renderArr('ls-array', lsArr, { current: i });
    document.getElementById('ls-status').innerHTML = `Checking index <span>${i}</span> → value <span>${lsArr[i]}</span>`;
    slog('ls-log', `Step ${i + 1}: arr[${i}] = ${lsArr[i]} ${lsArr[i] === target ? '== TARGET ✓' : '≠ ' + target}`);
    await delay(500);

    if (lsArr[i] === target) {
      renderArr('ls-array', lsArr, { found: i });
      document.getElementById('ls-status').innerHTML = `✓ Found <span>${target}</span> at index <span>${i}</span> in ${i + 1} step(s)`;
      slog('ls-log', `✓ FOUND at index ${i}`, 'hit');
      lsRunning = false;
      return;
    }
  }

  renderArr('ls-array', lsArr, { eliminated: lsArr.map((_, i) => i) });
  document.getElementById('ls-status').innerHTML = `✗ <span>${target}</span> not found — scanned all ${lsArr.length} elements`;
  slog('ls-log', `✗ Not found after ${lsArr.length} comparisons`, 'miss');
  lsRunning = false;
}

async function startBinary() {
  if (bsRunning || !bsArr.length) return;

  const target = parseInt(document.getElementById('bs-target').value);
  if (isNaN(target)) {
    document.getElementById('bs-status').textContent = 'Enter a target value';
    return;
  }

  bsRunning = true;
  document.getElementById('bs-log').innerHTML = '';

  let low = 0;
  let high = bsArr.length - 1;
  let step = 0;
  const eliminated = [];

  while (low <= high) {
    step++;
    const mid = Math.floor((low + high) / 2);

    renderArr('bs-array', bsArr, { low, high, mid, eliminated: [...eliminated] });
    document.getElementById('bs-status').innerHTML = `Step ${step}: low=<span>${low}</span> mid=<span>${mid}</span> high=<span>${high}</span> → arr[mid]=<span>${bsArr[mid]}</span>`;
    slog('bs-log', `Step ${step}: arr[${mid}]=${bsArr[mid]} vs target=${target}`);
    await delay(700);

    if (bsArr[mid] === target) {
      renderArr('bs-array', bsArr, { found: mid, eliminated: [...eliminated] });
      document.getElementById('bs-status').innerHTML = `✓ Found <span>${target}</span> at index <span>${mid}</span> in ${step} step(s)`;
      slog('bs-log', `✓ FOUND at index ${mid} in ${step} step(s)`, 'hit');
      bsRunning = false;
      return;
    } else if (bsArr[mid] < target) {
      for (let i = low; i <= mid; i++) eliminated.push(i);
      low = mid + 1;
      slog('bs-log', `  → ${bsArr[mid]} < ${target}: search RIGHT half`);
    } else {
      for (let i = mid; i <= high; i++) eliminated.push(i);
      high = mid - 1;
      slog('bs-log', `  → ${bsArr[mid]} > ${target}: search LEFT half`);
    }

    await delay(300);
  }

  document.getElementById('bs-status').innerHTML = `✗ <span>${target}</span> not found after <span>${step}</span> comparisons`;
  slog('bs-log', `✗ Not found after ${step} comparisons`, 'miss');
  bsRunning = false;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

generateLinear();
generateBinary();