import React, { useState, useMemo } from 'react';
import {
  calculateMolarMass,
  MolarMassResult,
  PRESSURE_FACTORS,
  VOLUME_FACTORS,
  convertPressure,
  convertVolume,
  convertTemperature,
  AVOGADRO_CONSTANT,
  STP_MOLAR_VOLUME,
  RTP_MOLAR_VOLUME
} from '../utils/molesCalculator';
import { MathView } from './MathView';
import { GasLawId } from '../types/chemistry';
import {
  Scale,
  Thermometer,
  Gauge,
  Box,
  Sparkles,
  ArrowRightLeft,
  Calculator,
  Beaker,
  AlertTriangle,
  Info,
  Check,
  Copy,
  ChevronRight,
  FlaskRound
} from 'lucide-react';

interface UnitConverterAndMolesLabProps {
  onOpenGasLaw?: (lawId: GasLawId) => void;
}

type TabType = 'converter' | 'molarmass' | 'molecalc' | 'molarity';

export const UnitConverterAndMolesLab: React.FC<UnitConverterAndMolesLabProps> = ({
  onOpenGasLaw
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('converter');

  // ==========================================
  // TAB 1: UNIT CONVERTER STATE
  // ==========================================
  // Pressure
  const [pressureVal, setPressureVal] = useState<number>(1);
  const [pressureUnit, setPressureUnit] = useState<string>('atm');

  // Volume
  const [volumeVal, setVolumeVal] = useState<number>(1);
  const [volumeUnit, setVolumeUnit] = useState<string>('L');

  // Temperature
  const [tempVal, setTempVal] = useState<number>(25);
  const [tempUnit, setTempUnit] = useState<'C' | 'K' | 'F'>('C');

  // ==========================================
  // TAB 2: MOLAR MASS STATE
  // ==========================================
  const [formulaInput, setFormulaInput] = useState<string>('H2O');
  const molarMassResult: MolarMassResult = useMemo(() => {
    return calculateMolarMass(formulaInput);
  }, [formulaInput]);

  const commonFormulas = [
    { label: 'Water (H₂O)', formula: 'H2O' },
    { label: 'Carbon Dioxide (CO₂)', formula: 'CO2' },
    { label: 'Methane (CH₄)', formula: 'CH4' },
    { label: 'Oxygen Gas (O₂)', formula: 'O2' },
    { label: 'Nitrogen Gas (N₂)', formula: 'N2' },
    { label: 'Ammonia (NH₃)', formula: 'NH3' },
    { label: 'Table Salt (NaCl)', formula: 'NaCl' },
    { label: 'Glucose (C₆H₁₂O₆)', formula: 'C6H12O6' },
    { label: 'Sulfuric Acid (H₂SO₄)', formula: 'H2SO4' },
    { label: 'Calcium Carbonate (CaCO₃)', formula: 'CaCO3' },
    { label: 'Helium Gas (He)', formula: 'He' },
    { label: 'Ethanol (C₂H₅OH)', formula: 'C2H5OH' }
  ];

  // ==========================================
  // TAB 3: MASS <-> MOLES <-> PARTICLES STATE
  // ==========================================
  const [calcSubstanceFormula, setCalcSubstanceFormula] = useState<string>('O2');
  const [inputMode, setInputMode] = useState<'mass' | 'moles' | 'particles' | 'stp_volume'>('mass');
  const [inputValue, setInputValue] = useState<number>(32);

  const substanceMolarMass = useMemo(() => {
    const res = calculateMolarMass(calcSubstanceFormula);
    return res.isValid ? res.totalMolarMass : 32.0;
  }, [calcSubstanceFormula]);

  // Derived quantities from inputMode
  const moleCalculations = useMemo(() => {
    let moles = 0;
    const M = substanceMolarMass > 0 ? substanceMolarMass : 1;

    if (inputMode === 'mass') {
      moles = inputValue / M;
    } else if (inputMode === 'moles') {
      moles = inputValue;
    } else if (inputMode === 'particles') {
      moles = inputValue / AVOGADRO_CONSTANT;
    } else if (inputMode === 'stp_volume') {
      moles = inputValue / STP_MOLAR_VOLUME;
    }

    const mass = moles * M;
    const particles = moles * AVOGADRO_CONSTANT;
    const volumeSTP = moles * STP_MOLAR_VOLUME;
    const volumeRTP = moles * RTP_MOLAR_VOLUME;

    return {
      moles: isNaN(moles) ? 0 : moles,
      mass: isNaN(mass) ? 0 : mass,
      particles: isNaN(particles) ? 0 : particles,
      volumeSTP: isNaN(volumeSTP) ? 0 : volumeSTP,
      volumeRTP: isNaN(volumeRTP) ? 0 : volumeRTP
    };
  }, [inputMode, inputValue, substanceMolarMass]);

  // ==========================================
  // TAB 4: MOLARITY & DILUTION STATE
  // ==========================================
  const [molaritySoluteMoles, setMolaritySoluteMoles] = useState<number>(0.5);
  const [molaritySolutionLiters, setMolaritySolutionLiters] = useState<number>(1.0);

  // Dilution M1 * V1 = M2 * V2
  const [dilutionSolveTarget, setDilutionSolveTarget] = useState<'M1' | 'V1' | 'M2' | 'V2'>('V1');
  const [dilutionM1, setDilutionM1] = useState<number>(6.0); // Stock 6 M
  const [dilutionV1, setDilutionV1] = useState<number>(0.05); // L
  const [dilutionM2, setDilutionM2] = useState<number>(0.5); // Target 0.5 M
  const [dilutionV2, setDilutionV2] = useState<number>(0.6); // Target 600 mL

  const dilutionSolvedValue = useMemo(() => {
    if (dilutionSolveTarget === 'V1') {
      return (dilutionM2 * dilutionV2) / (dilutionM1 || 1);
    } else if (dilutionSolveTarget === 'M1') {
      return (dilutionM2 * dilutionV2) / (dilutionV1 || 1);
    } else if (dilutionSolveTarget === 'M2') {
      return (dilutionM1 * dilutionV1) / (dilutionV2 || 1);
    } else {
      return (dilutionM1 * dilutionV1) / (dilutionM2 || 1);
    }
  }, [dilutionSolveTarget, dilutionM1, dilutionV1, dilutionM2, dilutionV2]);

  // Copy helper
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                <Scale className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  Gas Law Units &amp; Moles Calculation Laboratory
                </h2>
                <p className="text-xs text-slate-400">
                  Universal unit conversions, chemical formula molar mass analyzer, mole-particle bridges, and dilution solvers.
                </p>
              </div>
            </div>
          </div>

          {onOpenGasLaw && (
            <button
              onClick={() => onOpenGasLaw('ideal-gas-law')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer self-start md:self-auto shrink-0"
            >
              <span>Apply in Ideal Gas Law (PV=nRT)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'converter'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Gas Law Unit Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('molarmass')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'molarmass'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" />
            <span>Molar Mass &amp; Formula Weight</span>
          </button>

          <button
            onClick={() => setActiveTab('molecalc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'molecalc'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Mass ⇄ Moles ⇄ Particles</span>
          </button>

          <button
            onClick={() => setActiveTab('molarity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'molarity'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FlaskRound className="w-3.5 h-3.5" />
            <span>Molarity &amp; Dilutions</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GAS LAW UNIT CONVERTER */}
      {/* ========================================================================= */}
      {activeTab === 'converter' && (
        <div className="space-y-6">
          {/* Critical Kelvin Rule Banner */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3 text-amber-200 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="text-amber-300 text-sm block font-black uppercase tracking-wider">
                Golden Rule: Always Use Absolute Temperature (Kelvin) in Gas Laws!
              </strong>
              <p className="text-amber-200/90 leading-relaxed">
                Plugging Celsius or Fahrenheit directly into gas law equations (PV = nRT, Charles's, Gay-Lussac's, Combined) will produce completely incorrect numbers because Celsius has an arbitrary zero. Absolute zero is 0 K = -273.15°C. Always convert: <code className="bg-amber-900/60 px-2 py-0.5 rounded font-mono font-bold text-white">K = °C + 273.15</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pressure Converter Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Pressure (P)
                  </h3>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  Standard: 1 atm
                </span>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-medium">Enter Value &amp; Source Unit:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={pressureVal}
                    onChange={e => setPressureVal(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <select
                    value={pressureUnit}
                    onChange={e => setPressureUnit(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none cursor-pointer font-bold"
                  >
                    <option value="atm">atm</option>
                    <option value="kPa">kPa</option>
                    <option value="mmHg">mmHg / torr</option>
                    <option value="bar">bar</option>
                    <option value="psi">psi</option>
                    <option value="Pa">Pa</option>
                  </select>
                </div>
              </div>

              {/* Converted Outputs Grid */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Converted Equivalents:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { u: 'atm', label: 'atmospheres' },
                    { u: 'kPa', label: 'kilopascals' },
                    { u: 'mmHg', label: 'mmHg (torr)' },
                    { u: 'bar', label: 'bar' },
                    { u: 'psi', label: 'lb/in² (psi)' },
                    { u: 'Pa', label: 'pascals' }
                  ].map(unitItem => {
                    const converted = convertPressure(pressureVal, pressureUnit, unitItem.u);
                    const formatted = converted >= 10000 || (converted < 0.001 && converted > 0)
                      ? converted.toExponential(3)
                      : converted.toFixed(3);

                    return (
                      <div
                        key={unitItem.u}
                        onClick={() => handleCopy(formatted)}
                        className={`p-2 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          pressureUnit === unitItem.u
                            ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                            : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                        title="Click to copy value"
                      >
                        <span className="text-[10px] text-slate-400 font-medium">{unitItem.label}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono font-bold text-xs">{formatted}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{unitItem.u}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conversion Reference */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-0.5">
                <div>1 atm = 101.325 kPa = 760 mmHg</div>
                <div>1 bar = 100 kPa ≈ 0.987 atm</div>
              </div>
            </div>

            {/* Volume Converter Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Volume (V)
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  STP: 22.414 L/mol
                </span>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-medium">Enter Value &amp; Source Unit:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={volumeVal}
                    onChange={e => setVolumeVal(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <select
                    value={volumeUnit}
                    onChange={e => setVolumeUnit(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-none cursor-pointer font-bold"
                  >
                    <option value="L">L (liters)</option>
                    <option value="mL">mL (milliliters)</option>
                    <option value="cm3">cm³</option>
                    <option value="m3">m³</option>
                    <option value="dL">dL</option>
                  </select>
                </div>
              </div>

              {/* Converted Outputs Grid */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Converted Equivalents:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { u: 'L', label: 'Liters (L)' },
                    { u: 'mL', label: 'Milliliters (mL)' },
                    { u: 'cm3', label: 'Cubic cm (cm³)' },
                    { u: 'm3', label: 'Cubic meters (m³)' },
                    { u: 'dL', label: 'Deciliters (dL)' }
                  ].map(unitItem => {
                    const converted = convertVolume(volumeVal, volumeUnit, unitItem.u);
                    const formatted = converted >= 10000 || (converted < 0.001 && converted > 0)
                      ? converted.toExponential(3)
                      : converted.toFixed(3);

                    return (
                      <div
                        key={unitItem.u}
                        onClick={() => handleCopy(formatted)}
                        className={`p-2 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          volumeUnit === unitItem.u
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                            : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                        title="Click to copy value"
                      >
                        <span className="text-[10px] text-slate-400 font-medium">{unitItem.label}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono font-bold text-xs">{formatted}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{unitItem.u}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Volume Benchmarks */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-0.5">
                <div>1 L = 1000 mL = 1000 cm³ = 1 dm³</div>
                <div>1 m³ = 1,000 Liters</div>
              </div>
            </div>

            {/* Temperature Converter Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Temperature (T)
                  </h3>
                </div>
                <span className="text-[10px] text-rose-400 font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                  Must be Kelvin!
                </span>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-medium">Enter Value &amp; Source Scale:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={tempVal}
                    onChange={e => setTempVal(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                  <select
                    value={tempUnit}
                    onChange={e => setTempUnit(e.target.value as 'C' | 'K' | 'F')}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-rose-300 focus:outline-none cursor-pointer font-bold"
                  >
                    <option value="C">°C (Celsius)</option>
                    <option value="K">K (Kelvin)</option>
                    <option value="F">°F (Fahrenheit)</option>
                  </select>
                </div>
              </div>

              {/* Converted Outputs Grid */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Converted Scales:
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {[
                    { u: 'K', label: 'Absolute Kelvin (K) [Use in Gas Laws!]', highlight: true },
                    { u: 'C', label: 'Celsius (°C)', highlight: false },
                    { u: 'F', label: 'Fahrenheit (°F)', highlight: false }
                  ].map(unitItem => {
                    const converted = convertTemperature(tempVal, tempUnit, unitItem.u as any);
                    const formatted = converted.toFixed(2);

                    return (
                      <div
                        key={unitItem.u}
                        onClick={() => handleCopy(formatted)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          unitItem.highlight
                            ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                        title="Click to copy value"
                      >
                        <span className="text-[11px] font-medium">{unitItem.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-white">{formatted}</span>
                          <span className="text-xs text-slate-400 font-mono">{unitItem.u === 'K' ? 'K' : `°${unitItem.u}`}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Temperature Formulas */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-0.5">
                <div>K = °C + 273.15</div>
                <div>°C = K - 273.15</div>
                <div>°F = (°C × 9/5) + 32</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MOLAR MASS & FORMULA WEIGHT */}
      {/* ========================================================================= */}
      {activeTab === 'molarmass' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Molecular Weight &amp; Molar Mass Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  Type any chemical formula (supports parentheses like Ca(OH)₂, (NH₄)₂SO₄, C₆H₁₂O₆) to get exact mass and percentage composition.
                </p>
              </div>

              {molarMassResult.isValid && (
                <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 shrink-0">
                  <span className="text-xs font-medium text-emerald-400">Total Molar Mass:</span>
                  <span className="text-lg font-black font-mono text-white">
                    {molarMassResult.totalMolarMass.toFixed(3)}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">g/mol</span>
                </div>
              )}
            </div>

            {/* Formula Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Chemical Formula Input:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formulaInput}
                  onChange={e => setFormulaInput(e.target.value)}
                  placeholder="e.g. H2O, CO2, Ca(OH)2, (NH4)2SO4..."
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-base sm:text-lg text-emerald-300 font-mono tracking-wider focus:outline-none transition shadow-inner"
                />
                <button
                  onClick={() => handleCopy(molarMassResult.totalMolarMass.toString())}
                  disabled={!molarMassResult.isValid}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center gap-1.5"
                  title="Copy Molar Mass"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Copy Mass</span>
                </button>
              </div>

              {molarMassResult.errorMessage && (
                <p className="text-xs text-rose-400 font-medium">
                  ⚠️ {molarMassResult.errorMessage}
                </p>
              )}
            </div>

            {/* Quick Common Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Formula Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonFormulas.map(item => (
                  <button
                    key={item.formula}
                    onClick={() => setFormulaInput(item.formula)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                      formulaInput === item.formula
                        ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Element Breakdown Table */}
            {molarMassResult.isValid && molarMassResult.elements.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Element Mass &amp; Composition Breakdown:
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-2 px-3">Element</th>
                        <th className="py-2 px-3">Symbol</th>
                        <th className="py-2 px-3">Atomic Mass</th>
                        <th className="py-2 px-3">Atoms (n)</th>
                        <th className="py-2 px-3">Mass Contribution</th>
                        <th className="py-2 px-3">Mass %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 font-mono">
                      {molarMassResult.elements.map(el => (
                        <tr key={el.symbol} className="hover:bg-slate-850/50 transition">
                          <td className="py-2.5 px-3 font-sans font-semibold text-white">
                            {el.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
                              {el.symbol}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{el.atomicMass.toFixed(3)}</td>
                          <td className="py-2.5 px-3 text-amber-300 font-bold">× {el.count}</td>
                          <td className="py-2.5 px-3 text-white font-bold">{el.totalMass.toFixed(3)} g/mol</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="w-12 text-slate-300">{el.percentage.toFixed(1)}%</span>
                              <div className="w-20 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                <div
                                  className="bg-emerald-500 h-full rounded-full"
                                  style={{ width: `${Math.min(100, el.percentage)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MASS ⇄ MOLES ⇄ PARTICLES */}
      {/* ========================================================================= */}
      {activeTab === 'molecalc' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                Mass ⇄ Moles ⇄ Particles ⇄ Gas Volume Hub
              </h3>
              <p className="text-xs text-slate-400">
                Choose any given quantity to calculate moles, particle count, and STP gas volume using Avogadro's constant (6.022 × 10²³) and molar volume (22.414 L/mol).
              </p>
            </div>

            {/* Target Substance Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Substance Formula:
                </label>
                <input
                  type="text"
                  value={calcSubstanceFormula}
                  onChange={e => setCalcSubstanceFormula(e.target.value)}
                  placeholder="e.g. O2, H2O, CO2..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Computed Molar Mass (M):
                </label>
                <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-emerald-400 font-bold flex items-center justify-between">
                  <span>{substanceMolarMass.toFixed(3)} g/mol</span>
                  <span className="text-[10px] text-slate-500 font-sans">Formula Weight</span>
                </div>
              </div>
            </div>

            {/* Input Selection Mode */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Select Your Given Starting Quantity:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'mass', label: 'Mass in Grams (m)', unit: 'g' },
                  { id: 'moles', label: 'Moles (n)', unit: 'mol' },
                  { id: 'particles', label: 'Molecules / Atoms (N)', unit: 'particles' },
                  { id: 'stp_volume', label: 'Gas Vol @ STP (V)', unit: 'L' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setInputMode(mode.id as any);
                      if (mode.id === 'mass') setInputValue(32);
                      if (mode.id === 'moles') setInputValue(1);
                      if (mode.id === 'particles') setInputValue(6.022e23);
                      if (mode.id === 'stp_volume') setInputValue(22.414);
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      inputMode === mode.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{mode.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">{mode.unit}</span>
                  </button>
                ))}
              </div>

              {/* Input Value Field */}
              <div className="pt-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    step="any"
                    value={inputValue}
                    onChange={e => setInputValue(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-base text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <span className="px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-mono font-bold text-slate-300">
                    {inputMode === 'mass' ? 'grams' : inputMode === 'moles' ? 'moles' : inputMode === 'particles' ? 'particles' : 'Liters (STP)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Calculated Quantities Across All Dimensions:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Moles Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Amount of Substance (n)
                  </span>
                  <div className="text-lg font-black font-mono text-white">
                    {moleCalculations.moles.toPrecision(5)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">moles (mol)</span>
                </div>

                {/* Mass Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    Total Mass (m)
                  </span>
                  <div className="text-lg font-black font-mono text-white">
                    {moleCalculations.mass.toFixed(4)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">grams (g)</span>
                </div>

                {/* Particles Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                    Number of Particles (N)
                  </span>
                  <div className="text-lg font-black font-mono text-white">
                    {moleCalculations.particles.toExponential(4)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">molecules / atoms</span>
                </div>

                {/* STP Gas Volume Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Gas Volume @ STP (V)
                  </span>
                  <div className="text-lg font-black font-mono text-white">
                    {moleCalculations.volumeSTP.toFixed(3)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Liters (0°C, 1 atm)</span>
                </div>
              </div>
            </div>

            {/* Formula Explanations */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
              <strong className="text-white block font-bold">The Fundamental Mole Equations:</strong>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-850">
                  <span className="text-amber-300 font-bold block mb-1">Mass ⇄ Moles:</span>
                  <div>n = m / M</div>
                  <div>m = n × M</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-850">
                  <span className="text-purple-300 font-bold block mb-1">Moles ⇄ Particles:</span>
                  <div>N = n × 6.022 × 10²³</div>
                  <div>n = N / 6.022 × 10²³</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-850">
                  <span className="text-emerald-300 font-bold block mb-1">Gas Volume (STP):</span>
                  <div>V = n × 22.414 L</div>
                  <div>n = V / 22.414 L</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MOLARITY & DILUTION */}
      {/* ========================================================================= */}
      {activeTab === 'molarity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Molarity Calculator */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <FlaskRound className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Molarity (M) = Moles / Liters
                </h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-medium">Solute Amount (moles):</label>
                  <input
                    type="number"
                    step="any"
                    value={molaritySoluteMoles}
                    onChange={e => setMolaritySoluteMoles(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-medium">Solution Volume (Liters):</label>
                  <input
                    type="number"
                    step="any"
                    value={molaritySolutionLiters}
                    onChange={e => setMolaritySolutionLiters(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                </div>

                {/* Molarity Output */}
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                    Calculated Solution Concentration:
                  </span>
                  <div className="text-2xl font-black font-mono text-white">
                    {molaritySolutionLiters > 0
                      ? (molaritySoluteMoles / molaritySolutionLiters).toFixed(4)
                      : '0.000'}{' '}
                    <span className="text-sm text-purple-300">M (mol/L)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dilution Calculator M1 V1 = M2 V2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Dilution Equation (M₁V₁ = M₂V₂)
                </h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-medium">Solve For Variable:</label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    {(['V1', 'M1', 'M2', 'V2'] as const).map(target => (
                      <button
                        key={target}
                        onClick={() => setDilutionSolveTarget(target)}
                        className={`py-1.5 rounded-lg border text-center transition cursor-pointer ${
                          dilutionSolveTarget === target
                            ? 'bg-cyan-600 text-white border-cyan-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {target}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Stock M₁ (M):</label>
                    <input
                      type="number"
                      step="any"
                      disabled={dilutionSolveTarget === 'M1'}
                      value={dilutionSolveTarget === 'M1' ? dilutionSolvedValue.toFixed(4) : dilutionM1}
                      onChange={e => setDilutionM1(parseFloat(e.target.value) || 0)}
                      className={`w-full p-2 rounded-lg border font-mono ${
                        dilutionSolveTarget === 'M1'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Stock Vol V₁ (L):</label>
                    <input
                      type="number"
                      step="any"
                      disabled={dilutionSolveTarget === 'V1'}
                      value={dilutionSolveTarget === 'V1' ? dilutionSolvedValue.toFixed(4) : dilutionV1}
                      onChange={e => setDilutionV1(parseFloat(e.target.value) || 0)}
                      className={`w-full p-2 rounded-lg border font-mono ${
                        dilutionSolveTarget === 'V1'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Dilute M₂ (M):</label>
                    <input
                      type="number"
                      step="any"
                      disabled={dilutionSolveTarget === 'M2'}
                      value={dilutionSolveTarget === 'M2' ? dilutionSolvedValue.toFixed(4) : dilutionM2}
                      onChange={e => setDilutionM2(parseFloat(e.target.value) || 0)}
                      className={`w-full p-2 rounded-lg border font-mono ${
                        dilutionSolveTarget === 'M2'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-mono">Dilute Vol V₂ (L):</label>
                    <input
                      type="number"
                      step="any"
                      disabled={dilutionSolveTarget === 'V2'}
                      value={dilutionSolveTarget === 'V2' ? dilutionSolvedValue.toFixed(4) : dilutionV2}
                      onChange={e => setDilutionV2(parseFloat(e.target.value) || 0)}
                      className={`w-full p-2 rounded-lg border font-mono ${
                        dilutionSolveTarget === 'V2'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span>Solved <strong>{dilutionSolveTarget}</strong> = </span>
                  <span className="font-mono text-cyan-300 font-bold text-xs ml-1">
                    {dilutionSolvedValue.toFixed(4)}{' '}
                    {dilutionSolveTarget.startsWith('M') ? 'M' : 'Liters'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
