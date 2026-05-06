const SIZE = 11;
let table = Array.from({ length: SIZE }, () => []);

function hashFn(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) % SIZE;
  }
  return h;
}

function renderTable(highlightIdx = -1, mode = '') {
  const grid = document.getElementById('ht-grid');
  grid.innerHTML = '';
  table.forEach((bucket, i) => {
    const div = document.createElement('div');
    let cls = 'bucket';
    if (i === highlightIdx) cls += mode === 'collide' ? ' collide' : ' active';
    div.className = cls;
    const idx = document.createElement('div');
    idx.className = 'bucket-idx';
    idx.textContent = `[${i}]`;
    div.appendChild(idx);
    const chain = document.createElement('div');
    chain.className = 'bucket-chain';
    bucket.forEach(([k, v]) => {
      const kv = document.createElement('span');
      kv.className = 'kv-pair';
      kv.innerHTML = `<span class="kv-key">${k}</span><span class="kv-arrow">→</span><span class="kv-val">${v}</span>`;
      chain.appendChild(kv);
    });
    div.appendChild(chain);
    grid.appendChild(div);
  });
}

function htlog(msg, cls = 'step') {
  const el = document.getElementById('ht-log');
  el.innerHTML += `<span class="${cls}">${msg}</span><br/>`;
  el.scrollTop = el.scrollHeight;
}

function htInsert() {
  const k = document.getElementById('ht-key').value.trim();
  const v = document.getElementById('ht-val').value.trim();
  if (!k || !v) {
    document.getElementById('ht-status').innerHTML = '<span class="err">Both key and value are required</span>';
    return;
  }
  const idx = hashFn(k);
  const existing = table[idx].findIndex(([ek]) => ek === k);
  if (existing !== -1) {
    const old = table[idx][existing][1];
    table[idx][existing][1] = v;
    document.getElementById('ht-status').innerHTML = `Updated <span>${k}</span> at bucket <span>[${idx}]</span>: ${old} → ${v}`;
    htlog(`UPDATE key="${k}" → "${v}" at bucket [${idx}]`, 'hit');
    renderTable(idx);
  } else {
    const collide = table[idx].length > 0;
    table[idx].push([k, v]);
    document.getElementById('ht-status').innerHTML = `Inserted <span>${k}</span> → <span>${v}</span> at bucket <span>[${idx}]</span>${collide ? ' (chained)' : ''}`;
    htlog(`INSERT key="${k}" hash=${idx}${collide ? ' → COLLISION → chained' : ''}`, collide ? 'warn' : 'hit');
    renderTable(idx, collide ? 'collide' : '');
  }
  document.getElementById('ht-key').value = '';
  document.getElementById('ht-val').value = '';
}

function htSearch() {
  const k = document.getElementById('ht-search').value.trim();
  if (!k) return;
  const idx = hashFn(k);
  const entry = table[idx].find(([ek]) => ek === k);
  if (entry) {
    document.getElementById('ht-status').innerHTML = `Found <span>${k}</span> → <span>${entry[1]}</span> at bucket <span>[${idx}]</span>`;
    htlog(`SEARCH "${k}" → bucket [${idx}] → found "${entry[1]}"`, 'hit');
    renderTable(idx);
  } else {
    document.getElementById('ht-status').innerHTML = `<span class="err">"${k}" not found</span> — checked bucket <span>[${idx}]</span>`;
    htlog(`SEARCH "${k}" → bucket [${idx}] → NOT FOUND`, 'miss');
    renderTable(idx);
  }
  document.getElementById('ht-search').value = '';
}

function htDelete() {
  const k = document.getElementById('ht-search').value.trim();
  if (!k) return;
  const idx = hashFn(k);
  const before = table[idx].length;
  table[idx] = table[idx].filter(([ek]) => ek !== k);
  if (table[idx].length < before) {
    document.getElementById('ht-status').innerHTML = `Deleted <span>${k}</span> from bucket <span>[${idx}]</span>`;
    htlog(`DELETE "${k}" from bucket [${idx}]`, 'hit');
  } else {
    document.getElementById('ht-status').innerHTML = `<span class="err">"${k}" not found</span> — nothing deleted`;
    htlog(`DELETE "${k}" → NOT FOUND`, 'miss');
  }
  renderTable(idx);
  document.getElementById('ht-search').value = '';
}

function htClear() {
  table = Array.from({ length: SIZE }, () => []);
  renderTable();
  document.getElementById('ht-status').innerHTML = 'Table cleared';
  document.getElementById('ht-log').innerHTML = '';
  htlog('Table reset', 'step');
}

function seedData() {
  const pairs = [['name','Alice'],['city','Kampala'],['lang','JavaScript'],['algo','Hashing'],['key','value'],['foo','bar']];
  pairs.forEach(([k, v]) => {
    const idx = hashFn(k);
    const ex = table[idx].findIndex(([ek]) => ek === k);
    if (ex !== -1) table[idx][ex][1] = v;
    else table[idx].push([k, v]);
  });
  renderTable();
  document.getElementById('ht-status').innerHTML = 'Loaded sample data';
  htlog('Seeded 6 sample key-value pairs', 'hit');
}

renderTable();
htlog('HashTable initialized — size=' + SIZE, 'step');
