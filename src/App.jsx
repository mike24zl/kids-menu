import { useState, useCallback } from 'react'
import { useLang } from './i18n/LangContext'
import { AnimatePresence } from 'framer-motion'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core'

import Header from './components/Header'
import WeekBoard from './components/WeekBoard'
import DishPool from './components/DishPool'
import DessertPool from './components/DessertPool'
import ParentPanel from './components/ParentPanel'
import ConfettiOverlay from './components/ConfettiOverlay'

import { useWeekPlan } from './hooks/useWeekPlan'
import { useDishes } from './hooks/useDishes'
import { useSound } from './hooks/useSound'
import { isPast, getWeekDays } from './utils/dates'

export default function App() {
  const { plan, setSlot, clearSlot, resetWeek, dessertCount, dinnerCount } = useWeekPlan()
  const {
    dishes, desserts,
    addDish, updateDish, deleteDish,
    addDessert, updateDessert, deleteDessert,
  } = useDishes()
  const { playPop, playBoing } = useSound()
  const { t } = useLang()

  const [parentMode, setParentMode] = useState(false)
  const [dessertOverflow, setDessertOverflow] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeItem, setActiveItem] = useState(null) // item being dragged (for DragOverlay)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  )

  // Sets of currently placed IDs for glow effect
  const placedDishIds = new Set(
    Object.values(plan.days).map(d => d.dinner).filter(Boolean)
  )
  const placedDessertIds = new Set(
    Object.values(plan.days).map(d => d.dessert).filter(Boolean)
  )

  function handleDragStart({ active }) {
    const [type, id] = active.id.split('-')
    const pool = type === 'dish' ? dishes : desserts
    const item = pool.find(x => x.id === id) ?? null
    setActiveItem(item ? { ...item, dragType: type } : null)
  }

  const handleDragEnd = useCallback(({ active, over }) => {
    setActiveItem(null)
    if (!over) return

    // Parse dragged item
    const dashIdx = active.id.indexOf('-')
    const dragType = active.id.slice(0, dashIdx)       // "dish" | "dessert"
    const itemId   = active.id.slice(dashIdx + 1)       // the actual dish/dessert id

    // Parse target slot: "{dayIndex}-{slotType}"
    const parts    = over.id.split('-')
    const dayIndex = Number(parts[0])
    const slotType = parts[1]                           // "dinner" | "dessert"

    // Type mismatch: dish → dessert slot or dessert → dinner slot
    if ((dragType === 'dish' && slotType === 'dessert') ||
        (dragType === 'dessert' && slotType === 'dinner')) {
      playBoing()
      return
    }

    // Locked day
    const days = getWeekDays(plan.weekStart)
    if (isPast(days[dayIndex])) {
      playBoing()
      return
    }

    // Dessert limit
    if (slotType === 'dessert') {
      const currentlyFilled = plan.days[dayIndex].dessert !== null
      if (!currentlyFilled && dessertCount >= 3) {
        playBoing()
        setDessertOverflow(true)
        setTimeout(() => setDessertOverflow(false), 1200)
        return
      }
    }

    // Commit the drop
    setSlot(dayIndex, slotType, itemId)
    playPop()

    // Check for week completion: only trigger when we fill the last empty dinner slot
    if (slotType === 'dinner' && !plan.days[dayIndex].dinner) {
      const newDinnerCount = Object.values(plan.days).filter((d, i) =>
        i === dayIndex ? true : d.dinner !== null
      ).length
      if (newDinnerCount === 7) {
        setTimeout(() => setShowConfetti(true), 200)
      }
    }
  }, [plan, dessertCount, setSlot, playPop, playBoing])

  return (
    <div className="min-h-screen flex flex-col gap-3 pb-6" dir={t.dir}>
      <Header
        weekStart={plan.weekStart}
        parentMode={parentMode}
        onToggleParent={() => setParentMode(p => !p)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <WeekBoard
          plan={plan}
          dishes={dishes}
          desserts={desserts}
          onClear={clearSlot}
        />

        {/* Pools */}
        <div className="flex flex-col gap-4 mx-2 bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-md">
          <DishPool
            dishes={dishes}
            placedDishIds={placedDishIds}
          />
          <div className="border-t-2 border-dashed border-pink-200" />
          <DessertPool
            desserts={desserts}
            placedDessertIds={placedDessertIds}
            dessertCount={dessertCount}
            overflow={dessertOverflow}
          />
        </div>

        {/* Drag overlay — ghost card while dragging */}
        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div className="flex flex-col items-center justify-center gap-1 w-24 h-28 rounded-2xl shadow-2xl bg-white/90 border-2 border-orange-400 scale-110 rotate-3">
              <span className="text-4xl leading-none emoji">{activeItem.emoji}</span>
              <span className="font-fredoka text-sm text-center leading-tight px-1">
                {t.dir === 'rtl' && activeItem.nameHe ? activeItem.nameHe : activeItem.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Parent panel */}
      <AnimatePresence>
        {parentMode && (
          <ParentPanel
            dishes={dishes}
            desserts={desserts}
            onAddDish={addDish}
            onUpdateDish={updateDish}
            onDeleteDish={deleteDish}
            onAddDessert={addDessert}
            onUpdateDessert={updateDessert}
            onDeleteDessert={deleteDessert}
            onResetWeek={resetWeek}
          />
        )}
      </AnimatePresence>

      {/* Confetti celebration */}
      <AnimatePresence>
        {showConfetti && (
          <ConfettiOverlay show={showConfetti} onDismiss={() => setShowConfetti(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
