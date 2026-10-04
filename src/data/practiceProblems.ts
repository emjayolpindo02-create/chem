import { PracticeProblem } from '../types/chemistry';

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  // ==========================================
  // SHELF 1: GAS LAWS
  // ==========================================

  // Boyle's Law
  {
    id: 'boyle-1',
    difficulty: 'beginner',
    category: 'gas-laws',
    topicId: 'boyles-law',
    lawId: 'boyles-law',
    lawName: "Boyle's Law",
    title: 'Piston Compression',
    problemStatement:
      'A sample of nitrogen gas in a syringe has a volume of 50.0 mL at a pressure of 1.0 atm. The plunger is pushed in so that the volume decreases to 25.0 mL while the temperature is kept strictly constant. What gas law governs this process, and what happens to the pressure?',
    given: {
      'V_1': '50.0 mL',
      'P_1': '1.0 atm',
      'V_2': '25.0 mL',
      'T': 'Constant'
    },
    unknown: 'Gas Law & Final Pressure P₂',
    options: [
      "Boyle's Law; Pressure doubles to 2.0 atm",
      "Charles's Law; Pressure halves to 0.5 atm",
      "Gay-Lussac's Law; Pressure stays 1.0 atm",
      "Avogadro's Law; Pressure drops to zero"
    ],
    correctAnswer: "Boyle's Law; Pressure doubles to 2.0 atm",
    solutionSteps: [
      {
        step: 'Identify variables in play',
        explanation: 'Volume and Pressure are changing; Temperature and moles of gas are constant.'
      },
      {
        step: 'Identify law',
        latex: 'P_1 V_1 = P_2 V_2',
        explanation: "Since Pressure and Volume vary inversely at constant temperature, this is Boyle's Law."
      },
      {
        step: 'Calculate P₂',
        latex: 'P_2 = \\frac{P_1 V_1}{V_2} = \\frac{(1.0\\text{ atm})(50.0\\text{ mL})}{25.0\\text{ mL}} = 2.0\\text{ atm}',
        explanation: 'Halving the volume forces gas particles into half the space, doubling collision frequency.'
      }
    ],
    hint: 'Look at what stays constant: Temperature. Which law connects Pressure and Volume?',
    commonMistakeTrap: 'Thinking volume reduction causes pressure to drop.'
  },
  {
    id: 'boyle-2',
    difficulty: 'intermediate',
    category: 'gas-laws',
    topicId: 'boyles-law',
    lawId: 'boyles-law',
    lawName: "Boyle's Law",
    title: 'Pressure Unit Conversion & Expansion',
    problemStatement:
      'A gas occupies 800.0 mL at a pressure of 760.0 mmHg. What volume will it occupy if the pressure is increased to 2.50 atm at constant temperature? (1 atm = 760 mmHg)',
    given: {
      'V_1': '800.0 mL',
      'P_1': '760.0 mmHg = 1.00 atm',
      'P_2': '2.50 atm',
      'T': 'Constant'
    },
    unknown: 'V_2 = ? (mL)',
    options: ['320.0 mL', '2000.0 mL', '450.0 mL', '1600.0 mL'],
    correctAnswer: '320.0 mL',
    solutionSteps: [
      {
        step: 'Convert pressure to consistent units',
        latex: 'P_1 = \\frac{760.0\\text{ mmHg}}{760.0\\text{ mmHg/atm}} = 1.00\\text{ atm}',
        explanation: 'Both pressures must have matching units before substituting.'
      },
      {
        step: 'Rearrange Boyle\'s Law for V₂',
        latex: 'V_2 = \\frac{P_1 V_1}{P_2} = \\frac{(1.00\\text{ atm})(800.0\\text{ mL})}{2.50\\text{ atm}} = 320.0\\text{ mL}',
        explanation: 'Pressure increased 2.5-fold, so volume shrunk to 1/2.5 = 0.4 of initial.'
      }
    ],
    hint: 'Convert 760 mmHg to 1.00 atm first, then use V₂ = (P₁ · V₁) / P₂.',
    commonMistakeTrap: 'Forgetting to convert units, multiplying 760 by 800 and dividing by 2.5.'
  },

  // Charles's Law
  {
    id: 'charles-1',
    difficulty: 'beginner',
    category: 'gas-laws',
    topicId: 'charles-law',
    lawId: 'charles-law',
    lawName: "Charles's Law",
    title: 'Warming a Balloon',
    problemStatement:
      'A party balloon filled with air occupies 2.0 L at 300 K. It is gently heated to 600 K at constant atmospheric pressure. What law describes this, and what is the new volume?',
    given: {
      'V_1': '2.0 L',
      'T_1': '300 K',
      'T_2': '600 K',
      'P': 'Constant (1.0 atm)'
    },
    unknown: 'Gas Law & New Volume V₂',
    options: [
      "Charles's Law; Volume doubles to 4.0 L",
      "Boyle's Law; Volume reduces to 1.0 L",
      "Gay-Lussac's Law; Volume increases to 3.0 L",
      "Ideal Gas Law; Volume stays 2.0 L"
    ],
    correctAnswer: "Charles's Law; Volume doubles to 4.0 L",
    solutionSteps: [
      {
        step: 'Identify variables',
        explanation: 'Volume (V) and Temperature (T) are changing; Pressure is held constant.'
      },
      {
        step: 'Identify law',
        latex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
        explanation: "Volume and absolute temperature are directly proportional, which is Charles's Law."
      },
      {
        step: 'Calculate V₂',
        latex: 'V_2 = \\frac{V_1 T_2}{T_1} = \\frac{(2.0\\text{ L})(600\\text{ K})}{300\\text{ K}} = 4.0\\text{ L}',
        explanation: 'Doubling absolute temperature doubles the volume at constant pressure.'
      }
    ],
    hint: 'Direct proportionality: if temperature doubles in Kelvin, volume doubles.',
    commonMistakeTrap: 'Inverting the ratio.'
  },
  {
    id: 'charles-2',
    difficulty: 'intermediate',
    category: 'gas-laws',
    topicId: 'charles-law',
    lawId: 'charles-law',
    lawName: "Charles's Law",
    title: 'Sub-Zero Weather Balloon Contraction',
    problemStatement:
      'A weather balloon has an initial volume of 4.50 L at 25.0 °C. What will its volume be if the temperature drops to -10.0 °C while pressure remains constant at 1.00 atm?',
    given: {
      'V_1': '4.50 L',
      'T_1': '25.0 °C',
      'T_2': '-10.0 °C',
      'P': 'Constant (1.00 atm)'
    },
    unknown: 'V_2 = ? (L)',
    options: ['3.97 L', '-1.80 L', '5.10 L', '2.25 L'],
    correctAnswer: '3.97 L',
    solutionSteps: [
      {
        step: 'Convert temperatures to Kelvin (MANDATORY)',
        latex: 'T_1 = 25.0 + 273.15 = 298.15\\text{ K},\\quad T_2 = -10.0 + 273.15 = 263.15\\text{ K}',
        explanation: 'Celsius temperatures cannot be used directly in gas law quotients.'
      },
      {
        step: 'Apply Charles\'s Law formula',
        latex: 'V_2 = \\frac{V_1 T_2}{T_1} = \\frac{(4.50\\text{ L})(263.15\\text{ K})}{298.15\\text{ K}} = 3.97\\text{ L}',
        explanation: 'Because absolute temperature decreased by ~11.7%, volume decreases proportionally.'
      }
    ],
    hint: 'Always convert Celsius to Kelvin first: K = °C + 273.15.',
    commonMistakeTrap: 'Dividing by -10 °C produces a nonsensical negative volume (-1.80 L)!'
  },

  // Gay-Lussac's Law
  {
    id: 'gay-1',
    difficulty: 'beginner',
    category: 'gas-laws',
    topicId: 'gay-lussac-law',
    lawId: 'gay-lussac-law',
    lawName: "Gay-Lussac's Law",
    title: 'Sealed Rigid Metal Tank',
    problemStatement:
      'A rigid steel pressure tank with a fixed volume of 10.0 L is heated. Which variable CANNOT change in this scenario?',
    given: {
      'Container': 'Rigid steel tank',
      'Process': 'Heating'
    },
    unknown: 'Constant variable',
    options: [
      'Volume (V)',
      'Pressure (P)',
      'Temperature (T)',
      'Particle Kinetic Energy'
    ],
    correctAnswer: 'Volume (V)',
    solutionSteps: [
      {
        step: 'Analyze container boundaries',
        explanation: 'A rigid steel tank cannot expand or contract, locking the volume constant.'
      },
      {
        step: 'Determine law',
        latex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
        explanation: "Gay-Lussac's Law specifically models systems where volume is held constant."
      }
    ],
    hint: 'Rigid means the walls cannot move. What property is determined by wall boundaries?'
  },
  {
    id: 'gay-2',
    difficulty: 'intermediate',
    category: 'gas-laws',
    topicId: 'gay-lussac-law',
    lawId: 'gay-lussac-law',
    lawName: "Gay-Lussac's Law",
    title: 'Aerosol Can in Fire Safety Hazard',
    problemStatement:
      'An aerosol can contains gas at 2.0 atm at room temperature (27.0 °C). If tossed into a campfire at 627.0 °C, what will the internal pressure reach? Will it exceed the 5.0 atm rupture limit?',
    given: {
      'P_1': '2.0 atm',
      'T_1': '27.0 °C = 300.15 K',
      'T_2': '627.0 °C = 900.15 K',
      'V': 'Constant (Rigid can)'
    },
    unknown: 'P_2 = ? (atm)',
    options: ['6.0 atm (Exceeds rupture limit)', '4.6 atm (Safe)', '12.0 atm (Exceeds)', '2.5 atm (Safe)'],
    correctAnswer: '6.0 atm (Exceeds rupture limit)',
    solutionSteps: [
      {
        step: 'Convert temperatures to Kelvin',
        latex: 'T_1 = 27 + 273.15 = 300.15\\text{ K},\\quad T_2 = 627 + 273.15 = 900.15\\text{ K}',
        explanation: 'Absolute temperature triples from 300 K to 900 K.'
      },
      {
        step: 'Solve for P₂',
        latex: 'P_2 = \\frac{P_1 T_2}{T_1} = \\frac{(2.0\\text{ atm})(900.15\\text{ K})}{300.15\\text{ K}} = 6.0\\text{ atm}',
        explanation: 'Since 6.0 atm > 5.0 atm, the can will catastrophically explode.'
      }
    ],
    hint: 'Notice that 900 K is exactly 3 times 300 K.',
    commonMistakeTrap: 'Dividing 627 by 27 directly gives 23x instead of converting to Kelvin.'
  },

  // Avogadro's Law
  {
    id: 'avo-1',
    difficulty: 'intermediate',
    category: 'gas-laws',
    topicId: 'avogadro-law',
    lawId: 'avogadro-law',
    lawName: "Avogadro's Law",
    title: 'Gas Injection into Chamber',
    problemStatement:
      'A flexible container holds 0.750 moles of neon gas at a volume of 18.0 L. How many total moles of neon must be present in the container for the volume to expand to 30.0 L at constant temperature and pressure?',
    given: {
      'n_1': '0.750 mol',
      'V_1': '18.0 L',
      'V_2': '30.0 L',
      'P, T': 'Constant'
    },
    unknown: 'n_2 = ? (mol)',
    options: ['1.25 mol', '0.45 mol', '2.50 mol', '1.80 mol'],
    correctAnswer: '1.25 mol',
    solutionSteps: [
      {
        step: 'Apply Avogadro\'s Law',
        latex: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}',
        explanation: 'Volume is directly proportional to moles.'
      },
      {
        step: 'Rearrange for n₂',
        latex: 'n_2 = \\frac{V_2 n_1}{V_1} = \\frac{(30.0\\text{ L})(0.750\\text{ mol})}{18.0\\text{ L}} = 1.25\\text{ mol}',
        explanation: 'To expand to 30.0 L, the total gas amount must reach 1.25 moles.'
      }
    ],
    hint: 'Cross-multiply: n₂ = (V₂ · n₁) / V₁.'
  },

  // Combined Gas Law
  {
    id: 'comb-1',
    difficulty: 'advanced',
    category: 'gas-laws',
    topicId: 'combined-gas-law',
    lawId: 'combined-gas-law',
    lawName: 'Combined Gas Law',
    title: 'Atmospheric Ascent',
    problemStatement:
      'A meteorological balloon filled with 25.0 L of helium at 1.02 atm and 22.0 °C rises into the upper atmosphere where the pressure is 0.350 atm and the temperature is -35.0 °C. Calculate the final volume of the balloon.',
    given: {
      'P_1': '1.02 atm',
      'V_1': '25.0 L',
      'T_1': '22.0 °C = 295.15 K',
      'P_2': '0.350 atm',
      'T_2': '-35.0 °C = 238.15 K'
    },
    unknown: 'V_2 = ? (L)',
    options: ['58.79 L', '72.85 L', '14.20 L', '48.10 L'],
    correctAnswer: '58.79 L',
    solutionSteps: [
      {
        step: 'Convert all temperatures to Kelvin',
        latex: 'T_1 = 295.15\\text{ K},\\quad T_2 = 238.15\\text{ K}',
        explanation: 'Denominators must be absolute Kelvin temperatures.'
      },
      {
        step: 'Use Combined Gas Law formula',
        latex: 'V_2 = \\frac{P_1 V_1 T_2}{P_2 T_1} = \\frac{(1.02\\text{ atm})(25.0\\text{ L})(238.15\\text{ K})}{(0.350\\text{ atm})(295.15\\text{ K})} = 58.79\\text{ L}',
        explanation: 'The huge drop in external pressure overcomes thermal contraction, resulting in balloon expansion.'
      }
    ],
    hint: 'Formula rearrangement: V₂ = (P₁ · V₁ · T₂) / (P₂ · T₁).'
  },

  // Ideal Gas Law
  {
    id: 'ideal-1',
    difficulty: 'advanced',
    category: 'gas-laws',
    topicId: 'ideal-gas-law',
    lawId: 'ideal-gas-law',
    lawName: 'Ideal Gas Law',
    title: 'Molar Mass of Volatile Vapor',
    problemStatement:
      'A 1.50 g sample of an unknown volatile vapor occupies 0.820 L at 100.0 °C and a pressure of 0.950 atm. Determine the molar mass of the unknown compound (R = 0.08206 L·atm/(mol·K)).',
    given: {
      'm': '1.50 g',
      'V': '0.820 L',
      'P': '0.950 atm',
      'T': '100.0 °C = 373.15 K',
      'R': '0.08206 L·atm/(mol·K)'
    },
    unknown: 'Molar Mass M = ? (g/mol)',
    options: ['58.9 g/mol', '32.1 g/mol', '118.2 g/mol', '74.5 g/mol'],
    correctAnswer: '58.9 g/mol',
    solutionSteps: [
      {
        step: 'Calculate moles of vapor via PV = nRT',
        latex: 'n = \\frac{PV}{RT} = \\frac{(0.950\\text{ atm})(0.820\\text{ L})}{(0.08206)(373.15\\text{ K})} = 0.02545\\text{ mol}',
        explanation: 'Yields the amount of gas particles in the flask.'
      },
      {
        step: 'Calculate Molar Mass M = m / n',
        latex: 'M = \\frac{1.50\\text{ g}}{0.02545\\text{ mol}} = 58.9\\text{ g/mol}',
        explanation: 'Matches acetone or butane (C₄H₁₀).'
      }
    ],
    hint: 'Use M = (m · R · T) / (P · V). Convert 100 °C to 373.15 K.'
  },
  {
    id: 'ideal-2',
    difficulty: 'challenge',
    category: 'gas-laws',
    topicId: 'ideal-gas-law',
    lawId: 'ideal-gas-law',
    lawName: 'Ideal Gas Law',
    title: 'Gas Density at Non-Standard Conditions',
    problemStatement:
      'What is the density of carbon dioxide gas (CO₂, Molar mass = 44.01 g/mol) in g/L at a pressure of 2.40 atm and a temperature of 35.0 °C? (R = 0.08206 L·atm/(mol·K))',
    given: {
      'Compound': 'CO₂ (44.01 g/mol)',
      'P': '2.40 atm',
      'T': '35.0 °C = 308.15 K',
      'R': '0.08206 L·atm/(mol·K)'
    },
    unknown: 'Density d = ? (g/L)',
    options: ['4.18 g/L', '1.96 g/L', '2.84 g/L', '6.25 g/L'],
    correctAnswer: '4.18 g/L',
    solutionSteps: [
      {
        step: 'Derive Density formula from PV = (m/M)RT',
        latex: 'd = \\frac{m}{V} = \\frac{PM}{RT}',
        explanation: 'Relates density directly to pressure, molar mass, and temperature.'
      },
      {
        step: 'Substitute values',
        latex: 'd = \\frac{(2.40\\text{ atm})(44.01\\text{ g/mol})}{(0.08206)(308.15\\text{ K})} = \\frac{105.624}{25.2868} = 4.18\\text{ g/L}',
        explanation: 'At 2.40 atm, CO₂ is considerably denser than normal air (~1.2 g/L).'
      }
    ],
    hint: 'Density formula: d = (P · M) / (R · T).'
  },

  // ==========================================
  // SHELF 2: PERIODIC CHEMISTRY
  // ==========================================

  // Periodic Table Organization
  {
    id: 'per-org-1',
    difficulty: 'beginner',
    category: 'periodic-table',
    topicId: 'periodic-table-organization',
    lawName: 'Periodic Table Architecture',
    title: 'Periods, Groups, and Blocks',
    problemStatement:
      'An element has the ground-state electron configuration [Ne] 3s² 3p⁴. Identify its period, group number, and block in the periodic table.',
    given: {
      'Electron Configuration': '[Ne] 3s² 3p⁴',
      'Highest Principal Quantum Number': 'n = 3',
      'Valence Electrons': '2 + 4 = 6'
    },
    unknown: 'Period, Group, Block',
    options: [
      'Period 3, Group 16, p-block (Sulfur)',
      'Period 4, Group 6, d-block (Chromium)',
      'Period 2, Group 14, p-block (Carbon)',
      'Period 3, Group 6, s-block (Magnesium)'
    ],
    correctAnswer: 'Period 3, Group 16, p-block (Sulfur)',
    solutionSteps: [
      {
        step: 'Determine Period',
        explanation: 'The highest principal quantum number n is 3, so it resides in Period 3.'
      },
      {
        step: 'Determine Block',
        explanation: 'The outermost electron enters a p subshell, so it belongs to the p-block.'
      },
      {
        step: 'Determine Group',
        latex: '\\text{Group} = 10 + 2 + 4 = 16',
        explanation: 'For p-block elements, Group = 10 + (s electrons) + (p electrons) = 16.'
      }
    ],
    hint: 'Highest n gives the period; valence sum for p-block is 10 + s + p.'
  },

  // Periodic Trends
  {
    id: 'per-trend-1',
    difficulty: 'beginner',
    category: 'periodic-table',
    topicId: 'periodic-trends',
    lawName: 'Periodic Trends & Atomic Radii',
    title: 'Atomic Radius Comparison Across Period 3',
    problemStatement:
      'Arrange the elements Sodium (Na, Z=11), Phosphorus (P, Z=15), and Chlorine (Cl, Z=17) in order of DECREASING atomic radius (largest to smallest).',
    given: {
      'Elements': 'Na, P, Cl (all in Period 3)',
      'Atomic Numbers': 'Na (11), P (15), Cl (17)'
    },
    unknown: 'Order from largest to smallest radius',
    options: [
      'Na > P > Cl',
      'Cl > P > Na',
      'P > Na > Cl',
      'Na = P = Cl'
    ],
    correctAnswer: 'Na > P > Cl',
    solutionSteps: [
      {
        step: 'Recall trend across a period',
        latex: 'Z_{\\text{eff}} \\uparrow \\implies \\text{Atomic Radius} \\downarrow',
        explanation: 'Across a period from left to right, effective nuclear charge increases while electrons are added to the same principal shell (n=3).'
      },
      {
        step: 'Compare values',
        explanation: 'Na (190 pm) has the least protons (11), P (98 pm) has 15 protons, and Cl (79 pm) has 17 protons pulling the electron cloud tighter.'
      }
    ],
    hint: 'Atomic size decreases from left to right across a period because nuclear charge increases.'
  },
  {
    id: 'per-trend-2',
    difficulty: 'intermediate',
    category: 'periodic-table',
    topicId: 'periodic-trends',
    lawName: 'Periodic Trends & Atomic Radii',
    title: 'Ionization Energy Anomaly: Nitrogen vs Oxygen',
    problemStatement:
      'Although first ionization energy generally increases across Period 2, Nitrogen (N, Z=7) has a HIGHER first ionization energy (1402 kJ/mol) than Oxygen (O, Z=8, 1314 kJ/mol). Why does this anomaly occur?',
    given: {
      'Nitrogen': '1s² 2s² 2p³ (IE₁ = 1402 kJ/mol)',
      'Oxygen': '1s² 2s² 2p⁴ (IE₁ = 1314 kJ/mol)'
    },
    unknown: 'Underlying electronic cause',
    options: [
      'N has a stable half-filled 2p³ subshell; O has an electron pair in one 2p orbital with repulsive strain',
      'Oxygen has a smaller effective nuclear charge than Nitrogen',
      'Nitrogen has an extra quantum shell compared to Oxygen',
      'Oxygen is a noble gas with zero electron affinity'
    ],
    correctAnswer: 'N has a stable half-filled 2p³ subshell; O has an electron pair in one 2p orbital with repulsive strain',
    solutionSteps: [
      {
        step: 'Examine electron configurations',
        latex: '\\text{N: } [\\text{He}] 2s^2 2p_x^1 2p_y^1 2p_z^1,\\quad \\text{O: } [\\text{He}] 2s^2 2p_x^2 2p_y^1 2p_z^1',
        explanation: 'Nitrogen has three singly occupied 2p orbitals (half-filled subshell), providing maximum exchange energy stabilization.'
      },
      {
        step: 'Evaluate electron-electron repulsion',
        explanation: 'Oxygen has two electrons forced into the same 2px orbital. The electrostatic repulsion between these paired electrons makes it easier to remove one electron, lowering its ionization energy.'
      }
    ],
    hint: 'Think about Hund\'s rule, half-filled p subshell stability, and pairing repulsion.'
  },

  // Atomic Structure & Isotopes
  {
    id: 'per-atom-1',
    difficulty: 'beginner',
    category: 'periodic-table',
    topicId: 'atomic-structure',
    lawName: 'Atomic Structure & Isotopes',
    title: 'Subatomic Particles in a Bromine-81 Ion',
    problemStatement:
      'Determine the number of protons, neutrons, and electrons in a bromide ion: ^{81}_{35}\\text{Br}^-.',
    given: {
      'Isotope notation': '^{81}_{35}\\text{Br}^-',
      'Atomic number (Z)': '35',
      'Mass number (A)': '81',
      'Net charge': '-1'
    },
    unknown: 'Count of protons, neutrons, and electrons',
    options: [
      '35 protons, 46 neutrons, 36 electrons',
      '35 protons, 81 neutrons, 34 electrons',
      '35 protons, 46 neutrons, 34 electrons',
      '46 protons, 35 neutrons, 36 electrons'
    ],
    correctAnswer: '35 protons, 46 neutrons, 36 electrons',
    solutionSteps: [
      {
        step: 'Calculate Protons',
        latex: '\\text{Protons} = Z = 35',
        explanation: 'The atomic number defines the proton count.'
      },
      {
        step: 'Calculate Neutrons',
        latex: '\\text{Neutrons} = A - Z = 81 - 35 = 46',
        explanation: 'Mass number minus atomic number gives neutrons.'
      },
      {
        step: 'Calculate Electrons',
        latex: '\\text{Electrons} = \\text{Protons} - (\\text{Charge}) = 35 - (-1) = 36',
        explanation: 'A -1 anion has gained one additional electron.'
      }
    ],
    hint: 'Protons = Z, Neutrons = A - Z, and a negative charge means extra electrons.'
  },

  // ==========================================
  // SHELF 3: CHEMICAL CALCULATIONS
  // ==========================================

  // Mole Concept
  {
    id: 'calc-mole-1',
    difficulty: 'beginner',
    category: 'calculations',
    topicId: 'mole-concept',
    lawName: 'The Mole Concept & Avogadro Number',
    title: 'Counting Molecules from Moles',
    problemStatement:
      'A cylinder contains 2.50 moles of pure oxygen gas (O₂). How many individual O₂ molecules and how many total oxygen atoms are present? (N_A = 6.022 × 10²³ entities/mol)',
    given: {
      'Moles of O₂': '2.50 mol',
      'Avogadro Constant': '6.022 × 10²³ mol⁻¹'
    },
    unknown: 'Molecules of O₂ & Total Oxygen Atoms',
    options: [
      '1.51 × 10²⁴ molecules O₂; 3.01 × 10²⁴ O atoms',
      '2.50 × 10²³ molecules O₂; 5.00 × 10²³ O atoms',
      '6.02 × 10²³ molecules O₂; 1.20 × 10²⁴ O atoms',
      '3.01 × 10²⁴ molecules O₂; 1.51 × 10²⁴ O atoms'
    ],
    correctAnswer: '1.51 × 10²⁴ molecules O₂; 3.01 × 10²⁴ O atoms',
    solutionSteps: [
      {
        step: 'Calculate Molecules of O₂',
        latex: 'N_{\\text{molecules}} = n \\times N_A = 2.50\\text{ mol} \\times 6.022 \\times 10^{23}\\text{ mol}^{-1} = 1.5055 \\times 10^{24}\\text{ molecules}',
        explanation: 'Multiply moles by Avogadro constant.'
      },
      {
        step: 'Calculate Total Atoms',
        latex: 'N_{\\text{atoms}} = 1.5055 \\times 10^{24} \\times 2 = 3.011 \\times 10^{24}\\text{ O atoms}',
        explanation: 'Each O₂ molecule contains 2 bound oxygen atoms.'
      }
    ],
    hint: 'Molecules = moles × 6.022 × 10²³. Each molecule of O₂ has 2 atoms.'
  },

  // Molar Mass
  {
    id: 'calc-mass-1',
    difficulty: 'intermediate',
    category: 'calculations',
    topicId: 'molar-mass',
    lawName: 'Molar Mass & Empirical Formulas',
    title: 'Calculating Molar Mass of Hydrated Salt',
    problemStatement:
      'Calculate the molar mass of copper(II) sulfate pentahydrate, \\text{CuSO}_4 \\cdot 5\\text{H}_2\\text{O}. (Atomic masses: Cu = 63.55, S = 32.06, O = 16.00, H = 1.008 g/mol)',
    given: {
      'Formula': 'CuSO₄ · 5H₂O',
      'Cu': '63.55 g/mol',
      'S': '32.06 g/mol',
      'O': '16.00 g/mol',
      'H': '1.008 g/mol'
    },
    unknown: 'Molar Mass = ? (g/mol)',
    options: ['249.68 g/mol', '159.61 g/mol', '231.60 g/mol', '177.62 g/mol'],
    correctAnswer: '249.68 g/mol',
    solutionSteps: [
      {
        step: 'Calculate mass of anhydrous CuSO₄',
        latex: '63.55 + 32.06 + 4(16.00) = 159.61\\text{ g/mol}',
        explanation: 'Sum of copper, sulfur, and four oxygens.'
      },
      {
        step: 'Calculate mass of 5 water molecules (5 H₂O)',
        latex: '5 \\times [2(1.008) + 16.00] = 5 \\times 18.016 = 90.08\\text{ g/mol}',
        explanation: 'Five moles of water of crystallization.'
      },
      {
        step: 'Total Molar Mass',
        latex: '159.61 + 90.08 = 249.69\\text{ g/mol} \\approx 249.68\\text{ g/mol}',
        explanation: 'Combining anhydrous salt and water of hydration.'
      }
    ],
    hint: 'Do not forget the 5 water molecules: 5 × 18.016 g/mol = 90.08 g/mol.'
  },

  // Stoichiometry
  {
    id: 'calc-stoich-1',
    difficulty: 'advanced',
    category: 'calculations',
    topicId: 'stoichiometry',
    lawName: 'Stoichiometry & Limiting Reactants',
    title: 'Haber-Bosch Ammonia Limiting Reactant',
    problemStatement:
      'In the Haber process: \\text{N}_2(g) + 3\\text{H}_2(g) \\rightarrow 2\\text{NH}_3(g), 28.0 g of \\text{N}_2 (Molar mass = 28.02 g/mol) is mixed with 9.00 g of \\text{H}_2 (Molar mass = 2.016 g/mol). Which is the limiting reactant, and what theoretical yield of \\text{NH}_3 (17.03 g/mol) in grams is produced?',
    given: {
      'Reaction': 'N₂ + 3H₂ → 2NH₃',
      'Mass N₂': '28.0 g',
      'Mass H₂': '9.00 g'
    },
    unknown: 'Limiting reactant & Theoretical yield of NH₃ (g)',
    options: [
      'N₂ is limiting; 34.0 g NH₃',
      'H₂ is limiting; 51.0 g NH₃',
      'Both consumed equally; 37.0 g NH₃',
      'N₂ is limiting; 17.0 g NH₃'
    ],
    correctAnswer: 'N₂ is limiting; 34.0 g NH₃',
    solutionSteps: [
      {
        step: 'Convert reactant masses to moles',
        latex: 'n(\\text{N}_2) = \\frac{28.0\\text{ g}}{28.02\\text{ g/mol}} = 1.00\\text{ mol},\\quad n(\\text{H}_2) = \\frac{9.00\\text{ g}}{2.016\\text{ g/mol}} = 4.46\\text{ mol}',
        explanation: 'Compare moles to stoichiometric coefficients.'
      },
      {
        step: 'Determine Limiting Reactant',
        latex: '1.00\\text{ mol N}_2 \\times \\frac{3\\text{ mol H}_2}{1\\text{ mol N}_2} = 3.00\\text{ mol H}_2\\text{ required}',
        explanation: 'Since we have 4.46 mol H₂ available and only need 3.00 mol, H₂ is in excess and N₂ is the limiting reactant.'
      },
      {
        step: 'Calculate Theoretical Yield of NH₃',
        latex: '1.00\\text{ mol N}_2 \\times \\frac{2\\text{ mol NH}_3}{1\\text{ mol N}_2} \\times 17.03\\text{ g/mol} = 34.06\\text{ g NH}_3 \\approx 34.0\\text{ g}',
        explanation: 'Based on 1.00 mol limiting N₂ producing 2.00 mol NH₃.'
      }
    ],
    hint: 'Convert grams to moles first, check the 1:3 ratio, and base product on the limiting reactant.'
  },

  // ==========================================
  // SHELF 4: INORGANIC COMPOUNDS
  // ==========================================

  // Ionic vs Covalent
  {
    id: 'comp-ionic-1',
    difficulty: 'beginner',
    category: 'compounds',
    topicId: 'ionic-vs-covalent',
    lawName: 'Ionic vs Molecular Compounds',
    title: 'Distinguishing Ionic from Covalent Substances',
    problemStatement:
      'A white crystalline solid melts at 801 °C. In solid form it does NOT conduct electricity, but when dissolved in water or melted into a liquid, it conducts electricity vigorously. What type of bonding does it possess?',
    given: {
      'Melting point': '801 °C (High)',
      'Conductivity solid': 'Non-conductive',
      'Conductivity molten/aqueous': 'Conducts electricity'
    },
    unknown: 'Bonding classification',
    options: [
      'Ionic bonding (e.g., NaCl)',
      'Nonpolar covalent bonding (e.g., O₂)',
      'Polar covalent molecular bonding (e.g., H₂O)',
      'Network covalent bonding (e.g., Diamond)'
    ],
    correctAnswer: 'Ionic bonding (e.g., NaCl)',
    solutionSteps: [
      {
        step: 'Analyze Melting Point',
        explanation: 'Extremely high melting point (801 °C) signifies strong electrostatic attractions between oppositely charged ions in a 3D crystal lattice.'
      },
      {
        step: 'Analyze Electrical Conductivity',
        explanation: 'In the solid state, ions are locked into fixed lattice positions. When melted or dissolved, ions become freely mobile charge carriers (electrolytes).'
      }
    ],
    hint: 'Mobile ions allow molten salts and aqueous solutions to conduct electric current.'
  },

  // Acids and Bases
  {
    id: 'comp-acid-1',
    difficulty: 'intermediate',
    category: 'compounds',
    topicId: 'acids-and-bases',
    lawName: 'Acids, Bases & pH Scale',
    title: 'Calculating pH of Hydrochloric Acid Solution',
    problemStatement:
      'What is the pH of a 0.0025 M aqueous solution of hydrochloric acid (HCl), a strong monoprotic acid? (log 2.5 ≈ 0.40)',
    given: {
      'Acid': 'HCl (Strong acid, 100% dissociation)',
      'Concentration': '[HCl] = 0.0025 M = 2.5 × 10⁻³ M'
    },
    unknown: 'pH = ?',
    options: ['2.60', '3.40', '11.40', '2.50'],
    correctAnswer: '2.60',
    solutionSteps: [
      {
        step: 'Determine [H⁺] concentration',
        latex: '\\text{HCl} \\longrightarrow \\text{H}^+ + \\text{Cl}^- \\implies [\\text{H}^+] = [\\text{HCl}] = 2.5 \\times 10^{-3}\\text{ M}',
        explanation: 'Strong monoprotic acids dissociate completely in water.'
      },
      {
        step: 'Calculate pH using logarithmic definition',
        latex: '\\text{pH} = -\\log_{10}[\\text{H}^+] = -\\log(2.5 \\times 10^{-3}) = 3 - \\log(2.5) = 3 - 0.40 = 2.60',
        explanation: 'Log rule: -log(a × 10⁻ᵇ) = b - log(a).'
      }
    ],
    hint: 'pH = -log[H⁺]. For 2.5 × 10⁻³ M, pH is 3 - log(2.5).'
  },

  // Salts and Solubility
  {
    id: 'comp-solub-1',
    difficulty: 'intermediate',
    category: 'compounds',
    topicId: 'solubility-and-salts',
    lawName: 'Salts & Solubility Rules',
    title: 'Predicting Insoluble Precipitates',
    problemStatement:
      'According to standard solubility rules, which of the following ionic combinations will form an INSOLUBLE solid precipitate when mixed in aqueous solution?',
    given: {
      'Candidate combinations': 'NaNO₃, KCl, BaSO₄, NH₄C₂H₃O₂'
    },
    unknown: 'Insoluble precipitate compound',
    options: [
      'BaSO₄ (Barium sulfate)',
      'NaNO₃ (Sodium nitrate)',
      'KCl (Potassium chloride)',
      'NH₄C₂H₃O₂ (Ammonium acetate)'
    ],
    correctAnswer: 'BaSO₄ (Barium sulfate)',
    solutionSteps: [
      {
        step: 'Recall standard solubility rules',
        explanation: 'All nitrates (NO₃⁻), alkali metal salts (Na⁺, K⁺), and ammonium salts (NH₄⁺) are 100% soluble.'
      },
      {
        step: 'Evaluate Sulfate exceptions',
        latex: '\\text{Ba}^{2+}(aq) + \\text{SO}_4^{2-}(aq) \\longrightarrow \\text{BaSO}_4(s)\\downarrow',
        explanation: 'Most sulfates are soluble, EXCEPT with Ba²⁺, Pb²⁺, Ca²⁺, and Sr²⁺. BaSO₄ precipitates as a dense white solid.'
      }
    ],
    hint: 'Barium sulfate is an exception to the sulfate solubility rule.'
  },

  // ==========================================
  // SHELF 5: CHEMICAL REACTIONS
  // ==========================================

  // Chemical Equations
  {
    id: 'rxn-eq-1',
    difficulty: 'beginner',
    category: 'reactions',
    topicId: 'chemical-equations',
    lawName: 'Balancing Chemical Equations',
    title: 'Balancing Hydrocarbon Combustion',
    problemStatement:
      'Balance the combustion equation of propane: \\text{C}_3\\text{H}_8 + ?\\text{O}_2 \\rightarrow ?\\text{CO}_2 + ?\\text{H}_2\\text{O}. What is the correct stoichiometric coefficient for oxygen gas (\\text{O}_2)?',
    given: {
      'Reaction': 'C₃H₈ + O₂ → CO₂ + H₂O'
    },
    unknown: 'Coefficient in front of O₂',
    options: ['5', '3', '4', '10'],
    correctAnswer: '5',
    solutionSteps: [
      {
        step: 'Balance Carbon atoms first',
        latex: '\\text{C}_3\\text{H}_8 \\implies 3\\text{ CO}_2',
        explanation: '3 carbons on left require 3 CO₂ on right.'
      },
      {
        step: 'Balance Hydrogen atoms second',
        latex: '8\\text{ H on left} \\implies 4\\text{ H}_2\\text{O on right}',
        explanation: '4 × 2 = 8 Hydrogens on right.'
      },
      {
        step: 'Count Oxygen atoms and balance O₂',
        latex: '3(2) + 4(1) = 6 + 4 = 10\\text{ O atoms} \\implies 5\\text{ O}_2',
        explanation: '10 oxygen atoms needed on the left: 10 / 2 = 5 O₂ molecules.'
      }
    ],
    hint: 'Balance C, then H, and finish with O₂.'
  },

  // Redox Chemistry
  {
    id: 'rxn-redox-1',
    difficulty: 'intermediate',
    category: 'reactions',
    topicId: 'redox-chemistry',
    lawName: 'Oxidation-Reduction (Redox)',
    title: 'Identifying Oxidizing and Reducing Agents',
    problemStatement:
      'In the reaction: \\text{Zn}(s) + 2\\text{HCl}(aq) \\rightarrow \\text{ZnCl}_2(aq) + \\text{H}_2(g), identify which substance is oxidized and which is the reducing agent.',
    given: {
      'Reaction': 'Zn + 2HCl → ZnCl₂ + H₂'
    },
    unknown: 'Substance oxidized & Reducing agent',
    options: [
      'Zn is oxidized and Zn is the reducing agent',
      'H⁺ is oxidized and HCl is the reducing agent',
      'Zn is reduced and HCl is the reducing agent',
      'Cl⁻ is oxidized and Zn is the reducing agent'
    ],
    correctAnswer: 'Zn is oxidized and Zn is the reducing agent',
    solutionSteps: [
      {
        step: 'Assign Oxidation Numbers',
        latex: '\\text{Zn}^0 \\longrightarrow \\text{Zn}^{2+} + 2e^- (\\text{Oxidation}),\\quad 2\\text{H}^+ + 2e^- \\longrightarrow \\text{H}_2^0 (\\text{Reduction})',
        explanation: 'Zinc loses 2 electrons (oxidation state increases from 0 to +2).'
      },
      {
        step: 'Identify Agents (OIL RIG)',
        explanation: 'The substance that is oxidized (Zn) gives up electrons to reduce H⁺, making Zn the reducing agent.'
      }
    ],
    hint: 'The substance that gets oxidized loses electrons and acts as the reducing agent.'
  },

  // Precipitation Reactions
  {
    id: 'rxn-precip-1',
    difficulty: 'intermediate',
    category: 'reactions',
    topicId: 'precipitation-reactions',
    lawName: 'Precipitation & Net Ionic Equations',
    title: 'Formulating the Net Ionic Equation',
    problemStatement:
      'Aqueous silver nitrate (\\text{AgNO}_3) is mixed with aqueous sodium chloride (\\text{NaCl}). Which equation represents the correct NET IONIC equation for the reaction?',
    given: {
      'Reactants': 'AgNO₃(aq) + NaCl(aq)',
      'Observation': 'Curdy white precipitate forms immediately'
    },
    unknown: 'Net Ionic Equation',
    options: [
      'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
      'Na⁺(aq) + NO₃⁻(aq) → NaNO₃(s)',
      'AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)',
      'Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Cl⁻(aq) → AgCl(s) + Na⁺(aq) + NO₃⁻(aq)'
    ],
    correctAnswer: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)',
    solutionSteps: [
      {
        step: 'Write Full Ionic Equation',
        latex: '\\text{Ag}^+(aq) + \\text{NO}_3^-(aq) + \\text{Na}^+(aq) + \\text{Cl}^-(aq) \\longrightarrow \\text{AgCl}(s) + \\text{Na}^+(aq) + \\text{NO}_3^-(aq)',
        explanation: 'Separate all soluble strong electrolytes into free aqueous ions.'
      },
      {
        step: 'Cancel Spectator Ions',
        explanation: 'Na⁺(aq) and NO₃⁻(aq) exist unchanged on both reactant and product sides.'
      },
      {
        step: 'State Net Ionic Equation',
        latex: '\\text{Ag}^+(aq) + \\text{Cl}^-(aq) \\longrightarrow \\text{AgCl}(s)',
        explanation: 'Isolates the actual chemical precipitation event.'
      }
    ],
    hint: 'Spectator ions (Na⁺ and NO₃⁻) cancel out completely.'
  }
];
