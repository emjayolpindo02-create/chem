export const OFFLINE_SCRIPTS_PART2 = `
// ==========================================
// 2. COMPLETE 118-ELEMENT PERIODIC TABLE & TRENDS
// ==========================================
function setPeriodicMetric(mode) {
  periodicMetricMode = mode;
  document.querySelectorAll('.metric-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.metric === mode);
  });
  renderPeriodicGrid();
}

function getElementDisplayColor(el) {
  if (periodicMetricMode === 'block') {
    if (el.block === 's') return 'background: #991b1b; border-color: #ef4444;';
    if (el.block === 'p') return 'background: #1e3a8a; border-color: #3b82f6;';
    if (el.block === 'd') return 'background: #854d0e; border-color: #eab308;';
    if (el.block === 'f') return 'background: #581c87; border-color: #a855f7;';
  } else if (periodicMetricMode === 'radius') {
    if (!el.atomicRadiusPm) return 'background: #0f172a; border-color: #334155;';
    const norm = Math.min(1, Math.max(0, (el.atomicRadiusPm - 30) / 250));
    const r = Math.floor(6 + norm * 200);
    return 'background: rgb(' + r + ', 30, 80); border-color: #f43f5e;';
  } else if (periodicMetricMode === 'en') {
    if (!el.electronegativity) return 'background: #0f172a; border-color: #334155;';
    const norm = (el.electronegativity - 0.7) / 3.3;
    const g = Math.floor(10 + norm * 180);
    return 'background: rgb(20, ' + g + ', 140); border-color: #06b6d4;';
  } else if (periodicMetricMode === 'ie') {
    if (!el.ionizationEnergyKj) return 'background: #0f172a; border-color: #334155;';
    const norm = Math.min(1, el.ionizationEnergyKj / 2400);
    const b = Math.floor(40 + norm * 200);
    return 'background: rgb(40, 20, ' + b + '); border-color: #8b5cf6;';
  }
  // Category fallback
  switch (el.category) {
    case 'alkali-metal': return 'background: #881337; border-color: #f43f5e;';
    case 'alkaline-earth': return 'background: #7c2d12; border-color: #f97316;';
    case 'transition-metal': return 'background: #1e293b; border-color: #64748b;';
    case 'post-transition-metal': return 'background: #064e3b; border-color: #10b981;';
    case 'metalloid': return 'background: #134e4a; border-color: #14b8a6;';
    case 'nonmetal': return 'background: #1e3a8a; border-color: #3b82f6;';
    case 'halogen': return 'background: #701a75; border-color: #d946ef;';
    case 'noble-gas': return 'background: #3b0764; border-color: #a855f7;';
    case 'lanthanide': return 'background: #831843; border-color: #ec4899;';
    case 'actinide': return 'background: #4c1d95; border-color: #8b5cf6;';
    default: return 'background: #0f172a; border-color: #334155;';
  }
}

function getMetricValueText(el) {
  if (periodicMetricMode === 'radius') return el.atomicRadiusPm ? el.atomicRadiusPm + 'pm' : '—';
  if (periodicMetricMode === 'en') return el.electronegativity ? el.electronegativity : '—';
  if (periodicMetricMode === 'ie') return el.ionizationEnergyKj ? el.ionizationEnergyKj + 'kJ' : '—';
  if (periodicMetricMode === 'block') return el.block + '-block';
  return el.atomicMass.toFixed(1);
}

function renderPeriodicGrid() {
  const container = document.getElementById('periodic-grid-table');
  if (!container) return;
  container.innerHTML = '';

  for (let p = 1; p <= 7; p++) {
    for (let g = 1; g <= 18; g++) {
      if (p === 6 && g === 3) {
        const fAnchor = document.createElement('div');
        fAnchor.className = 'element-btn';
        fAnchor.style.background = '#831843';
        fAnchor.style.borderColor = '#ec4899';
        fAnchor.innerHTML = '<span class="el-z">57-71</span><strong class="el-symbol">La-Lu</strong><span class="el-metric">4f</span>';
        fAnchor.onclick = () => selectElement(57);
        container.appendChild(fAnchor);
        continue;
      }
      if (p === 7 && g === 3) {
        const fAnchor = document.createElement('div');
        fAnchor.className = 'element-btn';
        fAnchor.style.background = '#4c1d95';
        fAnchor.style.borderColor = '#8b5cf6';
        fAnchor.innerHTML = '<span class="el-z">89-103</span><strong class="el-symbol">Ac-Lr</strong><span class="el-metric">5f</span>';
        fAnchor.onclick = () => selectElement(89);
        container.appendChild(fAnchor);
        continue;
      }

      const el = PERIODIC_ELEMENTS.find(e => e.period === p && e.group === g && !(e.z >= 57 && e.z <= 71) && !(e.z >= 89 && e.z <= 103));
      if (!el) {
        const empty = document.createElement('div');
        container.appendChild(empty);
      } else {
        const btn = document.createElement('button');
        btn.className = 'element-btn' + (el.z === selectedElementZ ? ' selected' : '');
        btn.style.cssText = getElementDisplayColor(el);
        btn.innerHTML = '<span class="el-z">' + el.z + '</span><strong class="el-symbol">' + el.symbol + '</strong><span class="el-metric">' + getMetricValueText(el) + '</span>';
        btn.onclick = () => selectElement(el.z);
        container.appendChild(btn);
      }
    }
  }

  // Render Lanthanides & Actinides
  const fContainer = document.getElementById('periodic-f-block');
  if (fContainer) {
    fContainer.innerHTML = '';
    const renderFRow = (title, startZ, endZ, bg) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:4px; margin-bottom:4px;';
      const label = document.createElement('span');
      label.innerText = title;
      label.style.cssText = 'width:74px; font-size:10px; font-weight:bold; color:var(--text-muted);';
      row.appendChild(label);

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid; grid-template-columns:repeat(15, minmax(36px, 1fr)); gap:3px; flex:1;';
      for (let z = startZ; z <= endZ; z++) {
        const el = PERIODIC_ELEMENTS.find(e => e.z === z);
        if (el) {
          const btn = document.createElement('button');
          btn.className = 'element-btn' + (el.z === selectedElementZ ? ' selected' : '');
          btn.style.cssText = getElementDisplayColor(el);
          btn.innerHTML = '<span class="el-z">' + el.z + '</span><strong class="el-symbol">' + el.symbol + '</strong><span class="el-metric">' + getMetricValueText(el) + '</span>';
          btn.onclick = () => selectElement(el.z);
          grid.appendChild(btn);
        }
      }
      row.appendChild(grid);
      fContainer.appendChild(row);
    };

    renderFRow('Lanthanides', 57, 71, '#831843');
    renderFRow('Actinides', 89, 103, '#4c1d95');
  }

  renderElementInspector();
  populateComparisonDropdowns();
}

function selectElement(z) {
  selectedElementZ = z;
  renderPeriodicGrid();
}

function renderElementInspector() {
  const inspector = document.getElementById('element-inspector');
  if (!inspector) return;
  const el = PERIODIC_ELEMENTS.find(e => e.z === selectedElementZ) || PERIODIC_ELEMENTS[0];

  inspector.innerHTML = \`
    <div style="display:flex; gap:16px; align-items:center; margin-bottom:14px;">
      <div style="width:68px; height:68px; border-radius:14px; background:linear-gradient(135deg, #1e293b, #030712); border:2px solid var(--cyan); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(6,182,212,0.3);">
        <span style="font-size:11px; font-mono; opacity:0.8;">\${el.z}</span>
        <strong style="font-size:26px; color:#fff; line-height:1;">\${el.symbol}</strong>
      </div>
      <div>
        <h3 style="font-size:20px; font-weight:800; color:#fff;">\${el.name}</h3>
        <div style="font-size:12px; color:var(--text-muted);">Period \${el.period}, Group \${el.group} • \${el.block}-block</div>
        <span class="badge badge-cyan" style="margin-top:4px;">\${el.category.toUpperCase()}</span>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; font-size:12px; font-family:monospace; background:#030712; padding:12px; border-radius:10px; border:1px solid #1e293b; margin-bottom:12px;">
      <div>Atomic Mass: <strong style="color:var(--amber);">\${el.atomicMass}</strong></div>
      <div>Radius: <strong style="color:#fff;">\${el.atomicRadiusPm ? el.atomicRadiusPm + ' pm' : '—'}</strong></div>
      <div>Electronegativity: <strong style="color:var(--cyan);">\${el.electronegativity ?? '—'}</strong></div>
      <div>1st Ionization: <strong style="color:var(--violet);">\${el.ionizationEnergyKj ? el.ionizationEnergyKj + ' kJ' : '—'}</strong></div>
      <div style="grid-column:span 2;">Config: <strong style="color:#6ee7b7;">\${el.electronConfig}</strong></div>
    </div>
    <p style="font-size:13px; color:#cbd5e1; line-height:1.6;">\${el.summary}</p>
  \`;
}

function populateComparisonDropdowns() {
  const selA = document.getElementById('compare-sel-a');
  const selB = document.getElementById('compare-sel-b');
  if (!selA || !selB || selA.children.length > 0) return;

  PERIODIC_ELEMENTS.forEach(el => {
    const optA = document.createElement('option');
    optA.value = el.z;
    optA.innerText = el.z + '. ' + el.name + ' (' + el.symbol + ')';
    optA.selected = el.z === compareElementAZ;
    selA.appendChild(optA);

    const optB = document.createElement('option');
    optB.value = el.z;
    optB.innerText = el.z + '. ' + el.name + ' (' + el.symbol + ')';
    optB.selected = el.z === compareElementBZ;
    selB.appendChild(optB);
  });
  renderComparisonCards();
}

function updateComparison() {
  const selA = document.getElementById('compare-sel-a');
  const selB = document.getElementById('compare-sel-b');
  if (selA && selB) {
    compareElementAZ = parseInt(selA.value);
    compareElementBZ = parseInt(selB.value);
    renderComparisonCards();
  }
}

function renderComparisonCards() {
  const cardA = document.getElementById('compare-card-a');
  const cardB = document.getElementById('compare-card-b');
  const elA = PERIODIC_ELEMENTS.find(e => e.z === compareElementAZ);
  const elB = PERIODIC_ELEMENTS.find(e => e.z === compareElementBZ);
  if (!cardA || !cardB || !elA || !elB) return;

  const renderElCard = (el) => \`
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:10px;">
      <div style="width:48px; height:48px; border-radius:10px; background:#1e293b; border:1px solid var(--cyan); display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <span style="font-size:10px; opacity:0.8;">\${el.z}</span>
        <strong style="font-size:18px;">\${el.symbol}</strong>
      </div>
      <div>
        <h4 style="font-size:15px; font-weight:bold; color:#fff;">\${el.name}</h4>
        <div style="font-size:11px; color:var(--text-muted);">Period \${el.period}, Group \${el.group}</div>
      </div>
    </div>
    <div style="font-size:12px; font-family:monospace; line-height:1.8;">
      <div>Radius: <strong>\${el.atomicRadiusPm ? el.atomicRadiusPm + ' pm' : '—'}</strong></div>
      <div>Electronegativity: <strong>\${el.electronegativity ?? '—'}</strong></div>
      <div>Ionization Energy: <strong>\${el.ionizationEnergyKj ? el.ionizationEnergyKj + ' kJ' : '—'}</strong></div>
    </div>
  \`;

  cardA.innerHTML = renderElCard(elA);
  cardB.innerHTML = renderElCard(elB);
}

// ==========================================
// 3. DAILY CHEMISTRY CHALLENGE
// ==========================================
let currentDailyQuestion = null;

function renderDailyChallenge() {
  const streakData = getStoredData(STORAGE_KEYS.STREAK, {
    currentStreak: 0, bestStreak: 0, totalCompleted: 0, lastCompletedDate: null, history: []
  });

  const streakDisplay = document.getElementById('daily-streak-val');
  if (streakDisplay) streakDisplay.innerText = streakData.currentStreak;
  const bestDisplay = document.getElementById('daily-best-val');
  if (bestDisplay) bestDisplay.innerText = streakData.bestStreak;
  const totalDisplay = document.getElementById('daily-total-val');
  if (totalDisplay) totalDisplay.innerText = streakData.totalCompleted;

  // Pick deterministic daily question based on date
  const todayStr = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) hash = (hash << 5) - hash + todayStr.charCodeAt(i);
  const qIdx = Math.abs(hash) % PRACTICE_PROBLEMS.length;
  currentDailyQuestion = PRACTICE_PROBLEMS[qIdx];

  const qCard = document.getElementById('daily-question-card');
  if (!qCard || !currentDailyQuestion) return;

  const isCompletedToday = streakData.lastCompletedDate === todayStr;

  let optsHtml = '';
  currentDailyQuestion.options.forEach((opt, idx) => {
    optsHtml += '<button class="quiz-opt" onclick="submitDailyAnswer(this, \\'' + opt.replace(/'/g, "\\\\'") + '\\')">' + opt + '</button>';
  });

  qCard.innerHTML = \`
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span class="badge badge-amber">TODAY'S CHALLENGE • \${currentDailyQuestion.lawName}</span>
      <span style="font-size:12px; color:var(--text-muted); font-family:monospace;">\${todayStr}</span>
    </div>
    <h3 style="font-size:16px; font-weight:bold; color:#fff; margin-bottom:14px; line-height:1.6;">
      \${currentDailyQuestion.problemStatement}
    </h3>
    <div id="daily-options-box">\${optsHtml}</div>
    <div id="daily-explanation-box" class="card hidden" style="background:#030712; margin-top:14px; border-color:var(--emerald);"></div>
  \`;

  if (isCompletedToday) {
    const expBox = document.getElementById('daily-explanation-box');
    if (expBox) {
      expBox.classList.remove('hidden');
      expBox.innerHTML = \`
        <span class="badge badge-emerald" style="margin-bottom:8px;">SOLVED TODAY! 🎉</span>
        <div style="font-size:13px; color:#fff; font-weight:bold;">Correct Answer: \${currentDailyQuestion.correctAnswer}</div>
        <p style="font-size:12px; color:#cbd5e1; margin-top:6px;">\${currentDailyQuestion.hint}</p>
      \`;
    }
  }
}

function submitDailyAnswer(btn, chosen) {
  if (!currentDailyQuestion) return;
  const isCorrect = chosen.trim() === currentDailyQuestion.correctAnswer.trim();
  const parent = btn.parentElement;
  parent.querySelectorAll('.quiz-opt').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === currentDailyQuestion.correctAnswer.trim()) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  const expBox = document.getElementById('daily-explanation-box');
  if (expBox) {
    expBox.classList.remove('hidden');
    let stepsHtml = '';
    if (currentDailyQuestion.solutionSteps) {
      stepsHtml = '<div style="margin-top:10px; font-size:12px; color:#cbd5e1;">' +
        currentDailyQuestion.solutionSteps.map(s => '<div style="margin-bottom:4px;"><strong>Step ' + s.stepNumber + ': ' + s.description + '</strong>' + (s.latex ? '<div style="font-family:monospace; color:var(--amber);">' + s.latex + '</div>' : '') + '</div>').join('') +
        '</div>';
    }

    expBox.innerHTML = (isCorrect ? '<span class="badge badge-emerald">CORRECT ANSWER! 🌟</span>' : '<span class="badge badge-amber">SOLUTION BREAKDOWN</span>') +
      '<div style="font-size:13px; color:#fff; font-weight:bold; margin-top:6px;">Answer: ' + currentDailyQuestion.correctAnswer + '</div>' +
      stepsHtml;
  }

  // Update streak in storage
  if (isCorrect) {
    const todayStr = new Date().toISOString().split('T')[0];
    const streakData = getStoredData(STORAGE_KEYS.STREAK, {
      currentStreak: 0, bestStreak: 0, totalCompleted: 0, lastCompletedDate: null, history: []
    });

    if (streakData.lastCompletedDate !== todayStr) {
      streakData.currentStreak += 1;
      if (streakData.currentStreak > streakData.bestStreak) streakData.bestStreak = streakData.currentStreak;
      streakData.totalCompleted += 1;
      streakData.lastCompletedDate = todayStr;
      if (!streakData.history.includes(todayStr)) streakData.history.push(todayStr);
      saveStoredData(STORAGE_KEYS.STREAK, streakData);

      const streakDisplay = document.getElementById('daily-streak-val');
      if (streakDisplay) streakDisplay.innerText = streakData.currentStreak;
      const bestDisplay = document.getElementById('daily-best-val');
      if (bestDisplay) bestDisplay.innerText = streakData.bestStreak;
    }
  }
}
`;
