export const OFFLINE_SCRIPTS = `
// ==========================================
// STATE MANAGEMENT & DATA STORAGE
// ==========================================
let currentTab = 'gaslaws';
let selectedLawId = 'boyles-law';
let selectedElementZ = 9; // Fluorine
let periodicMetricMode = 'category';
let compareElementAZ = 11; // Na
let compareElementBZ = 17; // Cl
let flashcardIndex = 0;

const STORAGE_KEYS = {
  STREAK: 'chem_navigator_daily_streak_v1',
  PROGRESS: 'chem_navigator_progress_v1',
  NOTES: 'chem_navigator_notes_v1'
};

function getStoredData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) { return fallback; }
}

function saveStoredData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
}

// ==========================================
// NAVIGATION SYSTEM
// ==========================================
function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
  const pane = document.getElementById('tab-' + tabId);
  if (pane) pane.classList.remove('hidden');
  
  const activeBtn = document.querySelector('[data-tab="' + tabId + '"]');
  if (activeBtn) activeBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabId === 'gaslaws') initGasLawSim();
  if (tabId === 'periodic') renderPeriodicGrid();
  if (tabId === 'daily') renderDailyChallenge();
  if (tabId === 'practice') renderPracticeQuestions();
  if (tabId === 'memory') renderFlashcard();
  if (tabId === 'reallife') renderRealLifeScenarios();
  if (tabId === 'library') renderLibrary();
  if (tabId === 'progress') renderProgressStats();
}

// Modal helper
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('hidden');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('hidden');
}

// ==========================================
// 1. GAS LAWS SIMULATION & WORKBENCH
// ==========================================
let simAnimationId = null;
const particles = [];
for (let i = 0; i < 40; i++) {
  particles.push({
    x: 30 + Math.random() * 240,
    y: 80 + Math.random() * 140,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    r: 3.5
  });
}

function selectGasLaw(id) {
  selectedLawId = id;
  renderGasLawDetails();
  initGasLawSim();
}

function renderGasLawDetails() {
  const law = GAS_LAWS_DATA[selectedLawId] || Object.values(GAS_LAWS_DATA)[0];
  document.querySelectorAll('.law-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.law === selectedLawId);
  });

  const header = document.getElementById('law-detail-header');
  if (header) {
    header.innerHTML = \`
      <div style="display:flex; justify-content:space-between; align-items:start; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
            <span class="badge badge-cyan">\${law.shortName}</span>
            <span style="font-size:12px; color:var(--text-muted);">\${law.scientistYears} • \${law.scientist}</span>
          </div>
          <h2 style="font-size:22px; font-weight:800; color:#fff;">\${law.name}</h2>
          <p style="font-size:13px; color:#cbd5e1; max-width:680px; margin-top:4px;">\${law.coreConcept}</p>
        </div>
        <div style="font-family:monospace; background:#020617; border:1px solid #1e293b; padding:8px 14px; border-radius:10px; color:var(--amber); font-size:16px; font-weight:bold;">
          \${law.plainTextFormula}
        </div>
      </div>
    \`;
  }

  // Update study panels
  const facts = document.getElementById('law-facts-grid');
  if (facts) {
    facts.innerHTML = \`
      <div class="card" style="background:#090d16;">
        <span class="badge badge-amber" style="margin-bottom:6px;">Changing Variables</span>
        <div style="font-size:14px; font-weight:bold; color:#fff;">\${law.changingVariables.join(' & ')}</div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Relationship: <strong>\${law.relationshipType.toUpperCase()}</strong></div>
      </div>
      <div class="card" style="background:#090d16;">
        <span class="badge badge-emerald" style="margin-bottom:6px;">Constants Held Rigid</span>
        <div style="font-size:14px; font-weight:bold; color:#fff;">\${law.constantVariables.join(', ')}</div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Must not fluctuate during test</div>
      </div>
      <div class="card" style="background:#090d16;">
        <span class="badge badge-violet" style="margin-bottom:6px;">Golden Unit Rules</span>
        <div style="font-size:12px; color:#cbd5e1;">\${law.unitRequirements.map(r => '<div>• ' + r + '</div>').join('')}</div>
      </div>
    \`;
  }
}

function initGasLawSim() {
  const canvas = document.getElementById('gas-sim-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (simAnimationId) cancelAnimationFrame(simAnimationId);

  const law = GAS_LAWS_DATA[selectedLawId] || Object.values(GAS_LAWS_DATA)[0];
  const pInput = document.getElementById('sim-slider-p');
  const tInput = document.getElementById('sim-slider-t');
  const nInput = document.getElementById('sim-slider-n');

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const P = pInput ? parseFloat(pInput.value) : 1.0;
    const T = tInput ? parseFloat(tInput.value) : 300;
    const n = nInput ? parseFloat(nInput.value) : 1.0;

    // Calculate volume based on law
    let V = 4.0;
    if (law.id === 'boyles-law') {
      V = (1.0 * 4.0) / P;
    } else if (law.id === 'charles-law') {
      V = (3.0 * T) / 300;
    } else if (law.id === 'gay-lussac-law') {
      V = 4.0; // rigid container!
    } else if (law.id === 'avogadro-law') {
      V = (2.0 * n) / 1.0;
    } else {
      V = (n * 0.08206 * T) / P;
    }
    V = Math.max(0.8, Math.min(8.0, V));

    // Update live readouts
    const vReadout = document.getElementById('sim-val-v');
    if (vReadout) vReadout.innerText = V.toFixed(2) + ' L';
    const pReadout = document.getElementById('sim-val-p');
    if (pReadout && pInput) pReadout.innerText = P.toFixed(2) + ' atm';
    const tReadout = document.getElementById('sim-val-t');
    if (tReadout && tInput) tReadout.innerText = T.toFixed(0) + ' K';

    // Dimensions
    const cx = 40;
    const cw = 260;
    const cBottom = 260;
    const maxH = 210;
    const cHeight = Math.max(40, Math.min(maxH, (V / 8.0) * maxH));
    const pistonY = cBottom - cHeight;

    // Chamber Cylinder Outline
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, 30);
    ctx.lineTo(cx, cBottom);
    ctx.lineTo(cx + cw, cBottom);
    ctx.lineTo(cx + cw, 30);
    ctx.stroke();

    // Tick marks
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    for (let l = 1; l <= 8; l++) {
      const ty = cBottom - (l / 8.0) * maxH;
      ctx.fillRect(cx - 5, ty, 5, 2);
      ctx.fillText(l + 'L', cx - 24, ty + 3);
    }

    // Movable Piston Head
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx + 2, pistonY - 12, cw - 4, 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cx + 4, pistonY - 3, cw - 8, 3);
    // Piston Rod
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx + cw / 2 - 8, 10, 16, pistonY - 20);

    // Speed multiplier depends on Temperature
    const speedMult = Math.sqrt(T / 300) * (law.id === 'boyles-law' ? (4 / V) * 0.5 : 1.0);

    // Particle active count depends on moles n
    const activeCount = Math.min(particles.length, Math.floor(n * 20));

    ctx.fillStyle = law.id === 'charles-law' && T > 350 ? '#f43f5e' : '#38bdf8';
    for (let i = 0; i < activeCount; i++) {
      const p = particles[i];
      p.x += p.vx * speedMult;
      p.y += p.vy * speedMult;

      if (p.x - p.r < cx + 4) { p.x = cx + 4 + p.r; p.vx *= -1; }
      if (p.x + p.r > cx + cw - 4) { p.x = cx + cw - 4 - p.r; p.vx *= -1; }
      if (p.y - p.r < pistonY) { p.y = pistonY + p.r; p.vy *= -1; }
      if (p.y + p.r > cBottom - 4) { p.y = cBottom - 4 - p.r; p.vy *= -1; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Burner flame if Charles or Gay-Lussac
    if ((law.id === 'charles-law' || law.id === 'gay-lussac-law') && tInput) {
      const flameH = (T - 150) / 20;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(cx + cw / 2 - 25, cBottom + 12);
      ctx.quadraticCurveTo(cx + cw / 2, cBottom + 12 - flameH, cx + cw / 2 + 25, cBottom + 12);
      ctx.fill();
    }

    simAnimationId = requestAnimationFrame(loop);
  }

  loop();
}

function checkSimPrediction(pred) {
  const res = document.getElementById('sim-pred-result');
  if (!res) return;
  res.classList.remove('hidden');
  const law = GAS_LAWS_DATA[selectedLawId];
  if (law.id === 'boyles-law') {
    if (pred === 'decrease') {
      res.innerHTML = '<span style="color:var(--emerald); font-weight:bold;">Correct!</span> Boyle\\'s Law proves that when Pressure increases, Volume must decrease inversely.';
    } else {
      res.innerHTML = '<span style="color:var(--rose); font-weight:bold;">Incorrect.</span> Boyle\\'s Law is an inverse relationship: higher pressure compresses gas into less volume.';
    }
  } else {
    if (pred === 'increase') {
      res.innerHTML = '<span style="color:var(--emerald); font-weight:bold;">Correct!</span> Direct relationship: when thermal energy increases, particles push boundaries outward.';
    } else {
      res.innerHTML = '<span style="color:var(--rose); font-weight:bold;">Incorrect.</span> Higher kinetic velocity increases collision push, expanding volume directly.';
    }
  }
}
`;
