import { GAS_LAWS_DATA } from '../data/gasLawsData';
import { CHEMISTRY_LIBRARY_TOPICS } from '../data/chemistryLibrary';
import { PRACTICE_PROBLEMS } from '../data/practiceProblems';
import { PERIODIC_ELEMENTS } from '../data/periodicTableData';
import { REAL_LIFE_SCENARIOS } from '../data/realLifeScenarios';
import { OFFLINE_STYLES } from './offlineStyles';
import { OFFLINE_SCRIPTS } from './offlineScripts';
import { OFFLINE_SCRIPTS_PART2 } from './offlineScriptsPart2';
import { OFFLINE_SCRIPTS_PART3 } from './offlineScriptsPart3';

/**
 * Generates a self-contained, standalone single-file HTML application
 * that matches the design, rich interactive simulations, periodic table,
 * daily challenge streaks, unit converter, and library of the Chem-Navigator website.
 */
export function generateStandaloneOfflineHtml(): string {
  const serializedGasLaws = JSON.stringify(GAS_LAWS_DATA);
  const serializedPractice = JSON.stringify(PRACTICE_PROBLEMS);
  const serializedTopics = JSON.stringify(CHEMISTRY_LIBRARY_TOPICS);
  const serializedElements = JSON.stringify(PERIODIC_ELEMENTS);
  const serializedScenarios = JSON.stringify(REAL_LIFE_SCENARIOS);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GL-LAB | Gas Law Laboratory</title>
  <style>
${OFFLINE_STYLES}
  </style>
</head>
<body>
  <!-- HEADER -->
  <header>
    <div class="brand">
      <div class="brand-icon">⚗️</div>
      <div>
        <h1 style="font-size:16px; font-weight:800; letter-spacing:0.5px; color:#fff;">GL-LAB</h1>
        <p style="font-size:11px; color:var(--text-muted);">Gas Law Laboratory</p>
      </div>
      <span class="badge badge-cyan">100% OFFLINE</span>
    </div>

    <!-- Navigation Bar -->
    <nav class="nav-bar">
      <button class="nav-btn active" data-tab="gaslaws" onclick="switchTab('gaslaws')">📘 6 Gas Laws</button>
      <button class="nav-btn" data-tab="periodic" onclick="switchTab('periodic')">⚛️ Periodic Trends (1-118)</button>
      <button class="nav-btn" data-tab="daily" onclick="switchTab('daily')">🔥 Daily Challenge</button>
      <button class="nav-btn" data-tab="units" onclick="switchTab('units')">⚖️ Units &amp; Moles</button>
      <button class="nav-btn" data-tab="practice" onclick="switchTab('practice')">📝 Practice</button>
      <button class="nav-btn" data-tab="memory" onclick="switchTab('memory')">🧠 Memory Lab</button>
      <button class="nav-btn" data-tab="reallife" onclick="switchTab('reallife')">🌍 Real-Life</button>
      <button class="nav-btn" data-tab="library" onclick="switchTab('library')">🏛️ Library</button>
      <button class="nav-btn" data-tab="progress" onclick="switchTab('progress')">📊 Progress</button>
    </nav>

    <!-- Top Action Tools -->
    <div style="display:flex; align-items:center; gap:8px;">
      <button class="btn-accent" onclick="openModal('modal-confusion')">🧭 Help Me Choose Law</button>
      <button class="btn-accent" style="background:#1e293b; color:#fff;" onclick="exportUserDataJson()">💾 Backup</button>
    </div>
  </header>

  <div class="container">
    <!-- ========================================== -->
    <!-- TAB 1: 6 GAS LAWS INTERACTIVE WORKBENCH -->
    <!-- ========================================== -->
    <div id="tab-gaslaws" class="tab-pane">
      <!-- Gas Law Selector Pills -->
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:10px; margin-bottom:16px;">
        <button class="nav-btn law-tab-btn active" data-law="boyles-law" onclick="selectGasLaw('boyles-law')">Boyle's Law (P-V)</button>
        <button class="nav-btn law-tab-btn" data-law="charles-law" onclick="selectGasLaw('charles-law')">Charles's Law (V-T)</button>
        <button class="nav-btn law-tab-btn" data-law="gay-lussac-law" onclick="selectGasLaw('gay-lussac-law')">Gay-Lussac's (P-T)</button>
        <button class="nav-btn law-tab-btn" data-law="avogadro-law" onclick="selectGasLaw('avogadro-law')">Avogadro's (V-n)</button>
        <button class="nav-btn law-tab-btn" data-law="combined-gas-law" onclick="selectGasLaw('combined-gas-law')">Combined Gas Law</button>
        <button class="nav-btn law-tab-btn" data-law="ideal-gas-law" onclick="selectGasLaw('ideal-gas-law')">Ideal Gas (PV=nRT)</button>
      </div>

      <!-- Law Detail Header -->
      <div class="card" id="law-detail-header" style="margin-bottom:16px; border-left:4px solid var(--cyan);"></div>

      <!-- Main Workbench Grid -->
      <div class="grid-2">
        <!-- Interactive Canvas & Controls -->
        <div class="card">
          <div class="card-header">
            <div>
              <span class="badge badge-cyan">SIMULATION CHAMBER</span>
              <h3 style="font-size:16px; font-weight:bold; color:#fff; margin-top:4px;">Particle Kinetic Workbench</h3>
            </div>
            <div style="font-size:12px; font-family:monospace; color:var(--cyan);">
              Vol: <strong id="sim-val-v" style="color:#fff;">4.00 L</strong>
            </div>
          </div>

          <div style="display:flex; justify-content:center; margin-bottom:14px;">
            <canvas id="gas-sim-canvas" width="340" height="280" class="sim-canvas"></canvas>
          </div>

          <!-- Variable Sliders -->
          <div style="space-y:10px;">
            <div style="margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <label>Pressure (P):</label>
                <span id="sim-val-p" style="color:var(--cyan); font-family:monospace;">1.00 atm</span>
              </div>
              <input type="range" id="sim-slider-p" min="0.5" max="4.0" step="0.1" value="1.0" class="input-field" style="padding:0; accent-color:var(--cyan);">
            </div>

            <div style="margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <label>Temperature (T):</label>
                <span id="sim-val-t" style="color:var(--amber); font-family:monospace;">300 K</span>
              </div>
              <input type="range" id="sim-slider-t" min="150" max="600" step="10" value="300" class="input-field" style="padding:0; accent-color:var(--amber);">
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <label>Gas Amount (n):</label>
                <span id="sim-val-n-txt" style="color:var(--emerald); font-family:monospace;">1.00 mol</span>
              </div>
              <input type="range" id="sim-slider-n" min="0.5" max="2.0" step="0.1" value="1.0" class="input-field" style="padding:0; accent-color:var(--emerald);" oninput="document.getElementById('sim-val-n-txt').innerText = this.value + ' mol';">
            </div>
          </div>

          <!-- Prediction Challenge -->
          <div style="margin-top:16px; padding-top:14px; border-top:1px solid #1e293b;">
            <div style="font-size:12px; font-weight:bold; color:var(--amber); margin-bottom:6px;">
              Quick Challenge: If we double the pressure, what happens to volume?
            </div>
            <div style="display:flex; gap:8px;">
              <button class="nav-btn" style="background:#1e293b; color:#fff;" onclick="checkSimPrediction('increase')">Increases</button>
              <button class="nav-btn" style="background:#1e293b; color:#fff;" onclick="checkSimPrediction('decrease')">Decreases</button>
              <button class="nav-btn" style="background:#1e293b; color:#fff;" onclick="checkSimPrediction('same')">Stays Same</button>
            </div>
            <div id="sim-pred-result" class="hidden" style="margin-top:8px; font-size:12px; padding:8px; background:#030712; border-radius:8px;"></div>
          </div>
        </div>

        <!-- Facts, Formulas & Rearrangements -->
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div id="law-facts-grid" style="display:flex; flex-direction:column; gap:12px;"></div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: COMPLETE 118-ELEMENT PERIODIC TABLE -->
    <!-- ========================================== -->
    <div id="tab-periodic" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--indigo); margin-bottom:16px;">
        <div class="card-header">
          <div>
            <span class="badge badge-violet">ALL 118 CONFIRMED ELEMENTS (1-118)</span>
            <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Interactive Periodic Trends Explorer</h2>
            <p style="font-size:13px; color:#cbd5e1;">Click any element to inspect its quantum orbitals, atomic mass, radius, and electronegativity.</p>
          </div>
          <!-- Color scale modes -->
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="nav-btn metric-pill active" data-metric="category" onclick="setPeriodicMetric('category')">Category</button>
            <button class="nav-btn metric-pill" data-metric="block" onclick="setPeriodicMetric('block')">s/p/d/f Block</button>
            <button class="nav-btn metric-pill" data-metric="radius" onclick="setPeriodicMetric('radius')">Atomic Radius</button>
            <button class="nav-btn metric-pill" data-metric="en" onclick="setPeriodicMetric('en')">Electronegativity</button>
            <button class="nav-btn metric-pill" data-metric="ie" onclick="setPeriodicMetric('ie')">1st Ionization</button>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:2fr 1fr; gap:16px; align-items:start;">
        <!-- Periodic Grid Container -->
        <div class="card" style="padding:14px;">
          <div class="periodic-table-wrapper">
            <div id="periodic-grid-table" class="periodic-table-grid"></div>
            <!-- Lanthanides & Actinides -->
            <div id="periodic-f-block" style="margin-top:14px; padding-top:10px; border-top:1px solid #1e293b;"></div>
          </div>
        </div>

        <!-- Selected Element Inspector & Comparison Tool -->
        <div style="display:flex; flex-direction:column; gap:16px; position:sticky; top:80px;">
          <div class="card" id="element-inspector"></div>

          <!-- Comparison Tool -->
          <div class="card">
            <span class="badge badge-amber" style="margin-bottom:8px;">SIDE-BY-SIDE COMPARATOR</span>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
              <div>
                <label style="font-size:11px; color:var(--text-muted);">Element A:</label>
                <select id="compare-sel-a" class="input-field" style="margin-top:2px;" onchange="updateComparison()"></select>
              </div>
              <div>
                <label style="font-size:11px; color:var(--text-muted);">Element B:</label>
                <select id="compare-sel-b" class="input-field" style="margin-top:2px;" onchange="updateComparison()"></select>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <div id="compare-card-a" style="background:#030712; padding:10px; border-radius:8px; border:1px solid #1e293b;"></div>
              <div id="compare-card-b" style="background:#030712; padding:10px; border-radius:8px; border:1px solid #1e293b;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 3: DAILY CHEMISTRY CHALLENGE -->
    <!-- ========================================== -->
    <div id="tab-daily" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--amber); margin-bottom:16px;">
        <div class="card-header">
          <div>
            <span class="badge badge-amber">DAILY PRACTICE &amp; STREAK TRACKER</span>
            <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Daily Chemistry Challenge</h2>
            <p style="font-size:13px; color:#cbd5e1;">A new question every day to build long-term retention. Streaks save locally in your browser!</p>
          </div>
          <div style="display:flex; gap:12px;">
            <div style="text-align:center; background:#030712; border:1px solid #1e293b; padding:8px 14px; border-radius:10px;">
              <div style="font-size:18px; font-weight:bold; color:var(--amber);">🔥 <span id="daily-streak-val">0</span></div>
              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Day Streak</div>
            </div>
            <div style="text-align:center; background:#030712; border:1px solid #1e293b; padding:8px 14px; border-radius:10px;">
              <div style="font-size:18px; font-weight:bold; color:var(--cyan);">🏆 <span id="daily-best-val">0</span></div>
              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Best Streak</div>
            </div>
            <div style="text-align:center; background:#030712; border:1px solid #1e293b; padding:8px 14px; border-radius:10px;">
              <div style="font-size:18px; font-weight:bold; color:var(--emerald);">✓ <span id="daily-total-val">0</span></div>
              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Total Solved</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card" id="daily-question-card" style="max-width:800px; margin:0 auto;"></div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 4: UNIVERSAL UNITS & MOLES LAB -->
    <!-- ========================================== -->
    <div id="tab-units" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--emerald); margin-bottom:16px;">
        <span class="badge badge-emerald">OFFLINE CALCULATION ENGINE</span>
        <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Universal Unit Converter &amp; Moles Hub</h2>
        <p style="font-size:13px; color:#cbd5e1;">Multi-unit conversions for gas laws, formula molar masses, and STP stoichiometry.</p>
      </div>

      <!-- Converters 3-col grid -->
      <div class="grid-3" style="margin-bottom:20px;">
        <!-- Pressure -->
        <div class="card">
          <h3 style="font-size:15px; font-weight:bold; color:#fff; margin-bottom:8px;">Pressure Converter</h3>
          <div style="display:flex; gap:6px; margin-bottom:8px;">
            <input type="number" id="p-conv-val" value="1.0" class="input-field" oninput="convertPressure()">
            <select id="p-conv-unit" class="input-field" style="width:110px;" onchange="convertPressure()">
              <option value="atm">atm</option>
              <option value="kPa">kPa</option>
              <option value="mmHg">mmHg</option>
              <option value="bar">bar</option>
              <option value="psi">psi</option>
            </select>
          </div>
          <div id="p-conv-output" style="font-size:12px; font-family:monospace; line-height:1.8; color:#cbd5e1;"></div>
        </div>

        <!-- Volume -->
        <div class="card">
          <h3 style="font-size:15px; font-weight:bold; color:#fff; margin-bottom:8px;">Volume Converter</h3>
          <div style="display:flex; gap:6px; margin-bottom:8px;">
            <input type="number" id="v-conv-val" value="2.5" class="input-field" oninput="convertVolume()">
            <select id="v-conv-unit" class="input-field" style="width:110px;" onchange="convertVolume()">
              <option value="L">Liters (L)</option>
              <option value="mL">mL (cm³)</option>
              <option value="m3">m³</option>
              <option value="dL">dL</option>
            </select>
          </div>
          <div id="v-conv-output" style="font-size:12px; font-family:monospace; line-height:1.8; color:#cbd5e1;"></div>
        </div>

        <!-- Temperature -->
        <div class="card">
          <h3 style="font-size:15px; font-weight:bold; color:#fff; margin-bottom:8px;">Temperature Converter</h3>
          <div style="display:flex; gap:6px; margin-bottom:8px;">
            <input type="number" id="t-conv-val" value="25" class="input-field" oninput="convertTemperature()">
            <select id="t-conv-unit" class="input-field" style="width:110px;" onchange="convertTemperature()">
              <option value="C">°C</option>
              <option value="K">Kelvin (K)</option>
              <option value="F">°F</option>
            </select>
          </div>
          <div id="t-conv-output" style="font-size:12px; font-family:monospace; line-height:1.8; color:#cbd5e1;"></div>
        </div>
      </div>

      <!-- Molar Mass & STP Grid -->
      <div class="grid-2">
        <!-- Chemical Formula Molar Mass Calculator -->
        <div class="card">
          <span class="badge badge-violet">CHEMICAL FORMULA PARSER</span>
          <h3 style="font-size:16px; font-weight:bold; color:#fff; margin:6px 0;">Molar Mass &amp; Molecular Weight</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">Supports parentheses e.g. Ca(OH)2, (NH4)2SO4, C6H12O6</p>
          <div style="display:flex; gap:8px;">
            <input type="text" id="formula-input" value="Ca(OH)2" class="input-field" placeholder="e.g. (NH4)2SO4" oninput="calculateFormulaMolarMass()">
            <button class="btn-accent" onclick="calculateFormulaMolarMass()">Calculate</button>
          </div>
          <div id="formula-output"></div>
        </div>

        <!-- STP Mass / Moles / Particles / Volume -->
        <div class="card">
          <span class="badge badge-cyan">STP MOLE CALCULATOR</span>
          <h3 style="font-size:16px; font-weight:bold; color:#fff; margin:6px 0;">Mass ⇄ Moles ⇄ Particles ⇄ Volume at STP</h3>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">Standard Molar Volume = 22.414 L/mol • Avogadro = 6.022 × 10²³</p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12px;">
            <div>
              <label>Molar Mass (g/mol):</label>
              <input type="number" id="stp-molar-mass" value="18.015" class="input-field" oninput="convertMolesSTP('moles')">
            </div>
            <div>
              <label>Moles (mol):</label>
              <input type="number" id="stp-moles" value="1.0" class="input-field" oninput="convertMolesSTP('moles')">
            </div>
            <div>
              <label>Mass (grams):</label>
              <input type="number" id="stp-mass" value="18.02" class="input-field" oninput="convertMolesSTP('mass')">
            </div>
            <div>
              <label>Gas Volume at STP (L):</label>
              <input type="number" id="stp-vol" value="22.414" class="input-field" oninput="convertMolesSTP('volume')">
            </div>
            <div style="grid-column:span 2;">
              <label>Particles (molecules / atoms):</label>
              <input type="text" id="stp-particles" value="6.022e+23" class="input-field" readonly style="opacity:0.8;">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 5: PRACTICE QUIZ CENTER -->
    <!-- ========================================== -->
    <div id="tab-practice" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--cyan); margin-bottom:16px;">
        <div class="card-header">
          <div>
            <span class="badge badge-cyan">OFFLINE PRACTICE PROBLEMS</span>
            <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Practice &amp; Diagnostic Quizzes</h2>
            <p style="font-size:13px; color:#cbd5e1;">Test your understanding with immediate feedback, hints, and step-by-step derivations.</p>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="nav-btn filter-pill active" data-filter="all" onclick="filterPractice('all')">All Questions</button>
            <button class="nav-btn filter-pill" data-filter="boyles-law" onclick="filterPractice('boyles-law')">Boyle</button>
            <button class="nav-btn filter-pill" data-filter="charles-law" onclick="filterPractice('charles-law')">Charles</button>
            <button class="nav-btn filter-pill" data-filter="gay-lussac-law" onclick="filterPractice('gay-lussac-law')">Gay-Lussac</button>
            <button class="nav-btn filter-pill" data-filter="ideal-gas-law" onclick="filterPractice('ideal-gas-law')">Ideal Gas</button>
          </div>
        </div>
      </div>

      <div id="practice-list-container"></div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 6: FORMULA MEMORY LAB (3D FLASHCARDS) -->
    <!-- ========================================== -->
    <div id="tab-memory" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--violet); margin-bottom:16px; text-align:center;">
        <span class="badge badge-violet">SPACED REPETITION FLASHCARDS</span>
        <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Gas Law Formula Memory Lab</h2>
        <p style="font-size:13px; color:#cbd5e1;">Click the card to flip between law names, formulas, and constant variable conditions.</p>
      </div>

      <div style="max-width:540px; margin:0 auto;">
        <div class="flashcard-scene" onclick="flipFlashcard()">
          <div class="flashcard" id="active-flashcard">
            <div class="flashcard-face flashcard-front">
              <span class="badge badge-cyan" style="margin-bottom:12px;">CLICK TO FLIP</span>
              <h3 id="fc-front-title" style="font-size:24px; font-weight:bold; color:#fff;">Boyle's Law</h3>
              <p id="fc-front-sub" style="font-size:14px; color:var(--text-muted); margin-top:6px;">T and n are held constant</p>
            </div>
            <div class="flashcard-face flashcard-back">
              <div id="fc-back-formula" style="font-size:26px; font-weight:900; color:var(--amber); font-family:monospace;">P₁V₁ = P₂V₂</div>
              <p id="fc-back-tip" style="font-size:13px; color:#cbd5e1; margin-top:10px;">Pressure increases when Volume decreases inversely.</p>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
          <button class="nav-btn" style="background:#1e293b; color:#fff;" onclick="nextFlashcard(-1)">← Previous</button>
          <span id="fc-counter" style="font-size:12px; color:var(--text-muted); font-family:monospace;">1 of 6</span>
          <button class="nav-btn" style="background:#1e293b; color:#fff;" onclick="nextFlashcard(1)">Next →</button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 7: REAL-LIFE SCENARIOS LAB -->
    <!-- ========================================== -->
    <div id="tab-reallife" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--amber); margin-bottom:16px;">
        <span class="badge badge-amber">APPLIED SCIENCE</span>
        <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Real-Life Chemistry Scenarios</h2>
        <p style="font-size:13px; color:#cbd5e1;">Explore how gas laws govern deep sea scuba diving, automobile tire friction, hot air balloons, and lungs.</p>
      </div>

      <div id="reallife-scenarios-grid" class="grid-2"></div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 8: INORGANIC CHEMISTRY LIBRARY -->
    <!-- ========================================== -->
    <div id="tab-library" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--indigo); margin-bottom:16px;">
        <div class="card-header">
          <div>
            <span class="badge badge-violet">CURATED TOPIC SHELVES</span>
            <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Chemistry Reference Library</h2>
            <p style="font-size:13px; color:#cbd5e1;">Three comprehensive shelves: Gas Laws, Periodic Trends, and Stoichiometry &amp; Solutions.</p>
          </div>
          <div style="width:260px;">
            <input type="text" placeholder="Search topics (e.g. Kelvin, Boyle, STP)..." class="input-field" oninput="searchLibrary(this.value)">
          </div>
        </div>
      </div>

      <div id="library-topics-grid" class="grid-2"></div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 9: STUDENT PROGRESS & STATS -->
    <!-- ========================================== -->
    <div id="tab-progress" class="tab-pane hidden">
      <div class="card" style="border-left:4px solid var(--cyan); margin-bottom:16px;">
        <span class="badge badge-cyan">BROWSER LOCAL STORAGE</span>
        <h2 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Your Offline Learning Dashboard</h2>
        <p style="font-size:13px; color:#cbd5e1;">All study history, streaks, and personal notes stay in your browser without tracking or accounts.</p>
      </div>

      <div class="grid-4" style="margin-bottom:20px;">
        <div class="card" style="text-align:center;">
          <div style="font-size:26px; font-weight:bold; color:var(--amber);">🔥 <span id="prog-streak">0</span></div>
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Current Day Streak</div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-size:26px; font-weight:bold; color:var(--cyan);">🏆 <span id="prog-best">0</span></div>
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Best Day Streak</div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-size:26px; font-weight:bold; color:var(--emerald);">✓ <span id="prog-total">0</span></div>
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Daily Challenges Solved</div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-size:26px; font-weight:bold; color:var(--violet);">📝 <span id="prog-notes-count">0</span></div>
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Personal Topic Notes</div>
        </div>
      </div>

      <div class="card">
        <h3 style="font-size:16px; font-weight:bold; color:#fff; margin-bottom:8px;">Backup &amp; Restore Your Data</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Export your streaks and notes to a .json file so you can transfer your progress to any device.</p>
        <div style="display:flex; gap:10px;">
          <button class="btn-accent" onclick="exportUserDataJson()">Export Data (.json)</button>
          <label class="btn-accent" style="background:#1e293b; color:#fff; cursor:pointer;">
            Import Data (.json)
            <input type="file" accept=".json" style="display:none;" onchange="importUserDataFile(this.files[0])">
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- OFFLINE FOOTER NOTE (Requirement 10) -->
  <footer style="margin-top:40px; padding:20px; border-top:1px solid #1e293b; text-align:center; font-size:12px; color:var(--text-muted);">
    <div style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:9999px; background:#0f172a; border:1px solid #1e293b;">
      <span style="color:var(--emerald); font-weight:bold;">● Works offline – no internet required.</span>
      <span style="opacity:0.6;">|</span>
      <span>Double-click to open in any web browser (file:// protocol)</span>
    </div>
  </footer>

  <!-- MODAL: CONFUSION BUSTER -->
  <div id="modal-confusion" class="modal-overlay hidden">
    <div class="modal-box">
      <button class="close-btn" onclick="closeModal('modal-confusion')">✕</button>
      <span class="badge badge-cyan" style="margin-bottom:8px;">DECISION TREE WIZARD</span>
      <h3 style="font-size:20px; font-weight:bold; color:#fff; margin-bottom:6px;">Help Me Choose the Right Gas Law</h3>
      <p style="font-size:13px; color:#cbd5e1; margin-bottom:16px;">Click which variables are actively changing in your chemistry problem:</p>

      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:16px;">
        <button id="cb-p" class="nav-btn" style="background:#090d16; border:1px solid #1e293b; justify-content:center;" onclick="toggleBusterVar('p')">Pressure (P)</button>
        <button id="cb-v" class="nav-btn" style="background:#090d16; border:1px solid #1e293b; justify-content:center;" onclick="toggleBusterVar('v')">Volume (V)</button>
        <button id="cb-t" class="nav-btn" style="background:#090d16; border:1px solid #1e293b; justify-content:center;" onclick="toggleBusterVar('t')">Temperature (T)</button>
        <button id="cb-n" class="nav-btn" style="background:#090d16; border:1px solid #1e293b; justify-content:center;" onclick="toggleBusterVar('n')">Moles (n)</button>
      </div>

      <div id="cb-result" style="margin-top:14px;"></div>
    </div>
  </div>

  <!-- EMBEDDED COMPLETE DATASETS -->
  <script>
    const GAS_LAWS_DATA = ${serializedGasLaws};
    const PRACTICE_PROBLEMS = ${serializedPractice};
    const CHEMISTRY_LIBRARY_TOPICS = ${serializedTopics};
    const PERIODIC_ELEMENTS = ${serializedElements};
    const REAL_LIFE_SCENARIOS = ${serializedScenarios};
  </script>

  <!-- JAVASCRIPT LOGIC -->
  <script>
${OFFLINE_SCRIPTS}
${OFFLINE_SCRIPTS_PART2}
${OFFLINE_SCRIPTS_PART3}
  </script>
</body>
</html>`;
}

/**
 * Initiates the client-side file download for the standalone offline HTML file
 */
export function downloadOfflineAppFile(): void {
  const htmlContent = generateStandaloneOfflineHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GL-LAB.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
