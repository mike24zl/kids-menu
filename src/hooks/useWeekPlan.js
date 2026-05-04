import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getWeekStart } from '../utils/dates'

const EMPTY_DAY = { main: null, side: null, veggie: null, dessert: null }

function emptyDays() {
  return Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, { ...EMPTY_DAY }]))
}

export function useWeekPlan(userId) {
  const weekStart = getWeekStart()
  const [plan, setPlan] = useState({ weekStart, days: emptyDays() })
  const [loading, setLoading] = useState(true)
  const timer = useRef(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('week_plans')
      .select('days')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.days) {
          const days = {}
          for (let i = 0; i < 7; i++) {
            days[i] = data.days[i] ?? { ...EMPTY_DAY }
          }
          setPlan({ weekStart, days })
        }
        setLoading(false)
      })
  }, [userId])

  function persist(days) {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      supabase.from('week_plans').upsert(
        { user_id: userId, week_start: weekStart, days },
        { onConflict: 'user_id,week_start' }
      )
    }, 400)
  }

  function setSlot(dayIndex, type, itemId) {
    const next = {
      ...plan,
      days: { ...plan.days, [dayIndex]: { ...plan.days[dayIndex], [type]: itemId } },
    }
    setPlan(next)
    persist(next.days)
  }

  function clearSlot(dayIndex, type) { setSlot(dayIndex, type, null) }

  function resetWeek() {
    const days = emptyDays()
    setPlan({ weekStart, days })
    persist(days)
  }

  const dessertCount = Object.values(plan.days).filter(d => d.dessert !== null).length
  const mainCount    = Object.values(plan.days).filter(d => d.main !== null).length

  return { plan, setSlot, clearSlot, resetWeek, dessertCount, mainCount, loading }
}
