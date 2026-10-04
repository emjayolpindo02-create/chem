export const OFFLINE_SCRIPTS_PART3 = `
// ==========================================
// 4. UNIVERSAL UNITS & MOLES LAB
// ==========================================
function convertPressure() {
  const val = parseFloat(document.getElementById('p-conv-val').value) || 0;
  const unit = document.getElementById('p-conv-unit').value;
  const toAtm = { atm: 1, kPa: 101.325, mmHg: 760, bar: 1.01325, psi: 14.696, torr: 760 };
  const atm = val / (toAtm[unit] || 1);

  const out = document.getElementById('p-conv-output');
  if (out) {
    out.innerHTML = \`
      <div>= <strong>\${atm.toFixed(4)}</strong> atm</div>
      <div>= <strong>\${(atm * 101.325).toFixed(2)}</strong> kPa</div>
      <div>= <strong>\${(atm * 760).toFixed(1)}</strong> mmHg / torr</div>
      <div>= <strong>\${(atm * 1.01325).toFixed(4)}</strong> bar</div>
      <div>= <strong>\${(atm * 14.696).toFixed(2)}</strong> psi</div>
    \`;
  }
}

function convertVolume() {
  const val = parseFloat(document.getElementById('v-conv-val').value) || 0;
  const unit = document.getElementById('v-conv-unit').value;
  const toLiters = { L: 1, mL: 0.001, m3: 1000, cm3: 0.001, dL: 0.1 };
  const liters = val * (toLiters[unit] || 1);

  const out = document.getElementById('v-conv-output');
  if (out) {
    out.innerHTML = \`
      <div style="color:var(--cyan); font-weight:bold;">= \${liters.toFixed(4)} Liters (L)</div>
      <div>= \${(liters * 1000).toFixed(1)} mL (cm³)</div>
      <div>= \${(liters / 1000).toFixed(6)} m³</div>
      <div>= \${(liters * 10).toFixed(2)} dL</div>
    \`;
  }
}

function convertTemperature() {
  const val = parseFloat(document.getElementById('t-conv-val').value) || 0;
  const unit = document.getElementById('t-conv-unit').value;
  let K = 273.15;
  if (unit === 'C') K = val + 273.15;
  else if (unit === 'K') K = val;
  else if (unit === 'F') K = ((val - 32) * 5) / 9 + 273.15;

  const out = document.getElementById('t-conv-output');
  if (out) {
    out.innerHTML = \`
      <div style="color:var(--amber); font-weight:bold; font-size:14px;">= \${K.toFixed(2)} Kelvin (K) ★ Required for Gas Laws!</div>
      <div>= \${(K - 273.15).toFixed(2)} °C (Celsius)</div>
      <div>= \${(((K - 273.15) * 9) / 5 + 32).toFixed(2)} °F (Fahrenheit)</div>
    \`;
  }
}

// Chemical Formula Molar Mass Parser with Parentheses support
function calculateFormulaMolarMass() {
  const input = document.getElementById('formula-input').value.trim();
  const out = document.getElementById('formula-output');
  if (!out) return;
  if (!input) { out.innerHTML = 'Enter formula (e.g. Ca(OH)2, H2O)'; return; }

  try {
    let index = 0;
    function parseSubgroup() {
      const counts = {};
      while (index < input.length) {
        const ch = input[index];
        if (ch === '(') {
          index++;
          const inner = parseSubgroup();
          if (index < input.length && input[index] === ')') index++;
          let numStr = '';
          while (index < input.length && /[0-9]/.test(input[index])) { numStr += input[index]; index++; }
          const mult = numStr ? parseInt(numStr) : 1;
          for (const [s, c] of Object.entries(inner)) counts[s] = (counts[s] || 0) + c * mult;
        } else if (ch === ')') {
          break;
        } else if (/[A-Z]/.test(ch)) {
          let sym = ch;
          index++;
          if (index < input.length && /[a-z]/.test(input[index])) { sym += input[index]; index++; }
          let numStr = '';
          while (index < input.length && /[0-9]/.test(input[index])) { numStr += input[index]; index++; }
          const count = numStr ? parseInt(numStr) : 1;
          counts[sym] = (counts[sym] || 0) + count;
        } else {
          index++;
        }
      }
      return counts;
    }

    const counts = parseSubgroup();
    let totalMass = 0;
    const rows = [];

    for (const [sym, count] of Object.entries(counts)) {
      const el = PERIODIC_ELEMENTS.find(e => e.symbol === sym);
      if (!el) {
        out.innerHTML = '<span style="color:var(--rose);">Unknown element symbol: "' + sym + '". Check capitalization (e.g. "Na" not "NA").</span>';
        return;
      }
      const contrib = el.atomicMass * count;
      totalMass += contrib;
      rows.push({ symbol: sym, name: el.name, count, mass: el.atomicMass, total: contrib });
    }

    rows.forEach(r => r.pct = ((r.total / totalMass) * 100).toFixed(1));

    let tableHtml = '<div style="margin-top:12px; font-family:monospace; font-size:12px;">';
    tableHtml += '<div style="font-size:16px; font-weight:bold; color:var(--emerald); margin-bottom:8px;">Molar Mass: ' + totalMass.toFixed(3) + ' g/mol</div>';
    tableHtml += '<table style="width:100%; border-collapse:collapse;">';
    tableHtml += '<tr style="border-bottom:1px solid #334155; text-align:left; color:var(--text-muted); font-size:11px;"><th>Element</th><th>Count</th><th>Mass</th><th>Total</th><th>% Mass</th></tr>';
    rows.forEach(r => {
      tableHtml += '<tr style="border-bottom:1px solid #1e293b;"><td style="color:#fff; font-weight:bold;">' + r.symbol + ' (' + r.name + ')</td><td>' + r.count + '</td><td>' + r.mass.toFixed(2) + '</td><td>' + r.total.toFixed(2) + '</td><td style="color:var(--cyan);">' + r.pct + '%</td></tr>';
    });
    tableHtml += '</table></div>';

    out.innerHTML = tableHtml;
  } catch (e) {
    out.innerHTML = '<span style="color:var(--rose);">Invalid chemical formula syntax.</span>';
  }
}

// STP Mass / Moles / Particles / Volume Converter
function convertMolesSTP(source) {
  const molarMass = parseFloat(document.getElementById('stp-molar-mass').value) || 18.015;
  const massIn = document.getElementById('stp-mass');
  const molesIn = document.getElementById('stp-moles');
  const particlesIn = document.getElementById('stp-particles');
  const volumeIn = document.getElementById('stp-vol');

  let n = 1.0;
  if (source === 'mass') {
    n = (parseFloat(massIn.value) || 0) / molarMass;
    molesIn.value = n.toFixed(4);
  } else if (source === 'moles') {
    n = parseFloat(molesIn.value) || 0;
    massIn.value = (n * molarMass).toFixed(2);
  } else if (source === 'volume') {
    n = (parseFloat(volumeIn.value) || 0) / 22.414;
    molesIn.value = n.toFixed(4);
    massIn.value = (n * molarMass).toFixed(2);
  }

  particlesIn.value = (n * 6.022).toFixed(3) + 'e+23';
  if (source !== 'volume') volumeIn.value = (n * 22.414).toFixed(3);
}

// Molarity Dilution M1V1 = M2V2
function solveDilution() {
  const m1 = parseFloat(document.getElementById('dil-m1').value) || 0;
  const v1 = parseFloat(document.getElementById('dil-v1').value) || 0;
  const m2 = parseFloat(document.getElementById('dil-m2').value) || 0;
  const v2In = document.getElementById('dil-v2');
  const res = document.getElementById('dil-res');

  if (m2 > 0) {
    const v2 = (m1 * v1) / m2;
    v2In.value = v2.toFixed(3);
    if (res) res.innerHTML = 'Required Final Volume V₂ = <strong>' + v2.toFixed(3) + ' mL</strong>. Add ' + (v2 - v1).toFixed(1) + ' mL solvent.';
  }
}

// ==========================================
// 5. PRACTICE QUIZ CENTER
// ==========================================
let currentPracticeFilter = 'all';

function filterPractice(filter) {
  currentPracticeFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.filter === filter));
  renderPracticeQuestions();
}

function renderPracticeQuestions() {
  const container = document.getElementById('practice-list-container');
  if (!container) return;
  container.innerHTML = '';

  const list = currentPracticeFilter === 'all'
    ? PRACTICE_PROBLEMS
    : PRACTICE_PROBLEMS.filter(p => p.lawId === currentPracticeFilter);

  list.forEach((prob, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '14px';

    let optsHtml = '';
    prob.options.forEach(opt => {
      optsHtml += '<button class="quiz-opt" onclick="checkPracticeOpt(this, \\'' + prob.id + '\\', \\'' + prob.correctAnswer.replace(/'/g, "\\\\'") + '\\')">' + opt + '</button>';
    });

    card.innerHTML = \`
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge badge-cyan">QUESTION \${idx + 1} • \${prob.lawName}</span>
        <span class="badge badge-amber">\${prob.difficulty.toUpperCase()}</span>
      </div>
      <p style="font-size:14px; color:#fff; font-weight:600; margin-bottom:12px; line-height:1.5;">\${prob.problemStatement}</p>
      <div>\${optsHtml}</div>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <button class="btn-accent" style="padding:4px 10px; font-size:11px; background:#1e293b; color:var(--text-muted);" onclick="toggleHint('hint-\${prob.id}')">💡 Show Hint</button>
      </div>
      <div id="hint-\${prob.id}" class="card hidden" style="background:#030712; margin-top:8px; font-size:12px; color:var(--amber);">
        Hint: \${prob.hint}
      </div>
      <div id="sol-\${prob.id}" class="card hidden" style="background:#030712; margin-top:8px; font-size:12px; border-color:var(--emerald);">
        <div style="color:var(--emerald); font-weight:bold;">Correct Answer: \${prob.correctAnswer}</div>
      </div>
    \`;
    container.appendChild(card);
  });
}

function toggleHint(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden');
}

function checkPracticeOpt(btn, probId, correct) {
  const parent = btn.parentElement;
  const isCorrect = btn.innerText.trim() === correct.trim();
  parent.querySelectorAll('.quiz-opt').forEach(b => {
    b.disabled = true;
    if (b.innerText.trim() === correct.trim()) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');
  const sol = document.getElementById('sol-' + probId);
  if (sol) sol.classList.remove('hidden');
}

// ==========================================
// 6. FORMULA MEMORY LAB (3D FLASHCARDS)
// ==========================================
const FLASHCARDS = [
  { law: "Boyle's Law", formula: "P₁V₁ = P₂V₂", rule: "T and n are constant", tip: "Pressure up -> Volume down" },
  { law: "Charles's Law", formula: "V₁/T₁ = V₂/T₂", rule: "P and n are constant", tip: "Temp up -> Volume expands (Kelvin!)" },
  { law: "Gay-Lussac's Law", formula: "P₁/T₁ = P₂/T₂", rule: "V and n are constant", tip: "Rigid container: hotter gas = higher pressure" },
  { law: "Avogadro's Law", formula: "V₁/n₁ = V₂/n₂", rule: "P and T are constant", tip: "More gas moles = more volume occupied" },
  { law: "Combined Gas Law", formula: "P₁V₁/T₁ = P₂V₂/T₂", rule: "Only moles (n) constant", tip: "Use when P, V, and T all change simultaneously" },
  { law: "Ideal Gas Law", formula: "PV = nRT", rule: "R = 0.08206 L·atm/(mol·K)", tip: "Single state equation relating all 4 variables" }
];

function renderFlashcard() {
  const cardData = FLASHCARDS[flashcardIndex];
  const fc = document.getElementById('active-flashcard');
  if (!fc || !cardData) return;
  fc.classList.remove('flipped');
  document.getElementById('fc-front-title').innerText = cardData.law;
  document.getElementById('fc-front-sub').innerText = cardData.rule;
  document.getElementById('fc-back-formula').innerText = cardData.formula;
  document.getElementById('fc-back-tip').innerText = cardData.tip;
  document.getElementById('fc-counter').innerText = (flashcardIndex + 1) + ' of ' + FLASHCARDS.length;
}

function flipFlashcard() {
  const fc = document.getElementById('active-flashcard');
  if (fc) fc.classList.toggle('flipped');
}

function nextFlashcard(delta) {
  flashcardIndex = (flashcardIndex + delta + FLASHCARDS.length) % FLASHCARDS.length;
  renderFlashcard();
}

// ==========================================
// 7. REAL-LIFE SCENARIOS LAB
// ==========================================
function renderRealLifeScenarios() {
  const container = document.getElementById('reallife-scenarios-grid');
  if (!container) return;
  container.innerHTML = '';

  REAL_LIFE_SCENARIOS.forEach(sc => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = \`
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
        <span class="badge badge-cyan">\${sc.category}</span>
        <span style="font-size:24px;">\${sc.icon}</span>
      </div>
      <h3 style="font-size:16px; font-weight:bold; color:#fff; margin-bottom:8px;">\${sc.title}</h3>
      <p style="font-size:13px; color:#cbd5e1; margin-bottom:12px; line-height:1.6;">\${sc.situation}</p>
      <div style="background:#030712; padding:10px; border-radius:10px; border:1px solid #1e293b; margin-bottom:12px; font-size:12px;">
        <span style="color:var(--amber); font-weight:bold;">Governing Law: \${sc.governingLawName}</span>
        <div style="font-family:monospace; color:#fff; margin-top:2px;">\${sc.formulaLatex}</div>
      </div>
      <p style="font-size:12px; color:#94a3b8; line-height:1.5;">\${sc.explanation}</p>
    \`;
    container.appendChild(card);
  });
}

// ==========================================
// 8. CHEMISTRY LIBRARY & STUDENT NOTES
// ==========================================
let librarySearchTerm = '';

function searchLibrary(term) {
  librarySearchTerm = term.toLowerCase();
  renderLibrary();
}

function renderLibrary() {
  const container = document.getElementById('library-topics-grid');
  if (!container) return;
  container.innerHTML = '';

  const notesData = getStoredData(STORAGE_KEYS.NOTES, {});

  const filtered = CHEMISTRY_LIBRARY_TOPICS.filter(t => {
    if (!librarySearchTerm) return true;
    return t.title.toLowerCase().includes(librarySearchTerm) ||
      t.summary.toLowerCase().includes(librarySearchTerm) ||
      t.categoryLabel.toLowerCase().includes(librarySearchTerm);
  });

  filtered.forEach(topic => {
    const card = document.createElement('div');
    card.className = 'card';
    const note = notesData[topic.id] || '';

    card.innerHTML = \`
      <span class="badge badge-violet">\${topic.categoryLabel}</span>
      <h3 style="font-size:16px; font-weight:bold; color:#fff; margin:6px 0;">\${topic.title}</h3>
      <p style="font-size:13px; color:#cbd5e1; margin-bottom:10px;">\${topic.summary}</p>
      <ul style="padding-left:18px; font-size:12px; color:#94a3b8; margin-bottom:12px;">
        \${topic.keyPoints.slice(0, 3).map(pt => '<li style="margin-bottom:3px;">' + pt + '</li>').join('')}
      </ul>
      <div style="margin-top:10px; border-top:1px solid #1e293b; padding-top:10px;">
        <label style="font-size:11px; color:var(--amber); font-weight:bold;">Personal Note:</label>
        <textarea class="input-field" style="margin-top:4px; height:50px; font-size:12px;" onchange="saveTopicNote('\${topic.id}', this.value)" placeholder="Type your own notes here...">\${note}</textarea>
      </div>
    \`;
    container.appendChild(card);
  });
}

function saveTopicNote(id, text) {
  const notes = getStoredData(STORAGE_KEYS.NOTES, {});
  notes[id] = text;
  saveStoredData(STORAGE_KEYS.NOTES, notes);
}

// ==========================================
// 9. CONFUSION BUSTER DECISION WIZARD
// ==========================================
const busterState = { p: false, v: false, t: false, n: false };

function toggleBusterVar(key) {
  busterState[key] = !busterState[key];
  document.getElementById('cb-' + key).classList.toggle('active', busterState[key]);
  evaluateConfusionBuster();
}

function evaluateConfusionBuster() {
  const out = document.getElementById('cb-result');
  if (!out) return;
  const { p, v, t, n } = busterState;

  let law = null;
  let why = '';

  if (p && v && !t && !n) {
    law = GAS_LAWS_DATA['boyles-law'];
    why = "Pressure and Volume change while Temperature and Moles are kept constant.";
  } else if (v && t && !p && !n) {
    law = GAS_LAWS_DATA['charles-law'];
    why = "Volume and Temperature change while Pressure and Moles are held constant.";
  } else if (p && t && !v && !n) {
    law = GAS_LAWS_DATA['gay-lussac-law'];
    why = "Pressure and Temperature change inside a rigid container (Constant Volume).";
  } else if (v && n && !p && !t) {
    law = GAS_LAWS_DATA['avogadro-law'];
    why = "Volume and Moles change at constant Temperature and Pressure.";
  } else if (p && v && t && !n) {
    law = GAS_LAWS_DATA['combined-gas-law'];
    why = "P, V, and T all change simultaneously with constant amount of gas.";
  } else if (p && v && t && n) {
    law = GAS_LAWS_DATA['ideal-gas-law'];
    why = "All 4 state variables are involved. Use Ideal Gas Law (PV = nRT).";
  }

  if (law) {
    out.innerHTML = \`
      <div style="background:rgba(6,182,212,0.15); border:1px solid var(--cyan); padding:14px; border-radius:12px;">
        <span class="badge badge-cyan">RECOMMENDED LAW:</span>
        <h4 style="font-size:18px; font-weight:bold; color:#fff; margin:6px 0;">\${law.name}</h4>
        <div style="font-family:monospace; font-size:16px; color:var(--amber); font-weight:bold;">\${law.plainTextFormula}</div>
        <p style="font-size:13px; color:#cbd5e1; margin-top:6px;">\${why}</p>
        <button class="btn-accent" style="margin-top:10px;" onclick="closeModal('modal-confusion'); selectGasLaw('\${law.id}'); switchTab('gaslaws');">Open in Workbench</button>
      </div>
    \`;
  } else {
    out.innerHTML = '<div style="color:var(--text-muted); font-size:13px;">Select which variables are actively changing in your chemistry problem.</div>';
  }
}

// ==========================================
// 10. BACKUP / EXPORT / IMPORT
// ==========================================
function exportUserDataJson() {
  const data = {
    streak: getStoredData(STORAGE_KEYS.STREAK, {}),
    notes: getStoredData(STORAGE_KEYS.NOTES, {}),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'chem-navigator-progress-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importUserDataFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.streak) saveStoredData(STORAGE_KEYS.STREAK, data.streak);
      if (data.notes) saveStoredData(STORAGE_KEYS.NOTES, data.notes);
      alert('Data restored successfully!');
      renderDailyChallenge();
      renderLibrary();
    } catch (err) {
      alert('Invalid backup file.');
    }
  };
  reader.readAsText(file);
}

function renderProgressStats() {
  const streak = getStoredData(STORAGE_KEYS.STREAK, { currentStreak: 0, bestStreak: 0, totalCompleted: 0 });
  const notes = getStoredData(STORAGE_KEYS.NOTES, {});

  document.getElementById('prog-streak').innerText = streak.currentStreak;
  document.getElementById('prog-best').innerText = streak.bestStreak;
  document.getElementById('prog-total').innerText = streak.totalCompleted;
  document.getElementById('prog-notes-count').innerText = Object.keys(notes).length;
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  renderGasLawDetails();
  initGasLawSim();
  convertPressure();
  convertVolume();
  convertTemperature();
  calculateFormulaMolarMass();
  convertMolesSTP('moles');
});
`;
