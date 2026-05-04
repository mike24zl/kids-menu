export const DEFAULT_MAINS = [
  { id: 'm1', name: 'Schnitzel',       nameHe: 'שניצל',        emoji: '🥩', type: 'main' },
  { id: 'm2', name: 'Nuggets',          nameHe: 'נאגטס',        emoji: '🍗', type: 'main' },
  { id: 'm3', name: 'Grilled Chicken',  nameHe: 'עוף על האש',  emoji: '🍖', type: 'main' },
  { id: 'm4', name: 'Tuna',             nameHe: 'טונה',         emoji: '🐟', type: 'main' },
  { id: 'm5', name: 'Salmon',           nameHe: 'סלמון',        emoji: '🐠', type: 'main' },
  { id: 'm6', name: 'Meatballs',        nameHe: 'כדורי בשר',   emoji: '🧆', type: 'main' },
  { id: 'm7', name: 'Burger',           nameHe: 'המבורגר',      emoji: '🍔', type: 'main' },
  { id: 'm8', name: 'Shakshuka',        nameHe: 'שקשוקה',       emoji: '🍳', type: 'main' },
  { id: 'm9', name: 'Omelette',         nameHe: 'אומלט',        emoji: '🥚', type: 'main' },
  { id: 'm10', name: 'Boiled Egg',      nameHe: 'ביצה קשה',    emoji: '🥚', type: 'main' },
  { id: 'm11', name: 'Buttered Toast',  nameHe: 'טוסט עם חמאה', emoji: '🍞', type: 'main' },
  { id: 'm12', name: 'Pastrami',        nameHe: 'פסטרמה',       emoji: '🥓', type: 'main' },
]

export const DEFAULT_SIDES = [
  { id: 's1', name: 'Rice',            nameHe: 'אורז',          emoji: '🍚', type: 'side' },
  { id: 's2', name: 'Pasta',           nameHe: 'פסטה',          emoji: '🍝', type: 'side' },
  { id: 's3', name: 'Mashed Potato',   nameHe: 'פירה',          emoji: '🥔', type: 'side' },
  { id: 's4', name: 'French Fries',    nameHe: "צ'יפס",         emoji: '🍟', type: 'side' },
  { id: 's5', name: 'Couscous',        nameHe: 'קוסקוס',        emoji: '🫙', type: 'side' },
  { id: 's6', name: 'Sweet Potato',    nameHe: 'בטטה',          emoji: '🍠', type: 'side' },
  { id: 's7', name: 'Bread',           nameHe: 'לחם',           emoji: '🍞', type: 'side' },
]

export const DEFAULT_VEGGIES = [
  { id: 'v1', name: 'Cucumber',        nameHe: 'מלפפון',        emoji: '🥒', type: 'veggie' },
  { id: 'v2', name: 'Carrot',          nameHe: 'גזר',           emoji: '🥕', type: 'veggie' },
  { id: 'v3', name: 'Tomato',          nameHe: 'עגבנייה',       emoji: '🍅', type: 'veggie' },
  { id: 'v4', name: 'Corn',            nameHe: 'תירס',          emoji: '🌽', type: 'veggie' },
  { id: 'v5', name: 'Salad',           nameHe: 'סלט',           emoji: '🥗', type: 'veggie' },
  { id: 'v6', name: 'Apple',           nameHe: 'תפוח',          emoji: '🍎', type: 'veggie' },
  { id: 'v7', name: 'Watermelon',      nameHe: 'אבטיח',         emoji: '🍉', type: 'veggie' },
  { id: 'v8', name: 'Banana',          nameHe: 'בננה',          emoji: '🍌', type: 'veggie' },
]

export const DEFAULT_DESSERTS = [
  { id: 'ds1', name: 'Ice Cream',      nameHe: 'גלידה',         emoji: '🍦', type: 'dessert' },
  { id: 'ds2', name: 'Fruit Salad',    nameHe: 'סלט פירות',     emoji: '🍓', type: 'dessert' },
  { id: 'ds3', name: 'Chocolate',      nameHe: 'שוקולד',        emoji: '🍫', type: 'dessert' },
  { id: 'ds4', name: 'Yogurt',         nameHe: 'יוגורט',        emoji: '🍧', type: 'dessert' },
  { id: 'ds5', name: 'Cookie',         nameHe: 'עוגייה',        emoji: '🍪', type: 'dessert' },
]

export const POOL_COLORS = {
  main:    'bg-orange-200 text-orange-900',
  side:    'bg-amber-200 text-amber-900',
  veggie:  'bg-green-200 text-green-900',
  dessert: 'bg-pink-200 text-pink-900',
}

export const SLOT_STYLES = {
  main:    { empty: 'border-orange-300 bg-orange-50/50', filled: 'border-orange-400 bg-orange-100', placeholder: '🥩' },
  side:    { empty: 'border-amber-300 bg-amber-50/50',   filled: 'border-amber-400 bg-amber-100',   placeholder: '🍚' },
  veggie:  { empty: 'border-green-300 bg-green-50/50',   filled: 'border-green-400 bg-green-100',   placeholder: '🥦' },
  dessert: { empty: 'border-pink-300 bg-pink-50/50',     filled: 'border-pink-400 bg-pink-100',     placeholder: '🍰' },
}
