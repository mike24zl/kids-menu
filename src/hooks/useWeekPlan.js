import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const EMPTY_DAY = { main: null, side: null, dessert: null }

function emptyDays() {
  return Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, { ...EMPTY_DAY }]))
}

export function useWeekPlan(userId, weekStart) {
  const [plan, setPlan] = useState({ weekStart, days: emptyDays() })
  const [loading, setLoading] = useState(true)
  const [isDirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    setDirty(false)
    setPlan({ weekStart, days: emptyDays() })

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
  }, [userId, weekStart])

  function setSlot(dayIndex, type, itemId) {
    setPlan(prev => ({
      ...prev,
      days: { ...prev.days, [dayIndex]: { ...prev.days[dayIndex], [type]: itemId } },
    }))
    setDirty(true)
  }

  function clearSlot(dayIndex, type) { setSlot(dayIndex, type, null) }

  function resetWeek() {
    setPlan({ weekStart, days: emptyDays() })
    setDirty(true)
  }

  async function save() {
    setSaving(true)
    await supabase.from('week_plans').upsert(
      { user_id: userId, week_start: weekStart, days: plan.days },
      { onConflict: 'user_id,week_start' }
    )
    setSaving(false)
    setDirty(false)
  }

  const dessertCount = Object.values(plan.days).filter(d => d.dessert !== null).length
  const mainCount    = Object.values(plan.days).filter(d => d.main !== null).length

  return { plan, setSlot, clearSlot, resetWeek, save, isDirty, saving, dessertCount, mainCount, loading }
}
