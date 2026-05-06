let isArr = [];
let isRunning = false;

function randSortedArr(n, max) {
  const a = Array.from({ length: n }, () => Math.floor(Math.random() * max) + 1);
  return [...new Set(a)].sort((x, y) => x - y).slice(0, n);
}

function renderArr(arr, hl = {}) {
  const el = document.getElementById('is-array');
  el.innerHTML = '';
  arr.forEach((v, i) => {
    const cell = document.createElement('div');
    let cls = 'arr-cell';
    if (hl.probe === i) cls += ' probe';
    if (hl.found === i) cls += ' found';
    if (hl.eliminated && hl.eliminated.includes(i)) cls += ' eliminated';
    if (hl.low === i) cls += ' low';
    if (hl.high === i) cls += ' high';
    cell.className = cls;
    let ptrs = '';
    if (hl.low === i) ptrs += `<span class="ptr-label" style="color:#0958d9">LOW</span>`;
    if (hl.high === i) ptrs += `<span class="ptr-label" style="color:#cf1322;top:auto;bottom:-20px">HIGH</span>`;
    if (hl.probe === i) ptrs += `<span class="ptr-label">PROBE</span>`;
    cell.innerHTML = `${ptrs}<span class="cv">${v}</span><span class="ci">${i}</span>`;
    el.appendChild(cell);
  });
}

function islog(msg, cls = 'step') {
  const el = document.getElementById('is-log');
  el.innerHTML += `<span class="${cls}">${msg}</span><br/>`;
  el.scrollTop = el.scrollHeight;
}

function setFormula(low, high, arr, target, probe) {
  const el = document.getElementById('is-formula');
  if (low === -1) {
    el.innerHTML = '<span class="formula">pos = low + ⌊((target − arr[low]) / (arr[high] − arr[low])) × (high − low)⌋</span>';
    return;
  }
  el.innerHTML = `<span class="formula">pos</span> = ${low} + ⌊((${target} − ${arr[low]}) / (${arr[high]} − ${arr[low]})) × (${high} − ${low})⌋ = <span class="formula">${probe}</span>`;
}

function generateArr() {
  isArr = randSortedArr(16, 150);
  renderArr(isArr);
  document.getElementById('is-status').innerHTML = 'Uniformly distributed sorted array ready';
  document.getElementById('is-log').innerHTML = '';
  setFormula(-1, -1, [], 0, 0);
}

function resetArr() {
  renderArr(isArr);
  document.getElementById('is-status').innerHTML = 'Reset';
  document.getElementById('is-log').innerHTML = '';
  setFormula(-1, -1, [], 0, 0);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function startInterpolation() {
  if (isRunning || !isArr.length) return;
  const target = parseInt(document.getElementById('is-target').value);
  if (isNaN(target)) {
    document.getElementById('is-status').textContent = 'Enter a target value';
    return;
  }

  isRunning = true;
  document.getElementById('is-log').innerHTML = '';
  const arr = isArr;
  let low = 0;
  let high = arr.length - 1;
  let step = 0;
  const eliminated = [];

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    step++;

    if (arr[low] === arr[high]) {
      if (arr[low] === target) {
        renderArr(arr, { found: low, eliminated: [...eliminated] });
        document.getElementById('is-status').innerHTML = `✓ Found <span>${target}</span> at index <span>${low}</span> in ${step} step(s)`;
        islog(`✓ FOUND at index ${low} in ${step} step(s)`, 'hit');
        isRunning = false;
        return;
      }
      break;
    }

    const probe = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
    setFormula(low, high, arr, target, probe);

    renderArr(arr, { low, high, probe, eliminated: [...eliminated] });
    document.getElementById('is-status').innerHTML = `Step ${step}: low=<span>${low}</span> probe=<span>${probe}</span> high=<span>${high}</span> → arr[probe]=<span>${arr[probe]}</span>`;
    islog(`Step ${step}: probe[${probe}]=${arr[probe]} vs target=${target}`);
    await delay(800);

    if (arr[probe] === target) {
      renderArr(arr, { found: probe, eliminated: [...eliminated] });
      document.getElementById('is-status').innerHTML = `✓ Found <span>${target}</span> at index <span>${probe}</span> in ${step} step(s)`;
      islog(`✓ FOUND at index ${probe} in ${step} step(s)`, 'hit');
      isRunning = false;
      return;
    } else if (arr[probe] < target) {
      for (let i = low; i <= probe; i++) eliminated.push(i);
      islog(`  → ${arr[probe]} < ${target}: search RIGHT`);
      low = probe + 1;
    } else {
      for (let i = probe; i <= high; i++) eliminated.push(i);
      islog(`  → ${arr[probe]} > ${target}: search LEFT`);
      high = probe - 1;
    }

    await delay(300);
  }

  renderArr(arr, { eliminated: arr.map((_, i) => i) });
  document.getElementById('is-status').innerHTML = `✗ <span>${target}</span> not found after <span>${step}</span> probe(s)`;
  islog(`✗ Not found after ${step} probe(s)`, 'miss');
  isRunning = false;
}

generateArr();
