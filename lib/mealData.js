// lib/mealData.js — preset meals and meal ideas for Dubai lifestyle

export const QUICK_MEALS = [
  { id: 'protein_shake', name: 'Protein Shake', emoji: '🥤', calories: 140, protein: 27, effort: 'easy', note: '2 scoops whey in water' },
  { id: 'yogurt_bowl', name: 'Greek Yogurt Bowl', emoji: '🍓', calories: 380, protein: 32, effort: 'easy', note: '0% Greek yogurt + berries + honey + granola' },
  { id: 'protein_bread_turkey', name: 'Protein Bread + Turkey', emoji: '🥪', calories: 310, protein: 38, effort: 'easy', note: 'Arabic protein bread + smoked turkey + mustard' },
  { id: 'cottage_cheese', name: 'Cottage Cheese Bowl', emoji: '🧀', calories: 180, protein: 22, effort: 'easy', note: 'Low fat cottage cheese + cinnamon + honey' },
  { id: 'eggs_whites', name: 'Egg White Omelette', emoji: '🍳', calories: 200, protein: 28, effort: 'easy', note: '5 egg whites + veggies, 5 min microwave' },
];

export const MEAL_IDEAS = [
  // EASY / HOME
  {
    id: 'protein_shake', name: 'Protein Shake', emoji: '🥤',
    calories: 140, protein: 27, effort: 'easy', category: 'snack',
    desc: '2 scoops whey in water. Non-negotiable daily staple.',
    tags: ['quick', 'post-workout'],
  },
  {
    id: 'yogurt_bowl', name: 'Greek Yogurt Bowl', emoji: '🍓',
    calories: 380, protein: 32, effort: 'easy', category: 'lunch',
    desc: '0% Greek yogurt, mixed berries, drizzle of honey, granola. Tastes like dessert.',
    tags: ['sweet', 'no-cook'],
  },
  {
    id: 'protein_bread_turkey', name: 'Protein Bread + Turkey', emoji: '🥪',
    calories: 310, protein: 38, effort: 'easy', category: 'lunch',
    desc: 'Arabic protein bread, smoked turkey slices, yellow mustard. 3 min prep.',
    tags: ['savory', 'quick'],
  },
  {
    id: 'cottage_dessert', name: 'Cottage Cheese + Cinnamon', emoji: '🧀',
    calories: 160, protein: 18, effort: 'easy', category: 'dessert',
    desc: 'Low fat cottage cheese, cinnamon, honey drizzle. Creamy high-protein dessert swap.',
    tags: ['sweet', 'dessert', 'guilt-free'],
  },
  {
    id: 'protein_mug_cake', name: 'Protein Mug Cake', emoji: '🎂',
    calories: 190, protein: 22, effort: 'easy', category: 'dessert',
    desc: '1 scoop protein powder + 1 egg + splash milk. 90 seconds in microwave.',
    tags: ['dessert', 'sweet'],
  },
  {
    id: 'dark_choc_almonds', name: 'Dark Choc + Almonds', emoji: '🍫',
    calories: 180, protein: 5, effort: 'easy', category: 'dessert',
    desc: '3 squares 85% dark chocolate + 10 almonds. Satisfies sweet + fat cravings.',
    tags: ['dessert', 'snack'],
  },
  // ORDER IN
  {
    id: 'calo_chicken', name: 'Calo Grilled Chicken Plate', emoji: '🍱',
    calories: 420, protein: 45, effort: 'order', category: 'lunch',
    desc: 'Grilled chicken, brown rice, roasted veg. Clean, tracked, delivered.',
    tags: ['meal-plan', 'calo'],
  },
  {
    id: 'calo_beef_bowl', name: 'Calo Lean Beef Bowl', emoji: '🥩',
    calories: 480, protein: 48, effort: 'order', category: 'dinner',
    desc: 'Lean beef, sweet potato, greens. High protein, portion-controlled.',
    tags: ['meal-plan', 'calo'],
  },
  // RESTAURANTS
  {
    id: 'sashimi', name: 'Salmon Sashimi (10 pcs)', emoji: '🐟',
    calories: 360, protein: 40, effort: 'resto', category: 'dinner',
    desc: 'Best sushi order. High protein, omega-3s, zero carb bloat.',
    tags: ['sushi', 'clean'],
  },
  {
    id: 'tuna_roll', name: 'Tuna Roll + Edamame', emoji: '🍣',
    calories: 410, protein: 38, effort: 'resto', category: 'dinner',
    desc: 'Balanced. Skip tempura rolls, ask for less rice.',
    tags: ['sushi'],
  },
  {
    id: 'chicken_tikka', name: 'Chicken Tikka (dry)', emoji: '🍗',
    calories: 380, protein: 42, effort: 'resto', category: 'dinner',
    desc: 'Dry chicken tikka — skip the rice or have half portion. One of the best restaurant proteins.',
    tags: ['indian', 'high-protein'],
  },
  {
    id: 'dal_chicken', name: 'Tandoori Chicken + Dal', emoji: '🫕',
    calories: 450, protein: 46, effort: 'resto', category: 'dinner',
    desc: 'Tandoori chicken (skin off) + lentil dal. Powerhouse combo.',
    tags: ['indian'],
  },
  {
    id: 'korean_bbq', name: 'Korean BBQ (lean cuts)', emoji: '🥩',
    calories: 480, protein: 52, effort: 'resto', category: 'dinner',
    desc: 'Chicken bulgogi or lean beef bulgogi. Lettuce wraps. Skip the fried sides.',
    tags: ['korean', 'social'],
  },
  {
    id: 'daves_chicken', name: "Dave's Hot Chicken Tenders", emoji: '🌶️',
    calories: 480, protein: 46, effort: 'resto', category: 'lunch',
    desc: 'Tenders (not sandwich). Skip fries, sub for side salad. Light on sauce.',
    tags: ['treat', 'high-protein'],
  },
  {
    id: 'hotpot', name: 'Hotpot (lean focus)', emoji: '🍲',
    calories: 550, protein: 58, effort: 'resto', category: 'dinner',
    desc: 'Lean beef slices + shrimp + tofu + mushrooms. Clear broth. Best social high-protein meal.',
    tags: ['hotpot', 'social'],
  },
];

export const MEAL_CATEGORIES = ['all', 'lunch', 'dinner', 'snack', 'dessert'];
export const EFFORT_LABELS = { easy: 'Home (5 min)', order: 'Order In', resto: 'Restaurant' };
export const EFFORT_COLORS = { easy: '#5eff9e', order: '#38bdf8', resto: '#c084fc' };
