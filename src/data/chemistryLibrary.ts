import { ChemistryTopic } from '../types/chemistry';

export const CHEMISTRY_LIBRARY_TOPICS: ChemistryTopic[] = [
  // Gas Laws (Shelf 1)
  {
    id: 'boyles-law',
    category: 'gas-laws',
    categoryLabel: 'Gas Laws Collection',
    title: "Boyle's Law",
    subtitle: 'Pressure & Volume Inverse Relationship',
    summary: 'At constant temperature and moles, the pressure of an ideal gas is inversely proportional to its volume.',
    formulaLatex: 'P_1 V_1 = P_2 V_2',
    keyPoints: [
      'Discovered by Robert Boyle in 1662 using mercury J-tubes.',
      'As pressure increases, gas particles are compressed into a smaller volume.',
      'Temperature (T) and Amount of gas (n) remain strictly constant.',
      'P · V = constant (k).'
    ],
    keywords: ['boyle', 'pressure', 'volume', 'inverse', 'p1v1', 'gas law', 'compression', 'diver', 'syringe'],
    relatedLawId: 'boyles-law',
    readTime: '4 min'
  },
  {
    id: 'charles-law',
    category: 'gas-laws',
    categoryLabel: 'Gas Laws Collection',
    title: "Charles's Law",
    subtitle: 'Volume & Temperature Direct Relationship',
    summary: 'At constant pressure and moles, gas volume is directly proportional to its absolute temperature in Kelvin.',
    formulaLatex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
    keyPoints: [
      'Discovered by Jacques Charles in 1787 studying hydrogen balloons.',
      'Temperature must ALWAYS be converted to Kelvin: K = °C + 273.15.',
      'Extrapolating volume to zero established the concept of Absolute Zero (-273.15 °C).',
      'Pressure (P) and Amount of gas (n) remain constant.'
    ],
    keywords: ['charles', 'temperature', 'volume', 'kelvin', 'direct', 'balloon', 'absolute zero', 'expansion'],
    relatedLawId: 'charles-law',
    readTime: '4 min'
  },
  {
    id: 'gay-lussac-law',
    category: 'gas-laws',
    categoryLabel: 'Gas Laws Collection',
    title: "Gay-Lussac's Law",
    subtitle: 'Pressure & Temperature Direct Relationship in Rigid Containers',
    summary: 'In a fixed-volume vessel, gas pressure is directly proportional to absolute temperature in Kelvin.',
    formulaLatex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
    keyPoints: [
      'Formalized by Joseph Louis Gay-Lussac in 1802.',
      'Container must be rigid (steel tank, aerosol can, autoclave) so Volume is constant.',
      'Heating increases particle kinetic energy, producing more forceful impacts against walls.',
      'Temperature must be in Kelvin.'
    ],
    keywords: ['gay-lussac', 'pressure', 'temperature', 'rigid', 'autoclave', 'tire', 'aerosol', 'explosion'],
    relatedLawId: 'gay-lussac-law',
    readTime: '4 min'
  },
  {
    id: 'avogadro-law',
    category: 'gas-laws',
    categoryLabel: 'Gas Laws Collection',
    title: "Avogadro's Law",
    subtitle: 'Volume & Amount of Gas (Moles)',
    summary: 'Equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules.',
    formulaLatex: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}',
    keyPoints: [
      'Proposed by Amedeo Avogadro in 1811.',
      'Standard Molar Volume at STP (0 °C, 1 atm) is precisely 22.414 L/mol.',
      'Independent of molecular weight: 1 mol He takes the same volume as 1 mol SF₆.',
      'Pressure (P) and Temperature (T) remain constant.'
    ],
    keywords: ['avogadro', 'moles', 'volume', 'molecules', 'stp', '22.4', 'particle count'],
    relatedLawId: 'avogadro-law',
    readTime: '3 min'
  },
  {
    id: 'combined-gas-law',
    category: 'gas-laws',
    categoryLabel: 'Gas Laws Collection',
    title: 'Combined Gas Law',
    subtitle: 'Simultaneous Pressure, Volume, and Temperature Changes',
    summary: 'Combines Boyle, Charles, and Gay-Lussac into one master ratio when only gas quantity is constant.',
    formulaLatex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
    keyPoints: [
      'Unifies three empirical laws into a single predictive tool.',
      'Solves situations where all three state variables change at once (e.g. rising weather balloons).',
      'Requires Kelvin temperatures in the denominator.',
      'Amount of gas (n) remains constant.'
    ],
    keywords: ['combined', 'pressure', 'volume', 'temperature', 'p1v1/t1', 'weather balloon'],
    relatedLawId: 'combined-gas-law',
    readTime: '5 min'
  },
  {
    id: 'ideal-gas-law',
    category: 'gas-laws',
    categoryLabel: 'Gas Laws Collection',
    title: 'Ideal Gas Law',
    subtitle: 'The Universal State Equation PV = nRT',
    summary: 'Relates Pressure, Volume, Moles, and Temperature through the Universal Gas Constant R.',
    formulaLatex: 'P V = n R T',
    keyPoints: [
      'Synthesized by Benoît Émile Clapeyron in 1834.',
      'R = 0.08206 L·atm/(mol·K) or 8.314 J/(mol·K).',
      'Assumes particles have zero volume and experience no intermolecular attractions.',
      'Enables calculation of gas density (d = PM/RT) and molar mass (M = mRT/PV).'
    ],
    keywords: ['ideal gas', 'pv=nrt', 'gas constant', 'r', 'density', 'molar mass', 'clapeyron'],
    relatedLawId: 'ideal-gas-law',
    readTime: '6 min'
  },

  // Shelf 2: Periodic Chemistry
  {
    id: 'periodic-table-organization',
    category: 'periodic-table',
    categoryLabel: 'Periodic Chemistry',
    title: 'Periodic Table Architecture',
    subtitle: 'Periods, Groups, Blocks & Electron Configurations',
    summary: 'The modern periodic table organizes 118 elements by increasing atomic number and recurring valence electron valence patterns.',
    formulaLatex: 'Z = \\text{Protons} = \\text{Electrons (neutral atom)}',
    keyPoints: [
      'Rows are Periods (1–7), corresponding to principal energy levels (n).',
      'Columns are Groups/Families (1–18), sharing valence electron configurations.',
      'Divided into s, p, d, and f electron subshell blocks.',
      'Noble gases (Group 18) possess stable octets, explaining their non-reactive monoatomic gas behavior.'
    ],
    keywords: ['periodic table', 'elements', 'periods', 'groups', 'electron configuration', 'noble gases', 'valence'],
    readTime: '5 min'
  },
  {
    id: 'periodic-trends',
    category: 'periodic-table',
    categoryLabel: 'Periodic Chemistry',
    title: 'Periodic Trends & Atomic Radii',
    subtitle: 'Electronegativity, Ionization Energy & Atomic Size',
    summary: 'Systematic predictable variations across the periodic table dictated by effective nuclear charge (Zeff) and electron shielding.',
    formulaLatex: 'Z_{\\text{eff}} = Z - S',
    keyPoints: [
      'Atomic Radius: Decreases across a period (left to right), increases down a group.',
      'Ionization Energy: Energy required to remove an electron; peaks at top-right (Fluorine & Helium).',
      'Electronegativity: Ability of an atom to attract shared electrons in a bond; Fluorine is highest (4.0).',
      'Electron Shielding: Core inner electrons screen outer valence electrons from nuclear pull.'
    ],
    keywords: ['periodic trends', 'electronegativity', 'ionization energy', 'atomic radius', 'effective nuclear charge', 'zeff'],
    readTime: '6 min'
  },
  {
    id: 'atomic-structure',
    category: 'periodic-table',
    categoryLabel: 'Periodic Chemistry',
    title: 'Atomic Structure & Isotopes',
    subtitle: 'Subatomic Particles, Mass Number & Average Atomic Mass',
    summary: 'Atoms consist of a dense positive nucleus (protons + neutrons) surrounded by a quantized electron cloud.',
    formulaLatex: 'A = Z + N',
    keyPoints: [
      'Protons (p⁺, +1 charge) define element identity (Atomic Number Z).',
      'Neutrons (n⁰, neutral) provide nuclear glue via the strong force.',
      'Electrons (e⁻, -1 charge) determine chemical bonding and reactivity.',
      'Isotopes share the same Z but differ in neutron count N, yielding different mass numbers A.'
    ],
    keywords: ['atomic structure', 'proton', 'neutron', 'electron', 'isotope', 'mass number', 'nucleus'],
    readTime: '4 min'
  },

  // Shelf 3: Chemical Calculations
  {
    id: 'mole-concept',
    category: 'calculations',
    categoryLabel: 'Chemical Calculations',
    title: 'The Mole Concept & Avogadro Number',
    subtitle: 'Bridging Submicroscopic Particles and Macroscopic Mass',
    summary: 'One mole is defined as exactly 6.02214076 × 10²³ elementary entities, the foundational counting unit of chemistry.',
    formulaLatex: 'N_A = 6.022 \\times 10^{23}\\text{ entities/mol}',
    keyPoints: [
      'Avogadro constant allows counting atoms by weighing them on a laboratory balance.',
      '1 mole of ¹²C atoms weighs precisely 12 grams.',
      'Moles = particles / 6.022 × 10²³.',
      'Moles = grams / molar mass.'
    ],
    keywords: ['mole', 'avogadro number', 'counting', '6.022x10^23', 'particles', 'moles'],
    readTime: '5 min'
  },
  {
    id: 'molar-mass',
    category: 'calculations',
    categoryLabel: 'Chemical Calculations',
    title: 'Molar Mass & Empirical Formulas',
    subtitle: 'Calculating Formula Weight and Percent Composition',
    summary: 'The sum of atomic weights of all constituent atoms in a chemical formula, expressed in grams per mole (g/mol).',
    formulaLatex: '\\text{Molar Mass} = \\sum (n_i \\times M_i)',
    keyPoints: [
      'Water (H₂O) = 2(1.008) + 16.00 = 18.016 g/mol.',
      'Carbon dioxide (CO₂) = 12.011 + 2(16.00) = 44.01 g/mol.',
      'Percent composition by mass: % element = (mass of element in 1 mol / molar mass of compound) × 100.',
      'Essential for converting between mass and moles in gas law problems: n = m / M.'
    ],
    keywords: ['molar mass', 'formula mass', 'molecular weight', 'empirical formula', 'percent composition', 'grams to moles'],
    readTime: '4 min'
  },
  {
    id: 'stoichiometry',
    category: 'calculations',
    categoryLabel: 'Chemical Calculations',
    title: 'Stoichiometry & Limiting Reactants',
    subtitle: 'Quantitative Mole Ratios in Balanced Equations',
    summary: 'Using balanced chemical equations to calculate theoretical yields, determine limiting reactants, and predict product masses.',
    formulaLatex: '\\text{Moles Reactant} \\xrightarrow{\\text{mole ratio}} \\text{Moles Product}',
    keyPoints: [
      'Coefficients in a balanced equation represent exact mole ratios.',
      'Limiting reactant is completely consumed first, restricting the maximum amount of product formed.',
      'Percent Yield = (Actual Yield / Theoretical Yield) × 100%.',
      'Gas stoichiometry links reaction moles with gas volume at STP via 22.4 L/mol.'
    ],
    keywords: ['stoichiometry', 'limiting reactant', 'theoretical yield', 'mole ratio', 'balanced equation', 'excess reactant'],
    readTime: '7 min'
  },

  // Shelf 4: Inorganic Compounds
  {
    id: 'ionic-vs-covalent',
    category: 'compounds',
    categoryLabel: 'Inorganic Compounds',
    title: 'Ionic vs Molecular Compounds',
    subtitle: 'Lattice Networks vs Discrete Molecules',
    summary: 'Ionic compounds form from electron transfer creating crystalline lattices, whereas covalent molecules share electron pairs.',
    formulaLatex: '\\Delta\\text{EN} > 1.7 \\implies \\text{Predominantly Ionic}',
    keyPoints: [
      'Ionic: Metal + Non-metal (e.g., NaCl, MgO). High melting points, brittle, conduct electricity when dissolved or molten.',
      'Covalent: Non-metal + Non-metal (e.g., H₂O, CO₂, NH₃). Lower melting points, non-conductive, form discrete molecules.',
      'Polyatomic ions (SO₄²⁻, NO₃⁻, NH₄⁺) feature internal covalent bonds with an overall net ionic charge.'
    ],
    keywords: ['ionic', 'covalent', 'molecular', 'crystal lattice', 'electronegativity', 'bonding', 'salts'],
    readTime: '5 min'
  },
  {
    id: 'acids-and-bases',
    category: 'compounds',
    categoryLabel: 'Inorganic Compounds',
    title: 'Acids, Bases & pH Scale',
    subtitle: 'Arrhenius & Brønsted-Lowry Theory',
    summary: 'Acids act as proton (H⁺) donors and increase [H₃O⁺]; bases act as proton acceptors or yield hydroxide ions [OH⁻].',
    formulaLatex: '\\text{pH} = -\\log_{10}[\\text{H}^+]',
    keyPoints: [
      'Strong acids (HCl, HNO₃, H₂SO₄, HBr, HI, HClO₄) dissociate completely in aqueous solution.',
      'Strong bases (Group 1 and 2 hydroxides: NaOH, KOH, Ca(OH)₂) dissociate 100% into OH⁻.',
      'pH scale: pH < 7 is acidic, pH = 7 is neutral, pH > 7 is alkaline/basic at 25 °C.',
      'Acid + Base neutralization generates salt + water: HCl + NaOH → NaCl + H₂O.'
    ],
    keywords: ['acid', 'base', 'ph', 'hydroxide', 'hydronium', 'arrhenius', 'bronsted', 'neutralization'],
    readTime: '6 min'
  },
  {
    id: 'solubility-and-salts',
    category: 'compounds',
    categoryLabel: 'Inorganic Compounds',
    title: 'Salts & Solubility Rules',
    subtitle: 'Predicting Aqueous Dissolution and Insoluble Precipitates',
    summary: 'Rules governing which ionic combinations remain dissolved in aqueous solutions versus forming solid precipitates.',
    formulaLatex: 'K_{\\text{sp}} = [\\text{Cation}]^m [\\text{Anion}]^n',
    keyPoints: [
      'Always Soluble: All Nitrates (NO₃⁻), Acetates (C₂H₃O₂⁻), Alkali metal ions (Li⁺, Na⁺, K⁺), and Ammonium (NH₄⁺).',
      'Usually Insoluble: Carbonates (CO₃²⁻), Phosphates (PO₄³⁻), and Hydroxides (OH⁻) unless paired with alkali cations.',
      'Halides (Cl⁻, Br⁻, I⁻) are soluble EXCEPT with Ag⁺, Pb²⁺, and Hg₂²⁺.',
      'Sulfates (SO₄²⁻) are soluble EXCEPT with Ba²⁺, Pb²⁺, Ca²⁺, and Sr²⁺.'
    ],
    keywords: ['solubility', 'salts', 'precipitate', 'ksp', 'dissolution', 'insoluble', 'aqueous'],
    readTime: '5 min'
  },

  // Shelf 5: Reactions
  {
    id: 'chemical-equations',
    category: 'reactions',
    categoryLabel: 'Chemical Reactions',
    title: 'Balancing Chemical Equations',
    subtitle: 'The Law of Conservation of Mass in Practice',
    summary: 'Matter can neither be created nor destroyed; atoms of each element on the reactant side must equal atoms on the product side.',
    formulaLatex: '\\sum \\text{Atoms (Reactants)} = \\sum \\text{Atoms (Products)}',
    keyPoints: [
      'Never change chemical subscripts (doing so alters the identity of the chemical compound).',
      'Only adjust stoichiometric coefficients in front of formulas.',
      'Balance metals first, then non-metals, saving Hydrogen and Oxygen for last.',
      'State symbols designate physical states: (s) solid, (l) liquid, (g) gas, (aq) aqueous.'
    ],
    keywords: ['chemical equation', 'balancing', 'conservation of mass', 'reactants', 'products', 'coefficients'],
    readTime: '4 min'
  },
  {
    id: 'redox-chemistry',
    category: 'reactions',
    categoryLabel: 'Chemical Reactions',
    title: 'Oxidation-Reduction (Redox)',
    subtitle: 'Electron Transfer, Oxidation States & Half-Reactions',
    summary: 'Redox reactions involve simultaneous electron loss (oxidation) and electron gain (reduction): OIL RIG.',
    formulaLatex: '\\text{Zn}(s) + \\text{Cu}^{2+}(aq) \\longrightarrow \\text{Zn}^{2+}(aq) + \\text{Cu}(s)',
    keyPoints: [
      'Oxidation Is Loss of electrons (Oxidation number increases).',
      'Reduction Is Gain of electrons (Oxidation number decreases).',
      'Reducing Agent is the species being oxidized; Oxidizing Agent is the species being reduced.',
      'Rules for oxidation numbers: pure element = 0; Group 1 = +1; Fluorine = -1; Oxygen = -2 (except peroxides).'
    ],
    keywords: ['redox', 'oxidation', 'reduction', 'electron transfer', 'half-reaction', 'oxidizing agent', 'oil rig'],
    readTime: '6 min'
  },
  {
    id: 'precipitation-reactions',
    category: 'reactions',
    categoryLabel: 'Chemical Reactions',
    title: 'Precipitation & Net Ionic Equations',
    subtitle: 'Spectator Ions and Solid Insoluble Formation',
    summary: 'When two clear aqueous salt solutions combine to produce an insoluble solid that falls out of solution.',
    formulaLatex: '\\text{Ag}^+(aq) + \\text{Cl}^-(aq) \\longrightarrow \\text{AgCl}(s)',
    keyPoints: [
      'Molecular equation shows all compounds in their neutral formula units.',
      'Complete ionic equation displays all soluble strong electrolytes dissociated into free ions.',
      'Spectator ions appear unchanged on both sides and are canceled out.',
      'Net ionic equation isolates the actual chemical event forming the precipitate.'
    ],
    keywords: ['precipitation', 'net ionic equation', 'spectator ions', 'insoluble', 'double displacement'],
    readTime: '5 min'
  }
];
