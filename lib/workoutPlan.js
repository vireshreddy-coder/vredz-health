// lib/workoutPlan.js — 6-day split designed for Vredz
// Back-safe, knee-safe, abs-focused, sports-compatible

export const WORKOUT_PLAN = [
  {
    id: 'push',
    day: 1,
    name: 'Push Day',
    subtitle: 'Chest · Shoulders · Triceps',
    color: '#ff8c42',
    icon: '🔥',
    duration: '50–60 min',
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: '10–12', rest: '90s', muscle: 'Chest', note: 'Controlled eccentric, no flare elbows' },
      { name: 'Cable Chest Fly', sets: 3, reps: '12–15', rest: '60s', muscle: 'Chest', note: 'Feel the stretch at the bottom' },
      { name: 'Seated DB Shoulder Press', sets: 3, reps: '10–12', rest: '90s', muscle: 'Shoulders', note: 'Do not lock out at the top' },
      { name: 'Lateral Raises', sets: 4, reps: '15–20', rest: '45s', muscle: 'Shoulders', note: 'Light weight, lead with elbows' },
      { name: 'Face Pulls', sets: 3, reps: '15–20', rest: '45s', muscle: 'Shoulders', note: '⚠️ Do not skip — protects rotator cuff' },
      { name: 'Tricep Rope Pushdown', sets: 3, reps: '12–15', rest: '60s', muscle: 'Triceps', note: 'Elbows stay pinned at sides' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12–15', rest: '60s', muscle: 'Triceps', note: 'Great for long head development' },
    ],
  },
  {
    id: 'pull',
    day: 2,
    name: 'Pull Day',
    subtitle: 'Back · Biceps',
    color: '#c084fc',
    icon: '💪',
    duration: '50–60 min',
    exercises: [
      { name: 'Lat Pulldown', sets: 4, reps: '10–12', rest: '90s', muscle: 'Back', note: 'Full stretch at top, pull to chest' },
      { name: 'Seated Cable Row', sets: 3, reps: '10–12', rest: '90s', muscle: 'Back', note: 'Chest up, row to navel' },
      { name: 'Single Arm DB Row', sets: 3, reps: '10–12', rest: '60s', muscle: 'Back', note: '⚠️ Brace core hard — protect your disc' },
      { name: 'Reverse Pec Deck (Rear Delt)', sets: 3, reps: '15–20', rest: '45s', muscle: 'Rear Delts', note: 'Posture & shoulder health — do not rush' },
      { name: 'Barbell / EZ Bar Curl', sets: 3, reps: '10–12', rest: '60s', muscle: 'Biceps', note: 'Full range, no swinging' },
      { name: 'Hammer Curl', sets: 3, reps: '12–15', rest: '60s', muscle: 'Biceps', note: 'Works brachialis — adds arm thickness' },
    ],
  },
  {
    id: 'core',
    day: 3,
    name: 'Core & Abs',
    subtitle: 'Abs · Obliques · Deep Core',
    color: '#5eff9e',
    icon: '⚡',
    duration: '40–50 min',
    exercises: [
      { name: 'Dead Bug', sets: 3, reps: '10 each side', rest: '45s', muscle: 'Deep Core', note: '⚠️ Back flat to floor always — disc-safe essential' },
      { name: 'Plank', sets: 3, reps: '45–60 sec', rest: '45s', muscle: 'Core', note: 'Squeeze glutes, no hip drop' },
      { name: 'Cable Crunch', sets: 4, reps: '15–20', rest: '60s', muscle: 'Abs', note: 'Focus on the contraction — slow it down' },
      { name: 'Hanging Knee Raise', sets: 3, reps: '12–15', rest: '60s', muscle: 'Lower Abs', note: 'No swinging. Controlled return.' },
      { name: 'Pallof Press', sets: 3, reps: '12 each side', rest: '45s', muscle: 'Core', note: 'Anti-rotation — key for back health' },
      { name: 'Russian Twist (bodyweight)', sets: 3, reps: '20 total', rest: '45s', muscle: 'Obliques', note: 'Defined waist starts here' },
      { name: 'Bird Dog', sets: 3, reps: '10 each side', rest: '45s', muscle: 'Core', note: 'Slow and deliberate — slip disc rehab essential' },
    ],
  },
  {
    id: 'legs',
    day: 4,
    name: 'Leg Day',
    subtitle: 'Glutes · Hamstrings · Quads',
    color: '#38bdf8',
    icon: '🦵',
    duration: '50–60 min',
    note: '⚠️ Knee-modified: no heavy barbell squats or deep lunges',
    exercises: [
      { name: 'Hip Thrust', sets: 4, reps: '12–15', rest: '90s', muscle: 'Glutes', note: 'Best glute exercise — zero knee stress' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10–12', rest: '90s', muscle: 'Hamstrings', note: 'Neutral spine throughout — stretch those tight hammies' },
      { name: 'Leg Press (partial range)', sets: 3, reps: '12–15', rest: '90s', muscle: 'Quads', note: '⚠️ Do not go below 90° — knee protection' },
      { name: 'Lying Hamstring Curl', sets: 3, reps: '12–15', rest: '60s', muscle: 'Hamstrings', note: 'Full stretch + hard squeeze at top' },
      { name: 'Goblet Squat', sets: 3, reps: '12–15', rest: '60s', muscle: 'Quads', note: 'Light weight, heels elevated if tight. Mobility focus.' },
      { name: 'Standing Calf Raise', sets: 4, reps: '15–20', rest: '45s', muscle: 'Calves', note: 'Full range, 2-sec hold at top' },
    ],
  },
  {
    id: 'recovery',
    day: 5,
    name: 'Recovery & Mobility',
    subtitle: 'Stretching · Flexibility · Rehab',
    color: '#fb7185',
    icon: '🧘',
    duration: '25–35 min',
    note: 'Low intensity. This is as important as lifting.',
    exercises: [
      { name: 'Cat-Cow Stretch', sets: 1, reps: '2 minutes', rest: '—', muscle: 'Spine', note: 'Gently warms up the spine — great for disc health' },
      { name: 'Hip Flexor Stretch (kneeling)', sets: 3, reps: '45s each side', rest: '—', muscle: 'Hips', note: 'Tight hip flexors = back pain + bad posture' },
      { name: 'Lying Hamstring Stretch', sets: 3, reps: '45s each side', rest: '—', muscle: 'Hamstrings', note: '⚠️ Do these daily — directly helps your back' },
      { name: 'Thoracic Rotation', sets: 2, reps: '10 each side', rest: '—', muscle: 'Upper Back', note: 'Opens up stiff upper back — helps posture' },
      { name: 'Pigeon Pose', sets: 2, reps: '60s each side', rest: '—', muscle: 'Hips', note: 'Deep hip opener — helps football + padel range' },
      { name: 'Foam Roll (glutes, IT band, upper back)', sets: 1, reps: '5 min total', rest: '—', muscle: 'Full Body', note: '⚠️ Avoid direct foam rolling on the lumbar spine' },
    ],
  },
  {
    id: 'sport',
    day: 6,
    name: 'Sport Day',
    subtitle: 'Football · Padel · Active Rest',
    color: '#fbbf24',
    icon: '⚽',
    duration: '60–120 min',
    exercises: [
      { name: 'Football or Padel Session', sets: 1, reps: '60–120 min', rest: '—', muscle: 'Full Body', note: 'This is full cardio. Play hard. Enjoy it.' },
      { name: 'Pre-Sport Dynamic Warmup', sets: 1, reps: '5 min', rest: '—', muscle: 'Full Body', note: 'Leg swings, hip circles, light jog — never skip' },
      { name: 'Post-Sport Stretch', sets: 1, reps: '5–10 min', rest: '—', muscle: 'Legs', note: 'Hamstrings + quads. Protects knees long-term.' },
    ],
  },
];

export const getWorkoutById = (id) => WORKOUT_PLAN.find(w => w.id === id);
export const getWorkoutByDay = (day) => WORKOUT_PLAN[day % 6];

export const WORKOUT_WEEK_SCHEDULE = [
  { label: 'Mon', suggestion: 'push' },
  { label: 'Tue', suggestion: 'pull' },
  { label: 'Wed', suggestion: 'core' },
  { label: 'Thu', suggestion: 'sport' }, // Thursday football
  { label: 'Fri', suggestion: 'legs' },
  { label: 'Sat', suggestion: 'recovery' },
  { label: 'Sun', suggestion: 'rest' },
];
