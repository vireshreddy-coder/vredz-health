// lib/supplements.js

export const SUPPLEMENT_STACKS = [
  {
    timing: 'morning',
    label: 'Morning Stack',
    note: 'With your morning Americano ☕',
    color: '#fbbf24',
    items: [
      { id: 'multivitamin', name: 'Multivitamin', note: 'Foundation — fills nutrient gaps' },
      { id: 'd3', name: 'Vitamin D3 (5000 IU)', note: 'Energy, mood, immunity — especially important in Dubai (AC all day)' },
      { id: 'collagen', name: 'Collagen Peptides', note: 'Joint health, skin, hair — great for knees + back long-term' },
      { id: 'nmn', name: 'NMN 250mg (optional)', note: '🆕 NAD+ precursor — cellular energy, anti-aging. Take on empty stomach.' },
    ],
  },
  {
    timing: 'preworkout',
    label: 'Pre-Workout',
    note: '30 min before training',
    color: '#ff8c42',
    items: [
      { id: 'creatine', name: 'Creatine 5g', note: 'Mix in water. Best studied supplement for strength + muscle. Be consistent.' },
    ],
  },
  {
    timing: 'postworkout',
    label: 'Post-Workout',
    note: 'Within 30 min of finishing',
    color: '#5eff9e',
    items: [
      { id: 'protein_post', name: 'Protein Shake', note: 'Most important daily habit for your goals. 2 scoops in water.' },
    ],
  },
  {
    timing: 'evening',
    label: 'Evening Stack',
    note: 'With dinner or before bed',
    color: '#c084fc',
    items: [
      { id: 'ashwagandha', name: 'Ashwagandha (KSM-66)', note: 'Stress, cortisol control, energy balance — take with dinner' },
      { id: 'magnesium', name: 'Magnesium Glycinate', note: 'Deep sleep, muscle recovery — 30 min before bed. Game-changer.' },
    ],
  },
];

export const ALL_SUPPLEMENT_IDS = SUPPLEMENT_STACKS.flatMap(s => s.items.map(i => i.id));
export const TOTAL_SUPPS = ALL_SUPPLEMENT_IDS.length;
