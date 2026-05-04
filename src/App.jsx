import { useState, useCallback } from 'react'
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
import PoolSection from './components/PoolSection'
import ParentPanel from './components/ParentPanel'
import ConfettiOverlay from './components/ConfettiOverlay'
import AuthGate from './components/AuthGate'

import { useAuth } from './hooks/useAuth'
import { useWeekPlan } from './hooks/useWeekPlan'
import { useDishes } from './hooks/useDishes'
import { useSound } from './hooks/useSound'
import { useLang } from './i18n/LangContext'
import { isPast, getWeekDays } from './utils/dates'

const SLOT_TYPES = ['main', 'side', 'veggie', 'dessert']

export default function App() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <span className="text-6xl animate-bounce">🍽️</span>
      </div>
    )
  }

  if (!user) return <AuthGate />

  return <AppInner userId={user.id} />
}

function AppInner({ userId }) {
  const { plan, setSlot, clearSlot, resetWeek, save, isDirty, saving, dessertCount, mainCount, loading: planLoading } = useWeekPlan(userId)
  const { mains, sides, veggies, desserts, loading: dishesLoading } = useDishes(userId)
  const { playPop, playBoing } = useSound()
  const { t } = useLang()

  const [parentMode, setParentMode]       = useState(false)
  const [dessertOverflow, setOverflow]    = useState(false)
  const [showConfetti, setShowConfetti]   = useState(false)
  const [activeTab, setActiveTab]         = useState('main')
  const [activeItem, setActiveItem]       = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 100, tolerance: 5 } }),
  )

  const pools = { main: mains, side: sides, veggie: veggies, dessert: desserts }

  const placedIds = {
    main:    new Set(Object.values(plan.days).map(d => d.main).filter(Boolean)),
    side:    new Set(Object.values(plan.days).map(d => d.side).filter(Boolean)),
    veggie:  new Set(Object.values(plan.days).map(d => d.veggie).filter(Boolean)),
    dessert: new Set(Object.values(plan.days).map(d => d.dessert).filter(Boolean)),
  }

  function handleDragStart({ active }) {
    const dashIdx = active.id.indexOf('-')
    const dragType = active.id.slice(0, dashIdx)
    const itemId   = active.id.slice(dashIdx + 1)
    const item = pools[dragType]?.items.find(x => x.id === itemId) ?? null
    setActiveItem(item)
  }

  const handleDragEnd = useCallback(({ active, over }) => {
    setActiveItem(null)
    if (!over) return

    const dashIdx  = active.id.indexOf('-')
    const dragType = active.id.slice(0, dashIdx)
    const itemId   = active.id.slice(dashIdx + 1)

    const parts    = over.id.split('-')
    const dayIndex = Number(parts[0])
    const slotType = parts[1]

    if (dragType !== slotType) { playBoing(); return }
    if (isPast(getWeekDays(plan.weekStart)[dayIndex])) { playBoing(); return }

    if (slotType === 'dessert' && !plan.days[dayIndex].dessert && dessertCount >= 3) {
      playBoing()
      setOverflow(true)
      setTimeout(() => setOverflow(false), 1200)
      return
    }

    setSlot(dayIndex, slotType, itemId)
    playPop()

    if (slotType === 'main' && !plan.days[dayIndex].main) {
      const newCount = Object.values(plan.days).filter((d, i) => i === dayIndex ? true : d.main !== null).length
      if (newCount === 7) setTimeout(() => setShowConfetti(true), 200)
    }
  }, [plan, dessertCount, setSlot, playPop, playBoing])

  if (planLoading || dishesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <span className="text-6xl animate-bounce">🍽️</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col gap-3 pb-6" dir={t.dir}>
      <Header
        weekStart={plan.weekStart}
        parentMode={parentMode}
        onToggleParent={() => setParentMode(p => !p)}
        onSave={save}
        isDirty={isDirty}
        saving={saving}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <WeekBoard
          plan={plan}
          pools={{ mains: mains.items, sides: sides.items, veggies: veggies.items, desserts: desserts.items }}
          onClear={clearSlot}
        />

        <PoolSection
          pools={{ main: mains.items, side: sides.items, veggie: veggies.items, dessert: desserts.items }}
          placedIds={placedIds}
          dessertCount={dessertCount}
          dessertOverflow={dessertOverflow}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div className="flex flex-col items-center justify-center gap-1 w-24 h-28 rounded-2xl shadow-2xl bg-white/90 border-2 border-orange-400 scale-110 rotate-3">
              {activeItem.imageUrl
                ? <img src={activeItem.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover" />
                : <span className="text-4xl leading-none emoji">{activeItem.emoji}</span>
              }
              <span className="font-fredoka text-sm text-center leading-tight px-1">
                {t.dir === 'rtl' && activeItem.nameHe ? activeItem.nameHe : activeItem.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {parentMode && (
          <ParentPanel
            pools={pools}
            onResetWeek={resetWeek}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfetti && (
          <ConfettiOverlay show={showConfetti} onDismiss={() => setShowConfetti(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
