// Offline Chemical Formula Parser and Unit Conversion Engine
import { PERIODIC_ELEMENTS } from '../data/periodicTableData';

export interface ElementMassData {
  symbol: string;
  name: string;
  atomicMass: number;
}

export const ELEMENT_ATOMIC_MASSES: Record<string, ElementMassData> = PERIODIC_ELEMENTS.reduce(
  (acc, el) => {
    acc[el.symbol] = {
      symbol: el.symbol,
      name: el.name,
      atomicMass: el.atomicMass
    };
    return acc;
  },
  {} as Record<string, ElementMassData>
);

export interface FormulaElementBreakdown {
  symbol: string;
  name: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  percentage: number;
}

export interface MolarMassResult {
  formula: string;
  totalMolarMass: number;
  elements: FormulaElementBreakdown[];
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Parses chemical formulas including parentheses e.g. "Ca(OH)2", "H2O", "(NH4)2SO4", "C6H12O6"
 */
export function calculateMolarMass(formulaStr: string): MolarMassResult {
  const clean = formulaStr.trim().replace(/\s+/g, '');
  if (!clean) {
    return { formula: '', totalMolarMass: 0, elements: [], isValid: false, errorMessage: 'Empty formula' };
  }

  try {
    const counts = parseFormulaToElementCounts(clean);
    const elements: FormulaElementBreakdown[] = [];
    let totalMolarMass = 0;

    for (const [symbol, count] of Object.entries(counts)) {
      const el = ELEMENT_ATOMIC_MASSES[symbol];
      if (!el) {
        return {
          formula: clean,
          totalMolarMass: 0,
          elements: [],
          isValid: false,
          errorMessage: `Unknown element symbol: "${symbol}". Check capitalization (e.g. "Na" not "NA", "Cl" not "CL").`
        };
      }
      const massContrib = el.atomicMass * count;
      totalMolarMass += massContrib;
      elements.push({
        symbol,
        name: el.name,
        count,
        atomicMass: el.atomicMass,
        totalMass: massContrib,
        percentage: 0 // Will compute below
      });
    }

    // Sort by mass contribution descending
    elements.sort((a, b) => b.totalMass - a.totalMass);

    // Compute mass percentages
    elements.forEach(item => {
      item.percentage = totalMolarMass > 0 ? (item.totalMass / totalMolarMass) * 100 : 0;
    });

    return {
      formula: clean,
      totalMolarMass: parseFloat(totalMolarMass.toFixed(4)),
      elements,
      isValid: true
    };
  } catch (err: any) {
    return {
      formula: clean,
      totalMolarMass: 0,
      elements: [],
      isValid: false,
      errorMessage: err.message || 'Invalid formula format'
    };
  }
}

/**
 * Recursive formula parser with parenthesis multiplier support
 */
function parseFormulaToElementCounts(formula: string): Record<string, number> {
  let index = 0;

  function parseSubgroup(): Record<string, number> {
    const counts: Record<string, number> = {};

    while (index < formula.length) {
      const ch = formula[index];

      if (ch === '(') {
        index++;
        const inner = parseSubgroup();
        // check for closing paren
        if (index < formula.length && formula[index] === ')') {
          index++;
        }
        // read multiplier number after paren
        let numStr = '';
        while (index < formula.length && /[0-9]/.test(formula[index])) {
          numStr += formula[index];
          index++;
        }
        const multiplier = numStr ? parseInt(numStr, 10) : 1;

        for (const [sym, c] of Object.entries(inner)) {
          counts[sym] = (counts[sym] || 0) + c * multiplier;
        }
      } else if (ch === ')') {
        // Return back to caller
        break;
      } else if (/[A-Z]/.test(ch)) {
        // Read element symbol (1 uppercase + optional lowercase)
        let sym = ch;
        index++;
        if (index < formula.length && /[a-z]/.test(formula[index])) {
          sym += formula[index];
          index++;
        }

        // Read optional count
        let numStr = '';
        while (index < formula.length && /[0-9]/.test(formula[index])) {
          numStr += formula[index];
          index++;
        }
        const count = numStr ? parseInt(numStr, 10) : 1;
        counts[sym] = (counts[sym] || 0) + count;
      } else {
        index++;
      }
    }

    return counts;
  }

  const result = parseSubgroup();
  return result;
}

// =========================================================================
// UNIT CONVERSION CONSTANTS AND HELPERS
// =========================================================================

export const AVOGADRO_CONSTANT = 6.02214076e23;
export const STP_MOLAR_VOLUME = 22.414; // Liters per mole at STP (0°C, 1 atm)
export const RTP_MOLAR_VOLUME = 24.45; // Liters per mole at RTP (25°C, 1 atm)

// Pressure conversions relative to 1 atm
export const PRESSURE_FACTORS: Record<string, number> = {
  atm: 1.0,
  kPa: 101.325,
  Pa: 101325.0,
  mmHg: 760.0,
  torr: 760.0,
  bar: 1.01325,
  psi: 14.6959
};

// Volume conversions relative to 1 Liter
export const VOLUME_FACTORS: Record<string, number> = {
  L: 1.0,
  mL: 1000.0,
  cm3: 1000.0,
  m3: 0.001,
  dL: 10.0
};

export function convertPressure(value: number, fromUnit: string, toUnit: string): number {
  const fromFactor = PRESSURE_FACTORS[fromUnit] || 1;
  const toFactor = PRESSURE_FACTORS[toUnit] || 1;
  // value in atm = value / fromFactor
  const inAtm = value / fromFactor;
  return inAtm * toFactor;
}

export function convertVolume(value: number, fromUnit: string, toUnit: string): number {
  const fromFactor = VOLUME_FACTORS[fromUnit] || 1;
  const toFactor = VOLUME_FACTORS[toUnit] || 1;
  const inLiters = value / fromFactor;
  return inLiters * toFactor;
}

export function convertTemperature(value: number, fromUnit: 'C' | 'K' | 'F', toUnit: 'C' | 'K' | 'F'): number {
  // Convert from source to Kelvin first
  let kelvin = 0;
  if (fromUnit === 'C') {
    kelvin = value + 273.15;
  } else if (fromUnit === 'K') {
    kelvin = value;
  } else if (fromUnit === 'F') {
    kelvin = ((value - 32) * 5) / 9 + 273.15;
  }

  // Convert from Kelvin to target
  if (toUnit === 'K') return kelvin;
  if (toUnit === 'C') return kelvin - 273.15;
  if (toUnit === 'F') return ((kelvin - 273.15) * 9) / 5 + 32;

  return kelvin;
}
