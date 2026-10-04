export const OFFLINE_STYLES = `
  :root {
    --bg-dark: #030712;
    --card-bg: #0f172a;
    --card-bg-elevated: #1e293b;
    --card-border: #334155;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --cyan: #06b6d4;
    --cyan-glow: rgba(6, 182, 212, 0.25);
    --amber: #f59e0b;
    --emerald: #10b981;
    --rose: #f43f5e;
    --indigo: #6366f1;
    --violet: #8b5cf6;
    --pink: #ec4899;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg-dark);
    color: var(--text-main);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.5;
    min-height: 100vh;
  }
  header {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #1e293b;
    position: sticky;
    top: 0;
    z-index: 50;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--cyan), var(--indigo));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; box-shadow: 0 0 15px var(--cyan-glow);
  }
  .nav-bar { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
  .nav-btn {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid transparent;
    padding: 7px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; gap: 6px;
  }
  .nav-btn:hover { background: #1e293b; color: #fff; }
  .nav-btn.active {
    background: rgba(6, 182, 212, 0.15);
    border-color: rgba(6, 182, 212, 0.4);
    color: var(--cyan);
  }
  .btn-accent {
    background: linear-gradient(135deg, var(--cyan), #0284c7);
    color: #030712;
    border: none;
    padding: 7px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-accent:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .container { max-width: 1280px; margin: 0 auto; padding: 24px 16px 80px 16px; }
  .card {
    background: var(--card-bg);
    border: 1px solid #1e293b;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    position: relative;
    overflow: hidden;
  }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
  .badge {
    padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700;
    font-family: ui-monospace, monospace; display: inline-flex; align-items: center; gap: 4px;
  }
  .badge-cyan { background: rgba(6, 182, 212, 0.15); border: 1px solid var(--cyan); color: var(--cyan); }
  .badge-amber { background: rgba(245, 158, 11, 0.15); border: 1px solid var(--amber); color: var(--amber); }
  .badge-emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid var(--emerald); color: var(--emerald); }
  .badge-violet { background: rgba(139, 92, 246, 0.15); border: 1px solid var(--violet); color: var(--violet); }
  .input-field {
    width: 100%; background: #030712; border: 1px solid #334155;
    color: #fff; padding: 9px 12px; border-radius: 8px; font-size: 13px; font-family: inherit;
    outline: none; transition: border-color 0.2s;
  }
  .input-field:focus { border-color: var(--cyan); }
  .hidden { display: none !important; }
  /* Periodic Table Grid Styles */
  .periodic-table-wrapper { overflow-x: auto; padding-bottom: 12px; }
  .periodic-table-grid {
    display: grid; grid-template-columns: repeat(18, minmax(36px, 1fr)); gap: 3px; min-width: 780px;
  }
  .element-btn {
    aspect-ratio: 1; border-radius: 6px; border: 1px solid #334155;
    padding: 2px; display: flex; flex-direction: column; justify-content: space-between;
    align-items: center; cursor: pointer; transition: all 0.15s; background: #0b1120;
    color: #fff; text-decoration: none; user-select: none;
  }
  .element-btn:hover, .element-btn.selected {
    transform: scale(1.12); z-index: 10; border-color: #fff; box-shadow: 0 0 10px rgba(255,255,255,0.4);
  }
  .el-z { font-size: 8px; opacity: 0.75; font-family: monospace; }
  .el-symbol { font-size: 12px; font-weight: 900; }
  .el-metric { font-size: 7px; opacity: 0.9; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Simulation Canvas */
  .sim-canvas {
    background: #020617; border-radius: 12px; border: 1px solid #1e293b;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.8); display: block; width: 100%; max-width: 380px; height: 320px;
  }
  /* Flashcard 3D flip */
  .flashcard-scene { perspective: 800px; width: 100%; height: 200px; cursor: pointer; }
  .flashcard {
    width: 100%; height: 100%; position: relative; transition: transform 0.6s;
    transform-style: preserve-3d; border-radius: 14px;
  }
  .flashcard.flipped { transform: rotateY(180deg); }
  .flashcard-face {
    position: absolute; width: 100%; height: 100%; backface-visibility: hidden;
    border-radius: 14px; border: 1px solid #334155; padding: 20px;
    display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
  }
  .flashcard-front { background: #0f172a; }
  .flashcard-back { background: #1e293b; transform: rotateY(180deg); border-color: var(--cyan); }
  /* Modal Overlay */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(3, 7, 18, 0.85); backdrop-filter: blur(8px);
    z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .modal-box {
    background: #0f172a; border: 1px solid #334155; border-radius: 20px;
    max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; position: relative;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
  }
  .close-btn {
    position: absolute; top: 16px; right: 16px; background: transparent; border: none;
    color: var(--text-muted); font-size: 20px; cursor: pointer; border-radius: 8px; width: 32px; height: 32px;
  }
  .close-btn:hover { background: #1e293b; color: #fff; }
  /* Quiz options */
  .quiz-opt {
    width: 100%; text-align: left; padding: 12px 16px; background: #090d16;
    border: 1px solid #1e293b; border-radius: 10px; color: #fff; margin-bottom: 8px;
    cursor: pointer; transition: all 0.15s; font-size: 13px;
  }
  .quiz-opt:hover:not(:disabled) { border-color: var(--cyan); background: #0f172a; }
  .quiz-opt.correct { background: rgba(16, 185, 129, 0.2); border-color: var(--emerald); color: #6ee7b7; }
  .quiz-opt.wrong { background: rgba(244, 63, 94, 0.2); border-color: var(--rose); color: #fda4af; }
  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #030712; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }
`;
