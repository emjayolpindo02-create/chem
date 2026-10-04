import { GasLawInfo } from '../types/chemistry';

export const GAS_LAWS_DATA: Record<string, GasLawInfo> = {
  'boyles-law': {
    id: 'boyles-law',
    name: "Boyle's Law",
    shortName: 'Boyle',
    scientist: 'Robert Boyle',
    scientistYears: '1627 – 1691',
    scientistOrigin: 'Lismore Castle, Ireland / Oxford, England',
    historicalContext:
      'In 1662, Anglo-Irish philosopher Robert Boyle published his foundational experiments with a J-shaped glass tube containing mercury. By pouring mercury into the open limb to compress trapped air, Boyle proved that the "spring of air" was inversely proportional to its volume, formulating the very first quantitative empirical gas law in chemistry.',
    coreConcept:
      'At constant temperature and gas quantity, the volume of a given mass of gas is inversely proportional to its pressure. If you compress the gas into half the volume, the particles collide with the walls twice as frequently, doubling the pressure.',
    primaryFormulaLatex: 'P_1 V_1 = P_2 V_2',
    plainTextFormula: 'P1 * V1 = P2 * V2',
    relationshipType: 'inverse',
    changingVariables: ['Pressure (P)', 'Volume (V)'],
    constantVariables: ['Temperature (T)', 'Amount of gas (n)'],
    unitRequirements: [
      'P₁ and P₂ must be in identical pressure units (atm, kPa, mmHg, or torr)',
      'V₁ and V₂ must be in identical volume units (L, mL, cm³, or m³)',
      'No Kelvin conversion is needed here because Temperature is held constant'
    ],
    commonMistakes: [
      {
        mistake: 'Directly multiplying when solving instead of dividing (e.g. V₂ = P₁ · V₁ · P₂)',
        reason: 'Students confuse the inverse relationship with direct proportions.',
        correction: 'To isolate V₂, divide both sides by P₂: V₂ = (P₁ · V₁) / P₂.',
        correctionLatex: 'V_2 = \\frac{P_1 V_1}{P_2}'
      },
      {
        mistake: 'Using mismatched units (e.g. P₁ in atm and P₂ in mmHg)',
        reason: 'Units will not cancel properly if they are in different scales.',
        correction: 'Convert mmHg to atm first by dividing by 760 (1 atm = 760 mmHg).',
        correctionLatex: 'P = \\frac{760\\text{ mmHg}}{760\\text{ mmHg/atm}} = 1.0\\text{ atm}'
      }
    ],
    workedExample: {
      problemStatement:
        'A cylinder filled with gas occupies a volume of 2.50 L at an initial pressure of 1.20 atm. If the piston compresses the gas to a final pressure of 3.00 atm at constant temperature, what is the final volume of the gas?',
      given: {
        'P_1': '1.20 atm',
        'V_1': '2.50 L',
        'P_2': '3.00 atm',
        'T': 'Constant'
      },
      unknown: 'V_2 = ? (L)',
      formulaLatex: 'P_1 V_1 = P_2 V_2',
      rearrangementLatex: 'V_2 = \\frac{P_1 V_1}{P_2}',
      substitutionLatex: 'V_2 = \\frac{(1.20\\text{ atm})(2.50\\text{ L})}{3.00\\text{ atm}}',
      solutionLatex: 'V_2 = 1.00\\text{ L}',
      explanation:
        'Notice that the pressure increased from 1.20 atm to 3.00 atm (a factor of 2.5x). Because Boyle\'s law describes an inverse relationship, the volume decreased by the exact same factor, dropping from 2.50 L down to 1.00 L.'
    },
    rearrangements: [
      {
        targetVariable: 'V_2 (Final Volume)',
        latex: 'V_2 = \\frac{P_1 V_1}{P_2}',
        explanation: 'Divide both sides of P₁V₁ = P₂V₂ by P₂ to isolate V₂.',
        steps: [
          'Start with P₁V₁ = P₂V₂',
          'Divide both sides by P₂: (P₁V₁) / P₂ = (P₂V₂) / P₂',
          'Cancel P₂ on the right side: V₂ = (P₁V₁) / P₂'
        ]
      },
      {
        targetVariable: 'P_2 (Final Pressure)',
        latex: 'P_2 = \\frac{P_1 V_1}{V_2}',
        explanation: 'Divide both sides of P₁V₁ = P₂V₂ by V₂ to isolate P₂.',
        steps: [
          'Start with P₁V₁ = P₂V₂',
          'Divide both sides by V₂: (P₁V₁) / V₂ = (P₂V₂) / V₂',
          'Cancel V₂ on the right side: P₂ = (P₁V₁) / V₂'
        ]
      },
      {
        targetVariable: 'V_1 (Initial Volume)',
        latex: 'V_1 = \\frac{P_2 V_2}{P_1}',
        explanation: 'Divide both sides of P₁V₁ = P₂V₂ by P₁ to isolate V₁.',
        steps: [
          'Start with P₁V₁ = P₂V₂',
          'Divide both sides by P₁: (P₁V₁) / P₁ = (P₂V₂) / P₁',
          'Cancel P₁ on the left side: V₁ = (P₂V₂) / P₁'
        ]
      },
      {
        targetVariable: 'P_1 (Initial Pressure)',
        latex: 'P_1 = \\frac{P_2 V_2}{V_1}',
        explanation: 'Divide both sides of P₁V₁ = P₂V₂ by V₁ to isolate P₁.',
        steps: [
          'Start with P₁V₁ = P₂V₂',
          'Divide both sides by V₁: (P₁V₁) / V₁ = (P₂V₂) / V₁',
          'Cancel V₁ on the left side: P₁ = (P₂V₂) / V₁'
        ]
      }
    ],
    realWorldApplications: [
      {
        title: 'Deep-Sea Scuba Diving & Air Embolism',
        icon: '🤿',
        summary: 'Ascending diver bubbles expand rapidly.',
        detail: 'Every 10 meters of water adds roughly 1 atm of hydrostatic pressure. As a scuba diver ascends to the surface, ambient pressure drops, causing air in the lungs to expand. Divers must continuously breathe out to prevent pulmonary barotrauma.'
      },
      {
        title: 'Medical Syringe Action',
        icon: '💉',
        summary: 'Pulling plunger lowers internal pressure.',
        detail: 'When a nurse pulls the syringe plunger back, the volume inside the barrel increases. By Boyle\'s Law, the pressure inside drops below atmospheric pressure, drawing liquid medication into the chamber.'
      },
      {
        title: 'Human Breathing (Inhalation / Exhalation)',
        icon: '🫁',
        summary: 'Diaphragm movement alters thoracic cavity volume.',
        detail: 'When the diaphragm contracts downward, the chest cavity volume expands. The drop in intrapulmonary pressure draws atmospheric air inward. Exhalation reverses this process.'
      }
    ],
    color: '#0284c7',
    accentBorder: 'border-sky-500'
  },

  'charles-law': {
    id: 'charles-law',
    name: "Charles's Law",
    shortName: 'Charles',
    scientist: 'Jacques Charles',
    scientistYears: '1746 – 1823',
    scientistOrigin: 'Beaugency, France',
    historicalContext:
      'In 1787, pioneering French balloonist and physicist Jacques Alexandre César Charles experimented with hydrogen-filled balloons. He discovered that samples of various gases expanded uniformly by 1/273 of their volume for every Celsius degree increase at constant pressure, giving birth to the concept of Absolute Zero.',
    coreConcept:
      'At constant pressure and gas amount, the volume of a dry gas is directly proportional to its absolute temperature in Kelvin. As temperature increases, gas particles gain kinetic energy, moving faster and striking the container boundaries with greater momentum, forcing the boundaries outward to keep pressure constant.',
    primaryFormulaLatex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
    plainTextFormula: 'V1 / T1 = V2 / T2',
    relationshipType: 'direct',
    changingVariables: ['Volume (V)', 'Temperature (T)'],
    constantVariables: ['Pressure (P)', 'Amount of gas (n)'],
    unitRequirements: [
      'Temperature MUST ALWAYS BE IN KELVIN (K = °C + 273.15). Using Celsius causes complete calculation failure!',
      'V₁ and V₂ must share the same volume units (L, mL, cm³, or m³)'
    ],
    commonMistakes: [
      {
        mistake: 'Using Celsius (°C) directly in the formula instead of converting to Kelvin (K)',
        reason: 'The Celsius scale has an arbitrary zero (freezing point of water). Proportions are only valid on an absolute thermodynamic temperature scale with Absolute Zero.',
        correction: 'Always convert temperature: K = °C + 273.15 before doing any math!',
        correctionLatex: 'T(\\text{K}) = T(^\\circ\\text{C}) + 273.15'
      },
      {
        mistake: 'Flipping the fraction upside down during cross-multiplication (e.g. V₂ = (V₁ · T₁) / T₂)',
        reason: 'Errors in isolating the numerator variable.',
        correction: 'Cross multiply: V₁ · T₂ = V₂ · T₁. Then divide by T₁: V₂ = (V₁ · T₂) / T₁.',
        correctionLatex: 'V_2 = \\frac{V_1 T_2}{T_1}'
      }
    ],
    workedExample: {
      problemStatement:
        'A party balloon filled with helium has a volume of 3.20 L at room temperature (25.0 °C). If the balloon is placed outside in winter where the temperature drops to -15.0 °C at constant atmospheric pressure, what is its new volume?',
      given: {
        'V_1': '3.20 L',
        'T_1': '25.0 °C + 273.15 = 298.15 K',
        'T_2': '-15.0 °C + 273.15 = 258.15 K',
        'P': 'Constant (1 atm)'
      },
      unknown: 'V_2 = ? (L)',
      formulaLatex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
      rearrangementLatex: 'V_2 = \\frac{V_1 T_2}{T_1}',
      substitutionLatex: 'V_2 = \\frac{(3.20\\text{ L})(258.15\\text{ K})}{298.15\\text{ K}}',
      solutionLatex: 'V_2 = 2.77\\text{ L}',
      explanation:
        'Because the absolute temperature dropped from 298.15 K to 258.15 K, the gas molecules lost thermal kinetic energy. The balloon contracted from 3.20 L to 2.77 L to maintain equal pressure with the surrounding atmosphere.'
    },
    rearrangements: [
      {
        targetVariable: 'V_2 (Final Volume)',
        latex: 'V_2 = \\frac{V_1 T_2}{T_1}',
        explanation: 'Cross multiply: V₁·T₂ = V₂·T₁, then divide both sides by T₁.',
        steps: [
          'V₁ / T₁ = V₂ / T₂',
          'Cross-multiply: V₁ · T₂ = V₂ · T₁',
          'Divide both sides by T₁: V₂ = (V₁ · T₂) / T₁'
        ]
      },
      {
        targetVariable: 'T_2 (Final Temperature)',
        latex: 'T_2 = \\frac{V_2 T_1}{V_1}',
        explanation: 'Cross multiply: V₁·T₂ = V₂·T₁, then divide both sides by V₁.',
        steps: [
          'V₁ / T₁ = V₂ / T₂',
          'Cross-multiply: V₁ · T₂ = V₂ · T₁',
          'Divide both sides by V₁: T₂ = (V₂ · T₁) / V₁'
        ]
      },
      {
        targetVariable: 'V_1 (Initial Volume)',
        latex: 'V_1 = \\frac{V_2 T_1}{T_2}',
        explanation: 'Multiply both sides by T₁ to isolate V₁.',
        steps: [
          'V₁ / T₁ = V₂ / T₂',
          'Multiply both sides by T₁: V₁ = (V₂ · T₁) / T₂'
        ]
      },
      {
        targetVariable: 'T_1 (Initial Temperature)',
        latex: 'T_1 = \\frac{V_1 T_2}{V_2}',
        explanation: 'Cross multiply: V₁·T₂ = V₂·T₁, then divide both sides by V₂.',
        steps: [
          'V₁ / T₁ = V₂ / T₂',
          'Cross-multiply: V₁ · T₂ = V₂ · T₁',
          'Divide both sides by V₂: T₁ = (V₁ · T₂) / V₂'
        ]
      }
    ],
    realWorldApplications: [
      {
        title: 'Hot Air Balloons',
        icon: '🎈',
        summary: 'Heating air expands its volume and decreases its density.',
        detail: 'The burner heats air inside the balloon envelope. As temperature rises, volume expands and excess air escapes through the open bottom skirt. The hot air inside becomes less dense than the cooler surrounding air, generating buoyant lift.'
      },
      {
        title: 'Deflated Basketball in Winter',
        icon: '🏀',
        summary: 'Leaving a basketball out in the cold reduces its volume and bounce.',
        detail: 'When warm air inside an inflated ball cools down outside, the particles slow down and exert less pressure, causing the ball to become noticeably under-inflated and soft.'
      },
      {
        title: 'Baking Bread & Pastries',
        icon: '🥐',
        summary: 'Yeast gas bubbles expand inside hot oven dough.',
        detail: 'Air and carbon dioxide trapped inside yeast dough expand as the oven heats up, yielding fluffy, risen bread and pastry textures.'
      }
    ],
    color: '#10b981',
    accentBorder: 'border-emerald-500'
  },

  'gay-lussac-law': {
    id: 'gay-lussac-law',
    name: "Gay-Lussac's Law",
    shortName: 'Gay-Lussac',
    scientist: 'Joseph Louis Gay-Lussac',
    scientistYears: '1778 – 1850',
    scientistOrigin: 'Saint-Léonard-de-Noblat, France',
    historicalContext:
      'In 1802, French chemist Joseph Louis Gay-Lussac formalized the relationship between the pressure and temperature of a gas held inside a rigid container of fixed volume (often also attributed to Guillaume Amontons in early 1700s). Gay-Lussac even took dangerous high-altitude balloon flights up to 7,000 meters to measure atmospheric gases.',
    coreConcept:
      'In a rigid container where volume and amount of gas remain constant, the pressure of a gas is directly proportional to its absolute temperature in Kelvin. Heating the gas causes particles to move faster and crash against the rigid walls with higher impact force and frequency.',
    primaryFormulaLatex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
    plainTextFormula: 'P1 / T1 = P2 / T2',
    relationshipType: 'direct',
    changingVariables: ['Pressure (P)', 'Temperature (T)'],
    constantVariables: ['Volume (V)', 'Amount of gas (n)'],
    unitRequirements: [
      'Temperature MUST BE IN KELVIN (K = °C + 273.15)',
      'P₁ and P₂ must have matching units (atm, kPa, or psi)'
    ],
    commonMistakes: [
      {
        mistake: 'Assuming a rigid container changes volume when heated',
        reason: 'Confusion between flexible containers (Charles\'s Law) and rigid steel/metal tanks (Gay-Lussac\'s Law).',
        correction: 'In a steel tank or autoclave, Volume (V) is locked. Only Pressure (P) climbs as Temperature (T) rises.',
        correctionLatex: 'V = \\text{Constant}'
      },
      {
        mistake: 'Neglecting Kelvin conversion and ending up with negative pressure values',
        reason: 'Using negative Celsius temperatures results in nonsensical negative pressure.',
        correction: 'Always convert negative Celsius to positive Kelvin: K = °C + 273.15.',
        correctionLatex: 'T = -10^\\circ\\text{C} + 273.15 = 263.15\\text{ K}'
      }
    ],
    workedExample: {
      problemStatement:
        'A sealed, rigid steel aerosol can contains propellent gas at a pressure of 3.20 atm and an ambient temperature of 20.0 °C. The can is accidentally discarded into a bonfire reaching 650.0 °C. What internal pressure develops inside the can?',
      given: {
        'P_1': '3.20 atm',
        'T_1': '20.0 °C + 273.15 = 293.15 K',
        'T_2': '650.0 °C + 273.15 = 923.15 K',
        'V': 'Constant (Rigid steel can)'
      },
      unknown: 'P_2 = ? (atm)',
      formulaLatex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
      rearrangementLatex: 'P_2 = \\frac{P_1 T_2}{T_1}',
      substitutionLatex: 'P_2 = \\frac{(3.20\\text{ atm})(923.15\\text{ K})}{293.15\\text{ K}}',
      solutionLatex: 'P_2 = 10.08\\text{ atm}',
      explanation:
        'The absolute temperature increased by over 3.1x (from 293.15 K to 923.15 K). Because the volume is rigid, the internal pressure climbed from 3.20 atm up to 10.08 atm, illustrating why aerosol cans pose a catastrophic explosion hazard in fires.'
    },
    rearrangements: [
      {
        targetVariable: 'P_2 (Final Pressure)',
        latex: 'P_2 = \\frac{P_1 T_2}{T_1}',
        explanation: 'Cross multiply: P₁·T₂ = P₂·T₁, then divide both sides by T₁.',
        steps: [
          'P₁ / T₁ = P₂ / T₂',
          'Cross-multiply: P₁ · T₂ = P₂ · T₁',
          'Divide both sides by T₁: P₂ = (P₁ · T₂) / T₁'
        ]
      },
      {
        targetVariable: 'T_2 (Final Temperature)',
        latex: 'T_2 = \\frac{P_2 T_1}{P_1}',
        explanation: 'Cross multiply: P₁·T₂ = P₂·T₁, then divide both sides by P₁.',
        steps: [
          'P₁ / T₁ = P₂ / T₂',
          'Cross-multiply: P₁ · T₂ = P₂ · T₁',
          'Divide both sides by P₁: T₂ = (P₂ · T₁) / P₁'
        ]
      },
      {
        targetVariable: 'P_1 (Initial Pressure)',
        latex: 'P_1 = \\frac{P_2 T_1}{T_2}',
        explanation: 'Multiply both sides by T₁.',
        steps: [
          'P₁ / T₁ = P₂ / T₂',
          'Multiply both sides by T₁: P₁ = (P₂ · T₁) / T₂'
        ]
      },
      {
        targetVariable: 'T_1 (Initial Temperature)',
        latex: 'T_1 = \\frac{P_1 T_2}{P_2}',
        explanation: 'Cross multiply: P₁·T₂ = P₂·T₁, then divide both sides by P₂.',
        steps: [
          'P₁ / T₁ = P₂ / T₂',
          'Cross-multiply: P₁ · T₂ = P₂ · T₁',
          'Divide both sides by P₂: T₁ = (P₁ · T₂) / P₂'
        ]
      }
    ],
    realWorldApplications: [
      {
        title: 'Pressure Cookers & Autoclaves',
        icon: '🍲',
        summary: 'Fixed-volume steam builds higher pressure, raising water boiling point.',
        detail: 'In a sealed pressure cooker, water cannot expand as steam. The internal pressure rises above 2 atm, allowing water to boil at ~121 °C instead of 100 °C, cooking food in a fraction of the normal time and sterilizing hospital tools.'
      },
      {
        title: 'Automobile Tires on Long Highway Drives',
        icon: '🚗',
        summary: 'Friction heats the air inside the tire, increasing tire gauge PSI.',
        detail: 'After high-speed highway driving in summer, friction between the road and rubber heats the trapped tire air. The pressure reading increases by 4 to 6 PSI without adding any air.'
      },
      {
        title: 'Aerosol Can Explosion Warnings',
        icon: '⚠️',
        summary: '"Do not incinerate or store above 50 °C" warning labels.',
        detail: 'Because aerosol cans are rigid steel, excessive heat causes internal gas pressure to spike until it exceeds the tensile strength of the seam, causing violent shrapnel rupture.'
      }
    ],
    color: '#f59e0b',
    accentBorder: 'border-amber-500'
  },

  'avogadro-law': {
    id: 'avogadro-law',
    name: "Avogadro's Law",
    shortName: 'Avogadro',
    scientist: 'Amedeo Avogadro',
    scientistYears: '1776 – 1856',
    scientistOrigin: 'Turin, Kingdom of Sardinia (Italy)',
    historicalContext:
      'In 1811, Italian count and physicist Amedeo Avogadro proposed the radical hypothesis that equal volumes of all gases at the same temperature and pressure contain identical numbers of molecules. Though rejected for 50 years until Stanislao Cannizzaro championed it at the Karlsruhe Congress in 1860, Avogadro\'s law became the cornerstone of molecular chemistry.',
    coreConcept:
      'At constant temperature and pressure, the volume of a gas is directly proportional to the number of moles (amount) of gas present. Adding more gas molecules into a flexible container forces the walls outward to maintain balanced internal pressure against the surrounding atmosphere.',
    primaryFormulaLatex: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}',
    plainTextFormula: 'V1 / n1 = V2 / n2',
    relationshipType: 'direct',
    changingVariables: ['Volume (V)', 'Amount of gas in moles (n)'],
    constantVariables: ['Pressure (P)', 'Temperature (T)'],
    unitRequirements: [
      'n must be in moles (mol). If given mass in grams, divide by molar mass: n = m / M',
      'V₁ and V₂ must share the same volume units (L or mL)',
      'At STP (0 °C, 1 atm): 1 mole of any ideal gas occupies exactly 22.414 L'
    ],
    commonMistakes: [
      {
        mistake: 'Plugging grams (g) directly into "n" instead of moles (mol)',
        reason: 'Gas laws count particles (moles), not bulk mass in grams.',
        correction: 'Divide grams by molar mass: n = grams / (molar mass in g/mol).',
        correctionLatex: 'n = \\frac{\\text{mass (g)}}{\\text{Molar Mass (g/mol)}}'
      },
      {
        mistake: 'Thinking heavier gas molecules take up more volume than lighter ones',
        reason: 'Intuition suggests big molecules take more space.',
        correction: 'In an ideal gas, particle size is negligible compared to the vast empty space between them. 1 mole of heavy SF₆ gas occupies the exact same 22.4 L as 1 mole of light H₂ gas at STP!',
        correctionLatex: 'V_{\\text{molar}} = 22.414\\text{ L at STP}'
      }
    ],
    workedExample: {
      problemStatement:
        'A weather balloon initially contains 1.50 moles of helium gas and expands to a volume of 33.6 L. A technician injects an additional 2.50 moles of helium into the balloon at constant temperature and pressure. What is the new volume of the balloon?',
      given: {
        'n_1': '1.50 mol',
        'V_1': '33.6 L',
        'n_2': '1.50 mol + 2.50 mol = 4.00 mol (Total final moles!)',
        'P, T': 'Constant'
      },
      unknown: 'V_2 = ? (L)',
      formulaLatex: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}',
      rearrangementLatex: 'V_2 = \\frac{V_1 n_2}{n_1}',
      substitutionLatex: 'V_2 = \\frac{(33.6\\text{ L})(4.00\\text{ mol})}{1.50\\text{ mol}}',
      solutionLatex: 'V_2 = 89.6\\text{ L}',
      explanation:
        'Notice that n₂ is the TOTAL final moles (1.50 + 2.50 = 4.00 mol). Because volume is directly proportional to moles, increasing moles by a factor of 2.67x increased the balloon volume proportionally from 33.6 L to 89.6 L.'
    },
    rearrangements: [
      {
        targetVariable: 'V_2 (Final Volume)',
        latex: 'V_2 = \\frac{V_1 n_2}{n_1}',
        explanation: 'Cross multiply: V₁·n₂ = V₂·n₁, then divide both sides by n₁.',
        steps: [
          'V₁ / n₁ = V₂ / n₂',
          'Cross-multiply: V₁ · n₂ = V₂ · n₁',
          'Divide both sides by n₁: V₂ = (V₁ · n₂) / n₁'
        ]
      },
      {
        targetVariable: 'n_2 (Final Moles)',
        latex: 'n_2 = \\frac{V_2 n_1}{V_1}',
        explanation: 'Cross multiply: V₁·n₂ = V₂·n₁, then divide both sides by V₁.',
        steps: [
          'V₁ / n₁ = V₂ / n₂',
          'Cross-multiply: V₁ · n₂ = V₂ · n₁',
          'Divide both sides by V₁: n₂ = (V₂ · n₁) / V₁'
        ]
      },
      {
        targetVariable: 'V_1 (Initial Volume)',
        latex: 'V_1 = \\frac{V_2 n_1}{n_2}',
        explanation: 'Multiply both sides by n₁.',
        steps: [
          'V₁ / n₁ = V₂ / n₂',
          'Multiply both sides by n₁: V₁ = (V₂ · n₁) / n₂'
        ]
      },
      {
        targetVariable: 'n_1 (Initial Moles)',
        latex: 'n_1 = \\frac{V_1 n_2}{V_2}',
        explanation: 'Cross multiply: V₁·n₂ = V₂·n₁, then divide both sides by V₂.',
        steps: [
          'V₁ / n₁ = V₂ / n₂',
          'Cross-multiply: V₁ · n₂ = V₂ · n₁',
          'Divide both sides by V₂: n₁ = (V₁ · n₂) / V₂'
        ]
      }
    ],
    realWorldApplications: [
      {
        title: 'Blowing Up a Balloon',
        icon: '🎈',
        summary: 'Exhaling more gas particles expands the rubber volume.',
        detail: 'As you blow into a balloon, you deliver roughly 0.05 moles of air per breath. Each additional mole of gas pushes the flexible rubber outward.'
      },
      {
        title: 'Automotive Airbag Deployment',
        icon: '🚗',
        summary: 'Sodium azide (NaN₃) reaction creates rapid nitrogen gas moles.',
        detail: 'During an automobile collision, an electrical spark triggers rapid decomposition of solid sodium azide: 2 NaN₃(s) → 2 Na(s) + 3 N₂(g). Generating 3 moles of N₂ gas per reaction within 30 milliseconds inflates the 60-liter airbag instantly.'
      },
      {
        title: 'Standard Molar Volume at STP',
        icon: '📐',
        summary: '22.414 L occupied by 1 mole of any gas.',
        detail: 'At 0 °C and 1 atm, one mole of helium, oxygen, methane, or sulfur hexafluoride all occupy precisely 22.414 L, providing an essential conversion bridge between gas volume and stoichiometric mole ratios.'
      }
    ],
    color: '#8b5cf6',
    accentBorder: 'border-purple-500'
  },

  'combined-gas-law': {
    id: 'combined-gas-law',
    name: 'Combined Gas Law',
    shortName: 'Combined',
    scientist: 'Boyle, Charles, & Gay-Lussac',
    scientistYears: '17th – 19th Century Synthesis',
    scientistOrigin: 'International European Physics',
    historicalContext:
      'The Combined Gas Law integrates Boyle\'s Law, Charles\'s Law, and Gay-Lussac\'s Law into a single master ratio equation for a fixed quantity of gas. It handles practical situations where pressure, volume, AND temperature all change simultaneously, such as weather balloons rising through the atmosphere.',
    coreConcept:
      'When the amount of gas (n) remains constant, the ratio of the product of pressure and volume to absolute temperature remains constant. P₁V₁ / T₁ = P₂V₂ / T₂. If temperature and pressure both shift, you can predict the resulting volume without having to hold any parameter fixed.',
    primaryFormulaLatex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
    plainTextFormula: '(P1 * V1) / T1 = (P2 * V2) / T2',
    relationshipType: 'combined',
    changingVariables: ['Pressure (P)', 'Volume (V)', 'Temperature (T)'],
    constantVariables: ['Amount of gas (n)'],
    unitRequirements: [
      'Temperature MUST ALWAYS BE IN KELVIN (T₁ and T₂)',
      'P₁ and P₂ must match units (e.g., both atm)',
      'V₁ and V₂ must match units (e.g., both L)'
    ],
    commonMistakes: [
      {
        mistake: 'Messing up cross-multiplication with 6 variables',
        reason: 'Students forget that T₁ and T₂ are in the denominator.',
        correction: 'Cross multiply the diagonals first: P₁ · V₁ · T₂ = P₂ · V₂ · T₁. Then divide by the unwanted terms.',
        correctionLatex: 'P_1 V_1 T_2 = P_2 V_2 T_1'
      },
      {
        mistake: 'Forgetting that STP means 273.15 K and 1.00 atm',
        reason: 'Standard Temperature and Pressure is often mentioned in words without numerical values.',
        correction: 'STP values: T = 273.15 K, P = 1.00 atm (or 101.325 kPa, 760 mmHg).',
        correctionLatex: 'T_{\\text{STP}} = 273.15\\text{ K},\\quad P_{\\text{STP}} = 1.00\\text{ atm}'
      }
    ],
    workedExample: {
      problemStatement:
        'A high-altitude scientific research balloon has a volume of 45.0 L at ground level where the pressure is 1.00 atm and the temperature is 22.0 °C. The balloon climbs to an altitude of 10,000 meters where the atmospheric pressure drops to 0.280 atm and the temperature plummets to -48.0 °C. What is the volume of the balloon at this altitude?',
      given: {
        'P_1': '1.00 atm',
        'V_1': '45.0 L',
        'T_1': '22.0 °C + 273.15 = 295.15 K',
        'P_2': '0.280 atm',
        'T_2': '-48.0 °C + 273.15 = 225.15 K',
        'n': 'Constant (Sealed balloon)'
      },
      unknown: 'V_2 = ? (L)',
      formulaLatex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
      rearrangementLatex: 'V_2 = \\frac{P_1 V_1 T_2}{P_2 T_1}',
      substitutionLatex: 'V_2 = \\frac{(1.00\\text{ atm})(45.0\\text{ L})(225.15\\text{ K})}{(0.280\\text{ atm})(295.15\\text{ K})}',
      solutionLatex: 'V_2 = 122.69\\text{ L}',
      explanation:
        'Notice two opposing effects: The pressure drop (from 1.00 atm to 0.280 atm) would expand the balloon by ~3.57x. However, the cooling temperature (from 295.15 K to 225.15 K) would contract the balloon by 0.76x. Combining both effects yields a net expansion from 45.0 L to 122.69 L.'
    },
    rearrangements: [
      {
        targetVariable: 'V_2 (Final Volume)',
        latex: 'V_2 = \\frac{P_1 V_1 T_2}{P_2 T_1}',
        explanation: 'Cross-multiply to get P₁V₁T₂ = P₂V₂T₁, then divide both sides by (P₂T₁).',
        steps: [
          '(P₁V₁) / T₁ = (P₂V₂) / T₂',
          'Cross-multiply: P₁ · V₁ · T₂ = P₂ · V₂ · T₁',
          'Divide both sides by (P₂ · T₁): V₂ = (P₁ · V₁ · T₂) / (P₂ · T₁)'
        ]
      },
      {
        targetVariable: 'P_2 (Final Pressure)',
        latex: 'P_2 = \\frac{P_1 V_1 T_2}{V_2 T_1}',
        explanation: 'Cross-multiply, then divide both sides by (V₂T₁).',
        steps: [
          '(P₁V₁) / T₁ = (P₂V₂) / T₂',
          'Cross-multiply: P₁ · V₁ · T₂ = P₂ · V₂ · T₁',
          'Divide both sides by (V₂ · T₁): P₂ = (P₁ · V₁ · T₂) / (V₂ · T₁)'
        ]
      },
      {
        targetVariable: 'T_2 (Final Temperature)',
        latex: 'T_2 = \\frac{P_2 V_2 T_1}{P_1 V_1}',
        explanation: 'Cross-multiply, then divide both sides by (P₁V₁).',
        steps: [
          '(P₁V₁) / T₁ = (P₂V₂) / T₂',
          'Cross-multiply: P₁ · V₁ · T₂ = P₂ · V₂ · T₁',
          'Divide both sides by (P₁ · V₁): T₂ = (P₂ · V₂ · T₁) / (P₁ · V₁)'
        ]
      },
      {
        targetVariable: 'V_1 (Initial Volume)',
        latex: 'V_1 = \\frac{P_2 V_2 T_1}{P_1 T_2}',
        explanation: 'Cross-multiply, then divide both sides by (P₁T₂).',
        steps: [
          '(P₁V₁) / T₁ = (P₂V₂) / T₂',
          'Cross-multiply: P₁ · V₁ · T₂ = P₂ · V₂ · T₁',
          'Divide both sides by (P₁ · T₂): V₁ = (P₂ · V₂ · T₁) / (P₁ · T₂)'
        ]
      }
    ],
    realWorldApplications: [
      {
        title: 'Weather Balloon Stratospheric Ascent',
        icon: '🛰️',
        summary: 'Pressure drops faster than temperature, expanding the balloon until it pops.',
        detail: 'Meteorological balloons start partially filled at ground level. As they climb into the stratosphere, atmospheric pressure falls drastically to near-vacuum, causing the balloon to swell to the size of a house before rupturing.'
      },
      {
        title: 'Internal Combustion Engine Compression Stroke',
        icon: '⚙️',
        summary: 'Piston rapidly compresses fuel-air mixture, raising pressure and temperature.',
        detail: 'In a car cylinder, the piston slams upward. The volume shrinks (V₁ → V₂), causing pressure and temperature to rise simultaneously until the spark plug fires.'
      },
      {
        title: 'Refrigeration & Heat Pumps',
        icon: '❄️',
        summary: 'Compressor and expansion valves alter P, V, and T through closed loops.',
        detail: 'Refrigerant gas is compressed to high pressure and temperature in the condenser, then allowed to expand rapidly across a throttle valve, dropping pressure and cooling refrigerator coils.'
      }
    ],
    color: '#06b6d4',
    accentBorder: 'border-cyan-500'
  },

  'ideal-gas-law': {
    id: 'ideal-gas-law',
    name: 'Ideal Gas Law',
    shortName: 'Ideal Gas',
    scientist: 'Émile Clapeyron & Rudolf Clausius',
    scientistYears: '1834 – 1857',
    scientistOrigin: 'France & Germany',
    historicalContext:
      'In 1834, French engineer and physicist Benoît Paul Émile Clapeyron unified the empirical laws of Boyle, Charles, and Avogadro into the famous single state equation PV = nRT. Later in 1857, Rudolf Clausius and August Krönig derived the equation from kinetic molecular theory, proving that temperature directly measures the average translational kinetic energy of gas molecules.',
    coreConcept:
      'The Ideal Gas Law relates the state variables of a hypothetical ideal gas: Pressure (P), Volume (V), Amount of substance in moles (n), and Absolute Temperature (T) through the Universal Gas Constant (R). An ideal gas consists of point particles in continuous random motion with elastic collisions and zero intermolecular attractive forces.',
    primaryFormulaLatex: 'P V = n R T',
    plainTextFormula: 'P * V = n * R * T',
    relationshipType: 'ideal',
    changingVariables: ['Pressure (P)', 'Volume (V)', 'Moles (n)', 'Temperature (T)'],
    constantVariables: ['Universal Gas Constant (R)'],
    unitRequirements: [
      'R = 0.08206 L·atm/(mol·K) when P is in atmospheres (atm) and V is in liters (L)',
      'R = 8.314 J/(mol·K) or kPa·L/(mol·K) when P is in kilopascals (kPa)',
      'R = 62.36 L·mmHg/(mol·K) or L·torr/(mol·K) when P is in mmHg or torr',
      'T MUST ALWAYS BE IN KELVIN (K)',
      'n MUST ALWAYS BE IN MOLES (mol)'
    ],
    commonMistakes: [
      {
        mistake: 'Using the wrong value of the Gas Constant R for the units given',
        reason: 'Students memorize 8.314 and 0.08206 but swap their units.',
        correction: 'If Pressure is in atm and Volume is in L, you MUST use R = 0.08206 L·atm/(mol·K). If Pressure is in kPa, use 8.314.',
        correctionLatex: 'R = 0.08206\\ \\frac{\\text{L}\\cdot\\text{atm}}{\\text{mol}\\cdot\\text{K}} = 8.314\\ \\frac{\\text{J}}{\\text{mol}\\cdot\\text{K}}'
      },
      {
        mistake: 'Treating real gases at high pressure or very low temperature as purely ideal',
        reason: 'Under extreme compression or cold, molecular volume and intermolecular van der Waals attractions cannot be ignored.',
        correction: 'Real gases deviate from PV = nRT at high pressure and low temperature. Van der Waals equation corrections are required.',
        correctionLatex: '\\left(P + \\frac{a n^2}{V^2}\\right)(V - nb) = nRT'
      }
    ],
    workedExample: {
      problemStatement:
        'A rigid steel cylinder in an industrial welding shop has an internal volume of 20.0 L. At 21.0 °C, the pressure gauge reads 150.0 atm. How many moles of argon gas are contained inside the cylinder, and what is its mass in kilograms (Molar mass of Argon = 39.95 g/mol)?',
      given: {
        'P': '150.0 atm',
        'V': '20.0 L',
        'T': '21.0 °C + 273.15 = 294.15 K',
        'R': '0.08206 L·atm/(mol·K)',
        'M_{\\text{Ar}}': '39.95 g/mol'
      },
      unknown: 'n = ? (mol) and mass = ? (kg)',
      formulaLatex: 'P V = n R T',
      rearrangementLatex: 'n = \\frac{P V}{R T}',
      substitutionLatex: 'n = \\frac{(150.0\\text{ atm})(20.0\\text{ L})}{(0.08206\\text{ L}\\cdot\\text{atm}/(\\text{mol}\\cdot\\text{K}))(294.15\\text{ K})}',
      solutionLatex: 'n = 124.29\\text{ moles}\\quad \\implies\\quad m = 124.29 \\times 39.95\\text{ g} = 4.965\\text{ kg}',
      explanation:
        'Because pressure is given in atmospheres and volume in liters, we selected R = 0.08206. Solving PV = nRT gives 124.29 moles. Multiplying by argon\'s molar mass (39.95 g/mol) reveals that nearly 5.0 kg of compressed argon gas is packed into the 20 L cylinder.'
    },
    rearrangements: [
      {
        targetVariable: 'P (Pressure)',
        latex: 'P = \\frac{n R T}{V}',
        explanation: 'Divide both sides of PV = nRT by V.',
        steps: [
          'PV = nRT',
          'Divide both sides by V: (PV) / V = (nRT) / V',
          'Cancel V on the left side: P = (nRT) / V'
        ]
      },
      {
        targetVariable: 'V (Volume)',
        latex: 'V = \\frac{n R T}{P}',
        explanation: 'Divide both sides of PV = nRT by P.',
        steps: [
          'PV = nRT',
          'Divide both sides by P: (PV) / P = (nRT) / P',
          'Cancel P on the left side: V = (nRT) / P'
        ]
      },
      {
        targetVariable: 'n (Moles / Amount)',
        latex: 'n = \\frac{P V}{R T}',
        explanation: 'Divide both sides of PV = nRT by (RT).',
        steps: [
          'PV = nRT',
          'Divide both sides by (RT): (PV) / (RT) = (nRT) / (RT)',
          'Cancel (RT) on the right side: n = (PV) / (RT)'
        ]
      },
      {
        targetVariable: 'T (Absolute Temperature)',
        latex: 'T = \\frac{P V}{n R}',
        explanation: 'Divide both sides of PV = nRT by (nR).',
        steps: [
          'PV = nRT',
          'Divide both sides by (nR): (PV) / (nR) = (nRT) / (nR)',
          'Cancel (nR) on the right side: T = (PV) / (nR)'
        ]
      },
      {
        targetVariable: 'M (Molar Mass derivation)',
        latex: 'M = \\frac{m R T}{P V}',
        explanation: 'Substitute n = m / M into PV = nRT, where m is mass in grams and M is molar mass in g/mol.',
        steps: [
          'PV = (m / M) · RT',
          'Multiply both sides by M: PV · M = mRT',
          'Divide both sides by PV: M = (mRT) / (PV)'
        ]
      },
      {
        targetVariable: 'd (Gas Density derivation)',
        latex: 'd = \\frac{P M}{R T}',
        explanation: 'Density d = m / V. From M = (mRT)/(PV), we rearrange for m/V = (PM)/(RT).',
        steps: [
          'd = mass / volume = m / V',
          'PV = (m / M)RT',
          'Rearrange: m / V = (P · M) / (R · T)',
          'Therefore: d = (PM) / (RT)'
        ]
      }
    ],
    realWorldApplications: [
      {
        title: 'Industrial Compressed Gas Cylinders',
        icon: '🛢️',
        summary: 'Engineers calculate safety margins and capacity of high-pressure tanks.',
        detail: 'Hospital oxygen tanks and semiconductor gas supply lines rely on PV = nRT to determine exactly how many liters of breathing gas can be extracted as cylinder pressure decreases.'
      },
      {
        title: 'Determining Molar Mass of Unknown Volatile Liquids',
        icon: '🧪',
        summary: 'Dumas bulb method converts liquid to gas to weigh its molar mass.',
        detail: 'By vaporizing a measured liquid in a flask of known volume at boiling water temperature and measuring vapor mass, chemists calculate M = (mRT)/(PV) to identify unknown chemical compounds.'
      },
      {
        title: 'Atmospheric Air Density & Aviation',
        icon: '✈️',
        summary: 'Hot or low-pressure air is less dense, reducing aircraft wing lift.',
        detail: 'Pilots use density altitude calculations derived from d = PM/(RT). On hot summer days at high altitude airports, thinner air requires longer takeoff runways.'
      }
    ],
    color: '#ec4899',
    accentBorder: 'border-pink-500'
  }
};
