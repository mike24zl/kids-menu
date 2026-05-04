# Technical Design & Implementation Plan: Kids Weekly Dinner Planner

---

## 1. Tech Stack

| Concern | Library / Tool | Version |
|---------|---------------|---------|
| Bundler | Vite | latest |
| UI framework | React | 18 |
| Drag & drop | @dnd-kit/core + @dnd-kit/utilities | latest |
| Styling | Tailwind CSS v3 | latest |
| Animations | Framer Motion | latest |
| Confetti | canvas-confetti | latest |
| Font | Fredoka One via Google Fonts | — |
| Persistence | Browser `localStorage` | — |
| Sounds | Native `Audio` API (no extra dependency) | — |

**Why Framer Motion over pure CSS**: the bounce-on-drop, wiggle-on-error, and locked-day animations are complex enough that Framer Motion's `animate` prop and `AnimatePresence` are cleaner than keyframe CSS. It also handles layout animations (cards moving into slots) for free.

**Why @dnd-kit over react-beautiful-dnd**: touch support out of the box, actively maintained, no deprecated `ReactDOM.findDOMNode` warnings.

---

## 2. Project Structure

```
src/
├── main.jsx                  # Vite entry, mounts <App />
├── App.jsx                   # Root: DndContext, state wiring, layout
│
├── components/
│   ├── Header.jsx            # Title + week label + Parent toggle button
│   ├── WeekBoard.jsx         # 7-column grid
│   ├── DayColumn.jsx         # Single day: header, DinnerSlot, DessertSlot
│   ├── MealSlot.jsx          # Generic droppable slot (type: 'dinner'|'dessert')
│   ├── DishCard.jsx          # Draggable card (emoji + name + category badge)
│   ├── DishPool.jsx          # Scrollable dinner dish pool panel
│   ├── DessertPool.jsx       # Scrollable dessert pool panel + 🍰 x/3 counter
│   ├── DessertCounter.jsx    # "🍰 2 / 3" badge with overflow animation
│   ├── ParentPanel.jsx       # Slide-in parent management drawer
│   ├── DishForm.jsx          # Add/edit dish form (used for both pools)
│   └── ConfettiOverlay.jsx   # Fires canvas-confetti on week completion
│
├── hooks/
│   ├── useWeekPlan.js        # State + localStorage sync for the week plan
│   ├── useDishes.js          # State + localStorage sync for dishes & desserts
│   └── useSound.js           # Tiny hook: preloads Audio objects, exposes play()
│
├── data/
│   └── defaults.js           # Starter dish + dessert arrays (seeded on first load)
│
├── utils/
│   ├── dates.js              # getWeekStart(), isDatePast(), formatWeekLabel()
│   └── ids.js                # nanoid-style crypto.randomUUID() wrapper
│
└── index.css                 # Tailwind directives + @import Fredoka One
```

---

## 3. State Architecture

All state lives in `App.jsx` and flows down as props. No global state library needed at this scale.

```
App
 ├── dishes[]          ← useDishes() → localStorage "km_dishes"
 ├── desserts[]        ← useDishes() → localStorage "km_desserts"
 ├── weekPlan{}        ← useWeekPlan() → localStorage "km_week_plan"
 ├── parentMode bool   ← local useState
 └── toastMsg string   ← local useState (transient feedback messages)
```

### `useWeekPlan` shape
```js
{
  weekStart: "2026-05-04",   // always a Sunday ISO string
  days: {
    0: { dinner: "uuid-1" | null, dessert: "uuid-a" | null },
    ...
    6: { dinner: null, dessert: null }
  }
}
```

On load, if `weekStart` in storage differs from the current week's Sunday, the plan is **auto-reset** (new week). The old plan is discarded — no history for v1.

---

## 4. Drag & Drop Design

### Context setup (App.jsx)
```jsx
<DndContext
  sensors={sensors}          // PointerSensor + TouchSensor
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
```

### Draggable IDs
Each `DishCard` gets `id = "dish-{dish.id}"` or `"dessert-{dessert.id}"`.

### Droppable IDs
Each `MealSlot` gets `id = "{dayIndex}-{type}"`, e.g. `"3-dinner"` or `"3-dessert"`.

### `handleDragEnd` logic (App.jsx)
```
1. Parse dragged type from id prefix ("dish-" vs "dessert-")
2. Parse target slot type from droppable id suffix ("-dinner" vs "-dessert")
3. If types mismatch → play error sound, trigger wiggle animation → return
4. If slot is a locked day → return (no drop)
5. If type is "dessert" and dessertCount >= 3 and slot is currently empty → toast + bounce counter → return
6. Dispatch update to weekPlan: set days[dayIndex][type] = itemId
7. Play pop sound
8. If all 7 dinner slots now filled → fire confetti
```

---

## 5. localStorage Strategy

| Key | Contents | Written when |
|-----|----------|-------------|
| `km_dishes` | `Dish[]` JSON | Any dish added/edited/deleted |
| `km_desserts` | `Dessert[]` JSON | Any dessert added/edited/deleted |
| `km_week_plan` | `WeekPlan` JSON | Any slot changes, on week reset |

On first load (no keys found), `defaults.js` is written to storage. This seeds the starter pool without a network request.

---

## 6. Animation Spec

| Trigger | Component | Mechanism |
|---------|-----------|-----------|
| Card hover | `DishCard` | Framer `whileHover={{ rotate: [0,−3,3,0] }}` |
| Successful drop | `MealSlot` | Framer `animate` key change → scale 0.8→1.1→1.0 |
| Invalid drop | `DishCard` | Framer `animate={{ x: [0,−10,10,−6,6,0] }}` (shake) |
| Dessert overflow | `DessertCounter` | Framer `animate={{ scale: [1,1.4,1] }}` + red flash |
| Week complete | `ConfettiOverlay` | `canvas-confetti` burst, Framer fade-in message |
| Locked day | `DayColumn` | Static grey overlay + 🔒, no interaction events |
| Parent panel open | `ParentPanel` | Framer `AnimatePresence` slide in from right |

---

## 7. Responsive Layout

The app targets **tablet landscape** as primary (e.g. iPad 1024×768) but must also work on desktop.

- `WeekBoard`: CSS Grid `grid-cols-7`, min column width `120px`, horizontal scroll on small screens
- `DishPool` + `DessertPool`: flex-wrap row at the bottom, scrollable horizontally on touch
- `DishCard`: fixed size `w-24 h-28` on desktop, `w-20 h-24` on mobile

---

## 8. Sound Design

Two sounds, loaded once at app start via `useSound`:

| Event | Sound description |
|-------|------------------|
| Successful drop | Short soft "pop" (< 200ms) |
| Invalid drop / overflow | Short "boing" or "wobble" |

Both are generated as base64-encoded tiny WAV files inlined in `defaults.js` — no audio file fetching needed.

---

## 9. Implementation Plan

### Phase 1 — Scaffold & Data Layer
- [ ] `npm create vite@latest` with React template
- [ ] Install: `@dnd-kit/core`, `@dnd-kit/utilities`, `tailwindcss`, `framer-motion`, `canvas-confetti`
- [ ] Configure Tailwind + import Fredoka One in `index.css`
- [ ] Write `defaults.js` with starter dishes and desserts
- [ ] Write `utils/dates.js` (week start, isPast, label)
- [ ] Write `useWeekPlan` and `useDishes` hooks with localStorage sync

### Phase 2 — Static Layout
- [ ] `Header` component (title, week label, parent toggle button)
- [ ] `WeekBoard` + `DayColumn` rendering 7 columns from date utils
- [ ] `MealSlot` empty placeholder boxes (dinner + dessert per day)
- [ ] `DishPool` + `DessertPool` rendering cards from default data
- [ ] `DishCard` with emoji, name, category badge — no drag yet
- [ ] Locked-day overlay on past days

### Phase 3 — Drag & Drop
- [ ] Wrap app in `DndContext`, add `useSensor` with pointer + touch
- [ ] Make `DishCard` draggable (`useDraggable`)
- [ ] Make `MealSlot` droppable (`useDroppable`)
- [ ] Wire `handleDragEnd` with full validation logic (type mismatch, locked day, dessert limit)
- [ ] Render placed dish inside the slot (emoji + name mini)
- [ ] Allow drag-from-slot back to pool (clear the slot)

### Phase 4 — Constraints & Feedback
- [ ] `DessertCounter` badge with live count
- [ ] Overflow toast message (friendly, animated)
- [ ] `useSound` hook + inline pop/boing sounds
- [ ] Placed cards glow in the pool

### Phase 5 — Animations & Delight
- [ ] Card wobble on hover
- [ ] Bounce animation on successful drop
- [ ] Shake animation on invalid drop
- [ ] `ConfettiOverlay` on week completion
- [ ] Framer `AnimatePresence` on slot fill/clear

### Phase 6 — Parent Mode
- [ ] Parent toggle button in `Header`
- [ ] `ParentPanel` slide-in drawer
- [ ] `DishForm` for add/edit (name, emoji input, category select)
- [ ] Delete with confirmation
- [ ] "Reset week" button

### Phase 7 — Polish & QA
- [ ] Test on touch device / tablet emulator
- [ ] Verify localStorage persistence across page reloads
- [ ] Check all 7-dinner completion triggers confetti correctly
- [ ] Verify auto week-reset on new week
- [ ] Tailwind responsive pass for mobile/desktop
