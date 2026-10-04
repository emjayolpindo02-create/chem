import { GasLawId } from '../types/chemistry';

export interface RealLifeScenario {
  id: string;
  title: string;
  icon: string;
  category: string;
  situation: string;
  governingLawId: GasLawId;
  governingLawName: string;
  formulaLatex: string;
  constantVariables: string[];
  changingVariables: string[];
  explanation: string;
  interactiveQuestion: string;
  options: string[];
  correctOptionIndex: number;
  postAnswerInsight: string;
}

export const REAL_LIFE_SCENARIOS: RealLifeScenario[] = [
  {
    id: 'scuba-diving',
    title: 'Deep-Sea Scuba Diving & Ascending',
    icon: '🤿',
    category: 'Marine Physiology',
    situation:
      'A scuba diver breathes compressed air at a depth of 30 meters where the ambient hydrostatic pressure is 4.0 atm. If the diver holds their breath while rapidly ascending to the ocean surface (where pressure is 1.0 atm), the volume of air inside their lungs expands by 4 times.',
    governingLawId: 'boyles-law',
    governingLawName: "Boyle's Law",
    formulaLatex: 'P_1 V_1 = P_2 V_2',
    constantVariables: ['Temperature (T)', 'Moles of air (n)'],
    changingVariables: ['Pressure (P)', 'Volume (V)'],
    explanation:
      "Because water pressure drops from 4 atm to 1 atm while body temperature remains constant, Boyle's Law mandates that lung volume must quadruple if air cannot escape, causing severe pulmonary barotrauma.",
    interactiveQuestion:
      'What must a scuba diver continuously do while making an ascent to avoid lung damage?',
    options: [
      'Inhale deeply and hold their breath',
      'Exhale continuously to release expanding gas',
      'Drink cold sea water to cool the lungs',
      'Swim horizontally only'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'Exhaling continuously allows excess expanding air to vent naturally into the ocean, keeping internal lung pressure equalized with the decreasing external water pressure.'
  },
  {
    id: 'car-tire-temperature',
    title: 'Car Tires on a Scorching Summer Highway',
    icon: '🚗',
    category: 'Automotive Engineering',
    situation:
      'Before a long road trip on a hot summer afternoon, a driver checks their car tire pressure: 32 PSI at 20 °C. After driving at 70 mph for three hours on 45 °C asphalt, internal friction heats the air inside the rigid tire to 65 °C, raising the tire pressure to ~37 PSI.',
    governingLawId: 'gay-lussac-law',
    governingLawName: "Gay-Lussac's Law",
    formulaLatex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
    constantVariables: ['Volume of tire (V)', 'Moles of air (n)'],
    changingVariables: ['Temperature (T)', 'Pressure (P)'],
    explanation:
      "Because the steel-belted tire maintains an essentially rigid volume, Gay-Lussac's Law dictates that increasing absolute temperature directly increases the collision kinetic energy of the air particles, boosting internal pressure.",
    interactiveQuestion:
      'Why do vehicle manufacturers recommend measuring tire pressure when the tires are "cold" (before driving)?',
    options: [
      'Cold air weighs more than hot air',
      'Friction from driving artificially elevates pressure due to Gay-Lussac\'s Law',
      'Tire rubber melts at high speed',
      'The barometer only functions at 20 °C'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'Cold pressure ratings reflect the true base quantity of gas inside the tire before kinetic heating alters the pressure reading.'
  },
  {
    id: 'hot-air-balloon',
    title: 'Hot-Air Balloon Flight',
    icon: '🎈',
    category: 'Aeronautics',
    situation:
      'To make a 2,500 m³ hot-air balloon lift off the ground, the pilot fires propane burners to heat the air inside the balloon envelope from 15 °C to over 100 °C. The air expands, spills out of the bottom opening, and the balloon floats gracefully into the sky.',
    governingLawId: 'charles-law',
    governingLawName: "Charles's Law",
    formulaLatex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
    constantVariables: ['Atmospheric Pressure (P)'],
    changingVariables: ['Temperature (T)', 'Volume (V) / Density (d)'],
    explanation:
      "Charles's Law shows that air expands as its absolute temperature rises. Because the balloon has an open skirt at the bottom, heated expanding air vents out, reducing the mass of gas inside the envelope and making it less dense than the surrounding cold air.",
    interactiveQuestion:
      'What primarily causes the buoyant upward force that lifts the hot air balloon?',
    options: [
      'Helium chemical reaction',
      'Decreased air density inside the envelope compared to outside air',
      'Upward thrust of the propane flame',
      'Magnetic repulsion from the Earth'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'According to Archimedes\' principle combined with Charles\'s law, the buoyant force equals the weight of displaced cold air, which exceeds the weight of the less-dense hot air inside!'
  },
  {
    id: 'medical-syringe',
    title: 'Medical Syringe Aspiration',
    icon: '💉',
    category: 'Healthcare Devices',
    situation:
      'When drawing liquid medicine from a vial, a nurse inserts the syringe needle and pulls the plunger back. Liquid immediately rushes into the plastic barrel without any motor or pump.',
    governingLawId: 'boyles-law',
    governingLawName: "Boyle's Law",
    formulaLatex: 'P_1 V_1 = P_2 V_2',
    constantVariables: ['Temperature (T)', 'Moles of air (n)'],
    changingVariables: ['Volume (V)', 'Pressure (P)'],
    explanation:
      "Retracting the plunger expands the volume inside the syringe barrel. By Boyle's Law, the pressure inside drops below atmospheric pressure, creating a partial vacuum. The higher atmospheric pressure outside pushes liquid into the syringe.",
    interactiveQuestion:
      'What creates the pressure differential that draws medicine into the syringe?',
    options: [
      'Chemical suction created by rubber',
      'Increasing barrel volume creates lower pressure inside than ambient air',
      'The liquid boils and generates steam',
      'Gravity pulls the fluid upward'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'Fluids always flow spontaneously from areas of higher pressure to areas of lower pressure.'
  },
  {
    id: 'aerosol-fire',
    title: 'Aerosol Spray Can in a Bonfire',
    icon: '⚠️',
    category: 'Safety Science',
    situation:
      'An aerosol hairspray can is accidentally tossed into a campfire. Within two minutes, the can violently explodes with a loud bang, throwing metal fragments across the campsite.',
    governingLawId: 'gay-lussac-law',
    governingLawName: "Gay-Lussac's Law",
    formulaLatex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
    constantVariables: ['Volume of can (V)', 'Moles of gas (n)'],
    changingVariables: ['Temperature (T)', 'Pressure (P)'],
    explanation:
      "The rigid aluminum can prevents volume expansion. As campfire heat raises the propellant temperature from 293 K to 950 K, pressure triples or quadruples until exceeding the burst rating of the metal seam.",
    interactiveQuestion:
      'Which warning on aerosol cans directly relates to Gay-Lussac\'s Law?',
    options: [
      'Keep out of reach of children',
      'Do not expose to heat or store above 50 °C (122 °F)',
      'For external use only',
      'Recyclable steel container'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'Heating a fixed volume of trapped gas leads directly to dangerous pressure surges that cause rupture explosions.'
  },
  {
    id: 'bicycle-pump',
    title: 'Bicycle Hand Pump Getting Warm',
    icon: '🚲',
    category: 'Mechanics',
    situation:
      'When pumping up a bicycle tire vigorously with a manual hand pump, the lower metal barrel of the pump becomes noticeably hot to the touch, even though the ambient air is cool.',
    governingLawId: 'boyles-law',
    governingLawName: "Boyle's Law & Adiabatic Compression",
    formulaLatex: 'P_1 V_1 = P_2 V_2 \\quad\\text{and}\\quad PV = nRT',
    constantVariables: ['Moles of air (n) during compression stroke'],
    changingVariables: ['Pressure (P)', 'Volume (V)', 'Temperature (T)'],
    explanation:
      'Rapidly compressing air forces work into the gas faster than heat can dissipate through the walls (adiabatic heating). Forcing molecules closer together raises particle kinetic energy and manifests as thermal heat.',
    interactiveQuestion:
      'Why does the base of the pump get hot while pumping?',
    options: [
      'Friction between rubber piston and cylinder only',
      'Rapid compression of air molecules does thermodynamic work, raising temperature',
      'Air burns chemically inside the pump',
      'Bicycle tires contain electrical heating coils'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'While mechanical friction contributes slightly, the dominant heat comes from rapid compression of the gas itself!'
  },
  {
    id: 'weather-balloon',
    title: 'Stratospheric Weather Balloon',
    icon: '🛰️',
    category: 'Meteorology',
    situation:
      'A meteorological latex balloon carrying radiosonde instruments is launched from Earth\'s surface. At ground level it looks loose and half-empty. At 35 km altitude, it has swollen into a colossal sphere 10 meters wide before bursting.',
    governingLawId: 'combined-gas-law',
    governingLawName: 'Combined Gas Law',
    formulaLatex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
    constantVariables: ['Moles of helium (n)'],
    changingVariables: ['Pressure (P)', 'Volume (V)', 'Temperature (T)'],
    explanation:
      'At 35 km altitude, atmospheric pressure drops to less than 1% of surface pressure. Even though the stratosphere is freezing cold, the gargantuan pressure drop vastly dominates the temperature reduction, swelling the balloon to the bursting limit.',
    interactiveQuestion:
      'Why are weather balloons launched only partially inflated at ground level?',
    options: [
      'To save expensive helium gas only',
      'To leave room for massive volumetric expansion as surrounding pressure drops',
      'So the balloon can fit through the launch door',
      'Because cold air cannot lift fully inflated balloons'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'If filled to maximum capacity on the ground, the balloon would rupture within the first few kilometers of ascent!'
  },
  {
    id: 'airbag-deployment',
    title: 'Automobile Airbag Deployment',
    icon: '🛡️',
    category: 'Automotive Safety',
    situation:
      'In a head-on vehicular collision, crash sensors trigger an igniter within 20 milliseconds, decomposing solid sodium azide pellets into 60 liters of harmless nitrogen gas to cushion the driver\'s chest and head.',
    governingLawId: 'avogadro-law',
    governingLawName: "Avogadro's Law & Ideal Gas Law",
    formulaLatex: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2} \\quad\\text{and}\\quad PV = nRT',
    constantVariables: ['Temperature (T) and ambient Pressure (P) post-expansion'],
    changingVariables: ['Moles of gas (n)', 'Volume of cushion (V)'],
    explanation:
      "Avogadro's Law explains that rapidly generating 2 to 3 moles of nitrogen gas molecules instantly expands the nylon airbag from 0 L to 60 L, providing a life-saving decelerating cushion.",
    interactiveQuestion:
      'What chemical event drives the rapid inflation of modern airbags?',
    options: [
      'Compressed air released from a heavy scuba tank',
      'Rapid chemical decomposition creating a high mole count of nitrogen gas (n)',
      'Steam produced by boiling radiator coolant',
      'Electrochemical battery hydrogen production'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'Chemical reaction: 2 NaN₃(s) → 2 Na(s) + 3 N₂(g). Converting solids into moles of gas increases volume by over 800-fold!'
  },
  {
    id: 'breathing-lungs',
    title: 'Human Respiration & Diaphragm Motion',
    icon: '🫁',
    category: 'Human Biology',
    situation:
      'Every time you take a breath, you contract your muscular diaphragm downward and expand your ribcage outward. Without needing to physically swallow air, fresh oxygen enters your lungs effortlessly.',
    governingLawId: 'boyles-law',
    governingLawName: "Boyle's Law",
    formulaLatex: 'P_1 V_1 = P_2 V_2',
    constantVariables: ['Temperature (37 °C)', 'Moles of gas during initial expansion'],
    changingVariables: ['Volume of thoracic cavity (V)', 'Intrapulmonary pressure (P)'],
    explanation:
      'When your chest expands, the volume of the lungs increases. Boyle\'s law dictates that the internal pressure drops by 2 to 3 mmHg below atmospheric pressure, drawing outside air in through the trachea.',
    interactiveQuestion:
      'When does air spontaneously rush into the human respiratory tract?',
    options: [
      'When lung volume decreases',
      'When lung volume increases, causing internal pressure to fall below atmospheric pressure',
      'When the heart pumps oxygen into the stomach',
      'When blood pressure rises above 120 mmHg'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'Inhalation is an active volumetric expansion process governed directly by Boyle\'s inverse pressure-volume relationship!'
  },
  {
    id: 'gas-cylinders',
    title: 'Hospital Oxygen Storage Cylinders',
    icon: '🛢️',
    category: 'Industrial Cryogenics & Medicine',
    situation:
      'A hospital emergency ward receives a standard 50-liter steel oxygen cylinder compressed to 200 atm of pressure at 20 °C. The medical team needs to know how many hours of breathing gas at 1 atm they can administer to patients.',
    governingLawId: 'ideal-gas-law',
    governingLawName: 'Ideal Gas Law',
    formulaLatex: 'P V = n R T',
    constantVariables: ['Gas Constant (R)', 'Temperature (T)'],
    changingVariables: ['Pressure (P)', 'Volume (V)', 'Moles (n)'],
    explanation:
      'Using PV = nRT, 50 L at 200 atm holds roughly 415 moles of oxygen. When discharged into a patient mask at 1 atm, this expands to 10,000 liters of atmospheric oxygen gas.',
    interactiveQuestion:
      'If an oxygen cylinder has a pressure of 200 atm in a 50 L tank, how much gas does it supply at 1 atm (constant temperature)?',
    options: ['50 L', '500 L', '10,000 L', '2,000 L'],
    correctOptionIndex: 2,
    postAnswerInsight:
      'By Boyle\'s Law (P₁V₁ = P₂V₂): V₂ = (200 atm × 50 L) / 1 atm = 10,000 Liters of breathable oxygen!'
  },
  {
    id: 'deflated-football',
    title: 'Cold Weather Football Deflation',
    icon: '🏈',
    category: 'Sports Science',
    situation:
      'A football is inflated in a warm locker room (23 °C / 296 K) to an official regulation gauge pressure of 12.5 PSI. When brought out onto a snowy field at -5 °C (268 K), the ball feels noticeably under-inflated and soft.',
    governingLawId: 'gay-lussac-law',
    governingLawName: "Gay-Lussac's Law",
    formulaLatex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
    constantVariables: ['Volume of ball leather (V)', 'Moles of air (n)'],
    changingVariables: ['Temperature (T)', 'Pressure (P)'],
    explanation:
      'A football has relatively stiff leather boundaries that keep volume approximately constant. When absolute temperature drops by ~9.5%, internal absolute pressure drops by the same proportion, lowering the gauge reading by 1.5 to 2.0 PSI.',
    interactiveQuestion:
      'Why does the pressure in sports balls drop on cold winter days?',
    options: [
      'The leather contracts and squeezes air out through the valve',
      'Gas molecules lose thermal kinetic energy and strike the interior walls with less frequency and force',
      'Cold air weighs more, pulling the ball downward',
      'Oxygen freezes into a solid inside the ball'
    ],
    correctOptionIndex: 1,
    postAnswerInsight:
      'Temperature is the macroscopic manifestation of average particle kinetic energy. Lower temperature = gentler collisions = reduced pressure!'
  }
];
