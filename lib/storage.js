// lib/storage.js — all localStorage interaction

export const TODAY = () => new Date().toISOString().split('T')[0];

const DEFAULT_DAILY_LOG = () => ({
  meals: [],
  water: 0,       // ml
  workoutDone: false,
  workoutId: null,
  vaping: 0,
  supplements: {
    multivitamin: false, d3: false, collagen: false, nmn: false,
    creatine: false, protein_post: false, ashwagandha: false, magnesium: false,
  },
  sleep: { bedtime: '', wakeup: '' },
  notes: '',
});

export function getDailyLog(date) {
  if (typeof window === 'undefined') return DEFAULT_DAILY_LOG();
  const raw = localStorage.getItem(`dailyLog_${date}`);
  return raw ? { ...DEFAULT_DAILY_LOG(), ...JSON.parse(raw) } : DEFAULT_DAILY_LOG();
}

export function saveDailyLog(date, log) {
  localStorage.setItem(`dailyLog_${date}`, JSON.stringify(log));
}

export function getWorkoutLog(date) {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`workoutLog_${date}`);
  return raw ? JSON.parse(raw) : null;
}

export function saveWorkoutLog(date, log) {
  localStorage.setItem(`workoutLog_${date}`, JSON.stringify(log));
}

// The workout cycle: which day (0-5) in the 6-day plan
export function getWorkoutCycleDay() {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem('workoutCycleDay');
  return raw !== null ? parseInt(raw) : 0;
}
export function saveWorkoutCycleDay(day) {
  localStorage.setItem('workoutCycleDay', day.toString());
}

// Progress entries (weekly weigh-ins)
export function getProgressEntries() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('progressEntries');
  return raw ? JSON.parse(raw) : [];
}
export function saveProgressEntries(entries) {
  localStorage.setItem('progressEntries', JSON.stringify(entries));
}

// User profile
const DEFAULT_PROFILE = {
  name: 'Vredz', age: 34, height: 178, weight: 85,
  targetCalories: 1900, targetProtein: 160, targetWater: 3000,
  startWeight: 85,
};
export function getProfile() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  const raw = localStorage.getItem('userProfile');
  return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
}
export function saveProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

// Habit streaks
export function getStreaks() {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem('streaks');
  return raw ? JSON.parse(raw) : {};
}
export function saveStreaks(streaks) {
  localStorage.setItem('streaks', JSON.stringify(streaks));
}

// Calculate totals for a daily log
export function calcTotals(dailyLog) {
  const calories = dailyLog.meals.reduce((s, m) => s + (m.calories || 0), 0);
  const protein = dailyLog.meals.reduce((s, m) => s + (m.protein || 0), 0);
  return { calories, protein, water: dailyLog.water || 0 };
}

// Get last N days of logs for charts
export function getRecentLogs(days = 7) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    const log = getDailyLog(date);
    const totals = calcTotals(log);
    result.push({ date, ...totals, label: d.toLocaleDateString('en', { weekday: 'short' }) });
  }
  return result;
}

// Supplement count helper
export function suppCount(supplements) {
  return Object.values(supplements || {}).filter(Boolean).length;
}
export const TOTAL_SUPPS = 8;
