let arr = [];
let N = 25;
let running = false;
let stopFlag = false;
let comparisons = 0;
let swaps = 0;
let currentAlgo = 'bubble';

const CODES = {
  bubble: `<span class="kw">async function</span> <span class="fn">bubbleSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">let</span> swapped = <span class="kw">false</span>;
    <span class="kw">for</span> (<span class="kw">let</span> j = <span class="num">0</span>; j < n - i - <span class="num">1</span>; j++) {
      <span class="kw">if</span> (arr[j] > arr[j + <span class="num">1</span>]) {
        [arr[j], arr[j+<span class="num">1</span>]] = [arr[j+<span class="num">1</span>], arr[j]];
        swapped = <span class="kw">true</span>;
      }
    }
    <span class="kw">if</span> (!swapped) <span class="kw">break</span>; <span class="cm">// Early exit</span>
  }
}`,
  selection: `<span class="kw">async function</span> <span class="fn">selectionSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
    <span class="kw">let</span> minIdx = i;
    <span class="kw">for</span> (<span class="kw">let</span> j = i + <span class="num">1</span>; j < n; j++) {
      <span class="kw">if</span> (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}`,
  insertion: `<span class="kw">async function</span> <span class="fn">insertionSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">1</span>; i < n; i++) {
    <span class="kw">const</span> key = arr[i];
    <span class="kw">let</span> j = i - <span class="num">1</span>;
    <span class="kw">while</span> (j >= <span class="num">0</span> && arr[j] > key) {
      arr[j + <span class="num">1</span>] = arr[j]; j--;
    }
    arr[j + <span class="num">1</span>] = key;
  }
}`,
  merge: `<span class="kw">function</span> <span class="fn">mergeSort</span>(arr) {
  <span class="kw">if</span> (arr.length <= <span class="num">1</span>) <span class="kw">return</span> arr;
  <span class="kw">const</span> mid = Math.<span class="fn">floor</span>(arr.length / <span class="num">2</span>);
  <span class="kw">return</span> <span class="fn">merge</span>(
    <span class="fn">mergeSort</span>(arr.slice(<span class="num">0</span>, mid)),
    <span class="fn">mergeSort</span>(arr.slice(mid))
  );
}
<span class="kw">function</span> <span class="fn">merge</span>(left, right) {
  <span class="kw">const</span> res = []; <span class="kw">let</span> i = <span class="num">0</span>, j = <span class="num">0</span>;
  <span class="kw">while</span> (i < left.length && j < right.length)
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  <span class="kw">return</span> [...res, ...left.slice(i), ...right.slice(j)];
}`,
  quick: `<span class="kw">async function</span> <span class="fn">quickSort</span>(arr, lo, hi) {
  <span class="kw">if</span> (lo < hi) {
    <span class="kw">const</span> pi = <span class="kw">await</span> <span class="fn">partition</span>(arr, lo, hi);
    <span class="kw">await</span> <span class="fn">quickSort</span>(arr, lo, pi - <span class="num">1</span>);
    <span class="kw">await</span> <span class="fn">quickSort</span>(arr, pi + <span class="num">1</span>, hi);
  }
}
<span class="kw">async function</span> <span class="fn">partition</span>(arr, lo, hi) {
  <span class="kw">const</span> pivot = arr[hi]; <span class="kw">let</span> i = lo - <span class="num">1</span>;
  <span class="kw">for</span> (<span class="kw">let</span> j = lo; j < hi; j++) {
    <span class="kw">if</span> (arr[j] <= pivot) {
      i++; [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i+<span class="num">1</span>], arr[hi]] = [arr[hi], arr[i+<span class="num">1</span>]];
  <span class="kw">return</span> i + <span class="num">1</span>;
}`
};

function selectAlgo(name) {
  currentAlgo = name;
  document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + name).classList.add('active');
  document.getElementById('code-title').textContent = `// ${name.charAt(0).toUpperCase() + name.slice(1)} Sort`;
  document.getElementById('code-display').innerHTML = CODES[name];
}

function generateArray() {
  N = parseInt(document.getElementById('size').value);
  document.getElementById('array-size').textContent = N;
  arr = Array.from({ length: N }, () => Math.floor(Math.random() * 90) + 10);
  comparisons = 0;
  swaps = 0;
  document.getElementById('comparisons').textContent = 0;
  document.getElementById('swaps').textContent = 0;
  renderBars(arr, [], [], []);
  document.getElementById('status').textContent = 'Array ready — press Sort';
}

function renderBars(a, comparing = [], swapping = [], sorted = [], pivot = -1, merging = []) {
  const chart = document.getElementById('bar-chart');
  const maxVal = Math.max(...a);
  chart.innerHTML = '';

  a.forEach((v, i) => {
    const bar = document.createElement('div');
    let cls = 'bar ';

    if (sorted.includes(i)) {
      cls += 'sorted';
    } else if (swapping.includes(i)) {
      cls += 'swapping';
    } else if (pivot === i) {
      cls += 'pivot';
    } else if (merging.includes(i)) {
      cls += 'merging';
    } else if (comparing.includes(i)) {
      cls += 'comparing';
    } else {
      cls += 'normal';
    }

    bar.className = cls;
    bar.style.height = `${(v / maxVal) * 95}%`;
    chart.appendChild(bar);
  });
}

function getDelay() {
  const s = parseInt(document.getElementById('speed').value);
  document.getElementById('speed-lbl').textContent = s + 'x';
  return Math.max(10, 300 - s * 28);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function startSort() {
  if (running) return;

  stopFlag = false;
  running = true;
  comparisons = 0;
  swaps = 0;
  document.getElementById('comparisons').textContent = 0;
  document.getElementById('swaps').textContent = 0;
  document.getElementById('status').innerHTML = `Running <span>${currentAlgo} sort</span>...`;

  const start = Date.now();

  if (currentAlgo === 'bubble') {
    await bubbleSort();
  } else if (currentAlgo === 'selection') {
    await selectionSort();
  } else if (currentAlgo === 'insertion') {
    await insertionSort();
  } else if (currentAlgo === 'merge') {
    await mergeSortVis();
  } else if (currentAlgo === 'quick') {
    await quickSortVis(0, arr.length - 1);
  }

  if (!stopFlag) {
    renderBars(arr, [], [], arr.map((_, i) => i));
    const ms = Date.now() - start;
    document.getElementById('status').innerHTML = `✓ Sorted in <span>${ms}ms</span> — <span>${comparisons}</span> comparisons, <span>${swaps}</span> swaps`;
  }

  running = false;
}

function stopSort() {
  stopFlag = true;
  running = false;
  document.getElementById('status').textContent = 'Stopped';
}

async function bubbleSort() {
  const n = arr.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let sw = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (stopFlag) return;

      comparisons++;
      document.getElementById('comparisons').textContent = comparisons;
      renderBars(arr, [j, j + 1], [], [...sorted]);
      await delay(getDelay());

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        document.getElementById('swaps').textContent = swaps;
        sw = true;
      }
    }

    sorted.push(n - 1 - i);
    if (!sw) break;
  }
}

async function selectionSort() {
  const n = arr.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (stopFlag) return;

      comparisons++;
      document.getElementById('comparisons').textContent = comparisons;
      renderBars(arr, [j, minIdx], [], [...sorted]);
      await delay(getDelay());

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      document.getElementById('swaps').textContent = swaps;
    }

    sorted.push(i);
  }

  sorted.push(arr.length - 1);
}

async function insertionSort() {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      if (stopFlag) return;

      comparisons++;
      document.getElementById('comparisons').textContent = comparisons;

      arr[j + 1] = arr[j];
      j--;
      swaps++;
      document.getElementById('swaps').textContent = swaps;

      renderBars(arr, [j + 1, i], [], []);
      await delay(getDelay());
    }

    arr[j + 1] = key;
    renderBars(arr, [], [], [...Array.from({ length: i + 1 }, (_, k) => k)]);
    await delay(getDelay() / 2);
  }
}

async function mergeSortVis() {
  async function ms(l, r) {
    if (l >= r || stopFlag) return;
    const m = Math.floor((l + r) / 2);
    await ms(l, m);
    await ms(m + 1, r);
    await mergeParts(l, m, r);
  }

  async function mergeParts(l, m, r) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;

    while (i < left.length && j < right.length) {
      if (stopFlag) return;

      comparisons++;
      document.getElementById('comparisons').textContent = comparisons;

      const mi = Array.from({ length: r - l + 1 }, (_, x) => l + x);
      renderBars(arr, [], [], [], -1, mi);
      await delay(getDelay());

      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
        swaps++;
        document.getElementById('swaps').textContent = swaps;
      }
    }

    while (i < left.length) {
      arr[k++] = left[i++];
    }
    while (j < right.length) {
      arr[k++] = right[j++];
    }
  }

  await ms(0, arr.length - 1);
}

async function quickSortVis(lo, hi) {
  if (lo >= hi || stopFlag) return;
  const pi = await partition(lo, hi);
  await quickSortVis(lo, pi - 1);
  await quickSortVis(pi + 1, hi);
}

async function partition(lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;

  renderBars(arr, [], [], [], hi);
  await delay(getDelay());

  for (let j = lo; j < hi; j++) {
    if (stopFlag) return lo;

    comparisons++;
    document.getElementById('comparisons').textContent = comparisons;
    renderBars(arr, [j, hi], [], [], hi);
    await delay(getDelay());

    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swaps++;
      document.getElementById('swaps').textContent = swaps;
    }
  }

  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  swaps++;
  document.getElementById('swaps').textContent = swaps;

  return i + 1;
}

document.getElementById('speed').addEventListener('input', () => {
  document.getElementById('speed-lbl').textContent = document.getElementById('speed').value + 'x';
});

selectAlgo('bubble');
generateArray();