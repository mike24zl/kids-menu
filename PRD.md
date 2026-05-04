# PRD: Kids Weekly Dinner Planner

## Overview
A browser-based app where kids (ages 4–6) choose their dinners for the upcoming week by dragging colorful dish cards onto a weekly calendar. Parents manage the dish pool and dessert rules via a simple parent mode toggle. No backend — everything lives in `localStorage`.

---

## Users & Roles

| Role | Description |
|------|-------------|
| **Kid** | Drags dishes onto the weekly planner, sees fun animations and rewards |
| **Parent** | Manages the dish pool (add/edit/delete dishes), accessible via a simple toggle — no PIN required |

---

## UX Design Principles (Age 4–6)
- **Emoji-first**: every dish is represented by a giant emoji — the primary visual
- **Minimal text**: dish names in large, bold, rounded font (e.g. Fredoka One) — kids don't need to read much
- **Huge touch targets**: cards and slots sized for small fingers on tablets
- **Saturated, joyful colors**: think crayon-box palette, not pastel
- **Instant feedback**: animations on every meaningful interaction
- **No error messages**: constraints are enforced via friendly animations, never text errors

---

## Core Features

### 1. Weekly Planner Board
- 7-column grid, **starting Sunday** (Sun → Sat)
- Each column has two slots: **Dinner** and **Dessert**
- Shows the current week; kids plan ahead for days not yet passed
- **Past days are visible but locked** — greyed out with a padlock icon overlay
- Week label shown at the top (e.g. "This Week: May 4 – May 10")

### 2. Main Dish Pool (Drag Source)
- Scrollable panel of dish cards (side or bottom of screen)
- Each card: **giant emoji + dish name** (large rounded font) + **category color badge**
- Cards are permanently in the pool — infinite reuse
- A card that's already been placed somewhere glows/highlights so kids notice
- Touch drag supported for tablets

### 3. Dessert Pool (Separate)
- Visually distinct panel from the main dish pool (different background color, label "Desserts 🍨")
- Contains only dessert items
- Same card style: giant emoji + name

### 4. Drag & Drop
- Kids drag from either pool and drop onto the matching slot (dinner → dinner slot, dessert → dessert slot)
- Dropping replaces whatever was there
- Successful drop: soft pop sound + card bounces into place
- Invalid drop (e.g. dessert onto dinner slot): card snaps back with a gentle wiggle

### 5. Dessert Constraint
- Dessert slots can only be filled **3 times per week**
- A prominent counter badge always visible: e.g. "🍰 2 / 3"
- Attempting a 4th dessert: friendly bounce animation + "Oops! Only 3 desserts! 🙈" — no harsh error

### 6. Rewards & Delight
- Completing all 7 dinners triggers **confetti animation** + "Amazing! Week all planned! 🎉"
- Each successful drop plays a soft **pop sound**
- Cards have a subtle **wobble on hover/focus**
- Locked day columns have a gentle grey overlay + padlock emoji 🔒

### 7. Parent Mode
- Accessed via a small lock icon in the corner — **no PIN required** (assumed family device)
- Toggle reveals a management panel to:
  - Add a dish: name + emoji picker + category
  - Edit or delete existing dishes
  - Add/edit/delete desserts
  - Reset the current week's plan
- Parent mode visually distinct (e.g. dark overlay banner) so kids know they're not in "play mode"

---

## Dish Categories & Starter Pool

| Category | Color | Sample Dishes |
|----------|-------|---------------|
| 🍝 Pasta | Yellow | Spaghetti 🍝, Mac & Cheese 🧀, Lasagna |
| 🍗 Chicken | Orange | Chicken Nuggets 🍗, Grilled Chicken, Schnitzel |
| 🐟 Fish | Blue | Fish Sticks 🐟, Salmon, Tuna Pasta |
| 🥦 Veggie | Green | Veggie Stir-fry 🥦, Shakshuka 🍳, Lentil Soup |
| 🍲 Soup | Purple | Chicken Soup 🍲, Tomato Soup, Minestrone |

### Starter Dessert Pool

| Dessert | Emoji |
|---------|-------|
| Ice Cream | 🍦 |
| Fruit Salad | 🍓 |
| Chocolate Mousse | 🍫 |
| Yogurt | 🍧 |
| Cookie | 🍪 |

---

## Tech Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | React + Vite | Fast, modern, great ecosystem |
| Drag & Drop | @dnd-kit | Accessible, touch-friendly, well-maintained |
| Styling | Tailwind CSS | Easy colorful responsive UI |
| Font | Fredoka One (Google Fonts) | Rounded, playful, readable for kids |
| Persistence | localStorage | No backend needed for v1 |
| Confetti | canvas-confetti | Lightweight celebration animation |
| Sound | Howler.js or native Audio API | Soft interaction sounds |

---

## Data Model

```js
// Dish
{
  id: string,
  name: string,         // e.g. "Spaghetti"
  emoji: string,        // e.g. "🍝"
  category: 'pasta' | 'chicken' | 'fish' | 'veggie' | 'soup'
}

// Dessert
{
  id: string,
  name: string,         // e.g. "Ice Cream"
  emoji: string,        // e.g. "🍦"
}

// Week Plan
{
  weekStart: string,    // ISO date string of the Sunday (e.g. "2026-05-04")
  days: {
    0: { dinner: dishId | null, dessert: dessertId | null },  // Sunday
    1: { dinner: dishId | null, dessert: dessertId | null },  // Monday
    ...
    6: { dinner: dishId | null, dessert: dessertId | null }   // Saturday
  }
}
```

---

## Screens / Layout

```
┌─────────────────────────────────────────────────────┐
│  🍽️ What's for Dinner?        Week: May 4 – May 10  │
│                                        [👨‍👩‍👧 Parent] │
├──────┬──────┬──────┬──────┬──────┬──────┬──────────┤
│ Sun  │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │  Sat     │
│  🔒  │  🔒  │      │      │      │      │          │
│[Din] │[Din] │[Din] │[Din] │[Din] │[Din] │ [Din]    │
│[Des] │[Des] │[Des] │[Des] │[Des] │[Des] │ [Des]    │
├─────────────────────────────────────────────────────┤
│  🍽️ Dinners                    🍰 Desserts  2 / 3   │
│  [🍝][🍗][🐟][🥦][🍲]...      [🍦][🍓][🍫]...     │
└─────────────────────────────────────────────────────┘
```

---

## Out of Scope (v1)
- Multi-child profiles / kid selector
- Lunch or breakfast planning
- Nutritional information
- Backend / cloud sync
- Push notifications or reminders
- Photo upload for dishes (emoji only for now)
