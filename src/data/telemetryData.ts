export interface LithoDevice {
  id: string;
  code: string;
  name: string;
  equipmentTitle: string;
  bayLocation: string;
  isoClass: string;
  pm25: number;
  co2: number;
  temperature: number;
  humidity: number;
  pressurePa: number;
  airflowMps: number;
  historyPm25: number[];
}

export interface HealthcareAction {
  id: string;
  index: string;
  title: string;
  exposureBracket: string;
  summary: string;
  protocolDetails: string[];
  whoReferenceMetric: string;
}

export const LITHO_DEVICES: LithoDevice[] = [
  {
    id: 'device-1',
    code: 'ZONE-01',
    name: 'Device 1',
    equipmentTitle: 'Main Lithography Bay',
    bayLocation: 'Room 1 · Clean Zone A',
    isoClass: 'Ultra Clean',
    pm25: 3.8,
    co2: 412,
    temperature: 21.04,
    humidity: 44.2,
    pressurePa: 18.5,
    airflowMps: 0.46,
    historyPm25: [4.1, 3.9, 4.0, 3.7, 3.8, 3.6, 3.8, 3.9, 3.7, 3.8, 3.8, 3.8],
  },
  {
    id: 'device-2',
    code: 'ZONE-02',
    name: 'Device 2',
    equipmentTitle: 'Wafer Processing Line',
    bayLocation: 'Room 2 · Clean Zone B',
    isoClass: 'Standard Clean',
    pm25: 14.2,
    co2: 468,
    temperature: 21.38,
    humidity: 45.8,
    pressurePa: 15.2,
    airflowMps: 0.42,
    historyPm25: [11.4, 12.0, 12.8, 13.5, 13.9, 14.4, 14.1, 14.6, 14.3, 14.0, 14.1, 14.2],
  },
  {
    id: 'device-3',
    code: 'ZONE-03',
    name: 'Device 3',
    equipmentTitle: 'Coating & Drying Station',
    bayLocation: 'Room 3 · Exhaust Area',
    isoClass: 'Managed Air',
    pm25: 28.6,
    co2: 534,
    temperature: 21.85,
    humidity: 46.9,
    pressurePa: 12.1,
    airflowMps: 0.38,
    historyPm25: [22.1, 24.0, 25.4, 26.8, 27.2, 28.9, 29.1, 28.4, 28.0, 28.5, 28.7, 28.6],
  },
  {
    id: 'device-4',
    code: 'ZONE-04',
    name: 'Device 4',
    equipmentTitle: 'Lens & Quality Check',
    bayLocation: 'Room 4 · Quiet Lab',
    isoClass: 'Ultra Clean',
    pm25: 2.1,
    co2: 398,
    temperature: 20.92,
    humidity: 43.5,
    pressurePa: 19.8,
    airflowMps: 0.49,
    historyPm25: [2.3, 2.2, 2.2, 2.1, 2.0, 2.1, 2.2, 2.1, 2.0, 2.1, 2.1, 2.1],
  },
];

export const WHO_GUIDANCE_ITEMS: HealthcareAction[] = [
  {
    id: 'respiratory-ppe',
    index: '01',
    title: 'Wear a Well-Fitted Mask (N95 or KN95)',
    exposureBracket: 'Recommended when PM2.5 is above 15 µg/m³',
    summary:
      'Regular cloth or surgical masks cannot block tiny dust particles. Whenever air quality drops, wearing a snug N95, KN95, or FFP2 mask helps keep your lungs safe.',
    protocolDetails: [
      'Make sure the mask fits closely around your nose and chin with no air gaps.',
      'Choose a clean, dry mask before entering rooms with higher dust alerts.',
      'Replace your mask after a full work shift or if breathing starts to feel harder.',
    ],
    whoReferenceMetric: 'WHO Tip: N95/FFP2 filters out at least 95% of fine particles',
  },
  {
    id: 'ulpa-recirculation',
    index: '02',
    title: 'Keep Doors Closed & Air Purifiers Running',
    exposureBracket: 'Good everyday habit for all rooms',
    summary:
      'Keeping doors shut and running HEPA air filters stops dusty outside air from sneaking into your workspace and keeps indoor air fresh.',
    protocolDetails: [
      'Close hallway and loading-area doors promptly after walking through.',
      'Switch air purifiers to a higher fan speed if outdoor air looks hazy.',
      'Check and clean air filter indicators once a month so they work smoothly.',
    ],
    whoReferenceMetric: 'WHO Goal: Keep average yearly PM2.5 under 5.0 µg/m³',
  },
  {
    id: 'shift-exposure-cadence',
    index: '03',
    title: 'Take Regular Breaks in Clean Air Rooms',
    exposureBracket: 'Helpful when PM2.5 goes above 35 µg/m³',
    summary:
      'When doing active physical work, you breathe faster and take in more air. Stepping into a clean lounge for short breaks gives your body time to rest.',
    protocolDetails: [
      'Take a quick breather in a clean-air breakroom every 45–60 minutes during heavy tasks.',
      'Save heavy lifting or maintenance work for times when air readings are low.',
      'Drink plenty of water throughout your shift to keep your throat comfortable.',
    ],
    whoReferenceMetric: 'WHO Daily Safe Guide: Stay below 15.0 µg/m³ over 24 hours',
  },
  {
    id: 'biometric-surveillance',
    index: '04',
    title: 'Extra Care for Sensitive Groups',
    exposureBracket: 'Important when PM2.5 is above 25 µg/m³',
    summary:
      'Fine dust can irritate airways, especially for anyone with asthma, allergies, or heart conditions. Listening to your body early makes a big difference.',
    protocolDetails: [
      'Let your team lead know if you have asthma or sensitivity to dust.',
      'Move to a cleaner room right away if you notice coughing, dry eyes, or shortness of breath.',
      'Check the live air cards at the top of the page before starting long tasks.',
    ],
    whoReferenceMetric: 'Health Note: Sensitive groups feel effects much sooner than others',
  },
];

export type SafetyStatusLevel = 'Safe & Clean' | 'Fair' | 'Watch Out' | 'Unsafe';

export function evaluatePm25State(pm25: number): {
  level: SafetyStatusLevel;
  aqiLabel: string;
  isHazardous: boolean;
  toneText: string;
  toneDot: string;
  description: string;
} {
  if (pm25 <= 12.0) {
    return {
      level: 'Safe & Clean',
      aqiLabel: 'Clean Air',
      isHazardous: false,
      toneText: 'text-emerald-600 dark:text-emerald-400',
      toneDot: 'bg-emerald-500',
      description: 'Air is fresh and completely safe for everyone.',
    };
  }
  if (pm25 <= 25.0) {
    return {
      level: 'Fair',
      aqiLabel: 'Moderate Air',
      isHazardous: false,
      toneText: 'text-amber-600 dark:text-amber-400',
      toneDot: 'bg-amber-500',
      description: 'Air is okay, though slightly above the ideal daily level.',
    };
  }
  if (pm25 <= 35.4) {
    return {
      level: 'Watch Out',
      aqiLabel: 'Sensitive Alert',
      isHazardous: false,
      toneText: 'text-orange-600 dark:text-orange-400',
      toneDot: 'bg-orange-500',
      description: 'Getting dusty — people with asthma or allergies should take care.',
    };
  }
  return {
    level: 'Unsafe',
    aqiLabel: 'High Dust Alert',
    isHazardous: true,
    toneText: 'text-rose-600 dark:text-rose-400',
    toneDot: 'bg-rose-500',
    description: 'Fine dust is too high (> 35.4 µg/m³). Please wear a mask and turn on air filters.',
  };
}
