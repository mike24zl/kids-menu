import { useState } from 'react'
import { getWeekStart } from '../utils/dates'

const EMPTY_DAYS = Object.fromEntries(
  Array.from({ length: 7 }, (_, i) => [i, { dinner: null, dessert: null }])
)

function freshPlan() {
  return { weekStart: getWeekStart(), days: structuredClone(EMPTY_DAYS) }
}

function loadPlan() {
  try {
    const raw = localStorage.getItem('km_week_plan')
    if (!raw) return freshPlan()
    const plan = JSON.parse(raw)
    // Auto-reset if we're in a new week
    if (plan.weekStart !== getWeekStart()) return freshPlan()
    return plan
  } catch {
    return freshPlan()
  }
}

function savePlan(plan) {
  localStorage.setItem('km_week_plan', JSON.stringify(plan))
}

export function useWeekPlan() {
  const [plan, setPlan] = useState(loadPlan)

  function setSlot(dayIndex, type, itemId) {
    const next = {
      ...plan,
      days: {
        ...plan.days,
        [dayIndex]: { ...plan.days[dayIndex], [type]: itemId },
      },
    }
    setPlan(next)
    savePlan(next)
  }

  function clearSlot(dayIndex, type) {
    setSlot(dayIndex, type, null)
  }

  function resetWeek() {
    const next = freshPlan()
    setPlan(next)
    savePlan(next)
  }

  const dessertCount = Object.values(plan.days).filter(d => d.dessert !== null).length
  const dinnerCount = Object.values(plan.days).filter(d => d.dinner !== null).length

  return { plan, setSlot, clearSlot, resetWeek, dessertCount, dinnerCount }
}
